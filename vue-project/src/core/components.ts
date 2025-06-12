// Simple ID generator
let idCounter: number = 0;
function generateId(): string {
  return `${Date.now()}-${idCounter++}`;
}

// --- INTERFACES ---

// Base interface for all component data structures
export interface ComponentCoreData {
  id: string;
  type: string;
  x: number;
  y: number;
}

// Interface for constructor options of BaseComponent
interface BaseComponentOptions {
  type?: string;
  x?: number;
  y?: number;
}

export class BaseComponent implements ComponentCoreData {
  id: string;
  type: string;
  x: number;
  y: number;

  constructor({ type = 'Base', x = 0, y = 0 }: BaseComponentOptions = {}) {
    this.id = generateId();
    this.type = type;
    this.x = x;
    this.y = y;
  }
}

// --- FormComponent ---
// Children can be InputComponent or SelectComponent instances.
// We use their class types here for simplicity, assuming they also implement ComponentCoreData.
export type FormChildComponent = InputComponent | SelectComponent;

export interface FormComponentData extends ComponentCoreData {
  children: FormChildComponent[];
}

interface FormComponentOptions extends BaseComponentOptions {
  children?: FormChildComponent[];
}

export class FormComponent extends BaseComponent implements FormComponentData {
  children: FormChildComponent[];

  constructor({ x = 0, y = 0, children = [] }: FormComponentOptions = {}) {
    super({ type: 'Form', x, y });
    this.children = children;
  }
}

// --- TableComponent ---
// Cells can contain FormComponent instances or be null.
export type TableCellContent = FormComponent | null;

export interface TableComponentData extends ComponentCoreData {
  rows: number;
  cols: number;
  headers: string[];
  cells: TableCellContent[][];
}

interface TableComponentOptions extends BaseComponentOptions {
  rows?: number;
  cols?: number;
  headers?: string[];
  cells?: TableCellContent[][];
}

export class TableComponent extends BaseComponent implements TableComponentData {
  rows: number;
  cols: number;
  headers: string[];
  cells: TableCellContent[][];

  constructor({ x = 0, y = 0, rows = 2, cols = 3, headers, cells = [] }: TableComponentOptions = {}) {
    super({ type: 'Table', x, y });
    this.rows = Math.max(1, rows);
    this.cols = Math.max(1, cols);

    if (headers && headers.length === this.cols) {
      this.headers = headers;
    } else {
      this.headers = Array.from({ length: this.cols }, (_, i) => `Header ${i + 1}`);
    }

    // Ensure cells matrix matches actual rows and cols and is properly initialized
    if (cells.length === this.rows && cells.every(row => row.length === this.cols)) {
        this.cells = cells;
    } else {
        this.cells = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
    }
  }
}

// --- InputComponent ---
export interface InputComponentData extends ComponentCoreData {
  label: string;
  placeholder: string;
}

interface InputComponentOptions extends BaseComponentOptions {
  label?: string;
  placeholder?: string;
}

export class InputComponent extends BaseComponent implements InputComponentData {
  label: string;
  placeholder: string;

  constructor({ x = 0, y = 0, label = 'Input Label', placeholder = 'Enter text...' }: InputComponentOptions = {}) {
    super({ type: 'Input', x, y });
    this.label = label;
    this.placeholder = placeholder;
  }
}

// --- SelectComponent ---
export interface SelectOption {
  value: string;
  text: string;
}

export interface SelectComponentData extends ComponentCoreData {
  label: string;
  options: SelectOption[];
}

interface SelectComponentOptions extends BaseComponentOptions {
  label?: string;
  options?: SelectOption[];
}

export class SelectComponent extends BaseComponent implements SelectComponentData {
  label: string;
  options: SelectOption[];

  constructor({ x = 0, y = 0, label = 'Select Label', options }: SelectComponentOptions = {}) {
    super({ type: 'Select', x, y });
    this.label = label;
    if (options === undefined || options === null || options.length === 0) {
        this.options = [{ value: 'opt1', text: 'Option 1' }, { value: 'opt2', text: 'Option 2' }];
    } else {
        this.options = Array.isArray(options) ? options : [{ value: 'default', text: 'Default Option' }];
    }
  }
}
