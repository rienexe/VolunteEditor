<script setup>
import { computed } from "vue";



const props = defineProps({
  workflow: {
    type: Object,
    required: true
  }
});

const workflowTitle = computed(() => props.workflow?.title || "Kein Titel");
const nodes = computed(() => props.workflow?.description || []);

const MAX_VISIBLE = 5;

const visibleNodes = computed(() => nodes.value.slice(0, MAX_VISIBLE));
const hiddenNodes = computed(() => Math.max(0, nodes.value.length - MAX_VISIBLE));
</script>

<template>
  <div class="card h-100">
    <div class="card-body">
      <h5>{{ workflowTitle }}</h5>
      <div class="fw-bold small mb-1">Schritte</div>
      <div class="d-flex flex-column gap-1 shadow-sm rounded p-1">
        <div class="w-100">
          <template v-for="node in visibleNodes" :key="node.id">
            <span class="badge text-bg-light">
              {{ node.data?.label || node.type }}
            </span>
          </template>
          <span v-if="hiddenNodes > 0" class="badge text-bg-secondary align-self-start">
            +{{ hiddenNodes }} mehr
          </span>
          <span v-if="!nodes.length" class="text-muted small">
              Keine Schritte definiert
            </span>
        </div>
      </div>
      <div class="d-flex flex-row gap-2 mt-3">
        <slot name="editButton" :workflow="workflow"></slot>
      </div>
    </div>
  </div>
</template>