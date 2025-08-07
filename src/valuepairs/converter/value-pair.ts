import {ValuePair, ValuePairObject} from '../model/value-pair.js';

export function valuePairFromUnknown(value: unknown, firstProp = 'first', secondProp = 'second'): ValuePair {
	if (ValuePair.isObject(value, firstProp, secondProp)) {
		return ValuePair.fromObject(value, firstProp, secondProp);
	}
	return new ValuePair();
}

export function writeValuePair(target: any, inValue: ValuePair, firstProp = 'first', secondProp = 'second'): void {
	target.write(inValue.toObject(firstProp, secondProp));
}
