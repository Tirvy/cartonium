import { apiURL } from "./common";



export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const alias: string = (query.alias as string).trim();
    if (!alias) {
      return { result: { error: 'alias must be a string' } };
    }



    const res: any = await $fetch(`${apiURL}//games/${alias}`);

    const retObject = {
      idBgg: res.game.bggId,
      idTesera: res.game.teseraId,
      title: res.game.title,
      aliasTesera: alias,
      photoUrl: res.game.photoUrl,
      year: res.game.year,
      ratingTesera: res.game.ratingUser,
      ratingBgg: res.game.bggRating,
      playersMin: res.game.playersMin,
      playersMax: res.game.playersMax,
      linkTesera: res.game.teseraUrl,
    }
    return retObject;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { result: [], error: error.message };
    }
    console.log(String(error));
  }
});