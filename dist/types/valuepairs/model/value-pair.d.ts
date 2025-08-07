export interface ValuePairObject {
    first: number;
    second: number;
}
export declare class ValuePair {
    readonly first: number;
    readonly second: number;
    constructor(first?: number, second?: number);
    getComponents(): [number, number];
    static isObject(obj: unknown, firstProp?: string, secondProp?: string): obj is ValuePairObject;
    static equals(v1: ValuePair, v2: ValuePair): boolean;
    static fromObject(obj: any, firstProp?: string, secondProp?: string): ValuePair;
    toObject(firstProp?: string, secondProp?: string): any;
}
export declare const ValuePairAssembly: {
    toComponents: (p: ValuePair) => [number, number];
    fromComponents: (comps: [number, number]) => ValuePair;
};
