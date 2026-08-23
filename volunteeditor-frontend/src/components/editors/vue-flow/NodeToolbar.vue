<script setup>
import { computed } from 'vue';
import { NodeToolbar } from '@vue-flow/node-toolbar';
import { useVueFlow } from '@vue-flow/core';



const props = defineProps({
  nodeId: {
    type: String,
    required: true
  },
  nodeData: {
    type: Object,
    required: true
  },
  selected: ['selected']
})

const { findNode, addNodes, addEdges, removeNodes } = useVueFlow()

const currentNode = computed(() => findNode(props.nodeId))

const isConditionNode = computed(() => {
  return currentNode.value?.type === 'condition'
});

const isTriggerNode = computed(() => {
  return currentNode.value?.type === 'triggerVolunteerSignup'
});



function createPosition(offsetX = 20, offsetY = 20, sourceHandle = null) {
  const node = findNode(props.nodeId)

  if (!node) {
    return { x: 0, y: 0 }
  }

  const { x, y } = node.position
  const width = node.dimensions.width ?? 0
  const height = node.dimensions.height ?? 0

  if (node.type?.startsWith('trigger')) {
    return {
      x: x + width / 2 + offsetX,
      y: y + height + offsetY
    }
  }

  if (node.type === 'condition') {
    if (sourceHandle === 'true') {
      return {
        x: x - 200,
        y: y + height + 100
      }
    }

    if (sourceHandle === 'false') {
      return {
        x: x + 200,
        y: y + height + 100
      }
    }
  }

  return {
    x,
    y: y + height + offsetY
  }
}

function addNodeWithEdge(nodeConfig, sourceId = props.nodeId, sourceHandle = null) {
  const newId = `${nodeConfig.type}-${Date.now()}-${Math.random()}`

  addNodes({
    ...nodeConfig,
    id: newId,
    position: createPosition(20,20,sourceHandle)
  });

  addEdges({
    id: `e-${sourceId}-${newId}`,
    source: sourceId,
    sourceHandle,
    target: newId
  });

  return newId
}

function addNotificationNode(handle = null) {
  addNodeWithEdge(
      {
        type: 'notification',
        data: {
          label: 'Benachrichtigung senden',
          message: ''
        }
      },
      props.nodeId,
      handle
  );
}

function addDataRequestNode(handle = null) {
  addNodeWithEdge(
      {
        type: 'dataRequest',
        data: {
          label: 'Datenabfrage',
          fields: []
        }
      },
      props.nodeId,
      handle
  );
}

function addConditionNode(handle = null) {
  addNodeWithEdge(
      {
        type: 'condition',
        data: {
          label: 'Entscheidung',
          condition: ''
        }
      },
      props.nodeId,
      handle
  );
}

function addAcceptVolunteerNode(handle = null) {
  addNodeWithEdge(
      {
        type: 'signupVolunteer',
        data: {
          label: 'Person anmelden',
          action: 'signup'
        }
      },
      props.nodeId,
      handle
  );
}

function addRejectVolunteerNode(handle = null) {
  addNodeWithEdge(
      {
        type: 'signupVolunteer',
        data: {
          label: 'Person ablehnen',
          action: 'reject'
        }
      },
      props.nodeId,
      handle
  );
}
</script>

<template>
  <NodeToolbar v-if="!isConditionNode" :isVisible="selected" position="right" class="d-flex flex-column align-items-start">
    <div class="btn-group dropend">
      <button class="btn btn-primary dropdown-toggle py-1" type="button" data-bs-toggle="dropdown">
        <i class="bi bi-plus-lg"></i>
      </button>
      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" @click="addNotificationNode()">
            <i class="bi bi-chat"></i> Benachrichtigung senden
          </a>
        </li>
        <li>
          <a class="dropdown-item" @click="addDataRequestNode()">
            <i class="bi bi-input-cursor"></i> Daten abfragen
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item" @click="addConditionNode()">
            <i class="bi bi-diagram-2"></i> Bedingung hinzufügen
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item" @click="addAcceptVolunteerNode()">
            <i class="bi bi-check-lg"></i> Freiwillige:r ins Team hinzufügen
          </a>
        </li>
        <li>
          <a class="dropdown-item" @click="addRejectVolunteerNode()">
            <i class="bi bi-ban"></i> Freiwillige:r ablehnen
          </a>
        </li>
      </ul>
    </div>

    <button
        v-if="!isTriggerNode"
        class="btn btn-outline-danger py-1 mt-2"
        @click="removeNodes(nodeId)"
    >
      <i class="bi bi-x-lg"></i>
    </button>
  </NodeToolbar>
  <NodeToolbar v-else :isVisible="selected" position="right" class="d-flex flex-column align-items-start">
    <div class="btn-group dropend">
      <button class="btn btn-success dropdown-toggle py-1" type="button" data-bs-toggle="dropdown">
        <i class="bi bi-plus-lg"></i>
      </button>
      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" @click="addNotificationNode('true')">
            <i class="bi bi-chat"></i> Benachrichtigung senden
          </a>
        </li>
        <li>
          <a class="dropdown-item" @click="addDataRequestNode('true')">
            <i class="bi bi-input-cursor"></i> Daten abfragen
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item" @click="addConditionNode('true')">
            <i class="bi bi-diagram-2"></i> Bedingung hinzufügen
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item" @click="addAcceptVolunteerNode('true')">
            <i class="bi bi-check-lg"></i> Freiwillige:r ins Team hinzufügen
          </a>
        </li>
        <li>
          <a class="dropdown-item" @click="addRejectVolunteerNode('true')">
            <i class="bi bi-ban"></i> Freiwillige:r ablehnen
          </a>
        </li>
      </ul>
    </div>
    <div class="btn-group dropend mt-2">
      <button class="btn btn-danger dropdown-toggle py-1" type="button" data-bs-toggle="dropdown">
        <i class="bi bi-plus-lg"></i>
      </button>
      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" @click="addNotificationNode('false')">
            <i class="bi bi-chat"></i> Benachrichtigung senden
          </a>
        </li>
        <li>
          <a class="dropdown-item" @click="addDataRequestNode('false')">
            <i class="bi bi-input-cursor"></i> Daten abfragen
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item" @click="addConditionNode('false')">
            <i class="bi bi-diagram-2"></i> Bedingung hinzufügen
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item" @click="addAcceptVolunteerNode('false')">
            <i class="bi bi-check-lg"></i> Freiwillige:r ins Team hinzufügen
          </a>
        </li>
        <li>
          <a class="dropdown-item" @click="addRejectVolunteerNode('false')">
            <i class="bi bi-ban"></i> Freiwillige:r ablehnen
          </a>
        </li>
      </ul>
    </div>
    <button
        class="btn btn-outline-danger py-1 mt-2"
        @click="removeNodes(nodeId)"
    >
      <i class="bi bi-x-lg"></i>
    </button>
  </NodeToolbar>
</template>