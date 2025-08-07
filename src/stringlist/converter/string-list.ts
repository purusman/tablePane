import {StringList, StringListObject} from '../model/string-list.js';

export function stringListFromUnknown(value: unknown): StringList {
	if (StringList.isObject(value)) {
		return StringList.fromObject(value);
	}
	return new StringList();
}

export function writeStringList(target: any, inValue: StringList): void {
	target.write(inValue.toObject());
}
