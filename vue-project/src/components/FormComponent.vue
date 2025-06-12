<template>
  <div
    class="form-component-area"
    :class="{ 'drag-over-form': isDragOverForm }"
    @dragover.prevent="handleDragOverForm"
    @dragleave="handleDragLeaveForm"
    @drop.prevent="handleDropInForm"
  >
    <p v-if="!component.children || component.children.length === 0" class="placeholder-text-form">
      Form Area (Drop Input/Select here)
    </p>
    <div v-else class="children-container">
      <template v-for="child in component.children" :key="child.id">
        <input-component-vue v-if="child.type === 'Input'" :component="child" />
        <select-component-vue v-else-if="child.type === 'Select'" :component="child" />
        <!-- Fallback for other types if any, or simply don't render -->
        <div v-else class="child-item-unknown">
          Unknown child type: {{ child.type }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useCanvasStore } from '../stores/canvasStore.ts'; // Updated import path
import {
  InputComponent as InputComponentClass,
  SelectComponent as SelectComponentClass,
  type FormComponentData, // Using type for interface import
  type FormChildComponent // This is InputComponentData | SelectComponentData from core/components if using data interfaces, or InputComponentClass | SelectComponentClass
} from '../core/components.ts'; // Updated import path

// Import Vue components for rendering
import InputComponentVue from './InputComponent.vue';
import SelectComponentVue from './SelectComponent.vue';

// Define Props interface
interface Props {
  component: FormComponentData; // Use the imported FormComponentData interface
}
const props = defineProps<Props>();

const canvasStore = useCanvasStore();
const isDragOverForm = ref<boolean>(false);

const handleDragOverForm = (event: DragEvent): void => {
  event.preventDefault();
  const draggedType = event.dataTransfer?.getData('text/plain');
  if (draggedType === 'Input' || draggedType === 'Select') {
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    isDragOverForm.value = true;
    event.stopPropagation();
  } else {
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'none';
    }
  }
};

const handleDragLeaveForm = (): void => { // Added return type
  isDragOverForm.value = false;
};

const handleDropInForm = (event: DragEvent): void => {
  event.preventDefault();
  event.stopPropagation();
  isDragOverForm.value = false;

  if (!event.dataTransfer) return;

  const componentType: string = event.dataTransfer.getData('text/plain');

  // newChildComponent will be an instance of InputComponentClass or SelectComponentClass
  let newChildComponent: FormChildComponent | undefined;
  const childProps = { x: 0, y: 0 };

  switch (componentType) {
    case 'Input':
      newChildComponent = new InputComponentClass({ ...childProps, label: 'New Input' });
      break;
    case 'Select':
      // Default options are handled by SelectComponentClass constructor
      newChildComponent = new SelectComponentClass({ ...childProps, label: 'New Select' });
      break;
    default:
      console.warn(`Invalid component type '${componentType}' dropped into FormComponent.`);
      return;
  }

  // No need to check newChildComponent for undefined here because the default case in switch returns.
  // However, TypeScript might still think it could be undefined if not all paths assign.
  // The return in default case handles this.
  canvasStore.addChildToComponent({
    parentId: props.component.id,
    childComponent: newChildComponent, // Type is FormChildComponent (InputComponentClass | SelectComponentClass)
  });
  console.log(`Dropped ${componentType} into Form ${props.component.id}. Child added:`, newChildComponent);
};
</script>

<style lang="scss" scoped>
.form-component-area {
  border: 2px dashed var(--color-border-soft);
  padding: 20px; /* Increased padding */
  min-height: 120px;
  background-color: var(--color-background-panel); /* Use panel background */
  border-radius: 6px; /* Consistent radius */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Stretch children to fill width */
  justify-content: flex-start; /* Align children to the top */
  box-shadow: var(--box-shadow-soft); /* Add soft shadow if rendered on canvas */
  transition: var(--transition-medium);
}

/* If this component is part of .rendered-component, some styles might be redundant */
/* Consider how it looks when nested in TableComponent vs. directly on CanvasArea */
:global(.rendered-component) > .form-component-area {
  /* Overrides for when FormComponent is a direct child of .rendered-component on canvas */
  /* Example: remove redundant shadow if .rendered-component already has one */
   box-shadow: none;
}
/* Styles for when FormComponent is nested inside a Table cell */
:global(.table-cell) > .form-component-area {
  border-style: solid; /* Solid border when nested in table for clarity */
  border-color: var(--color-border-soft);
  box-shadow: none;
  padding: 10px; /* Reduced padding when nested */
  min-height: auto; /* Auto height when nested */
}


.form-component-area.drag-over-form {
  background-color: var(--color-secondary); /* Pale Mint Green for valid drag over */
  border-color: var(--color-primary); /* Muted Blue border */
}

.placeholder-text-form {
  font-size: 0.95em;
  color: var(--color-text-muted);
  text-align: center;
  padding: 10px 0; /* Add padding to placeholder */
  flex-grow: 1; /* Allow placeholder to take space if container is flex */
  display: flex;
  align-items: center;
  justify-content: center;
}

.children-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px; /* Increased gap */
}

.child-item-unknown {
  background-color: var(--color-accent); /* Soft Coral for unknown items */
  color: var(--color-text-main); /* Ensure contrast */
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9em;
  border: 1px solid var(--color-accent);
}
</style>
