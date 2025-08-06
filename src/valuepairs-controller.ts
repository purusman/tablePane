import {Controller, Value, ViewProps} from '@tweakpane/core';
import {ValuePair, ValuePairsInputParams} from './types.js';
import {ValuePairsView} from './valuepairs-view.js';

interface Config {
	value: Value<ValuePair[]>;
	viewProps: ViewProps;
	params: ValuePairsInputParams;
}

// Controller class for managing the value pairs plugin
export class ValuePairsController implements Controller<ValuePairsView> {
	public readonly value: Value<ValuePair[]>;
	public readonly view: ValuePairsView;
	public readonly viewProps: ViewProps;
	private readonly params_: ValuePairsInputParams;

	constructor(doc: Document, config: Config) {
		// Store configuration
		this.value = config.value;
		this.viewProps = config.viewProps;
		this.params_ = config.params;

		// Create the view
		this.view = new ValuePairsView(doc, {
			value: this.value,
			viewProps: this.viewProps,
			params: this.params_,
		});

		// Handle add button click
		this.view.addButton.addEventListener('click', () => {
			this.addPair();
		});

		// Handle keyboard shortcuts
		this.view.element.addEventListener('keydown', (e) => {
			this.onKeyDown_(e);
		});

		// Handle cleanup
		this.viewProps.handleDispose(() => {
			// Cleanup handled by view
		});
	}

	private addPair(): void {
		this.view.addPair();
	}

	private onKeyDown_(e: KeyboardEvent): void {
		// Handle keyboard shortcuts
		if (e.ctrlKey || e.metaKey) {
			switch (e.key) {
				case 'Enter':
					// Ctrl+Enter to add new pair
					e.preventDefault();
					this.addPair();
					break;
			}
		}
	}

	// Utility methods for external access
	public getPairs(): ValuePair[] {
		return [...this.value.rawValue];
	}

	public setPairs(pairs: ValuePair[]): void {
		this.value.rawValue = [...pairs];
	}

	public addPairAt(index: number, pair?: ValuePair): void {
		const newPair = pair || {
			first: this.params_.defaultFirst || 0,
			second: this.params_.defaultSecond || 0,
		};

		const pairs = [...this.value.rawValue];
		pairs.splice(index, 0, newPair);
		this.value.rawValue = pairs;
	}

	public removePairAt(index: number): boolean {
		if (index < 0 || index >= this.value.rawValue.length) {
			return false;
		}

		const pairs = [...this.value.rawValue];
		pairs.splice(index, 1);
		this.value.rawValue = pairs;
		return true;
	}

	public updatePairAt(index: number, pair: ValuePair): boolean {
		if (index < 0 || index >= this.value.rawValue.length) {
			return false;
		}

		const pairs = [...this.value.rawValue];
		pairs[index] = {...pair};
		this.value.rawValue = pairs;
		return true;
	}

	public clear(): void {
		this.value.rawValue = [];
	}

	public getLength(): number {
		return this.value.rawValue.length;
	}
}