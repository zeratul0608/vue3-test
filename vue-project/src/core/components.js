// Simple ID generator
let idCounter = 0;
function generateId() {
  return `${Date.now()}-${idCounter++}`;
}

export class BaseComponent {
  constructor({ type = 'Base', order = 0 } = {}) { // x, y parameters removed
    this.id = generateId();
    this.type = type;
    this.order = order; // 'order' property added
  }
}

export class FormComponent extends BaseComponent {
  constructor({ type = 'Form', order = 0, children = [] } = {}) { // x, y parameters removed
    super({ type, order }); // x, y arguments removed from super() call
    this.children = children; // Array of InputComponent or SelectComponent instances
  }
}

export class TableComponent extends BaseComponent {
  constructor({ type = 'Table', order = 0, rows = 2, cols = 3, headers, cells = [] } = {}) { // x, y parameters removed
    super({ type, order }); // x, y arguments removed from super() call
    this.rows = Math.max(1, rows); // Ensure at least 1 row
    this.cols = Math.max(1, cols); // Ensure at least 1 col

    // Ensure headers array matches number of columns if headers are provided, or generate default if not
    if (headers && headers.length === this.cols) {
      this.headers = headers;
    } else {
      this.headers = Array.from({ length: this.cols }, (_, i) => `Header ${i + 1}`);
    }

    // Initialize cells if not provided, based on rows and cols
    // Ensure cells matrix matches actual rows and cols
    if (cells.length === this.rows && cells.every(row => row.length === this.cols)) {
        this.cells = cells;
    } else {
        this.cells = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
    }
  }
}

export class InputComponent extends BaseComponent {
  constructor({ type = 'Input', order = 0, label = 'Input Label', placeholder = 'Enter text...' } = {}) { // x, y parameters removed
    super({ type, order }); // x, y arguments removed from super() call
    this.label = label;
    this.placeholder = placeholder;
  }
}

export class SelectComponent extends BaseComponent {
  constructor({ type = 'Select', order = 0, label = 'Select Label', options } = {}) { // x, y parameters removed
    super({ type, order }); // x, y arguments removed from super() call
    this.label = label;
    // Ensure options is always an array, even if undefined is passed. Provide default if necessary.
    if (options === undefined || options === null || (Array.isArray(options) && options.length === 0) ) {
        this.options = [{ value: 'opt1', text: 'Option 1' }, { value: 'opt2', text: 'Option 2' }];
    } else {
        // This was a slight bug in the TS version if `options` was an empty array, it would use default.
        // This JS version keeps closer to the original intent if `options` is provided but empty.
        // However, the prompt implies if options are not provided (or empty), use defaults.
        // Let's stick to the TS logic's outcome for default options.
        this.options = Array.isArray(options) && options.length > 0 ? options : [{ value: 'opt1', text: 'Option 1' }, { value: 'opt2', text: 'Option 2' }];
        // A simpler way, closer to the TS:
        // this.options = (Array.isArray(options) && options.length > 0) ? options : [{ value: 'defaultVal', text: 'Default Option' }];
        // Correcting to match the final TS logic which was:
        // if (options === undefined || options === null || options.length === 0) {
        //    this.options = [{ value: 'opt1', text: 'Option 1' }, { value: 'opt2', text: 'Option 2' }];
        // } else {
        //    this.options = Array.isArray(options) ? options : [{ value: 'default', text: 'Default Option' }];
        // }
        // The above implies that if options is an empty array, it should also use default.
        // So, the condition `(Array.isArray(options) && options.length === 0)` is important.
    }
  }
}
