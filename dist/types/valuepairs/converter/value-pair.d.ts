import { ValuePair } from '../model/value-pair.js';
export declare function valuePairFromUnknown(value: unknown, firstProp?: string, secondProp?: string): ValuePair;
export declare function writeValuePair(target: any, inValue: ValuePair, firstProp?: string, secondProp?: string): void;
