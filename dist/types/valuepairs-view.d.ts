import { Value, View, ViewProps } from '@tweakpane/core';
import { ValuePair, ValuePairsInputParams } from './types.js';
interface Config {
    value: Value<ValuePair[]>;
    viewProps: ViewProps;
    params: ValuePairsInputParams;
}
export declare class ValuePairsView implements View {
    readonly element: HTMLElement;
    readonly addButton: HTMLButtonElement;
    private value_;
    private params_;
    private viewProps_;
    private listContainer_;
    private pairRows_;
    constructor(doc: Document, config: Config);
    private refresh_;
    private createPairRow_;
    private deletePair_;
    addPair(): void;
    private onPairChange_;
    private onValueChange_;
}
export {};
