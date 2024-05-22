import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import { apiURL } from '../bgg/common';
import { XMLParser } from "fast-xml-parser";
import { Buffer } from 'node:buffer';

const parser = new XMLParser({
  ignoreAttributes: false,
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const client = await serverSupabaseClient<Database>(event)

  const gameBoxIds = body.gameBoxIds;


  const { data, error } = await client.from('gameboxes_with_club_id').select('*').in('id', gameBoxIds);

  const res = await $fetch(`${apiURL}/thing`, { query: { id: data?.map(item => item.id_bgg).join(',') } });
  const ret = parser.parse(res as string);

  function getThumbnails() {
    const target = ret.items?.item;

    if (Array.isArray(target)) {
      return target.map((item: any) => {
        return item?.thumbnail;
      })
    }
    return [target?.thumbnail];
  }

  const thumbnailsURLs = getThumbnails();

  if (thumbnailsURLs.length !== gameBoxIds.length) {
    return new Error('Not all thumbnails were downloaded' + thumbnailsURLs.length + ' / ' + gameBoxIds.length);
  }

  function getMime(url: string): string {

    const imgExt = url.split('.').pop() as string;
    let mimeType = 'image/png';
    if (imgExt.toLowerCase() !== 'png') {
      mimeType = 'image/jpeg';
    }
    return mimeType;
  }

  const requests = [];

  for (let i = 0; i < thumbnailsURLs.length; i++) {
    requests.push(await fetchUrlAndSend(thumbnailsURLs[i], gameBoxIds[i]));
  }

  const responses = await Promise.all(requests);

  async function fetchUrlAndSend(url: string, id: number) {
    const picture = await fetch(url)
      .then(x => x.arrayBuffer())

    const res = await client.storage.from('gamebox-pics').upload(id + '', picture, {
      contentType: getMime(url),
    });
    return res;
  }


  return responses
  // const blobik = response._data as Blob;
  // console.log(2);
  // console.log(thumbnailsURLs[0]);
  // console.log(blobik);
  // console.log(2);

  // const arrayBuffer = await blobik.arrayBuffer();

  // console.log(2);
  // const buffer = Buffer.from(arrayBuffer)
  // console.log(3);

  // return new File([buffer], 'pic', { type: getMime(thumbnailsURLs[0]) });
})
