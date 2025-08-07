import { ValueController, ViewProps, Value, PointAxis, Tuple2 } from '@tweakpane/core';
import { ValuePair } from '../model/value-pair.js';
import { ValuePairView } from '../view/value-pair.js';
import { PointNdTextController } from '../../common/controller/point-nd-text.js';
interface Config {
    axes: Tuple2<PointAxis>;
    value: Value<ValuePair>;
    viewProps: ViewProps;
}
export declare class ValuePairController implements ValueController<ValuePair, ValuePairView> {
    readonly value: Value<ValuePair>;
    readonly view: ValuePairView;
    readonly viewProps: ViewProps;
    private readonly textC_;
    constructor(doc: Document, config: Config);
    get textController(): PointNdTextController<ValuePair>;
}
export {};
