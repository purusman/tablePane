import { BaseInputParams } from '@tweakpane/core';
export interface ValuePair {
    first: number;
    second: number;
}
export interface ValuePairsInputParams extends BaseInputParams {
    view: 'valuepairs';
    firstLabel?: string;
    secondLabel?: string;
    defaultFirst?: number;
    defaultSecond?: number;
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
export interface PairChangeEvent {
    index: number;
    pair: ValuePair;
}
export interface PairDeleteEvent {
    index: number;
}
