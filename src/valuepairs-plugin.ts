import {
	BaseInputParams,
	BindingTarget,
	CompositeConstraint,
	createPlugin,
	createRangeConstraint,
	createStepConstraint,
	InputBindingPlugin,
	parseRecord,
} from '@tweakpane/core';

import {ValuePair, ValuePairsInputParams} from './types.js';
import {ValuePairsController} from './valuepairs-controller.js';

// Validate that a value is an array of value pairs
function isValuePairArray(value: unknown): value is ValuePair[] {
	if (!Array.isArray(value)) {
		return false;
	}

	return value.every(item => 
		typeof item === 'object' && 
		item !== null &&
		typeof (item as any).first === 'number' &&
		typeof (item as any).second === 'number'
	);
}

// Input plugin for editing arrays of value pairs
export const ValuePairsInputPlugin: InputBindingPlugin<
	ValuePair[],
	ValuePair[],
	ValuePairsInputParams
> = createPlugin({
	id: 'input-valuepairs',
	type: 'input',

	accept(exValue: unknown, params: Record<string, unknown>) {
		// Check if the external value is an array of value pairs
		if (!isValuePairArray(exValue)) {
			return null;
		}

		// Parse parameters object with constraint support
		const result = parseRecord<ValuePairsInputParams>(params, (p) => ({
			view: p.required.constant('valuepairs'),
			firstLabel: p.optional.string,
			secondLabel: p.optional.string,
			defaultFirst: p.optional.number,
			defaultSecond: p.optional.number,
			// Global constraints
			min: p.optional.number,
			max: p.optional.number,
			step: p.optional.number,
			// Dimension-specific constraints
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

		if (!result) {
			return null;
		}

		// Return typed value and params to accept the input
		return {
			initialValue: exValue,
			params: result,
		};
	},

	binding: {
		reader(_args) {
			return (exValue: unknown): ValuePair[] => {
				// Convert external value to internal value
				if (isValuePairArray(exValue)) {
					// Create a deep copy to avoid mutation issues
					return exValue.map(pair => ({
						first: pair.first,
						second: pair.second,
					}));
				}
				
				// Return empty array as fallback
				return [];
			};
		},

		// Note: constraints are applied at the input level in the view
		// rather than at the binding level since we're dealing with arrays

		writer(_args) {
			return (target: BindingTarget, inValue: ValuePair[]) => {
				// Write the internal value back to the target
				// Create a deep copy to avoid mutation issues
				const outputValue = inValue.map(pair => ({
					first: pair.first,
					second: pair.second,
				}));
				
				target.write(outputValue);
			};
		},
	},

	controller(args) {
		// Create and return the controller
		return new ValuePairsController(args.document, {
			value: args.value,
			viewProps: args.viewProps,
			params: args.params,
		});
	},
});