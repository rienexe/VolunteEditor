<script setup>
import { onMounted, ref } from "vue";
import { getTaskSchemas, getWorkflows, deleteTaskSchema, deleteTask, deleteWorkflow } from "@/api";
import ListContainer from "@/components/ListContainer.vue";
import { userStore, toastStore } from "@/services";
import {
  extractToolboxMeta,
  getEditorTools,
  getParsedTasks,
  taskEditorTools,
  taskTemplates,
  transformSchema
} from "@/utils";



const toolMap = getToolMap();
const taskSchemas = ref([]);
const tasks = ref([]);
const workflows = ref([]);
const orgId = userStore.id;



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

async function handleDelete(id, type) {
  const confirmMessage = {
    schema: "Möchten Sie diese Aufgaben Struktur löschen?",
    task: "Möchten Sie diese Aufgabe löschen?",
    workflow: "Möchten Sie diesen Workflow löschen?",
  }[type];

  if (!confirm(confirmMessage)) return;

  let result;

  try {
    if (type === "schema") {
      result = await deleteTaskSchema(id);
      taskSchemas.value = taskSchemas.value.filter(t => t.slug !== id);
    } else if (type === "task") {
      result = await deleteTask(id);
      tasks.value = tasks.value.filter(t => t.id !== id);
    } else if (type === "workflow") {
      result = await deleteWorkflow(id);
      workflows.value = workflows.value.filter(w => w.id !== id);
    }

    toastStore.addToast(result.message, 'info');
  } catch (err) {
    toastStore.addToast(err?.message || 'Fehler beim Löschen', 'danger');
  }
}



onMounted(async () => {
  try {
    const [allTaskSchemas, allTasks, allWorkflows] = await Promise.all([
      getTaskSchemas(orgId).catch(() => ({})),
      getParsedTasks(orgId).catch(() => ([])),
      getWorkflows(orgId).catch(() => ({})),
    ]);

    const rawSchemas = Object.entries(allTaskSchemas || {}).map(([slug, schema]) => ({
      slug,
      ...schema
    }));
    taskSchemas.value = transformSchemas(rawSchemas);

    tasks.value = (allTasks || []).map(({ description, image, ...rest }) => rest);

    workflows.value = Object.entries(allWorkflows || {}).map(([key, workflow]) => ({
      id: key,
      title: workflow?.meta?.title,
      description: workflow?.workflow?.nodes
    }));

  } catch (err) {
    console.error(err);
    toastStore.addToast("Fehler beim Laden", "danger");
  }
});
</script>

<template>
  <section>
    <div class="container my-5">
      <h2>Profilseite</h2>
      <div class="d-flex overflow-auto gap-3">
        <RouterLink to="org-admin/organisation/editor" class="btn btn-primary btn-lg btn-width">
          <i class="bi bi-pencil-square"></i><br>Profilseite bearbeiten
        </RouterLink>
        <RouterLink :to="`organisation/${orgId}`" class="btn btn-outline-primary btn-lg btn-width">
          <i class="bi bi-eye"></i><br>Profilseite anzeigen
        </RouterLink>
      </div>
    </div>
  </section>

  <section>
    <div class="container my-5">
      <h2>Aufgaben</h2>
      <div class="d-flex overflow-auto gap-3 mb-3">
        <RouterLink to="org-admin/task/editor/schema" class="btn btn-primary btn-lg btn-width">
          <i class="bi bi-grid-1x2"></i><br>Aufgabe Struktur festlegen
        </RouterLink>
        <RouterLink to="org-admin/task/editor" class="btn btn-primary btn-lg btn-width">
          <i class="bi bi-file-earmark-plus"></i><br>Aufgabe erstellen
        </RouterLink>
      </div>
      <div class="d-flex flex-column gap-3">
        <ListContainer :items="taskSchemas" type="schema" layout="slider" empty-message="Noch keinen Aufgabenstruktur definiert">
          <template #editButton="{ item }">
            <RouterLink :to="`org-admin/task/editor/schema/${item.slug}`" class="btn btn-primary flex-grow-1">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </RouterLink>
            <button class="btn btn-outline-danger" @click="handleDelete(item.slug, 'schema')">
              <i class="bi bi-x"></i>
            </button>
          </template>
        </ListContainer>

        <ListContainer :items="tasks" type="task" layout="slider" empty-message="Noch keine Aufgaben erstellt" >
          <template #editButton="{ item }">
            <RouterLink :to="`org-admin/task/editor/${item.id}`" class="btn btn-primary flex-grow-1">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </RouterLink>
            <RouterLink :to="`task/${item.id}`" class="btn btn-outline-primary flex-grow-1">
              <i class="bi bi-eye"></i> Ansehen
            </RouterLink>
            <button class="btn btn-outline-danger" @click="handleDelete(item.id, 'task')">
              <i class="bi bi-x"></i>
            </button>
          </template>
        </ListContainer>
      </div>
    </div>
  </section>

  <section>
    <div class="container my-5">
      <h2>Workflows</h2>
      <div class="d-flex overflow-auto gap-3 mb-3">
        <RouterLink to="org-admin/workflow/editor" class="btn btn-primary btn-lg btn-width">
          <i class="bi bi-node-plus"></i><br>Workflow erstellen
        </RouterLink>
        <RouterLink v-if="workflows.length" to="org-admin/workflow/task-assignment" class="btn btn-primary btn-lg btn-width">
          <i class="bi bi-diagram-2"></i><br>Workflow Aufgaben zuweisen
        </RouterLink>
      </div>
      <div class="d-flex flex-column gap-3">
        <ListContainer :items="workflows" type="workflow" layout="slider" empty-message="Noch keinen Workflow definiert">
          <template #editButton="{ item }">
            <RouterLink :to="`org-admin/workflow/editor/${item.id}`" class="btn btn-primary flex-grow-1">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </RouterLink>
            <button class="btn btn-outline-danger" @click="handleDelete(item.id, 'workflow')">
              <i class="bi bi-x"></i>
            </button>
          </template>
        </ListContainer>
      </div>
    </div>
  </section>
</template>

<style scoped>
.btn-width {
  width: 50vw;
  max-width: 250px
}
</style>