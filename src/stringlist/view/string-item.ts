import {
	ClassName,
	View,
	ViewProps,
} from '@tweakpane/core';

interface Config {
	viewProps: ViewProps;
}

const cn = ClassName('si');

export class StringItemView implements View {
	public readonly element: HTMLElement;
	public readonly textElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const textElem = doc.createElement('div');
		textElem.classList.add(cn('t'));
		this.element.appendChild(textElem);
		this.textElement = textElem;
	}
}
