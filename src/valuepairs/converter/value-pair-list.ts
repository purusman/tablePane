import {ValuePair, ValuePairObject} from '../model/value-pair.js';

export function valuePairListFromUnknown(value: unknown, firstProp = 'first', secondProp = 'second'): ValuePair[] {
	if (!Array.isArray(value)) {
		return [];
	}
	
	return value.map(item => {
		if (ValuePair.isObject(item, firstProp, secondProp)) {
			return ValuePair.fromObject(item, firstProp, secondProp);
		}
		return new ValuePair();
	});
}

export function writeValuePairList(target: any, inValue: ValuePair[], firstProp = 'first', secondProp = 'second'): void {
	target.write(inValue.map(pair => pair.toObject(firstProp, secondProp)));
}
