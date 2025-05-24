<template>
  <div>
    <p>Count: {{ counterStore.count }}</p>
    <el-button type="primary" @click="counterStore.increment">Increment</el-button>
  </div>
</template>

<script setup>
import { defineStore } from 'pinia';

// Define the counter store
const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    },
  },
});

// Use the counter store
const counterStore = useCounterStore();
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
