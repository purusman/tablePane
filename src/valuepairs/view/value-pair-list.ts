import {
	ClassName,
	View,
	ViewProps,
} from '@tweakpane/core';
import {ValuePairView} from './value-pair.js';

interface Config {
	viewProps: ViewProps;
	firstLabel: string;
	secondLabel: string;
}

const cn = ClassName('vpl');

export class ValuePairListView implements View {
	public readonly element: HTMLElement;
	public readonly addButton: HTMLButtonElement;
	private readonly listElement_: HTMLElement;
	private readonly headerElement_: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		// Create header with labels
		this.headerElement_ = doc.createElement('div');
		this.headerElement_.classList.add(cn('h'));
		
		const firstLabel = doc.createElement('div');
		firstLabel.classList.add(cn('l'));
		firstLabel.textContent = config.firstLabel;
		this.headerElement_.appendChild(firstLabel);

		const secondLabel = doc.createElement('div');
		secondLabel.classList.add(cn('l'));
		secondLabel.textContent = config.secondLabel;
		this.headerElement_.appendChild(secondLabel);

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
		this.addButton.textContent = '+ Add Pair';
		this.element.appendChild(this.addButton);
	}

	public addPairRow(pairView: ValuePairView, onRemove: () => void, firstLabel?: string, secondLabel?: string): void {
		const rowElement = document.createElement('div');
		rowElement.classList.add(cn('row'));

		// Create a wrapper that includes labels and the original pair view
		const pairWrapper = document.createElement('div');
		pairWrapper.classList.add(cn('pair-wrapper'));

		// Create labels container
		const labelsContainer = document.createElement('div');
		labelsContainer.classList.add(cn('labels'));
		
		const firstLabelElem = document.createElement('div');
		firstLabelElem.classList.add(cn('label'));
		firstLabelElem.textContent = firstLabel || 'First';
		labelsContainer.appendChild(firstLabelElem);

		const secondLabelElem = document.createElement('div');
		secondLabelElem.classList.add(cn('label'));
		secondLabelElem.textContent = secondLabel || 'Second';
		labelsContainer.appendChild(secondLabelElem);

		// Add labels and the original pair view
		pairWrapper.appendChild(labelsContainer);
		pairWrapper.appendChild(pairView.element);

		rowElement.appendChild(pairWrapper);

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
