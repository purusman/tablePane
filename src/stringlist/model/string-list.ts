export type StringListObject = string[];

export class StringList {
	public readonly items: string[];

	constructor(items: string[] = []) {
		this.items = [...items];
	}

	public getComponents(): string[] {
		return [...this.items];
	}

	public static isObject(obj: unknown): obj is StringListObject {
		if (!Array.isArray(obj)) {
			return false;
		}
		return obj.every(item => typeof item === 'string');
	}

	public static equals(v1: StringList, v2: StringList): boolean {
		if (v1.items.length !== v2.items.length) {
			return false;
		}
		return v1.items.every((item, index) => item === v2.items[index]);
	}

	public static fromObject(obj: StringListObject): StringList {
		return new StringList(obj);
	}

	public toObject(): StringListObject {
		return [...this.items];
	}
}

export const StringListAssembly = {
	toComponents: (s: StringList): string[] => s.getComponents(),
	fromComponents: (comps: string[]): StringList => new StringList(comps),
};
