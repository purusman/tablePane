import {
	createPlugin,
	InputBindingPlugin,
	parseRecord,
} from '@tweakpane/core';
import {ValuePairListController, ValuePairListInputParams} from './controller/value-pair-list.js';
import {valuePairListFromUnknown, writeValuePairList} from './converter/value-pair-list.js';
import {ValuePair, ValuePairObject} from './model/value-pair.js';

export const ValuePairListInputPlugin: InputBindingPlugin<
	ValuePair[],
	ValuePairObject[],
	ValuePairListInputParams
> = createPlugin({
	id: 'input-valuepairlist',
	type: 'input',
	accept: (value, params) => {
		if (!Array.isArray(value)) {
			return null;
		}

		const result = parseRecord<ValuePairListInputParams>(params, (p) => ({
			view: p.optional.constant('valuepairlist' as const),
			firstProp: p.optional.string,
			secondProp: p.optional.string,
			min: p.optional.number,
			max: p.optional.number,
			step: p.optional.number,
			first: p.optional.object({
				min: p.optional.number,
				max: p.optional.number,
				step: p.optional.number,
			}),
			second: p.optional.object({
				min: p.optional.number,
				max: p.optional.number,
				step: p.optional.number,
			}),
			firstLabel: p.optional.string,
			secondLabel: p.optional.string,
		}));
		
		if (!result) {
			return null;
		}
		
		const firstProp = result.firstProp || 'first';
		const secondProp = result.secondProp || 'second';
		
		// Check if all items in array are ValuePair objects with the specified properties
		const allValid = value.every(item => ValuePair.isObject(item, firstProp, secondProp));
		if (!allValid) {
			return null;
		}

		return {
			initialValue: value,
			params: result,
		};
	},
	binding: {
		reader: (args) => (value: unknown) => valuePairListFromUnknown(value, args.params.firstProp, args.params.secondProp),
		constraint: () => undefined, // No constraint for the array itself
		equals: (v1, v2) => {
			if (v1.length !== v2.length) return false;
			return v1.every((pair, i) => ValuePair.equals(pair, v2[i]));
		},
		writer: (args) => (target: any, inValue: ValuePair[]) => writeValuePairList(target, inValue, args.params.firstProp, args.params.secondProp),
	},
	controller: (args) => {
		const doc = args.document;
		const value = args.value;
		
		return new ValuePairListController(doc, {
			params: args.params,
			value: value,
			viewProps: args.viewProps,
		});
	},
});
