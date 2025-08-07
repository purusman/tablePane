import {
	createPlugin,
	InputBindingPlugin,
	parseRecord,
	createDimensionConstraint,
	createPointAxis,
	deepMerge,
	parseNumber,
	PointNdConstraint,
	Tuple2,
	PointAxis,
	Constraint,
} from '@tweakpane/core';
import {ValuePairController} from './controller/value-pair.js';
import {valuePairFromUnknown, writeValuePair} from './converter/value-pair.js';
import {ValuePair, ValuePairAssembly, ValuePairObject} from './model/value-pair.js';

export interface ValuePairInputParams {
	view?: 'valuepair';
	// Property names
	firstProp?: string;
	secondProp?: string;
	// Constraint parameters
	min?: number;
	max?: number;
	step?: number;
	// Dimension-specific constraints
	first?: {
		min?: number;
		max?: number;
		step?: number;
	};
	second?: {
		min?: number;
		max?: number;
		step?: number;
	};
}

function createConstraint(
	params: ValuePairInputParams,
	initialValue: ValuePairObject,
): Constraint<ValuePair> {
	return new PointNdConstraint({
		assembly: ValuePairAssembly,
		components: [
			createDimensionConstraint({...params, ...params.first}, initialValue.first),
			createDimensionConstraint({...params, ...params.second}, initialValue.second),
		],
	});
}

export const ValuePairInputPlugin: InputBindingPlugin<
	ValuePair,
	ValuePairObject,
	ValuePairInputParams
> = createPlugin({
	id: 'input-valuepair',
	type: 'input',
	accept: (value, params) => {
		const parsedParams = parseRecord<ValuePairInputParams>(params, (p) => ({
			view: p.optional.constant('valuepair' as const),
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
		}));
		
		if (!parsedParams) {
			return null;
		}
		
		const firstProp = parsedParams.firstProp || 'first';
		const secondProp = parsedParams.secondProp || 'second';
		
		if (!ValuePair.isObject(value, firstProp, secondProp)) {
			return null;
		}
		
		return {
			initialValue: value,
			params: parsedParams,
		};
	},
	binding: {
		reader: (args) => (value: unknown) => valuePairFromUnknown(value, args.params.firstProp, args.params.secondProp),
		constraint: (args) => createConstraint(args.params, args.initialValue),
		equals: ValuePair.equals,
		writer: (args) => (target: any, inValue: ValuePair) => writeValuePair(target, inValue, args.params.firstProp, args.params.secondProp),
	},
	controller: (args) => {
		const doc = args.document;
		const value = args.value;
		const c = args.constraint as PointNdConstraint<ValuePair>;
		const dParams = [args.params.first, args.params.second];
		
		return new ValuePairController(doc, {
			axes: value.rawValue.getComponents().map((comp, i) =>
				createPointAxis({
					constraint: c.components[i],
					initialValue: comp,
					params: deepMerge(
						args.params,
						(dParams[i] ?? {}) as Record<string, unknown>,
					),
				}),
			) as Tuple2<PointAxis>,
			value: value,
			viewProps: args.viewProps,
		});
	},
});
