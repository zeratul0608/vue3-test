import { defineStore } from 'pinia';

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    /** @type {import('../core/components.js').BaseComponent[]} */
    components: [],
  }),
  actions: {
    addComponent(component) {
      // Ensure the component has an ID, though our classes should handle this.
      if (!component.id) {
        console.error('Component added without an ID:', component);
        // Potentially generate an ID here if robust handling is needed
        // component.id = generateId(); // Assuming generateId is available or imported
      }
      this.components.push(component);
    },
    updateComponentPosition({ id, x, y }) {
      const component = this.components.find(comp => comp.id === id);
      if (component) {
        component.x = x;
        component.y = y;
      } else {
        console.warn(`Component with ID ${id} not found for position update.`);
      }
    },
    addChildToComponent({ parentId, childComponent }) {
      const parentComponent = this.components.find(comp => comp.id === parentId);
      if (parentComponent) {
        if (typeof parentComponent.children !== 'undefined') {
          // Ensure child has a unique ID (it should come with one from core/components.js)
          if (!childComponent.id) {
            console.error('Child component added without an ID:', childComponent);
            // Potentially generate an ID here if robust handling is needed
            // childComponent.id = generateId(); // Assuming generateId is available
          }
          parentComponent.children.push(childComponent);
          console.log(`Child component ${childComponent.id} added to parent ${parentId}`);
        } else {
          console.warn(`Parent component with ID ${parentId} does not have a 'children' property.`);
        }
      } else {
        console.warn(`Parent component with ID ${parentId} not found.`);
      }
    },
    updateTableConfiguration({ componentId, rows, cols, headers }) {
      const component = this.components.find(comp => comp.id === componentId);
      if (component && component.type === 'Table') {
        const numRows = parseInt(rows, 10);
        const numCols = parseInt(cols, 10);

        if (isNaN(numRows) || numRows <= 0) {
          console.warn(`Invalid number of rows: ${rows}. Must be a positive integer.`);
          return;
        }
        if (isNaN(numCols) || numCols <= 0) {
          console.warn(`Invalid number of columns: ${cols}. Must be a positive integer.`);
          return;
        }

        component.rows = numRows;
        component.cols = numCols;
        
        // Parse headers string (comma-separated) into an array
        // Ensure the number of headers matches the number of columns
        const parsedHeaders = headers.split(',').map(h => h.trim()).filter(h => h);
        if (parsedHeaders.length !== numCols) {
          // If mismatch, create default headers based on new numCols
          component.headers = Array.from({ length: numCols }, (_, i) => `Header ${i + 1}`);
          console.warn(`Header count mismatch. Expected ${numCols}, got ${parsedHeaders.length}. Generating default headers.`);
        } else {
          component.headers = parsedHeaders;
        }

        // Re-initialize cells to match new dimensions, clearing existing cell content.
        // A more advanced implementation might try to preserve existing cell data if dimensions allow.
        component.cells = Array(component.rows).fill(null).map(() => Array(component.cols).fill(null));
        
        console.log(`Table ${componentId} configuration updated: ${numRows}x${numCols}, Headers:`, component.headers);
      } else {
        console.warn(`Table component with ID ${componentId} not found or not a Table.`);
      }
    },
    updateSelectOptions({ componentId, newOptions }) {
      const component = this.components.find(comp => comp.id === componentId);
      if (component && component.type === 'Select') {
        if (Array.isArray(newOptions) && newOptions.every(opt => typeof opt.value === 'string' && typeof opt.text === 'string')) {
          component.options = newOptions;
          console.log(`Select component ${componentId} options updated:`, newOptions);
        } else {
          console.error(`Invalid newOptions format for Select component ${componentId}. Expected array of {value: string, text: string}.`, newOptions);
        }
      } else {
        console.warn(`Select component with ID ${componentId} not found or not a Select component.`);
      }
    },
    addComponentToTableCell({ tableId, rowIndex, colIndex, childComponent }) {
      const tableComponent = this.components.find(comp => comp.id === tableId);
      if (tableComponent && tableComponent.type === 'Table') {
        // Ensure childComponent has an ID (it should from core/components.js)
        if (!childComponent || !childComponent.id) {
          console.error('Invalid child component or child component without ID:', childComponent);
          return;
        }
        // Ensure cells array is initialized and accessible
        if (tableComponent.cells && 
            tableComponent.cells[rowIndex] && 
            typeof tableComponent.cells[rowIndex][colIndex] !== 'undefined') {
          
          // Check if the cell is empty (null) before placing a new component
          if (tableComponent.cells[rowIndex][colIndex] === null) {
            tableComponent.cells[rowIndex][colIndex] = childComponent;
            console.log(`FormComponent ${childComponent.id} added to Table ${tableId} at cell [${rowIndex}][${colIndex}]`);
          } else {
            console.warn(`Cell [${rowIndex}][${colIndex}] in Table ${tableId} is already occupied by component ${tableComponent.cells[rowIndex][colIndex].id}.`);
            // Optionally, allow replacement or provide feedback
            // For now, we prevent overwriting an existing component.
          }
        } else {
          console.error(`Cell [${rowIndex}][${colIndex}] is not accessible in Table ${tableId}. Current cells:`, tableComponent.cells);
        }
      } else {
        console.warn(`Table component with ID ${tableId} not found.`);
      }
    },
    // Example of another action that might be useful:
    // removeComponent(id) {
    //   this.components = this.components.filter(comp => comp.id !== id);
    // }
  },
  getters: {
    getComponentById: (state) => {
      return (id) => state.components.find(comp => comp.id === id);
    },
    // Example of another getter:
    // allComponents: (state) => state.components,
  },
});
