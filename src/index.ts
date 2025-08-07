import {TemplateInputPlugin} from './plugin.js';
import {ValuePairsInputPlugin} from './valuepairs-plugin.js';
import {ValuePairInputPlugin} from './valuepairs/plugin.js';
import {ValuePairListInputPlugin} from './valuepairs/plugin-list.js';
import {Point2dInputPlugin} from './point-2d/plugin.js';

// The identifier of the plugin bundle.
export const id = 'tablepane';

// This plugin template injects a compiled CSS by @rollup/plugin-replace
// See rollup.config.js for details
export const css = '__css__';

// Export your plugin(s) as a constant `plugins`
export const plugins = [
	TemplateInputPlugin,
	ValuePairsInputPlugin,
	ValuePairInputPlugin,
	ValuePairListInputPlugin,
	Point2dInputPlugin,
];
