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
  constructor({ x = 0, y = 0, rows = 2, cols = 2, headers = [], cells = [] } = {}) {
    super({ type: 'Table', x, y });
    this.rows = rows;
    this.cols = cols;
    this.headers = headers; // Array of strings
    this.cells = cells;   // 2D array, can hold FormComponent or other content
    
    // Initialize cells if not provided, based on rows and cols
    if (this.cells.length === 0 && this.rows > 0 && this.cols > 0) {
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
  constructor({ x = 0, y = 0, label = 'Select Label', options = [] } = {}) {
    super({ type: 'Select', x, y });
    this.label = label;
    this.options = options; // Array of objects e.g., { value: 'val', text: 'Display Text' }
  }
}
