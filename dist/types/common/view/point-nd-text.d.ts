import { NumberTextView, View } from '@tweakpane/core';
interface Config {
    textViews: NumberTextView[];
}
/**
 * @hidden
 */
export declare class PointNdTextView implements View {
    readonly element: HTMLElement;
    readonly textViews: NumberTextView[];
    constructor(doc: Document, config: Config);
}
export {};
