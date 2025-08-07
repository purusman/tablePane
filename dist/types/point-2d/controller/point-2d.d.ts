import { Parser, PickerLayout, PointAxis, Tuple2, Value, ValueController, ViewProps } from '@tweakpane/core';
import { Point2d } from '../model/point-2d.js';
import { Point2dView } from '../view/point-2d.js';
import { PointNdTextController } from '../../common/controller/point-nd-text.js';
interface Config {
    axes: Tuple2<PointAxis>;
    expanded: boolean;
    invertsY: boolean;
    max: number;
    parser: Parser<number>;
    pickerLayout: PickerLayout;
    value: Value<Point2d>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class Point2dController implements ValueController<Point2d, Point2dView> {
    readonly value: Value<Point2d>;
    readonly view: Point2dView;
    readonly viewProps: ViewProps;
    private readonly popC_;
    private readonly pickerC_;
    private readonly textC_;
    private readonly foldable_;
    constructor(doc: Document, config: Config);
    get textController(): PointNdTextController<Point2d>;
    private onPadButtonBlur_;
    private onPadButtonClick_;
    private onPopupChildBlur_;
    private onPopupChildKeydown_;
}
export {};
