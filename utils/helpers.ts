export function listToHashed(sortSource: { id?: number | undefined }[]) {
    return sortSource.reduce((total: any, item) => {
        if (item.id) {

            total[item.id] = item;
        }
        return total;
    }, {})
}

export function blobToFile(theBlob: Blob, fileName: string): File {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return theBlob as File;
  }