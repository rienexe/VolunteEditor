<script setup>
import { Handle, Position } from '@vue-flow/core'

import NodeToolbar from "../NodeToolbar.vue";



const props = defineProps({
  id: String,
  data: Object
})
</script>

<template>
  <div class="vue-flow__node-input">
    <span class="fw-bold">{{ data.label }}</span>

    <NodeToolbar
        :node-id="id"
        :node-data="data"
    />

    <Handle type="source" :position="Position.Right" />
  </div>
</template>