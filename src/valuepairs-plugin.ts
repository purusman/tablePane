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
	
	// Allow empty arrays
	if (value.length === 0) {
		return true;
	}
	
	// Check if every item is an object with exactly 2 numeric properties
	return value.every(item => {
		if (!item || typeof item !== 'object') {
			return false;
		}
		
		const values = Object.values(item);
		const keys = Object.keys(item);
		
		// Must have exactly 2 properties, both numbers
		return keys.length === 2 && 
			   values.length === 2 && 
			   values.every(v => typeof v === 'number');
	});
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
			// Dynamic property names
			firstProperty: p.optional.string,
			secondProperty: p.optional.string,
			// Labels
			firstLabel: p.optional.string,
			secondLabel: p.optional.string,
			// Default values
			defaultFirst: p.optional.number,
			defaultSecond: p.optional.number,
			// Global constraints
			min: p.optional.number,
			max: p.optional.number,
			step: p.optional.number,
			// We'll handle dynamic constraint objects separately
		}));

		// Handle dynamic constraint objects
		if (result) {
			const firstProp = result.firstProperty || 'first';
			const secondProp = result.secondProperty || 'second';
			
			// Add dynamic constraint objects
			if (params && typeof params === 'object' && firstProp in params && params[firstProp]) {
				(result as any)[firstProp] = parseRecord(params[firstProp] as Record<string, unknown>, (p) => ({
					min: p.optional.number,
					max: p.optional.number,
					step: p.optional.number,
				}));
			}
			
			if (params && typeof params === 'object' && secondProp in params && params[secondProp]) {
				(result as any)[secondProp] = parseRecord(params[secondProp] as Record<string, unknown>, (p) => ({
					min: p.optional.number,
					max: p.optional.number,
					step: p.optional.number,
				}));
			}
		}

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
					// Just return the value as-is since it's already validated
					return exValue;
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
				// Just pass through the value as-is since dynamic properties are preserved
				target.write(inValue);
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