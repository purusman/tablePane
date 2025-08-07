export interface ValuePairObject {
	first: number;
	second: number;
}

export class ValuePair {
	public readonly first: number;
	public readonly second: number;

	constructor(first = 0, second = 0) {
		this.first = first;
		this.second = second;
	}

	public getComponents(): [number, number] {
		return [this.first, this.second];
	}

	public static isObject(obj: unknown, firstProp = 'first', secondProp = 'second'): obj is ValuePairObject {
		if (typeof obj !== 'object' || obj === null) {
			return false;
		}
		const o = obj as any;
		if (typeof o[firstProp] !== 'number' || typeof o[secondProp] !== 'number') {
			return false;
		}
		return true;
	}

	public static equals(v1: ValuePair, v2: ValuePair): boolean {
		return v1.first === v2.first && v1.second === v2.second;
	}

	public static fromObject(obj: any, firstProp = 'first', secondProp = 'second'): ValuePair {
		return new ValuePair(obj[firstProp] || 0, obj[secondProp] || 0);
	}

	public toObject(firstProp = 'first', secondProp = 'second'): any {
		const result: any = {};
		result[firstProp] = this.first;
		result[secondProp] = this.second;
		return result;
	}
}

export const ValuePairAssembly = {
	toComponents: (p: ValuePair): [number, number] => p.getComponents(),
	fromComponents: (comps: [number, number]): ValuePair => new ValuePair(comps[0], comps[1]),
};
