<template>
  <div class="input-component-wrapper">
    <label :for="component.id">{{ component.label }}</label>
    <input
      type="text"
      :id="component.id"
      :placeholder="component.placeholder"
      class="styled-input"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.input-component-wrapper {
  padding: 8px 0; /* Vertical padding, horizontal handled by parent if needed */
  /* background-color: var(--color-background-panel); /* Usually transparent if nested */
  /* border-radius: 6px; /* Consistent radius */
}

.input-component-wrapper label {
  display: block;
  margin-bottom: 6px; /* Increased space */
  font-size: 0.9em;
  color: var(--color-text-muted); /* Muted color for label */
  font-weight: 500; /* Slightly bolder label */
}

.styled-input {
  /* Inherits global input styles from style.css for border, padding, radius, focus */
  width: 100%;
  box-sizing: border-box;
  font-size: 0.95em; /* Ensure it's not too small */
}

/* Global styles in style.css already handle :focus for inputs */
</style>
