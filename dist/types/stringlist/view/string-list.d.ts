import { View, ViewProps } from '@tweakpane/core';
import { StringItemView } from './string-item.js';
interface Config {
    viewProps: ViewProps;
    label?: string;
}
export declare class StringListView implements View {
    readonly element: HTMLElement;
    readonly addButton: HTMLButtonElement;
    private readonly listElement_;
    private readonly headerElement_;
    constructor(doc: Document, config: Config);
    addStringRow(stringView: StringItemView, onRemove: () => void, label?: string): void;
    clearRows(): void;
}
export {};
