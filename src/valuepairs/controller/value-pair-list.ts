import {
	ValueController,
	ViewProps,
	Value,
	createValue,
	createPointAxis,
	deepMerge,
	PointAxis,
	Tuple2,
	PointNdConstraint,
	createDimensionConstraint,
} from '@tweakpane/core';
import {ValuePair, ValuePairAssembly} from '../model/value-pair.js';
import {ValuePairListView} from '../view/value-pair-list.js';
import {ValuePairController} from './value-pair.js';

export interface ValuePairListInputParams {
	// Property names
	firstProp?: string;
	secondProp?: string;
	// Constraints
	min?: number;
	max?: number;
	step?: number;
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
	// Labels
	firstLabel?: string;
	secondLabel?: string;
}

interface Config {
	params: ValuePairListInputParams;
	value: Value<ValuePair[]>;
	viewProps: ViewProps;
}

export class ValuePairListController implements ValueController<ValuePair[], ValuePairListView> {
	public readonly value: Value<ValuePair[]>;
	public readonly view: ValuePairListView;
	public readonly viewProps: ViewProps;
	private readonly params_: ValuePairListInputParams;
	private readonly pairControllers_: ValuePairController[] = [];

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;
		this.params_ = config.params;

		this.view = new ValuePairListView(doc, {
			viewProps: this.viewProps,
			firstLabel: config.params.firstLabel || 'First',
			secondLabel: config.params.secondLabel || 'Second',
		});

		// Create controllers for existing pairs
		this.recreateControllers_(doc);

		// Listen for value changes to recreate controllers only when array length changes
		this.value.emitter.on('change', () => {
			const currentLength = this.value.rawValue.length;
			const controllerLength = this.pairControllers_.length;
			
			// Only recreate if the array length changed (add/remove), not for value updates within pairs
			if (currentLength !== controllerLength) {
				this.recreateControllers_(doc);
			}
		});

		// Handle add button
		this.view.addButton.addEventListener('click', () => {
			this.addPair_();
		});
	}

	private recreateControllers_(doc: Document): void {
		// Clear existing controllers and views
		this.pairControllers_.forEach(controller => {
			// Remove from view properly
			if (controller.view.element.parentNode) {
				controller.view.element.parentNode.removeChild(controller.view.element);
			}
		});
		this.pairControllers_.length = 0;
		
		// Clear all rows from the view
		this.view.clearRows();

		// Create new controllers for current pairs
		const pairs = this.value.rawValue;
		pairs.forEach((pair, index) => {
			this.createPairController_(doc, pair, index);
		});
	}

	private createPairController_(doc: Document, pair: ValuePair, index: number): void {
		// Create constraint for this pair
		const constraint = new PointNdConstraint({
			assembly: ValuePairAssembly,
			components: [
				createDimensionConstraint({...this.params_, ...this.params_.first}, pair.first),
				createDimensionConstraint({...this.params_, ...this.params_.second}, pair.second),
			],
		});

		// Create axes
		const dParams = [this.params_.first, this.params_.second];
		const axes = pair.getComponents().map((comp, i) =>
			createPointAxis({
				constraint: constraint.components[i],
				initialValue: comp,
				params: deepMerge(
					this.params_,
					(dParams[i] ?? {}) as Record<string, unknown>,
				),
			}),
		) as Tuple2<PointAxis>;

		// Create value for this pair
		const pairValue = createValue(pair);
		
		// Create controller
		const controller = new ValuePairController(doc, {
			axes: axes,
			value: pairValue,
			viewProps: this.viewProps,
		});

		// Listen for changes to update the main array
		pairValue.emitter.on('change', () => {
			this.updatePairAtIndex_(index, pairValue.rawValue);
		});

		this.pairControllers_.push(controller);

		// Add to view with remove button
		this.view.addPairRow(controller.view, () => {
			this.removePair_(index);
		}, this.params_.firstLabel || 'First', this.params_.secondLabel || 'Second');
	}

	private addPair_(): void {
		const newPair = new ValuePair(0, 0);
		const currentPairs = [...this.value.rawValue];
		currentPairs.push(newPair);
		this.value.rawValue = currentPairs;
	}

	private removePair_(index: number): void {
		const currentPairs = [...this.value.rawValue];
		currentPairs.splice(index, 1);
		this.value.rawValue = currentPairs;
	}

	private updatePairAtIndex_(index: number, newPair: ValuePair): void {
		const currentPairs = [...this.value.rawValue];
		
		// Only update if the value actually changed to prevent unnecessary events
		if (!ValuePair.equals(currentPairs[index], newPair)) {
			currentPairs[index] = newPair;
			this.value.rawValue = currentPairs;
		}
	}
}
