<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getTaskSchemas } from "@/api";
import { userStore } from "@/services";
import ListContainer from "@/components/ListContainer.vue";

import { Modal } from 'bootstrap';
import { getEditorTools, taskEditorTools, taskTemplates, extractToolboxMeta, transformSchema } from "@/utils/index.js";



const emit = defineEmits(["schema-selected"]);
defineExpose({ openModal });



const taskSchemas = ref([]);
const toolMap = getToolMap();
const modalRef = ref(null);
let modalInstance = null;



function openModal() {
  modalInstance.show();
}

function closeModal() {
  modalInstance.hide();
}

function confirmSchema(slug) {
  emit("schema-selected", slug);
  closeModal();
}

function getToolMap() {
  const allTools = extractToolboxMeta(
      getEditorTools({
        ...taskEditorTools,
        ...taskTemplates
      })
  );
  return Object.fromEntries(allTools.map(t => [t.type, t]));
}

function transformSchemas(rawSchemas) {
  return rawSchemas.map(schema => transformSchema(schema, toolMap));
}



onMounted(async () => {
  const schemas = await getTaskSchemas(userStore.id);
  const raw = Object.entries(schemas || {}).map(([slug, schema]) => ({
    slug,
    ...schema
  }));

  taskSchemas.value = transformSchemas(raw);

  if (modalRef.value) {
    modalInstance = Modal.getOrCreateInstance(modalRef.value);
  }
});

onBeforeUnmount(() => {
  modalInstance?.dispose();
});
</script>

<template>
  <div class="modal modal-xl fade" ref="modalRef" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Vorlage auswählen</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div v-if="taskSchemas.length === 0" class="text-center py-4">
            <p>Keine Aufgaben Strukturen gefunden.</p>
            <RouterLink to="/org-admin/task/editor/schema" class="btn btn-primary">Aufgaben Struktur anlegen</RouterLink>
          </div>
          <ListContainer v-else :items="taskSchemas" type="schema" layout="grid" @schema-selected="confirmSchema" />
        </div>
      </div>
    </div>
  </div>
</template>