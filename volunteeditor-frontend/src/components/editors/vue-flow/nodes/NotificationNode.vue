<script setup>
import { useVueFlow } from '@vue-flow/core';

import BaseNode from "@/components/editors/vue-flow/BaseNode.vue";



const props = defineProps({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
});

const { updateNodeData } = useVueFlow();



function updateData(key, value) {
  updateNodeData(props.id, {
    [key]: value
  });
}
</script>

<template>
  <BaseNode :id="id" :data="data" settings settingsTitle="Nachricht">
    <span class="fw-bold">{{ data.label }}</span>
    <template #settings>
      <div class="d-flex flex-row align-items-center gap-3 mb-2">
        <label class="col-form-label fw-normal">An: </label>
        <select
            class="form-select form-select-sm fw-normal"
            :value="data.recipient"
            @change="updateData('recipient', $event.target.value)"
        >
          <option value="volunteer">Freiwillige:r</option>
          <option value="organisation">Organisation</option>
        </select>
      </div>
      <textarea
          class="form-control form-control-sm"
          style="font-size: 12px"
          :value="data.message"
          @input="updateData('message', $event.target.value)"
          placeholder="Nachricht eingeben..."
          rows="3"
      />
    </template>
  </BaseNode>
</template>

<style scoped>
.form-select, .form-control {
  font-size: unset;
}
</style>
