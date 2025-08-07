import { PickerLayout, Value, ValueMap, View, ViewProps } from '@tweakpane/core';
import { Point2d } from '../model/point-2d.js';
/**
 * @hidden
 */
export type Point2dPickerProps = ValueMap<{
    invertsY: boolean;
    max: number;
    xKeyScale: number;
    yKeyScale: number;
}>;
/**
 * @hidden
 */
interface Config {
    layout: PickerLayout;
    props: Point2dPickerProps;
    value: Value<Point2d>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class Point2dPickerView implements View {
    readonly element: HTMLElement;
    readonly padElement: HTMLDivElement;
    readonly value: Value<Point2d>;
    private readonly props_;
    private readonly svgElem_;
    private readonly lineElem_;
    private readonly markerElem_;
    constructor(doc: Document, config: Config);
    get allFocusableElements(): HTMLElement[];
    private update_;
    private onValueChange_;
    private onPropsChange_;
    private onFoldableChange_;
}
export {};
