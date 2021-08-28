/** helpers for writing things more functionally */

/**
 * similar to python range function
 * @param end exclusive maximum (or minimum if step < 0)
 * @param start starting number
 * @param step step size
 */
export function range(end: number, start: number = 0, step: number = 1): number[] {
    if (step === 0 ||
        (step > 0 && start > end) ||
        (step < 0 && start < end)) {
        // invalid arguments...
        return [];
    }
    const r = [];
    const keepGoing = step > 0 ?
        (i: number) => i < end :
        (i: number) => i > end;
    for (let i = start; keepGoing(i); i += step) {
        r.push(i);
    }
    return r;
}

export function zeroes(n: number){
    const z = [];
    for(let i=0; i<n; i++) z.push(0);
    return z;
}

export function shuffle<T>(items: T[]): T[] {
    const pool = items.slice();
    const shuffled: T[] = [];
    while(pool.length > 0) {
        const i = Math.floor(Math.random()*pool.length);
        shuffled.push(...pool.splice(i));
    }
    return shuffled;
}

/** find index of minimum value */
export function findMinIndex<T>(items: T[], getCompareValue: (item: T) => number): number {
    return items.reduce((p, item, index) => {
        const v = getCompareValue(item);
        return v < p.min ? {min: v, index} : p;
    }, {min: Infinity, index: -1}).index;
}
