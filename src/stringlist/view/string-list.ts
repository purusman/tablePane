import {
	ClassName,
	View,
	ViewProps,
} from '@tweakpane/core';
import {StringItemView} from './string-item.js';

interface Config {
	viewProps: ViewProps;
	label?: string;
}

const cn = ClassName('sl');

export class StringListView implements View {
	public readonly element: HTMLElement;
	public readonly addButton: HTMLButtonElement;
	private readonly listElement_: HTMLElement;
	private readonly headerElement_: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		// Create header with label
		this.headerElement_ = doc.createElement('div');
		this.headerElement_.classList.add(cn('h'));
		
		const label = doc.createElement('div');
		label.classList.add(cn('l'));
		label.textContent = config.label || 'String';
		this.headerElement_.appendChild(label);

		const actionLabel = doc.createElement('div');
		actionLabel.classList.add(cn('l'));
		actionLabel.textContent = 'Actions';
		this.headerElement_.appendChild(actionLabel);

		this.element.appendChild(this.headerElement_);

		// Create list container
		this.listElement_ = doc.createElement('div');
		this.listElement_.classList.add(cn('list'));
		this.element.appendChild(this.listElement_);

		// Create add button
		this.addButton = doc.createElement('button');
		this.addButton.classList.add(cn('add'));
		this.addButton.textContent = '+ Add String';
		this.element.appendChild(this.addButton);
	}

	public addStringRow(stringView: StringItemView, onRemove: () => void, label?: string): void {
		const rowElement = document.createElement('div');
		rowElement.classList.add(cn('row'));

		// Create a wrapper for just the string view (no label)
		const stringWrapper = document.createElement('div');
		stringWrapper.classList.add(cn('string-wrapper'));

		// Add only the string view (no label)
		stringWrapper.appendChild(stringView.element);

		rowElement.appendChild(stringWrapper);

		// Add remove button
		const removeButton = document.createElement('button');
		removeButton.classList.add(cn('remove'));
		removeButton.textContent = '×';
		removeButton.addEventListener('click', () => {
			// Remove the row from the list
			if (rowElement.parentNode) {
				rowElement.parentNode.removeChild(rowElement);
			}
			onRemove();
		});
		rowElement.appendChild(removeButton);

		this.listElement_.appendChild(rowElement);
	}

	public clearRows(): void {
		while (this.listElement_.firstChild) {
			this.listElement_.removeChild(this.listElement_.firstChild);
		}
	}
}
