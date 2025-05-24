import { defineStore } from 'pinia';

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    /** @type {import('../core/components.js').BaseComponent[]} */
    components: [],
  }),
  actions: {
    addComponent(component) {
      // Ensure the component has an ID, though our classes should handle this.
      if (!component.id) {
        console.error('Component added without an ID:', component);
        // Potentially generate an ID here if robust handling is needed
        // component.id = generateId(); // Assuming generateId is available or imported
      }
      this.components.push(component);
    },
    updateComponentPosition({ id, x, y }) {
      const component = this.components.find(comp => comp.id === id);
      if (component) {
        component.x = x;
        component.y = y;
      } else {
        console.warn(`Component with ID ${id} not found for position update.`);
      }
    },
    // Example of another action that might be useful:
    // removeComponent(id) {
    //   this.components = this.components.filter(comp => comp.id !== id);
    // }
  },
  getters: {
    getComponentById: (state) => {
      return (id) => state.components.find(comp => comp.id === id);
    },
    // Example of another getter:
    // allComponents: (state) => state.components,
  },
});
