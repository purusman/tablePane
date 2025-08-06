import {TemplateInputPlugin} from './plugin.js';
import {ValuePairsInputPlugin} from './valuepairs-plugin.js';

// The identifier of the plugin bundle.
export const id = 'tablepane';

// This plugin template injects a compiled CSS by @rollup/plugin-replace
// See rollup.config.js for details
export const css = '__css__';

// Export your plugin(s) as a constant `plugins`
export const plugins = [
	TemplateInputPlugin,
	ValuePairsInputPlugin,
];
