import { apiURL } from "./common";



export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const title: string = (query.title as string).trim();
    if (!title) {
      return { result: { error: 'title must be a string' } };
    }

    const res: any = await $fetch(`${apiURL}/search`, { query: { query: title } });
    return res;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { result: [], error: error.message };
    }
    console.log(String(error));
  }
});

/* example
[
    {
        "type": "Game",
        "value": "Catan",
        "alias": "catan",
        "id": 8584,
        "teseraId": 528349,
        "title": "Catan",
        "title2": "",
        "photoUrl": "https://s.tesera.ru/images/items/528349,3/200x200xpa/photo1.jpg"
    },
    {
        "type": "Game",
        "value": "Catan Atlantis",
        "alias": "catan-atlantis",
        "id": 15623,
        "teseraId": 1178270,
        "title": "Catan Atlantis",
        "title2": "Колонизаторы Атлантис,",
        "photoUrl": "https://s.tesera.ru/images/items/1178270,3/200x200xpa/photo1.jpg"
    }
  ]
  */