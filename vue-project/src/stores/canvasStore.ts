import { defineStore } from 'pinia';
import {
  BaseComponent, // Using class as a type here for simplicity, can also use ComponentCoreData
  FormComponent, // Using class for type
  TableComponent,  // Using class for type
  InputComponent,  // Using class for type
  SelectComponent, // Using class for type
  SelectOption,
  FormChildComponent, // This is InputComponent | SelectComponent
  TableCellContent  // This is FormComponent | null
} from '../core/components.ts'; // Corrected path to .ts

// Union type for any component that can be in the main components array
export type CanvasComponent = BaseComponent | FormComponent | TableComponent | InputComponent | SelectComponent;

export interface CanvasState {
  components: CanvasComponent[];
  // any other state properties
}

export const useCanvasStore = defineStore('canvas', {
  state: (): CanvasState => ({
    components: [],
  }),
  getters: {
    getComponentById: (state: CanvasState) => (id: string): CanvasComponent | undefined => {
      return state.components.find(component => component.id === id);
    },
    // Example of another getter:
    // allComponents: (state: CanvasState): CanvasComponent[] => state.components,
  },
  actions: {
    addComponent(component: CanvasComponent) {
      // Ensure the component has an ID, though our classes should handle this.
      if (!component.id) {
        console.error('Component added without an ID:', component);
        // Potentially generate an ID here if robust handling is needed (generateId is not in scope here)
      }
      this.components.push(component);
    },
    updateComponentPosition({ id, x, y }: { id: string; x: number; y: number }) {
      const component = this.getComponentById(id);
      if (component) {
        component.x = x;
        component.y = y;
      } else {
        console.warn(`Component with ID ${id} not found for position update.`);
      }
    },
    addChildToComponent({ parentId, childComponent }: { parentId: string; childComponent: FormChildComponent }) {
      const parentComponent = this.getComponentById(parentId) as FormComponent | undefined;
      if (parentComponent && parentComponent.type === 'Form') {
         if (!parentComponent.children) { // Should be initialized by constructor, but good check
            parentComponent.children = [];
         }
        // Ensure childComponent has an ID
        if (!childComponent.id) {
          console.error('Child component added without an ID:', childComponent);
          return;
        }
        parentComponent.children.push(childComponent);
        console.log(`Child component ${childComponent.id} added to parent ${parentId}`);
      } else {
        console.warn(`FormComponent with ID ${parentId} not found or is not a FormComponent.`);
      }
    },
    updateTableConfiguration({ componentId, rows, cols, headers }: { componentId: string; rows: number; cols: number; headers: string }) {
      const table = this.getComponentById(componentId) as TableComponent | undefined;
      if (table && table.type === 'Table') {
        const numRows = Math.max(1, rows); // Ensure positive
        const numCols = Math.max(1, cols); // Ensure positive

        table.rows = numRows;
        table.cols = numCols;

        const parsedHeaders = headers.split(',').map(h => h.trim()).filter(h => h);
        if (parsedHeaders.length !== numCols) {
          table.headers = Array.from({ length: numCols }, (_, i) => `Header ${i + 1}`);
          console.warn(`Header count mismatch for Table ${componentId}. Expected ${numCols}, got ${parsedHeaders.length}. Generating default headers.`);
        } else {
          table.headers = parsedHeaders;
        }

        // Re-initialize cells to match new dimensions
        table.cells = Array(table.rows).fill(null).map(() => Array(table.cols).fill(null) as TableCellContent[]);

        console.log(`Table ${componentId} configuration updated: ${numRows}x${numCols}, Headers:`, table.headers);
      } else {
        console.warn(`TableComponent with ID ${componentId} not found or is not a TableComponent.`);
      }
    },
    updateSelectOptions({ componentId, newOptions }: { componentId: string; newOptions: SelectOption[] }) {
      const selectComp = this.getComponentById(componentId) as SelectComponent | undefined;
      if (selectComp && selectComp.type === 'Select') {
        if (Array.isArray(newOptions) && newOptions.every(opt => typeof opt.value === 'string' && typeof opt.text === 'string')) {
          selectComp.options = newOptions;
          console.log(`Select component ${componentId} options updated:`, newOptions);
        } else {
          console.error(`Invalid newOptions format for Select ${componentId}. Expected array of {value: string, text: string}.`, newOptions);
        }
      } else {
        console.warn(`SelectComponent with ID ${componentId} not found or is not a SelectComponent.`);
      }
    },
    addComponentToTableCell({ tableId, rowIndex, colIndex, childComponent }: { tableId: string; rowIndex: number; colIndex: number; childComponent: FormComponent }) {
      const tableComponent = this.getComponentById(tableId) as TableComponent | undefined;
      if (tableComponent && tableComponent.type === 'Table') {
        if (!childComponent || !childComponent.id) {
          console.error('Invalid child FormComponent or child component without ID for table cell.');
          return;
        }
        // Ensure cells array and specific row is initialized
        if (tableComponent.cells && tableComponent.cells[rowIndex] && typeof tableComponent.cells[rowIndex][colIndex] !== 'undefined') {
          if (tableComponent.cells[rowIndex][colIndex] === null) {
            tableComponent.cells[rowIndex][colIndex] = childComponent;
            console.log(`FormComponent ${childComponent.id} added to Table ${tableId} at cell [${rowIndex}][${colIndex}]`);
          } else {
            const existingId = (tableComponent.cells[rowIndex][colIndex] as FormComponent).id; // Type assertion
            console.warn(`Cell [${rowIndex}][${colIndex}] in Table ${tableId} is already occupied by component ${existingId}.`);
          }
        } else {
          console.error(`Cell [${rowIndex}][${colIndex}] is not accessible in Table ${tableId}.`);
        }
      } else {
        console.warn(`TableComponent with ID ${tableId} not found or is not a TableComponent.`);
      }
    },
    // removeComponent(id: string) {
    //   this.components = this.components.filter(comp => comp.id !== id);
    // }
  },
});
