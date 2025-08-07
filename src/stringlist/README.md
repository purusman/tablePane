# String List Plugin

A Tweakpane plugin for handling lists of strings, built using the value pair list foundation but adapted to use TextController for each row instead of NumberTextController.

## Features

- **Dynamic String List**: Add and remove string items dynamically
- **TextController Integration**: Each string item uses Tweakpane's TextController for consistent text input behavior
- **Consistent UI**: Follows the same design patterns as the value pair list plugin
- **Full Binding Support**: Properly integrates with Tweakpane's binding system

## Usage

```typescript
import {Pane} from 'tweakpane';
import * as YourPlugin from './path/to/your/plugin';

const pane = new Pane();
pane.registerPlugin(YourPlugin);

const PARAMS = {
  stringList: ['Hello', 'World', 'Example']
};

pane.addInput(PARAMS, 'stringList', {
  view: 'stringlist',
  label: 'Items'
}).on('change', (ev) => {
  console.log('String list changed:', ev.value);
});
```

## Plugin Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `view` | `'stringlist'` | Required view identifier | - |
| `label` | `string` | Label for string items | `'String'` |

## Architecture

The plugin is structured following Tweakpane's plugin architecture:

### Model Layer
- **`StringList`**: Core model class representing a list of strings
- **`StringListObject`**: Type alias for string arrays
- **`StringListAssembly`**: Assembly functions for component conversion

### View Layer
- **`StringItemView`**: View for individual string items
- **`StringListView`**: Main view containing the list and controls

### Controller Layer
- **`StringItemController`**: Controller for individual string items using TextController
- **`StringListController`**: Main controller managing the entire list

### Converter Layer
- **`stringListFromUnknown`**: Converts unknown values to StringList
- **`writeStringList`**: Writes StringList back to target objects

## Key Differences from Value Pair List

1. **TextController Usage**: Instead of using NumberTextController with parseNumber, each string item uses TextController with identity parser and formatter
2. **Simplified Model**: StringList model is simpler than ValuePair, just managing an array of strings
3. **Single Input per Row**: Each row contains one text input instead of two number inputs
4. **String Validation**: Uses string type validation instead of number validation

## Implementation Details

### TextController Integration

The plugin uses TextController following the pattern from the provided example:

```typescript
this.textC_ = new TextController(doc, {
  parser: (v) => v,  // Identity parser for strings
  props: ValueMap.fromObject({
    formatter: (v: string) => v,  // Identity formatter
  }),
  value: this.value,
  viewProps: this.viewProps,
});
```

### CSS Classes

The plugin uses the following CSS class structure:
- `.tp-slv`: Main string list view
- `.tp-slv_list`: List container
- `.tp-slv_row`: Individual row
- `.tp-slv_string-wrapper`: Wrapper for string input and label
- `.tp-slv_label`: Label for string input
- `.tp-slv_remove`: Remove button
- `.tp-slv_add`: Add button
- `.tp-siv`: String item view
- `.tp-siv_t`: Text container in string item

## Files Structure

```
src/stringlist/
├── model/
│   └── string-list.ts          # Core model and types
├── converter/
│   └── string-list.ts          # Value conversion utilities
├── view/
│   ├── string-item.ts          # Individual string item view
│   └── string-list.ts          # Main list view
├── controller/
│   ├── string-item.ts          # String item controller with TextController
│   └── string-list.ts          # Main list controller
├── plugin.ts                   # Main plugin definition
├── test-example.html           # Usage example
└── README.md                   # This file
```

## Styling

The plugin includes comprehensive SCSS styling that matches the existing value pair list design, with appropriate modifications for single-input rows. The styling is included in the main `src/sass/plugin.scss` file.
