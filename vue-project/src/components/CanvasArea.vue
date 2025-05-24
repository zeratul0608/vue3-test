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
    <div
      v-for="component in canvasStore.components"
      :key="component.id"
      class="rendered-component"
      :style="{ left: component.x + 'px', top: component.y + 'px' }"
    >
      Type: {{ component.type }} <br />
      ID: {{ component.id.substring(0, 8) }}... <br />
      X: {{ component.x }}, Y: {{ component.y }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCanvasStore } from '../stores/canvasStore.js';
import { FormComponent, TableComponent, InputComponent, SelectComponent, BaseComponent } from '../core/components.js';

const canvasStore = useCanvasStore();
const isDragOver = ref(false);

const handleDragOver = (event) => {
  event.preventDefault(); // Necessary to allow dropping
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
  isDragOver.value = true;
  // console.log('Drag over canvas');
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  if (!event.dataTransfer || !event.currentTarget) return;

  const componentType = event.dataTransfer.getData('text/plain');
  const canvasRect = event.currentTarget.getBoundingClientRect();

  // Calculate drop position relative to the canvas area
  // clientX/Y are viewport coordinates. We need them relative to the target element.
  const x = event.clientX - canvasRect.left;
  const y = event.clientY - canvasRect.top;

  console.log(`Dropped type: ${componentType} at x:${x}, y:${y}`);

  let newComponent;
  const componentProps = { x, y };

  switch (componentType) {
    case 'Form':
      newComponent = new FormComponent(componentProps);
      break;
    case 'Table':
      newComponent = new TableComponent(componentProps);
      break;
    case 'Input':
      newComponent = new InputComponent(componentProps);
      break;
    case 'Select':
      newComponent = new SelectComponent(componentProps);
      break;
    default:
      console.warn(`Unknown component type dropped: ${componentType}`);
      newComponent = new BaseComponent({ type: componentType, ...componentProps }); // Fallback
      // return; // Or handle as an error / unrecognized component
  }
  
  if (newComponent) {
    canvasStore.addComponent(newComponent);
    console.log('Component added to store:', canvasStore.getComponentById(newComponent.id));
  }
};
</script>

<style scoped>
.canvas-area {
  flex-grow: 1;
  height: 100%;
  background-color: #ffffff;
  border: 2px dashed #cccccc;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
  transition: background-color 0.2s ease, border-color 0.2s ease; /* For drag over effect */
  position: relative; /* Needed for absolute positioning of children if any */
}

.canvas-area.drag-over {
  background-color: #e8f0fe; /* Light blue background when dragging over */
  border-color: #4a90e2; /* Blue border when dragging over */
}

.placeholder-text {
  font-size: 1.2em;
  color: #aaaaaa;
  text-align: center;
}

/* Styling for the dynamically rendered components */
.rendered-component {
  position: absolute;
  background-color: #a0c4ff; /* Light blue */
  border: 1px solid #6a9eda; /* Darker blue border */
  padding: 8px;
  border-radius: 4px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.15);
  font-size: 0.85em;
  white-space: nowrap; /* Prevent text wrapping for simple display */
  cursor: default; /* Later this could be 'move' */
}
</style>
