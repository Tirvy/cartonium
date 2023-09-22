import { apiURL } from "./common";



export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const username: string = query.username as string;
    const checkedUser = username.trim();
    if (!checkedUser) {
      return { result: { error: 'user must be a string' } };
    }

    const res: any = await $fetch(`${apiURL}/user/${username}`);
    return res?.collection?.map((item: any) => item.game);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { result: [], error: error.message };
    }
    console.log(String(error));
  }
});