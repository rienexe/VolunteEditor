<script setup>
import draggable from "vuedraggable";



defineProps({
  element: Array,
  onAddVolunteer: Function,
});
</script>

<template>
  <draggable
      class="list-group list-group-flush"
      style="min-height: 40px; background-color: var(--bs-gray-300)"
      :list="element"
      :group="{ name: 'volunteers', pull: true, put: true }"
      @add="evt => onAddVolunteer(evt, element)"
      item-key="id"
  >
    <template #item="{ element }">
      <div class="list-group-item list-group-item-action list-group-item-light">
        {{ element.name }}

        <volunteer-item v-if="element.children" :element="element.children" :onAddVolunteer="onAddVolunteer" />
      </div>
    </template>
  </draggable>
</template>

<style scoped>
.list-group-item {
  cursor: grab;
}

.list-group-item:active {
  cursor: grabbing;
}
</style>