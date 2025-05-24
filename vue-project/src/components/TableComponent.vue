<template>
  <div class="table-component-wrapper">
    <div class="config-area">
      <h4>Configure Table</h4>
      <div>
        <label :for="'rows-' + component.id">Rows:</label>
        <input type="number" :id="'rows-' + component.id" v-model.number="config.rows" min="1" />
      </div>
      <div>
        <label :for="'cols-' + component.id">Cols:</label>
        <input type="number" :id="'cols-' + component.id" v-model.number="config.cols" min="1" />
      </div>
      <div>
        <label :for="'headers-' + component.id">Headers (comma-separated):</label>
        <input type="text" :id="'headers-' + component.id" v-model="config.headersStr" />
      </div>
      <button @click="applyConfiguration">Apply Configuration</button>
    </div>

    <table class="styled-table">
      <thead>
        <tr>
          <th v-if="!component.headers || component.headers.length === 0">Default Header</th>
          <th v-for="(header, index) in component.headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in component.cells" :key="'row-' + rowIndex">
          <td 
            v-for="(cell, colIndex) in row" 
            :key="'col-' + rowIndex + '-' + colIndex"
            class="table-cell"
            :class="{ 'cell-drag-over': cellDragOverState[rowIndex] && cellDragOverState[rowIndex][colIndex] }"
            @dragover.prevent="handleCellDragOver($event, rowIndex, colIndex)"
            @dragleave="handleCellDragLeave(rowIndex, colIndex)"
            @drop.prevent="handleCellDrop($event, rowIndex, colIndex)"
          >
            <template v-if="cell && cell.type === 'Form'">
              <form-component-vue :component="cell" />
            </template>
            <template v-else-if="cell === null">
              <!-- Placeholder for empty cell, or make it less prominent -->
              <span class="empty-cell-placeholder">Empty Cell</span>
            </template>
            <template v-else>
              <!-- Handle other non-Form component types or simple data if needed -->
              <span class="unknown-cell-content">Cell occupied</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, ref, watchEffect, reactive } from 'vue';
import { useCanvasStore } from '../stores/canvasStore.js';
import { FormComponent as FormComponentClass } from '../core/components.js'; // Class definition
import FormComponentVue from './FormComponent.vue'; // Vue component

const props = defineProps({
  component: {
    type: Object, // Instance of TableComponent from core/components.js
    required: true,
  },
});

const canvasStore = useCanvasStore();
const cellDragOverState = reactive({});

// Reactive state for configuration inputs
const config = ref({
  rows: props.component.rows,
  cols: props.component.cols,
  headersStr: props.component.headers.join(', '),
});

// Initialize cellDragOverState based on component dimensions
watchEffect(() => {
  for (let i = 0; i < props.component.rows; i++) {
    if (!cellDragOverState[i]) {
      cellDragOverState[i] = reactive({});
    }
    for (let j = 0; j < props.component.cols; j++) {
      cellDragOverState[i][j] = false;
    }
  }
  // Update config if component prop changes
  config.value.rows = props.component.rows;
  config.value.cols = props.component.cols;
  config.value.headersStr = props.component.headers.join(', ');
});


const applyConfiguration = () => {
  if (config.value.rows <= 0 || config.value.cols <= 0) {
    alert('Rows and columns must be positive numbers.');
    return;
  }
  canvasStore.updateTableConfiguration({
    componentId: props.component.id,
    rows: config.value.rows,
    cols: config.value.cols,
    headers: config.value.headersStr,
  });
};

const handleCellDragOver = (event, rowIndex, colIndex) => {
  event.preventDefault(); // Essential for allowing drop
  const draggedType = event.dataTransfer?.getData('text/plain');
  if (draggedType === 'Form') {
    if(event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    if (!cellDragOverState[rowIndex]) cellDragOverState[rowIndex] = reactive({});
    cellDragOverState[rowIndex][colIndex] = true;
  } else {
    if(event.dataTransfer) event.dataTransfer.dropEffect = 'none';
  }
  event.stopPropagation();
};

const handleCellDragLeave = (rowIndex, colIndex) => {
  if (cellDragOverState[rowIndex]) {
    cellDragOverState[rowIndex][colIndex] = false;
  }
};

const handleCellDrop = (event, rowIndex, colIndex) => {
  event.preventDefault();
  event.stopPropagation();
  if (cellDragOverState[rowIndex]) {
    cellDragOverState[rowIndex][colIndex] = false;
  }

  const draggedType = event.dataTransfer?.getData('text/plain');
  if (draggedType === 'Form') {
    // Check if cell is already occupied
    if (props.component.cells[rowIndex][colIndex] !== null) {
        alert('This cell is already occupied. Clear it first or drop into an empty cell.');
        console.warn(`Attempted to drop Form into occupied cell [${rowIndex}][${colIndex}] of Table ${props.component.id}`);
        return;
    }

    const newFormComponent = new FormComponentClass({ x: 0, y: 0, children: [] }); // x, y relative to cell
    canvasStore.addComponentToTableCell({
      tableId: props.component.id,
      rowIndex,
      colIndex,
      childComponent: newFormComponent,
    });
    console.log(`Form dropped into table ${props.component.id} cell [${rowIndex}][${colIndex}]`);
  } else {
    console.warn(`Invalid type '${draggedType}' dropped into table cell.`);
  }
};

</script>

<style scoped>
.table-component-wrapper {
  background-color: var(--color-background-panel);
  padding: 15px;
  border: 1px solid var(--color-border-soft);
  border-radius: 6px; /* Consistent radius */
  box-shadow: var(--box-shadow-soft);
  min-width: 350px; /* Ensure enough space for config and table */
}

.config-area {
  margin-bottom: 20px;
  padding: 15px; /* Increased padding */
  border: 1px solid var(--color-border-soft);
  border-radius: 6px;
  background-color: var(--color-background-alt); /* Slightly different background */
}

.config-area h4 {
  margin-top: 0;
  margin-bottom: 15px; /* Increased margin */
  color: var(--color-text-main);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border-soft);
  padding-bottom: 10px;
}

