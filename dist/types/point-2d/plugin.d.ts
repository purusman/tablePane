import { Point2dInputParams } from 'tweakpane';
import { Point2d, Point2dObject } from './model/point-2d.js';
import { InputBindingPlugin } from '@tweakpane/core';
export declare function getSuitableMax(params: Point2dInputParams, initialValue: Point2d): number;
/**
 * @hidden
 */
export declare const Point2dInputPlugin: InputBindingPlugin<Point2d, Point2dObject, Point2dInputParams>;
