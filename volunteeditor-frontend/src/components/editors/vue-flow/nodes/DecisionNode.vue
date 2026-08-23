<script setup>
import { useVueFlow, Handle, Position } from "@vue-flow/core";

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
  })
}
</script>

<template>
  <BaseNode :id="id" :data="data" :show-source-handle="false" settings settingsTitle="Bedingung">
    <span class="fw-bold">{{ data.label }}</span>
    <template #settings>
      <input class="form-control" :value="data.decision" @input="updateData('decision', $event.target.value)" placeholder="Bedingung eingeben...">
      <div class="d-flex flex-row align-items-center gap-3 mt-3">
        <input class="form-control border-success" :value="data.option1" @input="updateData('option1', $event.target.value)" placeholder="Option 1...">
        <input class="form-control border-danger" :value="data.option2" @input="updateData('option2', $event.target.value)" placeholder="Option 2...">
      </div>
    </template>

    <Handle
        id="true"
        type="source"
        class="bg-success"
        :position="Position.Bottom"
        :style="{
        left: '30%',
      }"
    />

    <Handle
        id="false"
        type="source"
        class="bg-danger"
        :position="Position.Bottom"
        :style="{
        left: '70%',
      }"
    />
  </BaseNode>
</template>