<script setup>
import { ref, defineModel, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTask, getTaskSchema, patchTaskBlockContent, postTaskSchema } from "@/api";
import { toastStore, userStore } from "@/services";
import { getEditorTools, taskEditorTools, taskTemplates, extractToolboxMeta } from "@/utils";

import slugify from 'slugify';
import draggable from 'vuedraggable';



const route = useRoute();
const router = useRouter();
const slug = ref(route.params.slug || null);
const source = ref(route.query.source || null);
const schemaName = ref('');
const showSidebar = defineModel();

const taskBlockTools = ref([]);
const templates = ref([]);
const blockTools = ref([]);
const mainSchema = ref([]);
const sidebarSchema = ref([]);



async function convertToSchema(allTools, taskData) {
  return taskData.map(block => {
    const toolMeta = allTools.find(t => t.id === block.type) || {};

    return {
      id: block.id,
      icon: toolMeta.icon ?? null,
      name: toolMeta.name ?? block.type,
      type: block.type,
      data: block.data ?? {},
      config: block.config ?? {},
    };
  });
}

function buildEditorOutput(schema) {
  return {
    time: Date.now(),
    blocks: schema.map((block, index) => ({
      id: block.id ?? `${block.type}-${index}`,
      type: block.type,
      data: block.data,
      config: block.config
    }))
  };
}

function cloneBlockTool(tool) {
  return {
    id: `${tool.id}-${Date.now()}`,
    name: tool.name,
    icon: tool.icon,
    type: tool.id
  };
}

function removeAt(list, index) {
  list.splice(index, 1);
}

async function saveAsTask() {
  if (!mainSchema.value.length || (showSidebar.value && !sidebarSchema.value.length)) {
    toastStore.addToast('Zumindest ein Bereich enthält noch keine Blöcke', 'warning');
    return;
  }

  const main = buildEditorOutput(mainSchema.value);
  const sidebar = showSidebar.value ? buildEditorOutput(sidebarSchema.value) : { blocks: [] };

  const result = await patchTaskBlockContent(slug.value, { main, sidebar });

  if (result?.success) {
    slug.value = result.slug;
    await router.replace({ name: 'TaskEditor', params: { slug: slug.value }});
    toastStore.addToast("Vorlage erfolgreich gespeichert", "success")
  } else {
    toastStore.addToast("Speichern fehlgeschlagen", "danger")
  }
}

async function saveAsSchema() {
  const title = schemaName.value;

  if (!title) {
    toastStore.addToast('Bitte fügen Sie der Aufgabenstruktur einen Titel hinzu', 'warning');
    return;
  }

  const newSlug = slugify(title, { lower: true, strict: true, locale: 'de' });

  if (!mainSchema.value.length || (showSidebar.value && !sidebarSchema.value.length)) {
    toastStore.addToast('Zumindest ein Bereich enthält noch keine Blöcke', 'warning');
    return;
  }

  const main = buildEditorOutput(mainSchema.value);
  const sidebar = showSidebar.value ? buildEditorOutput(sidebarSchema.value) : { blocks: [] };

  const payload = {
    slug: slug.value,
    newSlug,
    changeSlug: slug.value !== newSlug,
    meta: { title, orgId: userStore.id },
    blockContent: { main, sidebar }
  };

  const result = await postTaskSchema(slug.value, payload);

  if (result?.success) {
    slug.value = result.slug;
    await router.replace({ name: 'TaskSchemaEditor', params: { slug: slug.value }});
    toastStore.addToast("Schema erfolgreich gespeichert", "success")
  } else {
    toastStore.addToast("Speichern fehlgeschlagen", "danger")
  }
}



onMounted(async () => {
  taskBlockTools.value = extractToolboxMeta(taskEditorTools);
  templates.value = extractToolboxMeta(taskTemplates);
  blockTools.value = extractToolboxMeta(getEditorTools()).filter(
      tool => !['underline', 'marker'].includes(tool.id)
  );
  const allTools = [...taskBlockTools.value, ...templates.value, ...blockTools.value];
  let taskData;

  if (source.value === "task") {
    taskData = await getTask(slug.value);
  } else {
    taskData = await getTaskSchema(slug.value);
  }

  mainSchema.value = await convertToSchema(allTools, taskData?.blockContent?.main?.blocks || []);
  sidebarSchema.value = await convertToSchema(allTools, taskData?.blockContent?.sidebar?.blocks || []);
  schemaName.value = taskData?.meta?.title ?? slug.value;
  showSidebar.value = sidebarSchema.value.length > 0;
});
</script>

