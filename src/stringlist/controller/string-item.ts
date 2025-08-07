import {
	ValueController,
	ViewProps,
	Value,
	TextController,
	ValueMap,
} from '@tweakpane/core';
import {StringItemView} from '../view/string-item.js';

interface Config {
	value: Value<string>;
	viewProps: ViewProps;
}

export class StringItemController implements ValueController<string, StringItemView> {
	public readonly value: Value<string>;
	public readonly view: StringItemView;
	public readonly viewProps: ViewProps;
	private readonly textC_: TextController<string>;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		// Create TextController using the provided example pattern
		this.textC_ = new TextController(doc, {
			parser: (v) => v,
			props: ValueMap.fromObject({
				formatter: (v: string) => v,
			}),
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view = new StringItemView(doc, {
			viewProps: this.viewProps,
		});
		
		this.view.textElement.appendChild(this.textC_.view.element);
	}

	get textController(): TextController<string> {
		return this.textC_;
	}
}
