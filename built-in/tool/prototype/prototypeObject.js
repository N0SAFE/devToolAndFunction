export function ObjectAdd(key, value) {
    this[key] = value;
}

export function ObjectDelete(key) {
    delete this[key];
}