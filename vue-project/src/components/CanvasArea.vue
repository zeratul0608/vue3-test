<template>
  <div
    class="canvas-area"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- Placeholder is now inside the container -->
    <div class="canvas-components-container">
      <p v-if="orderedComponents.length === 0 && !isDragOver" class="placeholder-text">
        Drop components here
      </p>
      <template v-else v-for="component in orderedComponents" :key="component.id">
        <form-component-vue
          v-if="component.type === 'Form'"
          :component="component"
          class="rendered-component"
          :class="{
            'dragging-source': draggedItemId === component.id,
            'drag-over-top': dragOverTargetId === component.id && dragOverPosition === 'top',
            'drag-over-bottom': dragOverTargetId === component.id && dragOverPosition === 'bottom'
          }"
          draggable="true"
          @dragstart="handleItemDragStart(component.id, $event)"
          @dragover="handleItemDragOver(component.id, $event)"
          @dragleave="handleItemDragLeave($event)"
          @drop="handleItemDrop(component.id, $event)"
          @dragend="handleItemDragEnd($event)"
        />
        <input-component-vue
          v-else-if="component.type === 'Input'"
          :component="component"
          class="rendered-component"
          :class="{
            'dragging-source': draggedItemId === component.id,
            'drag-over-top': dragOverTargetId === component.id && dragOverPosition === 'top',
            'drag-over-bottom': dragOverTargetId === component.id && dragOverPosition === 'bottom'
          }"
          draggable="true"
          @dragstart="handleItemDragStart(component.id, $event)"
          @dragover="handleItemDragOver(component.id, $event)"
          @dragleave="handleItemDragLeave($event)"
          @drop="handleItemDrop(component.id, $event)"
          @dragend="handleItemDragEnd($event)"
        />
        <select-component-vue
          v-else-if="component.type === 'Select'"
          :component="component"
          class="rendered-component"
          :class="{
            'dragging-source': draggedItemId === component.id,
            'drag-over-top': dragOverTargetId === component.id && dragOverPosition === 'top',
            'drag-over-bottom': dragOverTargetId === component.id && dragOverPosition === 'bottom'
          }"
          draggable="true"
          @dragstart="handleItemDragStart(component.id, $event)"
          @dragover="handleItemDragOver(component.id, $event)"
          @dragleave="handleItemDragLeave($event)"
          @drop="handleItemDrop(component.id, $event)"
          @dragend="handleItemDragEnd($event)"
        />
        <table-component-vue
          v-else-if="component.type === 'Table'"
          :component="component"
          class="rendered-component"
          :class="{
            'dragging-source': draggedItemId === component.id,
            'drag-over-top': dragOverTargetId === component.id && dragOverPosition === 'top',
            'drag-over-bottom': dragOverTargetId === component.id && dragOverPosition === 'bottom'
          }"
          draggable="true"
          @dragstart="handleItemDragStart(component.id, $event)"
          @dragover="handleItemDragOver(component.id, $event)"
          @dragleave="handleItemDragLeave($event)"
          @drop="handleItemDrop(component.id, $event)"
          @dragend="handleItemDragEnd($event)"
        />
        <div
          v-else
          class="rendered-component"
          :class="{
            'dragging-source': draggedItemId === component.id,
            'drag-over-top': dragOverTargetId === component.id && dragOverPosition === 'top',
            'drag-over-bottom': dragOverTargetId === component.id && dragOverPosition === 'bottom'
          }"
          draggable="true"
          @dragstart="handleItemDragStart(component.id, $event)"
          @dragover="handleItemDragOver(component.id, $event)"
          @dragleave="handleItemDragLeave($event)"
          @drop="handleItemDrop(component.id, $event)"
          @dragend="handleItemDragEnd($event)"
        >
          Type: {{ component.type }} <br />
          ID: {{ component.id.substring(0, 8) }}... <br />
        Order: {{ component.order }} <!-- Display order instead of X, Y -->
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'; // Import computed
// NOTE: canvasStore.js and components.js were critically reverted to JS
import { useCanvasStore } from '../stores/canvasStore.js';
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
} from '../core/components.js';

const canvasStore = useCanvasStore();
const isDragOver = ref(false); // For drag over the main canvas area (for new components)

// For item reordering
const draggedItemId = ref(null);
const dragOverTargetId = ref(null);
const dragOverPosition = ref(null); // 'top' or 'bottom'

const orderedComponents = computed(() => {
  return [...canvasStore.components].sort((a, b) => a.order - b.order);
});

