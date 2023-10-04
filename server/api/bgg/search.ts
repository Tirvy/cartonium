import { apiURL } from "./common";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
});

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const searchText = (query.name as string).trim();
    let gameId = (query.id as number);
    if (!searchText && !gameId) {
      return { result: { query: 'name or gameId must be a string' } };
    }
    if (!gameId) {
      const res = await $fetch(`${apiURL}/search`, { query: { query: searchText, exact: 1 } });
      const ret = parser.parse(res as string);
      console.log(ret);
      gameId = ret[0].id;
    }
    if (!gameId) {
      return { result: { query: 'game not found' } };
    }
    const res = await $fetch(`${apiURL}/thing`, { query: { id: gameId } });
    const ret = parser.parse(res as string);
    return ret;

  } catch (error: unknown) {
    console.log(String(error));
    if (error instanceof Error) {
      return { result: [], error: error.message };
    }
  }
});