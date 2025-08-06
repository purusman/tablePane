import {BaseInputParams} from '@tweakpane/core';

// Value pair interface
export interface ValuePair {
	[key: string]: number;
}

// Plugin input parameters
export interface ValuePairsInputParams extends BaseInputParams {
	view: 'valuepairs';
	// Dynamic property names (defaults to 'first' and 'second')
	firstProperty?: string;
	secondProperty?: string;
	// Labels (defaults to property names)
	firstLabel?: string;
	secondLabel?: string;
	// Default values
	defaultFirst?: number;
	defaultSecond?: number;
	// Constraint parameters like Point2D plugin
	min?: number;
	max?: number;
	step?: number;
	// Dimension-specific constraints using dynamic property names
	[key: string]: any; // Allow dynamic constraint objects
}

// Event data for pair operations
export interface PairChangeEvent {
	index: number;
	pair: ValuePair;
}

export interface PairDeleteEvent {
	index: number;
}