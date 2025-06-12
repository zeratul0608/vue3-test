<template>
  <div
    class="canvas-area"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <p v-if="canvasStore.components.length === 0 && !isDragOver" class="placeholder-text">
      Drop components here
    </p>
    <template v-for="component in canvasStore.components" :key="component.id">
      <form-component-vue
        v-if="component.type === 'Form'"
        :component="component"
        class="rendered-component"
        :style="{ left: component.x + 'px', top: component.y + 'px' }"
      />
      <input-component-vue
        v-else-if="component.type === 'Input'"
        :component="component"
        class="rendered-component"
        :style="{ left: component.x + 'px', top: component.y + 'px' }"
      />
      <select-component-vue
        v-else-if="component.type === 'Select'"
        :component="component"
        class="rendered-component"
        :style="{ left: component.x + 'px', top: component.y + 'px' }"
      />
      <table-component-vue
        v-else-if="component.type === 'Table'"
        :component="component"
        class="rendered-component"
        :style="{ left: component.x + 'px', top: component.y + 'px' }"
      />
      <div
        v-else
        class="rendered-component"
        :style="{ left: component.x + 'px', top: component.y + 'px' }"
      >
        Type: {{ component.type }} <br />
        ID: {{ component.id.substring(0, 8) }}... <br />
        X: {{ component.x }}, Y: {{ component.y }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCanvasStore, CanvasComponent } from '../stores/canvasStore.ts'; // Updated import path & import CanvasComponent type
// Import Vue components
import FormComponentVue from './FormComponent.vue';
import InputComponentVue from './InputComponent.vue';
import SelectComponentVue from './SelectComponent.vue';
import TableComponentVue from './TableComponent.vue';
// Import class definitions from core
import {
  BaseComponent,
  FormComponent,
  TableComponent,
  InputComponent,
  SelectComponent
} from '../core/components.ts'; // Updated import path

const canvasStore = useCanvasStore(); // Typed by Pinia
const isDragOver = ref<boolean>(false); // Renamed dragOverClass to isDragOver for clarity

const handleDragOver = (event: DragEvent): void => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent): void => { // event param added for consistency, though not used
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent): void => {
  event.preventDefault();
  isDragOver.value = false;

  const currentTarget = event.currentTarget as HTMLDivElement; // Type assertion
  if (!event.dataTransfer || !currentTarget) return;

  const componentType: string = event.dataTransfer.getData('text/plain');
  const rect: DOMRect = currentTarget.getBoundingClientRect();

  const x: number = event.clientX - rect.left;
  const y: number = event.clientY - rect.top;

  console.log(`Dropped type: ${componentType} at x:${x}, y:${y}`);

  let newComponent: CanvasComponent; // Use the union type
  const componentProps = { x, y };

  switch (componentType) {
    case 'Form':
      newComponent = new FormComponent({ ...componentProps, children: [] });
      break;
    case 'Table':
      newComponent = new TableComponent(componentProps);
      break;
    case 'Input':
      newComponent = new InputComponent(componentProps);
      break;
    case 'Select':
      newComponent = new SelectComponent(componentProps); // Default options are set in constructor
      break;
    default:
      console.warn(`Unknown component type dropped: ${componentType}`);
      newComponent = new BaseComponent({ type: componentType, ...componentProps });
  }

  canvasStore.addComponent(newComponent); // addComponent action expects CanvasComponent
  console.log('Component added to store:', canvasStore.getComponentById(newComponent.id));
};
</script>

<style lang="scss" scoped>
.canvas-area {
  flex-grow: 1;
  /* Height is determined by parent .right-panel which has display:flex */
  background-color: var(--color-background-panel); /* Use panel background for canvas itself */
  border: 2px dashed var(--color-border-soft);
  border-radius: 8px; /* Larger radius for a softer feel */
  /* Padding is handled by parent .right-panel or can be added if needed for content alignment */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.04); /* Softer inset shadow */
  transition: var(--transition-medium); /* Use global transition */
  position: relative;
  overflow: auto; /* Allow scrolling if content overflows */
}

.canvas-area.drag-over {
  background-color: var(--color-background-alt); /* Slightly darker for general drag over */
  border-color: var(--color-primary); /* Muted blue border */
  box-shadow: inset 0 0 10px rgba(var(--color-primary-rgb, 160, 196, 255), 0.1); /* Soft glow */
}

.placeholder-text {
  font-size: 1.3em; /* Larger placeholder text */
  color: var(--color-text-muted);
  text-align: center;
  user-select: none; /* Prevent text selection */
}

/* Styling for the dynamically rendered components */
.rendered-component {
  position: absolute;
  /*
    This class primarily handles positioning.
    Specific components (FormComponentVue, InputComponentVue, etc.) should define
    their own appearance (background, border, padding).
    A minimal default can be provided for unknown component types.
  */
  background-color: var(--color-background-alt); /* Default for unknown types */
  border: 1px solid var(--color-border-soft);
  padding: 10px;
  border-radius: 6px; /* Consistent radius */
  box-shadow: var(--box-shadow-medium); /* Consistent shadow */
  font-size: 0.9em;
  cursor: default; /* Will change to 'move' when dragging is implemented */
  transition: var(--transition-short); /* Smooth transitions for any style changes */
}

/* Ensure components don't have excessive padding/margin if they are self-contained visual blocks */
.rendered-component > :deep(div:first-child),
.rendered-component > :deep(table:first-child) {
  margin: 0; /* Reset margins if the component's root is a div/table */
}
</style>
