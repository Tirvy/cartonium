export const apiURL = 'https://api.tesera.ru';

export function collectionParser(collection: any[]) {
    return collection.map((item) => {
        return {
            id: item.id,
            name: item.name,
            description: item.description,
        };
    });
}