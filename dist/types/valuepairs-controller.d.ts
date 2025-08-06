import { Controller, Value, ViewProps } from '@tweakpane/core';
import { ValuePair, ValuePairsInputParams } from './types.js';
import { ValuePairsView } from './valuepairs-view.js';
interface Config {
    value: Value<ValuePair[]>;
    viewProps: ViewProps;
    params: ValuePairsInputParams;
}
export declare class ValuePairsController implements Controller<ValuePairsView> {
    readonly value: Value<ValuePair[]>;
    readonly view: ValuePairsView;
    readonly viewProps: ViewProps;
    private readonly params_;
    constructor(doc: Document, config: Config);
    private addPair;
    private onKeyDown_;
    getPairs(): ValuePair[];
    setPairs(pairs: ValuePair[]): void;
    addPairAt(index: number, pair?: ValuePair): void;
    removePairAt(index: number): boolean;
    updatePairAt(index: number, pair: ValuePair): boolean;
    clear(): void;
    getLength(): number;
}
export {};
