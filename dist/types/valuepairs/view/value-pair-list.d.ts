import { View, ViewProps } from '@tweakpane/core';
import { ValuePairView } from './value-pair.js';
interface Config {
    viewProps: ViewProps;
    firstLabel: string;
    secondLabel: string;
}
export declare class ValuePairListView implements View {
    readonly element: HTMLElement;
    readonly addButton: HTMLButtonElement;
    private readonly listElement_;
    private readonly headerElement_;
    constructor(doc: Document, config: Config);
    addPairRow(pairView: ValuePairView, onRemove: () => void, firstLabel?: string, secondLabel?: string): void;
    clearRows(): void;
}
export {};
