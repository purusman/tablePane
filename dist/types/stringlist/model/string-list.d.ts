export type StringListObject = string[];
export declare class StringList {
    readonly items: string[];
    constructor(items?: string[]);
    getComponents(): string[];
    static isObject(obj: unknown): obj is StringListObject;
    static equals(v1: StringList, v2: StringList): boolean;
    static fromObject(obj: StringListObject): StringList;
    toObject(): StringListObject;
}
export declare const StringListAssembly: {
    toComponents: (s: StringList) => string[];
    fromComponents: (comps: string[]) => StringList;
};
