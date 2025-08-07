import {
	ClassName, 
	Value, 
	View, 
	ViewProps,
	createValue,
	parseNumber,
	CompositeConstraint,
	createRangeConstraint,
	createStepConstraint,
	NumberTextController,
	ValueMap,
	getSuitableKeyScale,
	getSuitablePointerScale,
	Formatter,
	createNumberTextPropsObject,
} from '@tweakpane/core';
import {ValuePair, ValuePairsInputParams} from './types.js';

interface Config {
	value: Value<ValuePair[]>;
	viewProps: ViewProps;
	params: ValuePairsInputParams;
}

// Create a class name generator for the value pairs view
const className = ClassName('valuepairs');

// Individual pair row view using NumberTextController
class PairRowView {
	public readonly element: HTMLElement;
	public readonly firstController: NumberTextController;
	public readonly secondController: NumberTextController;
	public readonly deleteButton: HTMLButtonElement;

	constructor(doc: Document, pair: ValuePair, index: number, params: ValuePairsInputParams, viewProps: ViewProps, onValueChange: () => void) {
		// Create row container
		this.element = doc.createElement('div');
		this.element.classList.add(className('row'));

		// Get dynamic property names (default to 'first' and 'second')
		const firstProp = params.firstProperty || 'first';
		const secondProp = params.secondProperty || 'second';

		// Create first input using NumberTextController
		const firstContainer = doc.createElement('div');
		firstContainer.classList.add(className('input-container'));
		
		const firstLabel = doc.createElement('label');
		firstLabel.classList.add(className('label'));
		firstLabel.textContent = params.firstLabel || firstProp;
		
		// Prepare constraints for first input
		const firstParams = (params as any)[firstProp] || {};
		const globalMin = params.min;
		const globalMax = params.max;
		const globalStep = params.step;
		
		const firstConstraints = [];
		const firstMin = firstParams.min !== undefined ? firstParams.min : globalMin;
		const firstMax = firstParams.max !== undefined ? firstParams.max : globalMax;
		const firstStep = firstParams.step !== undefined ? firstParams.step : globalStep;
		
		if (firstMin !== undefined || firstMax !== undefined) {
			const rangeConstraint = createRangeConstraint({min: firstMin, max: firstMax});
			if (rangeConstraint) firstConstraints.push(rangeConstraint);
		}
		
		if (firstStep !== undefined) {
			const stepConstraint = createStepConstraint({step: firstStep});
			if (stepConstraint) firstConstraints.push(stepConstraint);
		}

		// Create first NumberTextController
		const firstInitialValue = (pair as any)[firstProp] || 0;
		const firstScaleParams = {
			...(firstMin !== undefined ? {min: firstMin} : {}),
			...(firstMax !== undefined ? {max: firstMax} : {}),
			...(firstStep !== undefined ? {step: firstStep} : {}),
		};
		
		this.firstController = new NumberTextController(doc, {
			arrayPosition: 'fst',
			parser: parseNumber,
			props: ValueMap.fromObject(createNumberTextPropsObject(firstScaleParams, firstInitialValue)),
			sliderProps: new ValueMap({
				keyScale: createValue(getSuitableKeyScale(firstScaleParams)),
				min: createValue(firstMin !== undefined ? firstMin : -Infinity),
				max: createValue(firstMax !== undefined ? firstMax : Infinity),
			}),
			value: createValue(firstInitialValue, {
				constraint: firstConstraints.length > 0 ? new CompositeConstraint(firstConstraints) : undefined,
			}),
			viewProps: viewProps,
		});

		this.firstController.value.emitter.on('change', () => {
			onValueChange();
		});

		firstContainer.appendChild(firstLabel);
		firstContainer.appendChild(this.firstController.view.element);

		// Create second input using NumberTextController
		const secondContainer = doc.createElement('div');
		secondContainer.classList.add(className('input-container'));
		
		const secondLabel = doc.createElement('label');
		secondLabel.classList.add(className('label'));
		secondLabel.textContent = params.secondLabel || secondProp;
		
		// Prepare constraints for second input
		const secondParams = (params as any)[secondProp] || {};
		
		const secondConstraints = [];
		const secondMin = secondParams.min !== undefined ? secondParams.min : globalMin;
		const secondMax = secondParams.max !== undefined ? secondParams.max : globalMax;
		const secondStep = secondParams.step !== undefined ? secondParams.step : globalStep;
		
		if (secondMin !== undefined || secondMax !== undefined) {
			const rangeConstraint = createRangeConstraint({min: secondMin, max: secondMax});
			if (rangeConstraint) secondConstraints.push(rangeConstraint);
		}
		
		if (secondStep !== undefined) {
			const stepConstraint = createStepConstraint({step: secondStep});
			if (stepConstraint) secondConstraints.push(stepConstraint);
		}

		// Create second NumberTextController
		const secondInitialValue = (pair as any)[secondProp] || 0;
		const secondScaleParams = {
			...(secondMin !== undefined ? {min: secondMin} : {}),
			...(secondMax !== undefined ? {max: secondMax} : {}),
			...(secondStep !== undefined ? {step: secondStep} : {}),
		};
		
		this.secondController = new NumberTextController(doc, {
			arrayPosition: 'lst',
			parser: parseNumber,
			props: ValueMap.fromObject(createNumberTextPropsObject(secondScaleParams, secondInitialValue)),
			sliderProps: new ValueMap({
				keyScale: createValue(getSuitableKeyScale(secondScaleParams)),
				min: createValue(secondMin !== undefined ? secondMin : -Infinity),
				max: createValue(secondMax !== undefined ? secondMax : Infinity),
			}),
			value: createValue(secondInitialValue, {
				constraint: secondConstraints.length > 0 ? new CompositeConstraint(secondConstraints) : undefined,
			}),
			viewProps: viewProps,
		});

		this.secondController.value.emitter.on('change', () => {
			onValueChange();
		});

		secondContainer.appendChild(secondLabel);
		secondContainer.appendChild(this.secondController.view.element);

		// Create delete button
		this.deleteButton = doc.createElement('button');
		this.deleteButton.classList.add(className('delete-btn'));
		this.deleteButton.textContent = '×';
		this.deleteButton.title = 'Delete this pair';

		// Assemble row
		this.element.appendChild(firstContainer);
		this.element.appendChild(secondContainer);
		this.element.appendChild(this.deleteButton);
	}

