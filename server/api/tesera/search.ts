import { apiURL } from "./common";



export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const title: string = (query.title as string).trim();
    if (!title) {
      return { result: { error: 'title must be a string' } };
    }

    const res: any = await $fetch(`${apiURL}/search`, { query: {query: title}});
    return res;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { result: [], error: error.message };
    }
    console.log(String(error));
  }
});