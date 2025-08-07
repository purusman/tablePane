import { NumberTextController, Parser, PointAxis, PointNdAssembly, Value, ValueController, ViewProps } from "@tweakpane/core";
import { PointNdTextView } from "../view/point-nd-text.js";
interface Config<PointNd> {
    assembly: PointNdAssembly<PointNd>;
    axes: PointAxis[];
    parser: Parser<number>;
    value: Value<PointNd>;
    viewProps: ViewProps;
}
export declare function createAxisController<PointNd>(doc: Document, config: Config<PointNd>, index: number): NumberTextController;
export declare class PointNdTextController<PointNd> implements ValueController<PointNd, PointNdTextView> {
    readonly value: Value<PointNd>;
    readonly view: PointNdTextView;
    readonly viewProps: ViewProps;
    private readonly acs_;
    constructor(doc: Document, config: Config<PointNd>);
    get textControllers(): NumberTextController[];
}
export {};
