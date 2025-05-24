<template>
  <div class="component-menu">
    <h3>Component Library</h3>
    <ul>
      <li
        v-for="componentType in availableComponents"
        :key="componentType.name"
        class="menu-item"
        draggable="true"
        @dragstart="handleDragStart(componentType)"
      >
        {{ componentType.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const availableComponents = ref([
  { name: 'Form', type: 'Form' }, // 'type' can be used to map to class names if needed
  { name: 'Table', type: 'Table' },
  { name: 'Input', type: 'Input' },
  { name: 'Select', type: 'Select' },
]);

const handleDragStart = (event, componentType) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', componentType.type);
    event.dataTransfer.dropEffect = 'copy';
    console.log(`Dragging: ${componentType.name}, Type: ${componentType.type}`);
  } else {
    console.error('DataTransfer object is not available.');
  }
};
</script>

<style scoped>
.component-menu {
  /* Padding is handled by the left-panel in App.vue, or can be added if this component is used elsewhere */
  /* background-color: var(--color-background-panel); /* Already set by left-panel */
  /* border-radius: 6px; /* Consistent with global button radius */
  /* box-shadow: var(--box-shadow-soft); /* Already set by left-panel */
  flex-grow: 1; /* Allow the menu to take available space in the flex column */
}

.component-menu h3 {
  margin-top: 0; /* Reset if padding is on parent */
  margin-bottom: 12px;
  color: var(--color-text-main);
  font-size: 1.1em; /* Subtler heading size */
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border-soft);
}

.component-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 12px 18px; /* Increased padding */
  margin-bottom: 10px; /* Increased margin */
  background-color: var(--color-background-panel);
  border: 1px solid var(--color-border-soft);
  border-radius: 6px; /* Consistent radius */
  cursor: grab;
  font-size: 1em; /* Slightly larger for clarity */
  color: var(--color-text-main);
  box-shadow: var(--box-shadow-soft);
  transition: var(--transition-short); /* Use global transition */
}

.menu-item:hover {
  background-color: var(--color-background-alt);
  border-color: var(--color-primary); /* Use primary color for border on hover */
  box-shadow: var(--box-shadow-medium);
  transform: translateY(-1px); /* Subtle lift effect */
}

.menu-item:active {
  cursor: grabbing;
  background-color: var(--color-primary); /* Use primary color for active state */
  color: var(--color-background-panel); /* Ensure text is readable */
  border-color: var(--color-primary);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); /* Inner shadow for pressed effect */
  transform: translateY(0px); /* Reset lift effect */
}
</style>
