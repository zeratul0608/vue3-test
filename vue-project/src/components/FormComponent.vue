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

<script setup>
import { defineProps, ref } from 'vue';
import { useCanvasStore } from '../stores/canvasStore.js';
import { InputComponent, SelectComponent } from '../core/components.js'; // These are the CLASS definitions
import InputComponentVue from './InputComponent.vue'; // This is the VUE component
import SelectComponentVue from './SelectComponent.vue'; // This is the VUE component

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

const canvasStore = useCanvasStore();
const isDragOverForm = ref(false);

const handleDragOverForm = (event) => {
  event.preventDefault();
  // Check if the dragged item is suitable (Input or Select)
  const draggedType = event.dataTransfer?.getData('text/plain');
  if (draggedType === 'Input' || draggedType === 'Select') {
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
    }
    isDragOverForm.value = true;
    event.stopPropagation(); // Prevent CanvasArea from reacting
  } else {
     if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'none'; // Indicate not a valid drop target
    }
  }
};

const handleDragLeaveForm = () => {
  isDragOverForm.value = false;
};

const handleDropInForm = (event) => {
  event.preventDefault();
  event.stopPropagation(); // Crucial: Stop event from bubbling to CanvasArea
  isDragOverForm.value = false;

  if (!event.dataTransfer) return;

  const componentType = event.dataTransfer.getData('text/plain');
  
  // We don't need to calculate x/y relative to this component for now,
  // as child components' positions within the form might be handled by layout flow or fixed later.
  // For now, they are just added to the children array.
  
  let newChildComponent;
  const childProps = { 
    // x and y are relative to the parent Form, can be set to 0 or managed by layout later
    x: 0, 
    y: 0 
  }; 

  switch (componentType) {
    case 'Input':
      newChildComponent = new InputComponent({ ...childProps, label: 'New Input' });
      break;
    case 'Select':
      newChildComponent = new SelectComponent({ ...childProps, label: 'New Select', options: [{value: '1', text: 'Option 1'}] });
      break;
    default:
      console.warn(`Invalid component type '${componentType}' dropped into FormComponent.`);
      return; // Do not add if not Input or Select
  }

  if (newChildComponent) {
    canvasStore.addChildToComponent({
      parentId: props.component.id,
      childComponent: newChildComponent,
    });
    console.log(`Dropped ${componentType} into Form ${props.component.id}. Child added:`, newChildComponent);
  }
};
</script>

<style scoped>
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
