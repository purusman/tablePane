import { ValueController, ViewProps, Value, TextController } from '@tweakpane/core';
import { StringItemView } from '../view/string-item.js';
interface Config {
    value: Value<string>;
    viewProps: ViewProps;
}
export declare class StringItemController implements ValueController<string, StringItemView> {
    readonly value: Value<string>;
    readonly view: StringItemView;
    readonly viewProps: ViewProps;
    private readonly textC_;
    constructor(doc: Document, config: Config);
    get textController(): TextController;
}
export {};
