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
  padding: 15px;
  background-color: #f8f9fa; /* Light background for the menu */
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.component-menu h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 1.2em;
}

.component-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 10px 15px;
  margin-bottom: 8px;
  background-color: #ffffff; /* White background for items */
  border: 1px solid #dee2e6; /* Light border */
  border-radius: 4px;
  cursor: grab; /* Indicates draggable item */
  font-size: 0.95em;
  color: #495057;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.menu-item:hover {
  background-color: #e9ecef; /* Slightly darker on hover */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.menu-item:active {
  cursor: grabbing;
  background-color: #ced4da; /* Darker when grabbed */
}
</style>
