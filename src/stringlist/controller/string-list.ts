import {
	ValueController,
	ViewProps,
	Value,
	createValue,
} from '@tweakpane/core';
import {StringList} from '../model/string-list.js';
import {StringListView} from '../view/string-list.js';
import {StringItemController} from './string-item.js';

export interface StringListInputParams {
	// Labels
	label?: string;
}

interface Config {
	params: StringListInputParams;
	value: Value<StringList>;
	viewProps: ViewProps;
}

export class StringListController implements ValueController<StringList, StringListView> {
	public readonly value: Value<StringList>;
	public readonly view: StringListView;
	public readonly viewProps: ViewProps;
	private readonly params_: StringListInputParams;
	private readonly stringControllers_: StringItemController[] = [];

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;
		this.params_ = config.params;

		this.view = new StringListView(doc, {
			viewProps: this.viewProps,
			label: config.params.label || 'String',
		});

		// Create controllers for existing strings
		this.recreateControllers_(doc);

		// Listen for value changes to recreate controllers only when array length changes
		this.value.emitter.on('change', () => {
			const currentLength = this.value.rawValue.items.length;
			const controllerLength = this.stringControllers_.length;
			
			// Only recreate if the array length changed (add/remove), not for value updates within strings
			if (currentLength !== controllerLength) {
				this.recreateControllers_(doc);
			}
		});

		// Handle add button
		this.view.addButton.addEventListener('click', () => {
			this.addString_();
		});
	}

	private recreateControllers_(doc: Document): void {
		// Clear existing controllers and views
		this.stringControllers_.forEach(controller => {
			// Remove from view properly
			if (controller.view.element.parentNode) {
				controller.view.element.parentNode.removeChild(controller.view.element);
			}
		});
		this.stringControllers_.length = 0;
		
		// Clear all rows from the view
		this.view.clearRows();

		// Create new controllers for current strings
		const strings = this.value.rawValue.items;
		strings.forEach((str, index) => {
			this.createStringController_(doc, str, index);
		});
	}

	private createStringController_(doc: Document, str: string, index: number): void {
		// Create value for this string
		const stringValue = createValue(str);
		
		// Create controller
		const controller = new StringItemController(doc, {
			value: stringValue,
			viewProps: this.viewProps,
		});

		// Listen for changes to update the main array
		stringValue.emitter.on('change', () => {
			this.updateStringAtIndex_(index, stringValue.rawValue);
		});

		this.stringControllers_.push(controller);

		// Add to view with remove button
		this.view.addStringRow(controller.view, () => {
			this.removeString_(index);
		});
	}

	private addString_(): void {
		const newString = '';
		const currentStrings = [...this.value.rawValue.items];
		currentStrings.push(newString);
		this.value.rawValue = new StringList(currentStrings);
	}

	private removeString_(index: number): void {
		const currentStrings = [...this.value.rawValue.items];
		currentStrings.splice(index, 1);
		this.value.rawValue = new StringList(currentStrings);
	}

	private updateStringAtIndex_(index: number, newString: string): void {
		const currentStrings = [...this.value.rawValue.items];
		
		// Only update if the value actually changed to prevent unnecessary events
		if (currentStrings[index] !== newString) {
			currentStrings[index] = newString;
			this.value.rawValue = new StringList(currentStrings);
		}
	}
}
