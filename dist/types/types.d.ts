import { BaseInputParams } from '@tweakpane/core';
export interface ValuePair {
    [key: string]: number;
}
export interface ValuePairsInputParams extends BaseInputParams {
    view: 'valuepairs';
    firstProperty?: string;
    secondProperty?: string;
    firstLabel?: string;
    secondLabel?: string;
    defaultFirst?: number;
    defaultSecond?: number;
    min?: number;
    max?: number;
    step?: number;
    [key: string]: any;
}
export interface PairChangeEvent {
    index: number;
    pair: ValuePair;
}
export interface PairDeleteEvent {
    index: number;
}
