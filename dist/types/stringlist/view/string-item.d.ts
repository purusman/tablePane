import { View, ViewProps } from '@tweakpane/core';
interface Config {
    viewProps: ViewProps;
}
export declare class StringItemView implements View {
    readonly element: HTMLElement;
    readonly textElement: HTMLElement;
    constructor(doc: Document, config: Config);
}
export {};
