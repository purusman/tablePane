import { InputBindingPlugin } from '@tweakpane/core';
import { StringListInputParams } from './controller/string-list.js';
import { StringList, StringListObject } from './model/string-list.js';
export interface StringListPluginInputParams extends StringListInputParams {
    view?: 'stringlist';
}
export declare const StringListInputPlugin: InputBindingPlugin<StringList, StringListObject, StringListPluginInputParams>;
