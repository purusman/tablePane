import {
	ValueController,
	ViewProps,
	Value,
	parseNumber,
	createPointAxis,
	deepMerge,
	PointAxis,
	Tuple2,
} from '@tweakpane/core';
import {ValuePair, ValuePairAssembly} from '../model/value-pair.js';
import {ValuePairView} from '../view/value-pair.js';
import {PointNdTextController} from '../../common/controller/point-nd-text.js';

interface Config {
	axes: Tuple2<PointAxis>;
	value: Value<ValuePair>;
	viewProps: ViewProps;
}

export class ValuePairController implements ValueController<ValuePair, ValuePairView> {
	public readonly value: Value<ValuePair>;
	public readonly view: ValuePairView;
	public readonly viewProps: ViewProps;
	private readonly textC_: PointNdTextController<ValuePair>;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.textC_ = new PointNdTextController(doc, {
			assembly: ValuePairAssembly,
			axes: config.axes,
			parser: parseNumber,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view = new ValuePairView(doc, {
			viewProps: this.viewProps,
		});
		
		this.view.textElement.appendChild(this.textC_.view.element);
	}

	get textController(): PointNdTextController<ValuePair> {
		return this.textC_;
	}
}
