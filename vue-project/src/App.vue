<script setup>
import ComponentMenu from './components/ComponentMenu.vue';
import CanvasArea from './components/CanvasArea.vue';
</script>

<template>
  <div class="app-container">
    <div class="left-panel">
      <component-menu />
    </div>
    <div class="right-panel">
      <canvas-area />
    </div>
  </div>
</template>

<style scoped>
/* Ensure #app takes full height for the layout to work correctly */
/* It's generally better to set this in a global style (e.g., main.css or index.css) 
   but can be here if #app is unique to this component's template, which it isn't.
   Assuming #app is the mount point in index.html and has height: 100% from a global style.
*/
:global(html), :global(body), :global(#app) {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  height: 100%;
}

.left-panel {
  width: 250px; /* Adjusted width for ComponentMenu */
  background-color: #f0f0f0;
  /* padding: 10px; */ /* Padding is now handled by ComponentMenu */
  border-right: 1px solid #ccc;
  overflow-y: auto; /* In case menu items exceed height */
}

.right-panel {
  flex-grow: 1;
  background-color: #e0e0e0;
  /* padding: 10px; */ /* Padding is now handled by CanvasArea */
  display: flex; /* To allow CanvasArea to grow */
}
</style>
/* Global styles for html, body, and #app are above using :global() */
/* Styles for app-container, left-panel, and right-panel are defined above */
</style>
