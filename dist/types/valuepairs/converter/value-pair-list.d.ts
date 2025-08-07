import { ValuePair } from '../model/value-pair.js';
export declare function valuePairListFromUnknown(value: unknown, firstProp?: string, secondProp?: string): ValuePair[];
export declare function writeValuePairList(target: any, inValue: ValuePair[], firstProp?: string, secondProp?: string): void;