.config-area div {
  margin-bottom: 10px; /* Increased margin */
  display: flex; /* For better alignment of label and input */
  align-items: center;
}

.config-area label {
  display: inline-block;
  width: 200px; /* Adjusted for "Headers (comma-separated)" */
  margin-right: 10px; /* Increased margin */
  font-size: 0.9em;
  color: var(--color-text-muted);
}

.config-area input[type="number"],
.config-area input[type="text"] {
  /* Inherits global input styles */
  flex-grow: 1; /* Allow input to take remaining space */
  font-size: 0.9em;
  /* width: calc(100% - 210px); /* Removed, flex-grow handles it */
}

.config-area button {
  /* Inherits global button styles */
  margin-top: 10px; /* Space above button */
  padding: 10px 15px; /* Larger padding */
  background-color: var(--color-primary); /* Muted blue */
  color: var(--color-text-main); /* Ensure contrast or use white/dark text */
}

.config-area button:hover {
  background-color: #8ab4f7; /* Darker shade of primary */
  border-color: var(--color-primary);
}

.styled-table {
  width: 100%;
  border-collapse: separate; /* Use separate for rounded corners on cells if desired, or on table itself */
  border-spacing: 0; /* Remove spacing if using border-collapse: collapse */
  font-size: 0.9em;
  table-layout: fixed;
  border: 1px solid var(--color-border-soft); /* Border around the table */
  border-radius: 6px; /* Rounded corners for the table */
  overflow: hidden; /* To make border-radius work on table */
}

.styled-table th,
.table-cell { 
  border-bottom: 1px solid var(--color-border-soft); /* Horizontal lines */
  padding: 0; 
  text-align: left;
  vertical-align: top; 
  min-height: 50px; 
  position: relative;
}
.styled-table th:not(:last-child),
.table-cell:not(:last-child) {
  border-right: 1px solid var(--color-border-soft); /* Vertical lines */
}


.table-cell {
  padding: 6px 8px; /* Default padding for empty/text cells */
  transition: var(--transition-short);
}

.table-cell.cell-drag-over {
  background-color: var(--color-secondary); /* Pale Mint Green */
  outline: 2px dashed var(--color-primary); /* Muted Blue dashed outline */
  outline-offset: -2px; /* Offset inside the cell */
}

.styled-table th {
  background-color: var(--color-background-alt);
  font-weight: 600; /* Bolder headers */
  padding: 10px 12px; /* Increased padding for headers */
  color: var(--color-text-main);
}

.styled-table tr:last-child .table-cell {
    border-bottom: none; /* Remove bottom border for last row cells */
}


.styled-table tbody tr:nth-child(even) .table-cell:not(:has(> .form-component-area)) {
  /* background-color: var(--color-background-main); /* Slightly different for even rows, if cell is empty */
}

.empty-cell-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* Ensure placeholder takes full cell height */
  min-height: 40px; /* Match nested form min-height */
  padding: 8px;
  color: var(--color-text-muted);
  font-style: italic;
  font-size: 0.85em;
}

.unknown-cell-content {
  display: block;
  padding: 8px;
  color: var(--color-accent); /* Soft Coral for unknown */
  font-size: 0.85em;
}

.table-cell > :deep(.form-component-area) {
  margin: 0;
  border: none; 
  box-shadow: none; 
  padding: 8px; /* Consistent padding for nested forms */
  min-height: 40px; 
  background-color: transparent; /* Allow cell background to show if needed, or set explicitly */
  border-radius: 0; /* Forms inside cells might not need their own radius */
}
</style>
