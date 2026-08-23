<script setup>
import { ref, onMounted } from 'vue';
import { toastStore, userStore } from "@/services";
import { getTasks, getWorkflows, postTaskToWorkflow } from "@/api";

import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { MiniMap } from '@vue-flow/minimap';
import { Controls } from '@vue-flow/controls';



const DEFAULT_WORKFLOW_SLUG = 'default';
const DEFAULT_WORKFLOW_TITLE = 'Automatische Registrierung';

const { updateEdge, addEdges } = useVueFlow();

const nodes = ref([]);
const edges = ref([]);

let taskCache = {};
let workflowSlugs = new Set();

const loadTasks = async () => {
  return Object.entries(taskCache).map(([key, task], index) => {
    const title = task.meta?.title;

    return {
      id: `task_${key}`,
      type: "input",
      position: { x: 100 + index * 150 * 1.1, y: 100 },
      data: { label: title ?? key },
    };
  });
};

const loadWorkflows = async () => {
  const result = await getWorkflows(userStore.id);

  const workflows = Object.entries(result).map(([key, workflow], index) => {
    workflowSlugs.add(key);

    const title = workflow.meta?.title;

    return {
      id: `workflow_${key}`,
      type: "output",
      position: {
        x: 100 + index * 150 * 1.1,
        y: 300
      },
      data: {
        label: title ?? key
      },
    };
  });

  if (!workflowSlugs.has(DEFAULT_WORKFLOW_SLUG)) {
    workflowSlugs.add(DEFAULT_WORKFLOW_SLUG);

    workflows.push({
      id: `workflow_${DEFAULT_WORKFLOW_SLUG}`,
      type: "output",
      class: "vue-flow__node-defaultWorkflow",
      position: {
        x: 100 + workflows.length * 150 * 1.1,
        y: 300
      },
      data: {
        label: DEFAULT_WORKFLOW_TITLE
      }
    });
  }

  return workflows;
};

function loadExistingEdges() {
  const newEdges = [];

  for (const [taskSlug, task] of Object.entries(taskCache)) {
    const workflowSlug = task?.meta?.workflowSlug;
    if (!workflowSlug) continue;
    if (!workflowSlugs.has(workflowSlug)) continue;

    newEdges.push({
      id: `edge_${taskSlug}_${workflowSlug}`,
      source: `task_${taskSlug}`,
      target: `workflow_${workflowSlug}`,
      updatable: { source: false, target: true }
    });
  }

  edges.value = newEdges;
}

async function onConnect(params) {
  const { source, target } = params;

  if (!source.startsWith("task_") || !target.startsWith("workflow_")) return;
  if (edges.value.some(e => e.source === source)) return;
  if (edges.value.some(e => e.source === source && e.target === target)) return;

  addEdges([{ ...params, updatable: { source: false, target: true } }]);
}

function onEdgeUpdate({ edge, connection }) {
  updateEdge(edge, connection)
}

function onEdgeDoubleClick({ event, edge }) {
  edges.value = edges.value.filter(e => e.id !== edge.id);
}

async function persistAssignments(mapping) {
  const updates = {};
  const taskSlugs = Object.keys(taskCache);

  for (const slug of taskSlugs) {
    updates[slug] = mapping.get(slug) || DEFAULT_WORKFLOW_SLUG;
  }

  const result = await postTaskToWorkflow(updates);

  if (result?.success) {
    toastStore.addToast('Beziehungen erfolgreich gespeichert', 'success');
  } else {
    toastStore.addToast('Beim Speichern ist ein Fehler aufgetreten.', 'danger');
  }
}


async function saveEditor() {
  const taskSlugs = Object.keys(taskCache);
  const mapping = new Map();

  for (const e of edges.value) {
    if (
        e.source.startsWith("task_") &&
        e.target.startsWith("workflow_")
    ) {
      mapping.set(
          e.source.replace("task_", ""),
          e.target.replace("workflow_", "")
      );
    }
  }

  const unassignedTasks = taskSlugs.filter(
      slug => !mapping.has(slug)
  );

  if (unassignedTasks.length > 0) {
    toastStore.addToast(
        `${unassignedTasks.length} Aufgabe(n) haben keinen Workflow. Sie werden automatisch dem Workflow „${DEFAULT_WORKFLOW_TITLE}“ zugewiesen.`,
        'warning',
        0,
        {
          label: 'Bestätigen',
          handler: async () => {
            for (const slug of unassignedTasks) {
              mapping.set(slug, DEFAULT_WORKFLOW_SLUG);
            }

            await persistAssignments(mapping);
            loadExistingEdges();
          }
        }
    );

    return;
  }

  await persistAssignments(mapping);
}




onMounted(async () => {
  taskCache = await getTasks(userStore.id);

  const tasks = await loadTasks();
  const workflows = await loadWorkflows();

  nodes.value = [...tasks, ...workflows];

  loadExistingEdges();
});
</script>

<template>
  <section class="container my-5">
    <div class="text-end mb-3">
        <button class="btn btn-primary" @click="saveEditor">Speichern</button>
    </div>
    <div class="border border-3 border-dark p-0" style="width: 100%; height: 80vh;">
      <VueFlow :nodes="nodes" v-model:edges="edges" fit-view-on-init
               @connect="onConnect"
               @edge-update="onEdgeUpdate"
               @edge-double-click="onEdgeDoubleClick"
      >
        <MiniMap pannable zoomable />
        <Controls />
        <Background />
      </VueFlow>
    </div>
  </section>
</template>