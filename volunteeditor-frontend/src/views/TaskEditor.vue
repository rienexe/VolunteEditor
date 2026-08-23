<script setup>
import { ref, defineModel, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toastStore, userStore } from "@/services";
import { getEditorTools, taskEditorTools, editorJsI18nDE, validateEditorBlocks, taskTemplates } from "@/utils";
import { getOrganisation, getTask, getTaskSchema, postTask } from "@/api";

import slugify from 'slugify';
import EditorJS from '@editorjs/editorjs';
import TaskSchemasModal from "@/components/modals/TaskSchemasModal.vue";



const route = useRoute();
const router = useRouter();
const slug = ref(route.params.slug || null);
const taskTitle = ref('');

const editorMain = ref(null);
const editorSidebar = ref(null);
const showSidebar = defineModel();
const taskSchemasModalRef = ref(null);

const TEMPLATE_TYPES = Object.keys(taskTemplates);
const EDITORS = [
  { name: 'main', instance: editorMain },
  { name: 'sidebar', instance: editorSidebar }
];



async function loadData() {
  const data = await getTask(slug.value);
  const sidebarData = data?.blockContent?.sidebar;

  showSidebar.value = Array.isArray(sidebarData?.blocks) && sidebarData.blocks.length > 0;
  taskTitle.value = data?.meta?.title ?? slug.value;

  return data;
}

async function loadEditors(data) {
  await Promise.all(EDITORS.map(e => e.instance.value?.isReady));

  if (data && data.meta.orgId !== userStore.id) {
    toastStore.addToast('Keine Berechtigung', 'danger');
    await router.push({name: 'TaskList'});
  }

  if (!data) {
    openTaskSchemasModal();
    return;
  }

  await editorMain.value.render(data.blockContent.main);
  await editorSidebar.value.render(data.blockContent.sidebar);

  toastStore.addToast('Aufgabe geladen', 'success');
}

function openTaskSchemasModal() {
  taskSchemasModalRef.value?.openModal();
}

async function handleSchemaSelected(slug) {
  const schema = await getTaskSchema(slug);

  if (!schema) {
    toastStore.addToast("Struktur konnte nicht geladen werden", "danger");
    return;
  }

  await editorMain.value.render(schema.blockContent.main);
  await editorSidebar.value.render(schema.blockContent.sidebar);

  showSidebar.value = Array.isArray(schema.blockContent.sidebar.blocks) && schema.blockContent.sidebar.blocks.length > 0;

  toastStore.addToast(`Struktur geladen`, 'info');
}

async function saveEditors() {
  const title = taskTitle.value;

  if (!title) {
    toastStore.addToast('Bitte fügen Sie der Aufgabe einen Titel hinzu', 'warning');
    return;
  }

  try {
    const editors = [
      { name: 'main', instance: editorMain.value }
    ];

    if (showSidebar.value && editorSidebar.value) {
      editors.push({ name: 'sidebar', instance: editorSidebar.value });
    }

    const validationResults = await Promise.all(
        editors.map(({ name, instance }) =>
            validateEditorBlocks({
              editorInstance: instance,
              editorName: name
            })
        )
    );

    if (validationResults.includes(false)) return;

    let main = await editorMain.value.save();
    let sidebar = showSidebar.value && editorSidebar.value
        ? await editorSidebar.value.save()
        : { blocks: [] };

    main = convertTemplateTools(main);
    sidebar = convertTemplateTools(sidebar);

    const newSlug = slugify(title, { lower: true, strict: true, locale: 'de' });

    const result = await postTask(slug.value, {
      slug: slug.value,
      newSlug,
      changeSlug: slug.value !== newSlug,
      meta: { title, orgId: userStore.id },
      blockContent: { main, sidebar }
    });

    if (result?.success) {
      slug.value = result.slug;
      await router.replace({ name: 'TaskEditor', params: { slug: slug.value } });
      toastStore.addToast('Aufgabe erfolgreich gespeichert', 'success');
    }
  } catch (error) {
    toastStore.addToast(`Fehler beim Speichern der Aufgabe: ${error}`, 'danger');
  }
}

function convertTemplateTools(output) {
  return {
    ...output,
    blocks: output.blocks.map(block => {
      if (TEMPLATE_TYPES.includes(block.type)) {
        const text = block.data?.text?.trim();

        if (!text) return null;

        return {
          type: 'paragraph',
          data: { text }
        };
      }

      return block;
    })
  };
}



onMounted(async () => {
  const organisation = await getOrganisation(userStore.id);
  const tools = getEditorTools({
    ...taskEditorTools,
    ...taskTemplates,
    organisationTeaser: {
      ...taskEditorTools.organisationTeaser,
      config: {
        ...taskEditorTools.organisationTeaser.config,
        getOrganisation: async () => {
          return {
            name: organisation?.name,
            description: organisation?.description
          };
        }
      }
    }
  });

  editorMain.value = new EditorJS({
    holder: 'editorjsMain',
    tools: tools,
    autofocus: true,
    i18n: editorJsI18nDE
  });

  editorSidebar.value = new EditorJS({
    holder: 'editorjsSidebar',
    tools: tools,
    i18n: editorJsI18nDE
  });

  const data = await loadData();
  await loadEditors(data);
});

onBeforeUnmount(() => {
  editorMain.value?.destroy();
  editorSidebar.value?.destroy();
});
</script>

<template>
  <section class="container my-5">
    <div class="d-flex justify-content-between mb-3">
      <div class="d-flex align-items-center gap-3">
        <label for="taskTitle" class="form-label text-nowrap">Titel der Aufgabe</label>
        <input v-model="taskTitle" type="text" class="form-control" id="taskTitle">
        <div class="form-check form-switch ms-3">
          <input v-model="showSidebar" class="form-check-input" type="checkbox" role="switch">
          <label class="form-check-label">Seitenleiste</label>
        </div>
      </div>
      <div class="d-flex flex-row align-items-center gap-2">
        <button class="btn btn-secondary" @click="openTaskSchemasModal">Vorlage auswählen</button>
        <button class="btn btn-primary" @click="saveEditors">Speichern</button>
      </div>
    </div>

    <div class="border border-3 border-dark rounded">
      <div class="row p-2">
        <div :class="showSidebar ? 'col-lg-8 col-12 order-lg-1 order-2' : 'col-12'">
          <div id="editorjsMain" class="shadow rounded p-2 mb-3"></div>
        </div>
        <div v-show="showSidebar" class="col-lg-4 col-12 order-lg-2 order-1">
          <div id="editorjsSidebar" class="sticky-top sticky-offset shadow rounded p-2 mb-3"></div>
        </div>
      </div>
    </div>
  </section>

  <TaskSchemasModal ref="taskSchemasModalRef" @schema-selected="handleSchemaSelected" />
</template>