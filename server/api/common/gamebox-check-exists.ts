export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const isExists = await $fetch('/api/db/check-game-exists', { query: { alias: query.alias } });
    console.log(isExists);
    return isExists;
})
