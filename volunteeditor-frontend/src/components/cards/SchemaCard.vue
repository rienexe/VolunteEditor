<script setup>
import { computed } from "vue";



const emit = defineEmits(["schema-selected"]);
const props = defineProps({
  schema: {
    type: Object,
    required: true
  }
});

const schemaTitle = computed(() => props.schema?.meta?.title || "Kein Titel");
const mainTools = computed(() => props.schema?.blockContent?.main?.blocks || []);
const sidebarTools = computed(() => props.schema?.blockContent?.sidebar?.blocks || []);
const showSidebar = computed(() => sidebarTools.value.length > 0);

const MAX_VISIBLE = 5;

const visibleMainTools = computed(() => mainTools.value.slice(0, MAX_VISIBLE));
const hiddenMainTools = computed(() => mainTools.value.length - MAX_VISIBLE);
const visibleSidebarTools = computed(() => sidebarTools.value.slice(0, MAX_VISIBLE));
const hiddenSidebarTools = computed(() => sidebarTools.value.length - MAX_VISIBLE);
</script>

<template>
  <div class="card h-100">
    <div class="card-body">
      <h5>{{ schemaTitle }}</h5>
      <div class="d-flex flex-row flex-wrap gap-2">
        <div class="w-100">
          <div class="fw-bold small">Seite</div>
          <div class="d-flex flex-wrap gap-1 shadow-sm rounded p-1">
            <template v-for="tool in visibleMainTools" :key="tool.id">
              <span class="badge text-bg-light" v-html="tool.icon + ' ' + tool.name"></span>
            </template>
            <span v-if="hiddenMainTools > 0" class="badge text-bg-secondary">
              +{{ hiddenMainTools }} mehr
            </span>
            <span v-if="!mainTools.length" class="text-muted small">
              Keine Blöcke
            </span>
          </div>
        </div>
        <div v-if="showSidebar" class="w-100">
          <div class="fw-bold small">Seitenleiste</div>
          <div class="d-flex flex-wrap gap-1 shadow-sm rounded p-1">
            <template v-for="tool in visibleSidebarTools" :key="tool.id">
              <span class="badge text-bg-light" v-html="tool.icon + ' ' + tool.name"></span>
            </template>
            <span v-if="hiddenSidebarTools > 0" class="badge text-bg-secondary">
              +{{ hiddenSidebarTools }} mehr
            </span>
            <span v-if="!sidebarTools.length" class="text-muted small">
              Keine Blöcke
            </span>
          </div>
        </div>
      </div>
      <div class="d-flex flex-row gap-2 mt-3">
        <slot name="editButton" :schema="schema">
          <button class="btn btn-primary w-100 stretched-link" @click="emit('schema-selected', schema.slug)">Struktur wählen</button>
        </slot>
      </div>
    </div>
  </div>
</template>