<template>
  <section class="container my-5" style="min-height: 80vh">
    <div class="d-flex flex-row justify-content-between mb-3">
      <div class="d-flex flex-row align-items-center gap-3">
        <label for="schemaName" class="form-label text-nowrap">Name der Vorlage</label>
        <input v-model="schemaName" type="text" class="form-control" id="schemaName">
        <div class="form-check form-switch ms-3">
          <input v-model="showSidebar" class="form-check-input" type="checkbox" role="switch">
          <label class="form-check-label">Seitenleiste</label>
        </div>
      </div>
      <div class="d-flex flex-row align-items-center gap-2">
        <button class="btn btn-primary" @click="saveAsSchema">Als Vorlage speichern</button>
        <button v-if="source === 'task'" class="btn btn-primary" @click="saveAsTask">Aufgabe direkt speichern</button>
      </div>
    </div>

    <div class="row m-0">
      <div class="col-3 bg-primary-subtle text-light rounded-start-3 p-0">
        <div class="lead text-bg-primary rounded-start-3 p-2 mb-3">Block Tools</div>
        <div class="px-3 mb-3">
          <div class="fw-bold mb-1">Aufgaben spezifische Tools</div>
          <draggable
              class="list-group list-group-flush"
              :list="taskBlockTools"
              :group="{ name: 'blockTools', pull: 'clone', put: false }"
              :clone="cloneBlockTool"
              :sort="false"
              item-key="id"
          >
            <template #item="{ element }">
              <div class="list-group-item list-group-item-action list-group-item-light">
                <span v-html="element.icon" class="d-inline-block me-2" style="width: 24px"></span>{{ element.name }}
              </div>
            </template>
          </draggable>
        </div>
        <div class="px-3 mb-3">
          <div class="fw-bold mb-1">Vorlagen</div>
          <draggable
              class="list-group list-group-flush"
              :list="templates"
              :group="{ name: 'blockTools', pull: 'clone', put: false }"
              :clone="cloneBlockTool"
              :sort="false"
              item-key="id"
          >
            <template #item="{ element }">
              <div class="list-group-item list-group-item-action list-group-item-light">
                <span v-html="element.icon" class="d-inline-block me-2" style="width: 24px"></span>{{ element.name }}
              </div>
            </template>
          </draggable>
        </div>
        <div class="px-3 mb-5">
          <div class="fw-bold mb-1">Standard Tools</div>
          <draggable
              class="list-group list-group-flush"
              :list="blockTools"
              :group="{ name: 'blockTools', pull: 'clone', put: false }"
              :clone="cloneBlockTool"
              :sort="false"
              item-key="id"
          >
            <template #item="{ element }">
              <div class="list-group-item list-group-item-action list-group-item-light">
                <span v-html="element.icon" class="d-inline-block me-2" style="width: 24px"></span>{{ element.name }}
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="col-9 border border-3 border-dark p-0">
          <div class="row g-3 p-3 vh-100">
            <div :class="showSidebar ? 'col-lg-8 col-12 order-lg-1 order-2' : 'col-12'">
              <div class="fw-bold">Seiten-Oberfläche</div>
              <draggable
                  class="item-container list-group list-group-flush shadow"
                  style="min-height: 40px"
                  :list="mainSchema"
                  group="blockTools"
                  item-key="id"
              >
                <template #item="{ element, index }">
                  <div class="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-items-center">
                    <div>
                      <span v-html="element.icon" class="d-inline-block me-2" style="width: 24px"></span>
                      {{ element.name }}
                    </div>
                    <a class="link-danger link-underline-opacity-0" href="#" @click="removeAt(mainSchema, index)">
                      <i class="bi bi-x"></i>
                    </a>
                  </div>
                </template>
              </draggable>
            </div>
            <div v-show="showSidebar" class="col-lg-4 col-12 order-lg-2 order-1">
              <div class="fw-bold">Seitenleiste</div>
              <draggable
                  class="item-container list-group list-group-flush shadow"
                  style="min-height: 40px"
                  :list="sidebarSchema"
                  group="blockTools"
                  item-key="id"
              >
                <template #item="{ element, index }">
                  <div class="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-items-center">
                    <div>
                      <span v-html="element.icon" class="d-inline-block me-2" style="width: 24px"></span>
                      {{ element.name }}
                    </div>
                    <a class="link-danger link-underline-opacity-0" href="#" @click="removeAt(sidebarSchema, index)">
                      <i class="bi bi-x"></i>
                    </a>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </div>
    </div>
  </section>
</template>

<style scoped>
.list-group-item {
  cursor: grab;
}

.list-group-item:active {
  cursor: grabbing;
}
</style>