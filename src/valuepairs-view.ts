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
	createNumberFormatter,
	ValueMap,
	getSuitableKeyScale,
	getSuitablePointerScale,
	NumberInputPlugin,
} from '@tweakpane/core';
import {ValuePair, ValuePairsInputParams} from './types.js';

interface Config {
	value: Value<ValuePair[]>;
	viewProps: ViewProps;
	params: ValuePairsInputParams;
}

// Create a class name generator for the value pairs view
const className = ClassName('valuepairs');

// Individual pair row view using native Tweakpane InputBindingApi
class PairRowView {
	public readonly element: HTMLElement;
	public readonly firstBinding: any;
	public readonly secondBinding: any;
	public readonly deleteButton: HTMLButtonElement;
	private readonly firstTarget_: {value: number};
	private readonly secondTarget_: {value: number};

	constructor(doc: Document, pair: ValuePair, index: number, params: ValuePairsInputParams, viewProps: ViewProps, onValueChange: () => void) {
		// Create row container
		this.element = doc.createElement('div');
		this.element.classList.add(className('row'));

		// Get dynamic property names (default to 'first' and 'second')
		const firstProp = params.firstProperty || 'first';
		const secondProp = params.secondProperty || 'second';

		// Create target objects for bindings
		this.firstTarget_ = {value: (pair as any)[firstProp] || 0};
		this.secondTarget_ = {value: (pair as any)[secondProp] || 0};

		// Create first input using NumberInputPlugin
		const firstContainer = doc.createElement('div');
		firstContainer.classList.add(className('input-container'));
		
		const firstLabel = doc.createElement('label');
		firstLabel.classList.add(className('label'));
		firstLabel.textContent = params.firstLabel || firstProp;
		
		// Prepare constraint parameters for first input (use dynamic property name)
		const firstParams = (params as any)[firstProp] || {};
		const globalMin = params.min;
		const globalMax = params.max;
		const globalStep = params.step;
		
		const firstInputParams = {
			...(firstParams.min !== undefined || globalMin !== undefined ? { min: firstParams.min ?? globalMin } : {}),
			...(firstParams.max !== undefined || globalMax !== undefined ? { max: firstParams.max ?? globalMax } : {}),
			...(firstParams.step !== undefined || globalStep !== undefined ? { step: firstParams.step ?? globalStep } : {}),
		};

		// Create first binding using NumberInputPlugin
		const firstResult = NumberInputPlugin.accept(this.firstTarget_.value, firstInputParams);
		if (firstResult) {
			this.firstBinding = NumberInputPlugin.controller({
				document: doc,
				value: createValue(this.firstTarget_.value),
				viewProps: viewProps,
				params: firstResult.params,
				initialValue: firstResult.initialValue,
				constraint: undefined, // We'll apply constraints via params instead
			});
			
			this.firstBinding.value.emitter.on('change', () => {
				this.firstTarget_.value = this.firstBinding.value.rawValue;
				onValueChange();
			});
		}

		firstContainer.appendChild(firstLabel);
		if (this.firstBinding) {
			firstContainer.appendChild(this.firstBinding.view.element);
		}

		// Create second input using NumberInputPlugin
		const secondContainer = doc.createElement('div');
		secondContainer.classList.add(className('input-container'));
		
		const secondLabel = doc.createElement('label');
		secondLabel.classList.add(className('label'));
		secondLabel.textContent = params.secondLabel || secondProp;
		
		// Prepare constraint parameters for second input (use dynamic property name)
		const secondParams = (params as any)[secondProp] || {};
		
		const secondInputParams = {
			...(secondParams.min !== undefined || globalMin !== undefined ? { min: secondParams.min ?? globalMin } : {}),
			...(secondParams.max !== undefined || globalMax !== undefined ? { max: secondParams.max ?? globalMax } : {}),
			...(secondParams.step !== undefined || globalStep !== undefined ? { step: secondParams.step ?? globalStep } : {}),
		};

		// Create second binding using NumberInputPlugin
		const secondResult = NumberInputPlugin.accept(this.secondTarget_.value, secondInputParams);
		if (secondResult) {
			this.secondBinding = NumberInputPlugin.controller({
				document: doc,
				value: createValue(this.secondTarget_.value),
				viewProps: viewProps,
				params: secondResult.params,
				initialValue: secondResult.initialValue,
				constraint: undefined, // We'll apply constraints via params instead
			});
			
			this.secondBinding.value.emitter.on('change', () => {
				this.secondTarget_.value = this.secondBinding.value.rawValue;
				onValueChange();
			});
		}

		secondContainer.appendChild(secondLabel);
		if (this.secondBinding) {
			secondContainer.appendChild(this.secondBinding.view.element);
		}

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
		
		this.firstTarget_.value = (pair as any)[firstProp] || 0;
		this.secondTarget_.value = (pair as any)[secondProp] || 0;
		if (this.firstBinding) {
			this.firstBinding.value.rawValue = (pair as any)[firstProp] || 0;
		}
		if (this.secondBinding) {
			this.secondBinding.value.rawValue = (pair as any)[secondProp] || 0;
		}
	}

	getPair(params: ValuePairsInputParams): ValuePair {
		const firstProp = params.firstProperty || 'first';
		const secondProp = params.secondProperty || 'second';
		
		const result: any = {};
		result[firstProp] = this.firstTarget_.value;
		result[secondProp] = this.secondTarget_.value;
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
			// Cleanup native controllers
			this.pairRows_.forEach(row => {
				// Native controllers handle their own disposal
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