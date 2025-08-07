import { InputBindingPlugin } from '@tweakpane/core';
import { ValuePair, ValuePairObject } from './model/value-pair.js';
export interface ValuePairInputParams {
    view?: 'valuepair';
    firstProp?: string;
    secondProp?: string;
    min?: number;
    max?: number;
    step?: number;
    first?: {
        min?: number;
        max?: number;
        step?: number;
    };
    second?: {
        min?: number;
        max?: number;
        step?: number;
    };
}
export declare const ValuePairInputPlugin: InputBindingPlugin<ValuePair, ValuePairObject, ValuePairInputParams>;
