<template>
  <div class="select-component-wrapper">
    <label :for="component.id">{{ component.label }}</label>
    <select :id="component.id" class="styled-select">
      <option v-if="!component.options || component.options.length === 0" value="" disabled>
        No options defined
      </option>
      <option
        v-for="option in component.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
    <button @click="customizeOptions" class="customize-btn">Customize Options</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useCanvasStore } from '../stores/canvasStore.js';

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

const canvasStore = useCanvasStore();

const customizeOptions = () => {
  const input = prompt(
    'Enter options as value1:Text1,value2:Text2,...',
    // Pre-fill with current options for easier editing
    props.component.options.map(opt => `${opt.value}:${opt.text}`).join(',')
  );

  if (input === null) { // User cancelled
    return;
  }

  if (input.trim() === '') { // User entered empty string
    canvasStore.updateSelectOptions({
      componentId: props.component.id,
      newOptions: [],
    });
    return;
  }

  try {
    const newOptions = input.split(',').map(pairStr => {
      const parts = pairStr.split(':');
      if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
        throw new Error(`Invalid format for pair: "${pairStr}". Expected "value:text".`);
      }
      return { value: parts[0].trim(), text: parts[1].trim() };
    });

    // Call the action to update options in the store
    canvasStore.updateSelectOptions({
      componentId: props.component.id,
      newOptions: newOptions,
    });
  } catch (error) {
    alert(`Error parsing options: ${error.message}\nPlease use the format: value1:Text1,value2:Text2`);
    console.error("Error parsing options:", error);
  }
};
</script>

<style scoped>
.select-component-wrapper {
  padding: 8px 0; /* Vertical padding, horizontal handled by parent if needed */
  /* background-color: var(--color-background-panel); /* Usually transparent if nested */
  /* border-radius: 6px; */
  /* Removed explicit border and shadow, assuming it's part of .rendered-component when on canvas */
}

.select-component-wrapper label {
  display: block;
  margin-bottom: 6px; /* Increased space */
  font-size: 0.9em;
  color: var(--color-text-muted); /* Muted color for label */
  font-weight: 500;
}

.styled-select {
  /* Inherits global select styles from style.css for border, padding, radius, focus */
  width: 100%;
  box-sizing: border-box;
  font-size: 0.95em; /* Ensure it's not too small */
  margin-bottom: 10px; /* Increased space before the button */
}

.customize-btn {
  /* Inherits global button styles for basic look and feel */
  padding: 8px 12px; /* Slightly adjusted padding */
  font-size: 0.85em;
  color: var(--color-text-main);
  background-color: var(--color-background-alt); /* Softer background */
  border: 1px solid var(--color-border-soft); /* Match global button border */
  align-self: flex-start;
}

.customize-btn:hover {
  background-color: var(--color-secondary); /* Pale Mint Green on hover */
  border-color: var(--color-secondary);
  color: var(--color-text-main); /* Ensure text remains readable */
}

/* Global styles in style.css already handle :focus for selects and buttons */
</style>