// Drag handlers for the main canvas (dropping new components)
const handleDragOver = (event) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'; // For new components
  }
  isDragOver.value = true;
};

const handleDragLeave = (event) => {
  isDragOver.value = false;
};

// This handleDrop is for NEW components from the menu
const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false; // Reset canvas drag-over state

  const currentTarget = event.currentTarget;
  if (!event.dataTransfer || !currentTarget) return;

  const componentType = event.dataTransfer.getData('text/plain');
  // const rect = currentTarget.getBoundingClientRect(); // Not needed for x,y anymore
  // const x = event.clientX - rect.left; // Not needed
  // const y = event.clientY - rect.top; // Not needed

  console.log(`Dropped type: ${componentType}`);

  let newComponent;
  // componentProps no longer needs x, y. Order is set in canvasStore.addComponent
  // For constructors that take { type, order, ... }, type and order are set by BaseComponent or defaults.
  // We only need to pass properties specific to the derived class if they are mandatory at creation
  // and not covered by defaults in their own constructors.
  const componentCreationProps = { type: componentType }; // Pass type for BaseComponent fallback if needed

  switch (componentType) {
    case 'Form':
      // FormComponent constructor expects { type?, order?, children? }
      // children defaults to [] in its own constructor.
      // type and order are handled by BaseComponent or by defaults if not passed.
      newComponent = new FormComponent({});
      break;
    case 'Table':
      newComponent = new TableComponent({}); // Uses defaults for rows, cols, headers
      break;
    case 'Input':
      newComponent = new InputComponent({}); // Uses defaults for label, placeholder
      break;
    case 'Select':
      newComponent = new SelectComponent({}); // Uses defaults for label, options
      break;
    default:
      console.warn(`Unknown component type dropped: ${componentType}`);
      // BaseComponent constructor expects { type?, order? }
      // type is passed, order will default in BaseComponent constructor
      newComponent = new BaseComponent(componentCreationProps);
  }

  // The addComponent action in canvasStore now sets the 'order' property.
  canvasStore.addComponent(newComponent);
  console.log('Component added to store:', canvasStore.getComponentById(newComponent.id));
};

// --- Item Reordering Drag Handlers ---
const handleItemDragStart = (componentId, event) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', componentId);
    event.dataTransfer.effectAllowed = 'move';
  }
  draggedItemId.value = componentId;
  event.target.classList.add('dragging-active'); // Optional: style the source item itself
};

const handleItemDragOver = (targetComponentId, event) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  dragOverTargetId.value = targetComponentId;

  // Determine if dragging over top or bottom half of the target item
  const targetElement = event.target.closest('.rendered-component');
  if (targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (event.clientY < midpoint) {
      dragOverPosition.value = 'top';
    } else {
      dragOverPosition.value = 'bottom';
    }
  }
};

const handleItemDragLeave = (event) => {
  // Only reset if leaving the actual target component area, not just moving within it
  const relatedTarget = event.relatedTarget;
  const currentTarget = event.currentTarget;
  if (!currentTarget.contains(relatedTarget)) {
    dragOverTargetId.value = null;
    dragOverPosition.value = null;
  }
};

const handleItemDrop = (targetComponentId, event) => {
  event.preventDefault();
  const sourceItemId = event.dataTransfer?.getData('text/plain');

  if (!sourceItemId) {
    dragCleanup();
    return;
  }

  // If dropping on itself without a clear "before" or "after" indication, treat as no-op.
  // dragOverPosition will be null if not meaningfully over top/bottom half.
  if (sourceItemId === targetComponentId && !dragOverPosition.value) {
    dragCleanup();
    return;
  }

  let currentComponents = [...canvasStore.components];
  const draggedItemIndex = currentComponents.findIndex(c => c.id === sourceItemId);

  if (draggedItemIndex === -1) {
    dragCleanup();
    return; // Should not happen if dragstart was correct
  }
  const draggedItem = currentComponents.splice(draggedItemIndex, 1)[0];

  // Find target's index in the array *after* the dragged item is removed
  let targetIndexInMutatedArray = currentComponents.findIndex(c => c.id === targetComponentId);

  if (sourceItemId === targetComponentId) {
    // Dropping on itself (its original position is now empty).
    // Re-insert based on where it was originally and the drop half.
    // `draggedItemIndex` is its original index in the full list.
    if (dragOverPosition.value === 'bottom') {
      currentComponents.splice(draggedItemIndex, 0, draggedItem); // effectively one after, as list is shorter
    } else { // 'top' or if somehow still null (shouldn't be if we got here)
      currentComponents.splice(draggedItemIndex, 0, draggedItem); // back to original spot
    }
  } else {
    if (targetIndexInMutatedArray === -1) {
      // This can happen if targetComponentId was the dragged item, which is handled by sourceItemId === targetComponentId
      // Or, if targetComponentId is somehow invalid (not expected here).
      // As a fallback, add to end or put item back. For now, put back and log.
      console.warn('Target component not found in mutated list, putting dragged item back at original end.');
      currentComponents.push(draggedItem); // Add to end as a safe fallback
    } else {
      // Dropping on a different item
      if (dragOverPosition.value === 'bottom') {
        currentComponents.splice(targetIndexInMutatedArray + 1, 0, draggedItem);
      } else { // 'top'
        currentComponents.splice(targetIndexInMutatedArray, 0, draggedItem);
      }
    }
  }

  const newlyOrderedComponents = currentComponents.map((comp, index) => {
    comp.order = index;
    return comp;
  });

  canvasStore.setComponents(newlyOrderedComponents);
  dragCleanup();
};

