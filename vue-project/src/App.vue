<script setup>
import { ref } from 'vue';
import ComponentMenu from './components/ComponentMenu.vue';
import CanvasArea from './components/CanvasArea.vue';
import { useCanvasStore } from './stores/canvasStore.js';

const canvasStore = useCanvasStore();
const showJsonOutput = ref(false);
const jsonOutput = ref('');

const exportToJson = () => {
  const componentsJson = JSON.stringify(canvasStore.components, null, 2);
  jsonOutput.value = componentsJson;
  showJsonOutput.value = true;
  console.log(componentsJson); // Log to console as requested
};

const closeJsonOutput = () => {
  showJsonOutput.value = false;
  jsonOutput.value = '';
};
</script>

<template>
  <div class="app-container">
    <div class="left-panel">
      <div class="export-controls">
        <button @click="exportToJson" class="export-button">Export to JSON</button>
      </div>
      <component-menu />
    </div>
    <div class="right-panel">
      <canvas-area />
      <div v-if="showJsonOutput" class="json-output-modal">
        <div class="json-output-content">
          <button @click="closeJsonOutput" class="close-json-button">Close</button>
          <h3>Generated JSON Output:</h3>
          <textarea readonly class="json-textarea">{{ jsonOutput }}</textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* :global styles for html, body, #app are now in style.css */

.app-container {
  display: flex;
  height: 100vh; /* Use vh for full viewport height */
  background-color: var(--color-background-main);
}

.left-panel {
  width: 260px; /* Slightly wider for better spacing */
  background-color: var(--color-background-panel);
  border-right: 1px solid var(--color-border-soft);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 10px; /* Added padding to the panel itself */
  box-shadow: var(--box-shadow-soft);
}

.export-controls {
  padding: 10px 0; /* Adjusted padding */
  margin-bottom: 10px; /* Space below the button area */
  border-bottom: 1px solid var(--color-border-soft);
}

.export-button {
  /* Inherits global button styles, customize if needed */
  background-color: var(--color-secondary); /* Pale Mint Green */
  color: var(--color-text-main);
  width: 100%;
  padding: 10px 15px; /* Larger padding */
  font-size: 1em;
}

.export-button:hover {
  background-color: #a8d5c9; /* Slightly darker mint */
  border-color: var(--color-secondary);
}

.right-panel {
  flex-grow: 1;
  background-color: var(--color-background-alt); /* Slightly darker off-white */
  display: flex;
  position: relative; 
  padding: 15px; /* Added padding */
}

.json-output-modal {
  position: fixed; /* Use fixed to ensure it covers viewport */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(52, 58, 64, 0.6); /* Darker overlay, using var(--color-text-main) with alpha */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px; /* Padding for smaller screens */
}

.json-output-content {
  background-color: var(--color-background-panel);
  padding: 25px;
  border-radius: 8px; /* Consistent with global button radius */
  box-shadow: var(--box-shadow-medium);
  width: 80%;
  max-width: 700px;
  max-height: 80vh; /* Max height relative to viewport */
  display: flex;
  flex-direction: column;
}

.json-output-content h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--color-text-main);
}

.json-textarea {
  /* Inherits global input styles */
  flex-grow: 1;
  font-family: var(--font-family-monospace);
  font-size: 0.9em;
  resize: vertical; /* Allow vertical resize */
  background-color: var(--color-background-main); /* Light background for textarea */
  min-height: 200px; /* Ensure a minimum usable height */
}

.close-json-button {
  /* Inherits global button styles */
  align-self: flex-end;
  margin-top: 15px; /* Switched from margin-bottom */
  background-color: var(--color-accent); /* Soft Coral */
  color: var(--color-text-main); /* Ensure contrast */
}

.close-json-button:hover {
  background-color: #e8a0a0; /* Darker coral */
  border-color: var(--color-accent);
}
</style>
/* Global styles for html, body, and #app are in style.css */
</style>
