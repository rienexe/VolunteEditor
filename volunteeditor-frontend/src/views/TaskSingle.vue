<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getOrganisation, getTask, getWorkflow } from "@/api";
import { userStore, WorkflowRunner, workflowActions } from "@/services";
import { getEditorTools, taskEditorTools, editorJsI18nDE, taskTemplates } from '@/utils/editorUtils.js';

import EditorJS from '@editorjs/editorjs';



const route = useRoute();
const slug = route.params.slug;

const taskData = ref(null);
const editorMain = ref(null);
const editorSidebar = ref(null)
const showSidebar = ref(false);
const workflowSlug = ref('');
const organisation = ref(null);

const tools = getEditorTools({
  ...taskEditorTools,
  ...taskTemplates
});



async function render() {
  const sidebarData = taskData.value?.blockContent?.sidebar;

  showSidebar.value = Array.isArray(sidebarData?.blocks) && sidebarData.blocks.length > 0;

  editorMain.value = new EditorJS({
    holder: 'editorjsMain',
    tools,
    data: structuredClone(JSON.parse(JSON.stringify(taskData.value.blockContent.main))),
    i18n: editorJsI18nDE,
    readOnly: true,
    minHeight: 0
  });

  if (showSidebar.value) {
    editorSidebar.value = new EditorJS({
      holder: 'editorjsSidebar',
      tools: tools,
      data: structuredClone(JSON.parse(JSON.stringify(taskData.value.blockContent.sidebar))),
      i18n: editorJsI18nDE,
      readOnly: true,
      minHeight: 0
    });
  }
}

async function signup() {
  if (!workflowSlug.value) return

  const workflowData = await getWorkflow(workflowSlug.value)
  const runner = new WorkflowRunner(
      workflowData.workflow,
      {
        org: organisation.value,
        volunteerId: userStore.id,
        taskId: slug,
        taskTitle: taskData.value.meta.title,
      },
      workflowActions
  )

  await runner.run()
}



onMounted(async () => {
  taskData.value = await getTask(slug);
  organisation.value = await getOrganisation(taskData.value?.meta?.orgId);
  workflowSlug.value = taskData.value?.meta?.workflowSlug;

  await render(taskData);
});

</script>

<template>
  <section class="container my-5">
    <div class="row">
      <div :class="showSidebar ? 'col-lg-8 col-12 order-lg-1 order-2' : 'col-12'">
        <div id="editorjsMain" class="p-1 mb-3"></div>
      </div>
      <div v-if="showSidebar" class="col-lg-4 col-12 order-lg-2 order-1">
        <div id="editorjsSidebar" class="p-1 mb-3"></div>
      </div>
    </div>
  </section>

  <section v-if="workflowSlug && userStore.role === 'volunteer'" class="container text-center my-5">
    <div class="text-bg-primary rounded-3 p-5">
      <h2 class="pb-2">Jetzt aktiv werden!</h2>
      <button type="button" class="btn btn-lg btn-light" @click="signup">Anmelden</button>
    </div>
  </section>
</template>

<style scoped>
:deep(.ce-block__content),
:deep(.ce-toolbar__content) {
  max-width: unset;
}
</style>