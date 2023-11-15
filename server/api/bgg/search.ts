import { apiURL } from "./common";
import { XMLParser } from "fast-xml-parser";
import { searchResultBgg } from "~/types/index";

const parser = new XMLParser({
  ignoreAttributes: false,
});

function parseGameData(item: any): searchResultBgg {
  return {
    id: item['@_id'],
    title: item.name["@_value"],
    year: item.yearpublished["@_value"],
  }
}

async function getGameData(searchTexts: String[]): Promise<searchResultBgg[]> {

  let id = null;

  for (let i = 0; i < searchTexts.length && !id; i++) {
    let res = await $fetch(`${apiURL}/search`, { query: { query: searchTexts[i], exact: 1 } });
    let resParsed = parser.parse(res as string);

    if (resParsed.items.item) {
      if (Array.isArray(resParsed.items.item)) {
        return resParsed.items.item.map((item: any) => parseGameData(item));
      }
      return [parseGameData(resParsed.items.item)]
    }
  }

  for (let i = 0; i < searchTexts.length && !id; i++) {
    let res = await $fetch(`${apiURL}/search`, { query: { query: searchTexts[i] } });
    let ret = parser.parse(res as string);

    if (ret.items.item && Array.isArray(ret.items.item)) {
      return ret.items.item.map((item: any) => parseGameData(item));
    }
  }

  return [];
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const searchTexts = (query.titles as String[]);

    if (!searchTexts) {
      return { result: { query: 'titles must be a string' } };
    }

    return getGameData(searchTexts);
  } catch (error: unknown) {
    console.log(String(error));
    if (error instanceof Error) {
      return { result: [], error: error.message };
    }
  }
});

// search results
/*
{
  '?xml': { '@_version': '1.0', '@_encoding': 'utf-8' },
  items: {
    item: {
      name: [Object],
      yearpublished: [Object],
      '@_type': 'boardgame',
      '@_id': '100901'
    },
    '@_total': '1',
    '@_termsofuse': 'https://boardgamegeek.com/xmlapi/termsofuse'
  }
} */

