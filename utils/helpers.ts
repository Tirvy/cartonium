export function listToHashed(sortSource: { id?: number | undefined }[]) {
    return sortSource.reduce((total: any, item) => {
        if (item.id) {

            total[item.id] = item;
        }
        return total;
    }, {})
}