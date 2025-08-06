import {BaseInputParams} from '@tweakpane/core';

// Value pair interface
export interface ValuePair {
	first: number;
	second: number;
}

// Plugin input parameters
export interface ValuePairsInputParams extends BaseInputParams {
	view: 'valuepairs';
	// Optional: labels for the two values
	firstLabel?: string;
	secondLabel?: string;
	// Optional: default values for new pairs
	defaultFirst?: number;
	defaultSecond?: number;
	// Constraint parameters like Point2D plugin
	min?: number;
	max?: number;
	step?: number;
	// Dimension-specific constraints
	first?: {
		min?: number;
		max?: number;
		step?: number;
	};
	second?: {
		min?: number;
		max?: number;
		step?: number;
	};
}

// Event data for pair operations
export interface PairChangeEvent {
	index: number;
	pair: ValuePair;
}

export interface PairDeleteEvent {
	index: number;
}