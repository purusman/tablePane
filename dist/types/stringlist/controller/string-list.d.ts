import { ValueController, ViewProps, Value } from '@tweakpane/core';
import { StringList } from '../model/string-list.js';
import { StringListView } from '../view/string-list.js';
export interface StringListInputParams {
    label?: string;
}
interface Config {
    params: StringListInputParams;
    value: Value<StringList>;
    viewProps: ViewProps;
}
export declare class StringListController implements ValueController<StringList, StringListView> {
    readonly value: Value<StringList>;
    readonly view: StringListView;
    readonly viewProps: ViewProps;
    private readonly params_;
    private readonly stringControllers_;
    constructor(doc: Document, config: Config);
    private recreateControllers_;
    private createStringController_;
    private addString_;
    private removeString_;
    private updateStringAtIndex_;
}
export {};
