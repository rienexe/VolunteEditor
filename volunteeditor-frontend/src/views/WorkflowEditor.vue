<script setup>
import { ref, markRaw, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toastStore, userStore } from "@/services";
import { getWorkflow, postWorkflow } from "@/api";

import slugify from "slugify";
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { MiniMap } from '@vue-flow/minimap';
import { Controls } from '@vue-flow/controls';

import TriggerVolunteerSignupNode from "@/components/editors/vue-flow/nodes/TriggerVolunteerSignupNode.vue";
import NotificationNode from "@/components/editors/vue-flow/nodes/NotificationNode.vue";
import DecisionNode from "@/components/editors/vue-flow/nodes/DecisionNode.vue";
import DataRequestNode from "@/components/editors/vue-flow/nodes/DataRequestNode.vue";
import SignupVolunteerNode from "@/components/editors/vue-flow/nodes/SignupVolunteerNode.vue";



const route = useRoute();
const router = useRouter();
const slug = ref(route.params.slug || null);
const workflowName = ref('');

const { fromObject, toObject, addNodes, addEdges, updateEdge, removeEdges } = useVueFlow();
const nodes = ref([]);
const edges = ref([]);

const nodeType = markRaw({
  triggerVolunteerSignup: TriggerVolunteerSignupNode,
  notification: NotificationNode,
  dataRequest: DataRequestNode,
  condition: DecisionNode,
  signupVolunteer: SignupVolunteerNode
});



async function onConnect(params) {
  addEdges([{ ...params, updatable: { source: false, target: true } }]);
}

function onEdgeUpdate({ edge, connection }) {
  updateEdge(edge, connection)
}

function onEdgeDoubleClick({ edge }) {
  removeEdges(edge.id)
}

function validateNodes() {
  if (nodes.value.length === 0) {
    toastStore.addToast('Der Workflow muss mindestens eine Aktion enthalten.', 'warning');
    return false;
  }

  const triggerNode = nodes.value.find(node => node.id === 'trigger');

  if (!triggerNode) {
    toastStore.addToast(
        'Der Workflow benötigt einen Trigger.', 'danger');
    return false;
  }

  const reachableNodeIds = new Set(['trigger']);
  const nodesToVisit = ['trigger'];

  while (nodesToVisit.length > 0) {
    const currentNodeId = nodesToVisit.shift();
    const outgoingEdges = edges.value.filter(
        edge => edge.source === currentNodeId
    );

    for (const edge of outgoingEdges) {
      if (!reachableNodeIds.has(edge.target)) {
        reachableNodeIds.add(edge.target);
        nodesToVisit.push(edge.target);
      }
    }
  }

  const unreachableNodes = nodes.value.filter(
      node => !reachableNodeIds.has(node.id)
  );

  if (unreachableNodes.length > 0) {
    const nodeNames = unreachableNodes
        .map(node => node.data?.label || node.id)
        .join(', ');

    toastStore.addToast(
        `Die Aktionen ${nodeNames} sind nicht mit dem Trigger verbunden`, 'warning');
    return false;
  }

  return true;
}

async function saveEditor() {
  const title = workflowName.value;

  if (!title) {
    toastStore.addToast('Bitte fügen Sie einen Titel für den Workflow hinzu', 'warning');
    return;
  }

  if (!validateNodes()) {
    return;
  }

  const newSlug = slugify(title, { lower: true, strict: true, locale: 'de' });

  const payload = {
    slug: slug.value,
    newSlug,
    changeSlug: slug.value !== newSlug,
    meta: { title, orgId: userStore.id },
    workflow: toObject(nodes, edges)
  }

  const result = await postWorkflow(slug.value, payload);

  if (result?.success) {
    slug.value = result.slug;
    await router.replace({ name: 'WorkflowEditor', params: { slug: slug.value }});
    toastStore.addToast("Workflow erfolgreich gespeichert", "success")
  } else {
    toastStore.addToast("Speichern fehlgeschlagen", "danger")
  }
}



onMounted(async () => {
  const workflowData = await getWorkflow(slug.value);

  workflowName.value = workflowData?.meta?.title ?? slug.value;

  if (workflowData?.workflow) {
    await fromObject(workflowData.workflow);
  } else {
    addNodes({
          id: 'trigger',
          type: 'triggerVolunteerSignup',
          data: { label: 'Freiwillige:r meldet sich für eine Aufgabe' },
          position: { x: 0, y: 0 }
        }
    )
  }
});
</script>

<template>
  <section class="container">
    <h2>Prozess bei Bewerbung festlegen</h2>
  </section>
  <section class="container my-5">
    <div class="d-flex flex-row justify-content-between mb-3">
      <div class="d-flex flex-row align-items-center gap-3">
        <label for="workflowName" class="col-form-label text-nowrap">Name des Workflows</label>
        <input v-model="workflowName" type="text" class="form-control" id="workflowName">
      </div>
      <div class="d-flex flex-row align-items-center gap-3">
        <button class="btn btn-primary" @click="saveEditor">Speichern</button>
      </div>
    </div>
    <div class="border border-3 border-dark p-0" style="width: 100%; height: 80vh;">
      <VueFlow v-model:nodes="nodes" v-model:edges="edges" :node-types="nodeType"
               fit-view-on-init
               :snap-to-grid="true"
               :snap-grid="[20, 20]"
               :nodes-draggable="true"
               :nodes-connectable="true"
               @connect="onConnect"
               @edge-update="onEdgeUpdate"
               @edge-double-click="onEdgeDoubleClick">
      <MiniMap pannable zoomable />
        <Controls />
        <Background/>
      </VueFlow>
    </div>
  </section>
</template>