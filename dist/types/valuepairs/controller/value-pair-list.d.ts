import { ValueController, ViewProps, Value } from '@tweakpane/core';
import { ValuePair } from '../model/value-pair.js';
import { ValuePairListView } from '../view/value-pair-list.js';
export interface ValuePairListInputParams {
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
    firstLabel?: string;
    secondLabel?: string;
}
interface Config {
    params: ValuePairListInputParams;
    value: Value<ValuePair[]>;
    viewProps: ViewProps;
}
export declare class ValuePairListController implements ValueController<ValuePair[], ValuePairListView> {
    readonly value: Value<ValuePair[]>;
    readonly view: ValuePairListView;
    readonly viewProps: ViewProps;
    private readonly params_;
    private readonly pairControllers_;
    constructor(doc: Document, config: Config);
    private recreateControllers_;
    private createPairController_;
    private addPair_;
    private removePair_;
    private updatePairAtIndex_;
}
export {};