	updatePair(pair: ValuePair, params: ValuePairsInputParams): void {
		const firstProp = params.firstProperty || 'first';
		const secondProp = params.secondProperty || 'second';
		
		this.firstController.value.rawValue = (pair as any)[firstProp] || 0;
		this.secondController.value.rawValue = (pair as any)[secondProp] || 0;
	}

	getPair(params: ValuePairsInputParams): ValuePair {
		const firstProp = params.firstProperty || 'first';
		const secondProp = params.secondProperty || 'second';
		
		const result: any = {};
		result[firstProp] = this.firstController.value.rawValue;
		result[secondProp] = this.secondController.value.rawValue;
		return result;
	}
}

// Main view class for the value pairs plugin
export class ValuePairsView implements View {
	public readonly element: HTMLElement;
	public readonly addButton: HTMLButtonElement;
	
	private value_: Value<ValuePair[]>;
	private params_: ValuePairsInputParams;
	private viewProps_: ViewProps;
	private listContainer_: HTMLElement;
	private pairRows_: PairRowView[] = [];

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		// Store configuration
		this.value_ = config.value;
		this.params_ = config.params;
		this.viewProps_ = config.viewProps;

		// Create root element
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		// Create list container
		this.listContainer_ = doc.createElement('div');
		this.listContainer_.classList.add(className('list'));

		// Create add button
		this.addButton = doc.createElement('button');
		this.addButton.classList.add(className('add-btn'));
		this.addButton.textContent = '+ Add Pair';

		// Assemble elements
		this.element.appendChild(this.listContainer_);
		this.element.appendChild(this.addButton);

		// Handle value changes
		this.value_.emitter.on('change', this.onValueChange_);

		// Initial render
		this.refresh_();

		config.viewProps.handleDispose(() => {
			// Cleanup NumberTextControllers
			this.pairRows_.forEach(row => {
				// NumberTextControllers handle their own disposal automatically
			});
		});
	}

	private refresh_(): void {
		// Clear existing rows
		this.pairRows_.forEach(row => {
			if (row.element.parentNode) {
				this.listContainer_.removeChild(row.element);
			}
		});
		this.pairRows_ = [];

		// Create new rows for each pair
		const pairs = this.value_.rawValue;
		pairs.forEach((pair, index) => {
			this.createPairRow_(pair, index);
		});
	}

	private createPairRow_(pair: ValuePair, index: number): void {
		const doc = this.element.ownerDocument;
		const pairRow = new PairRowView(
			doc, 
			pair, 
			index, 
			this.params_, 
			this.viewProps_,
			() => this.onPairChange_(index)
		);
		
		pairRow.deleteButton.addEventListener('click', () => {
			this.deletePair_(index);
		});
		
		this.pairRows_[index] = pairRow;
		this.listContainer_.appendChild(pairRow.element);
	}

	private deletePair_(index: number): void {
		const pairs = [...this.value_.rawValue];
		pairs.splice(index, 1);
		this.value_.rawValue = pairs;
	}

	public addPair(): void {
		const firstProp = this.params_.firstProperty || 'first';
		const secondProp = this.params_.secondProperty || 'second';
		
		const newPair: any = {};
		newPair[firstProp] = this.params_.defaultFirst || 0;
		newPair[secondProp] = this.params_.defaultSecond || 0;

		const pairs = [...this.value_.rawValue, newPair];
		this.value_.rawValue = pairs;
	}

	private onPairChange_(index: number): void {
		const currentPairs = [...this.value_.rawValue];
		if (this.pairRows_[index]) {
			currentPairs[index] = this.pairRows_[index].getPair(this.params_);
			this.value_.rawValue = currentPairs;
		}
	}

	private onValueChange_(): void {
		this.refresh_();
	}
}