const handleItemDragEnd = (event) => {
  event.target.classList.remove('dragging-active'); // Optional
  dragCleanup();
};

const dragCleanup = () => {
  draggedItemId.value = null;
  dragOverTargetId.value = null;
  dragOverPosition.value = null;
};

</script>

<style scoped> /* lang="scss" removed */
.canvas-area {
  flex-grow: 1;
  background-color: var(--color-background-panel);
  border: 2px dashed var(--color-border-soft);
  border-radius: 8px;
  display: flex; /* Keep flex to make container fill space */
  /* justify-content: center; Removed, container handles its content */
  /* align-items: center; Removed, container handles its content */
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.04);
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
  user-select: none;
  /* Removed width, position, top, left, transform. Centering handled by parent flex. */
  padding: 20px; /* Add some padding so it's not too small */
}

/* New container for flow layout */
.canvas-components-container {
  display: flex;
  flex-direction: column;
  /* align-items: stretch; Default, components take full width */
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  position: relative; /* For absolute positioning of placeholder */
}
/* Styles for when canvas-components-container has items (not just placeholder) */
.canvas-components-container:not(:has(.placeholder-text:only-child)) {
  align-items: stretch; /* Default behavior when items are present */
}
/* Styles for when canvas-components-container is empty (only placeholder) */
.canvas-components-container:has(.placeholder-text:only-child) {
  align-items: center; /* Center placeholder horizontally */
  justify-content: center; /* Center placeholder vertically */
}
/* Hide placeholder if not the only child (i.e., if actual components are present) */
.canvas-components-container .placeholder-text:not(:only-child) {
  display: none;
}


/* Styling for the dynamically rendered components */
.rendered-component {
  /* position: absolute; Removed for flow layout */
  background-color: var(--color-background-alt);
  border: 1px solid var(--color-border-soft);
  padding: 10px;
  border-radius: 6px;
  box-shadow: var(--box-shadow-medium);
  font-size: 0.9em;
  cursor: grab; /* Indicate draggable items */
  transition: var(--transition-short);
  margin-bottom: 10px; /* Visual separation */
  min-height: 60px; /* Default minimum height */
  box-sizing: border-box;
  position: relative; /* For pseudo-elements or absolute positioning of indicators if needed */
}
.rendered-component:last-child {
  margin-bottom: 0;
}

.rendered-component.dragging-active { /* Optional: style for the item being dragged */
  opacity: 0.5;
}

.rendered-component.drag-over-top::before {
  content: '';
  position: absolute;
  top: -2px; /* Adjust for visibility */
  left: 0;
  right: 0;
  height: 4px; /* Thickness of the indicator line */
  background-color: var(--color-accent, #f0b8b8); /* Use accent color */
  z-index: 1; /* Ensure it's above the item's content */
}

.rendered-component.drag-over-bottom::after {
  content: '';
  position: absolute;
  bottom: -2px; /* Adjust for visibility */
  left: 0;
  right: 0;
  height: 4px; /* Thickness of the indicator line */
  background-color: var(--color-accent, #f0b8b8); /* Use accent color */
  z-index: 1; /* Ensure it's above the item's content */
}


/* Ensure components don't have excessive padding/margin if they are self-contained visual blocks */
.rendered-component > :deep(div:first-child), /* This targets the root div inside specific component's wrapper */
.rendered-component > :deep(table:first-child) { /* This targets the table inside TableComponentVue's wrapper */
  margin: 0;
}
</style>
