import { apiURL } from "./common";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
});

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const searchText = (query.query as string).trim();
    if (!searchText) {
      return { result: { query: 'user must be a string' } };
    }
    const res = await $fetch(`${apiURL}/search`, { query: { query: searchText, exact: 1 } });
    const ret = parser.parse(res as string);
    return ret;

  } catch (error: unknown) {
    console.log(String(error));
    if (error instanceof Error) {
      return { result: [], error: error.message };
    }
  }
});