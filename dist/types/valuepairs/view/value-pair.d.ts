import { View, ViewProps } from '@tweakpane/core';
interface Config {
    viewProps: ViewProps;
}
export declare class ValuePairView implements View {
    readonly element: HTMLElement;
    readonly textElement: HTMLElement;
    constructor(doc: Document, config: Config);
}
export {};
