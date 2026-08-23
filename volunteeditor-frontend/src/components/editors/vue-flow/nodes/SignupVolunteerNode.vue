<script setup>
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
</script>

<template>
  <BaseNode :id="id" :data="data">
    <span class="fw-bold">{{ data.label }}</span>
  </BaseNode>
</template>