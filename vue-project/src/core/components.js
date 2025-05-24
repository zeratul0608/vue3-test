// Simple ID generator (timestamp + random number for more uniqueness)
let idCounter = 0;
function generateId() {
  return `${Date.now()}-${idCounter++}`;
}

export class BaseComponent {
  constructor({ type = 'Base', x = 0, y = 0 } = {}) {
    this.id = generateId();
    this.type = type;
    this.x = x;
    this.y = y;
  }
}

export class FormComponent extends BaseComponent {
  constructor({ x = 0, y = 0, children = [] } = {}) {
    super({ type: 'Form', x, y });
    this.children = children; // Array of InputComponent or SelectComponent instances
  }
}

export class TableComponent extends BaseComponent {
  constructor({ x = 0, y = 0, rows = 2, cols = 3, headers = ['Header 1', 'Header 2', 'Header 3'], cells = [] } = {}) {
    super({ type: 'Table', x, y });
    this.rows = Math.max(1, rows); // Ensure at least 1 row
    this.cols = Math.max(1, cols); // Ensure at least 1 col
    
    // Ensure headers array matches number of columns if headers are provided, or generate default if not
    if (headers.length !== this.cols) {
        this.headers = Array.from({ length: this.cols }, (_, i) => `Header ${i + 1}`);
    } else {
        this.headers = headers;
    }
    
    this.cells = cells;   // 2D array, can hold FormComponent or other content
    
    // Initialize cells if not provided, based on rows and cols
    // Ensure cells matrix matches actual rows and cols
    if (this.cells.length !== this.rows || (this.cells[0] && this.cells[0].length !== this.cols)) {
      this.cells = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
    }
  }
}

export class InputComponent extends BaseComponent {
  constructor({ x = 0, y = 0, label = 'Input Label', placeholder = 'Enter text...' } = {}) {
    super({ type: 'Input', x, y });
    this.label = label;
    this.placeholder = placeholder;
  }
}

export class SelectComponent extends BaseComponent {
  constructor({ x = 0, y = 0, label = 'Select Label', options = [{ value: 'opt1', text: 'Option 1' }, { value: 'opt2', text: 'Option 2' }] } = {}) {
    super({ type: 'Select', x, y });
    this.label = label;
    // Ensure options is always an array, even if undefined is passed.
    this.options = Array.isArray(options) ? options : [{ value: 'default', text: 'Default Option' }]; 
  }
}
