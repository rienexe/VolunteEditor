<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";
import { Handle, Position } from '@vue-flow/core';

import NodeToolbar from './NodeToolbar.vue';



const props = defineProps({
  id: String,
  data: Object,
  settings: {
    type: Boolean,
    default: false
  },
  settingsTitle: {
    type: String,
    default: "Optionen"
  },
  showSourceHandle: {
    type: Boolean,
    default: true
  }
});
const accordionId = `accordion-${props.id}`;
const isOpen = ref(false);

let collapseEl;



onMounted(() => {
  collapseEl = document.getElementById(accordionId);

  if (collapseEl) {
    collapseEl.addEventListener('show.bs.collapse', () => isOpen.value = true);
    collapseEl.addEventListener('hide.bs.collapse', () => isOpen.value = false);
  }
});

onBeforeUnmount(() => {
  if (collapseEl) {
    collapseEl.removeEventListener('show.bs.collapse', () => isOpen.value = true);
    collapseEl.removeEventListener('hide.bs.collapse', () => isOpen.value = false);
  }
});
</script>

<template>
  <div class="vue-flow__node-default" :style="isOpen ? { width: 'var(--vf-node-max-width)' } : {}">
    <Handle type="target" :position="Position.Top" />
    <NodeToolbar
        :node-id="id"
        :node-data="data"
    />
    <slot />
    <div v-if="settings" class="vue-flow__node-inside">
      <div class="accordion accordion-flush mt-1">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
                class="accordion-button collapsed p-0"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#' + accordionId"
                style="font-size:12px"
            >
              {{ settingsTitle }}
            </button>
          </h2>
          <div :id="accordionId" class="accordion-collapse collapse">
            <div class="accordion-body px-0 pt-1 pb-0">
              <slot name="settings" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Handle v-if="showSourceHandle" type="source" :position="Position.Bottom" />  </div>
</template>

<style scoped>
.accordion-item,
.accordion-button {
  background-color: transparent;
}

.accordion-button:not(.collapsed) {
  box-shadow: none;
  color: inherit;
}
</style>