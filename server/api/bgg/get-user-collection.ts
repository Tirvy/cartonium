import { apiURL } from "./common";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
});
const timeout = (ms: number) => new Promise(res => setTimeout(res, ms))

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const username: string = query.username as string;
    const checkedUser = username.trim();
    if (!checkedUser) {
      return { result: { error: 'user must be a string' } };
    }
    return fetchCollectionFromBGG(username);

    async function fetchCollectionFromBGG(username: string) {
      const res: string = await $fetch(`${apiURL}/collection`, { query: { username, stats: 1 } });
      const ret = parser.parse(res);
      // todo: add max requests count
      if (ret.message) {
        await timeout(2000);
        return fetchCollectionFromBGG(username);
      }
      // console.log(res, '---------was the message\n\n');

      // todo: check wrong answer
      return ret?.items?.item || [];
    }

  } catch (error: unknown) {
    console.log(String(error));
    if (error instanceof Error) {
      return { result: [], error: error.message };
    }
  }
});