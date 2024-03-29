import { apiURL } from "./common";
import type { GameBoxDataTesera } from '~/types/frontend'



export default defineEventHandler(async (event): Promise<GameBoxDataTesera | null> => {
  try {
    const query = getQuery(event);
    const alias: string = (query.alias as string).trim();
    if (!alias) {
      return null;
    }



    const res: any = await $fetch(`${apiURL}//games/${alias}`);

    const retObject: GameBoxDataTesera = {
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
      return null;
    }
    console.log(String(error));
  }
  return null;
});