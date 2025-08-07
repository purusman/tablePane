import {
	createPlugin,
	InputBindingPlugin,
	parseRecord,
	BaseInputParams,
} from '@tweakpane/core';
import {StringListController, StringListInputParams} from './controller/string-list.js';
import {stringListFromUnknown, writeStringList} from './converter/string-list.js';
import {StringList, StringListObject} from './model/string-list.js';

export interface StringListPluginInputParams extends StringListInputParams, BaseInputParams {
	view?: 'stringlist';
}

export const StringListInputPlugin: InputBindingPlugin<
	StringList,
	StringListObject,
	StringListPluginInputParams
> = createPlugin({
	id: 'input-stringlist',
	type: 'input',
	accept: (value, params) => {
		const parsedParams = parseRecord<StringListPluginInputParams>(params, (p) => ({
			view: p.optional.constant('stringlist' as const),
			label: p.optional.string,
		}));
		
		if (!parsedParams) {
			return null;
		}
		
		if (!StringList.isObject(value)) {
			return null;
		}
		
		return {
			initialValue: value,
			params: parsedParams,
		};
	},
	binding: {
		reader: (_args) => stringListFromUnknown,
		equals: StringList.equals,
		writer: (_args) => writeStringList,
	},
	controller: (args) => {
		const doc = args.document;
		const value = args.value;
		
		return new StringListController(doc, {
			params: args.params,
			value: value,
			viewProps: args.viewProps,
		});
	},
});
