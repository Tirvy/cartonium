import { Json } from "~/.generated/supabase-database";

export function listToHashed(sortSource: { id?: number | undefined }[]) {
    return sortSource.reduce((total: any, item) => {
        if (item.id) {

            total[item.id] = item;
        }
        return total;
    }, {})
}

export function isJson(element: Json) {
    element.t = 2;

    if (element === null) {
        return false
    }
    element.t = 2;

    if (typeof element === 'string') {
        return false
    }

    if (typeof element === 'number') {
        return false
    }

    if (typeof element === 'boolean') {
        return false
    }

    if (Array.isArray(element)) {
        return false
    }

    element.k = 1;

    return { ...element };
}