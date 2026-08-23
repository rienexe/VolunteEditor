<script setup>
import { ref, computed } from 'vue';
import { useVueFlow } from '@vue-flow/core';

import BaseNode from "@/components/editors/vue-flow/BaseNode.vue";



const FIELD_TYPES = [
  { type: 'textfield', label: 'Textfeld', icon: '<i class="bi bi-input-cursor-text"></i>'},
  { type: 'textarea', label: 'großes Textfeld', icon: '<i class="bi bi-textarea-resize"></i>' },
  { type: 'number', label: 'Zahlenfeld', icon: '<i class="bi bi-123"></i>' },
  { type: 'datetime', label: 'Datum', icon: '<i class="bi bi-calendar3"></i>' },
  { type: 'filepicker', label: 'Datei', icon: '<i class="bi bi-file-earmark"></i>' },
  { type: 'checkbox', label: 'Checkbox', icon: '<i class="bi bi-check2-square"></i>' },
  { type: 'text', label: 'Text', icon: '<i class="bi bi-fonts"></i>'},
  { type: 'separator', label: 'Trennlinie', icon: '<i class="bi bi-hr"></i>' }
];

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
});

const { updateNodeData } = useVueFlow();

const fieldLabel = ref('');
const fieldType = ref('');
const dateSubtype = ref('date');

const labelPlaceholder = computed(() => {
  if (fieldType.value === 'text') return 'Text'
  return 'Label'
});

const selectedFieldIcon = computed(() => {
  return FIELD_TYPES.find(f => f.type === fieldType.value)?.icon || ''
});



function getFieldLabel(type) {
  return FIELD_TYPES.find(f => f.type === type)?.label || type
}

function generateId() {
  return "Field_" + Math.random().toString(36).substring(2, 9)
}

function generateKey(type) {
  return type + "_" + Math.random().toString(36).substring(2, 7)
}

function addField() {
  if (!fieldType.value) return;

  const newField = {
    label: fieldLabel.value,
    type: fieldType.value,
    id: generateId(),
    key: generateKey(fieldType.value)
  };

  if (fieldType.value === 'datetime') {
    newField.dateSubtype = dateSubtype.value;
  }

  if (fieldType.value === 'text') {
    newField.text = "# " + fieldLabel.value;
  }

  if (fieldType.value === 'separator') {
    delete newField.label;
  }

  const updatedFields = [...(props.data.fields || []), newField];

  updateNodeData(props.id, {
    ...props.data,
    fields: updatedFields
  })

  fieldLabel.value = '';
  fieldType.value = 'textfield';
  dateSubtype.value = 'date';
}

function removeField(id) {
  const updatedFields = props.data.fields.filter(f => f.id !== id)

  updateNodeData(props.id, {
    ...props.data,
    fields: updatedFields
  })
}
</script>

<template>
  <BaseNode :id="id" :data="data" settings settingsTitle="Formular">
    <span class="fw-bold">{{ data.label }}</span>

    <template #settings>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" v-html="selectedFieldIcon"></span>
        <select v-model="fieldType" class="form-select">
          <option disabled value="">Feld Type auswählen</option>
          <option v-for="field in FIELD_TYPES" :key="field.type" :value="field.type">{{ field.label }}</option>
        </select>
        <select
            v-if="fieldType === 'datetime'"
            v-model="dateSubtype"
            class="form-select"
        >
          <option value="date">Datum</option>
          <option value="datetime">Datum + Zeit</option>
          <option value="time">Zeit</option>
        </select>
        <input v-if="fieldType !== 'separator'" v-model="fieldLabel" class="form-control" type="text" :placeholder="labelPlaceholder">
        <button
            type="button"
            class="btn btn-primary"
            :disabled="!fieldType || (!fieldLabel && fieldType !== 'separator')"
            @click="addField">
          <i class="bi bi-plus"></i>
        </button>
      </div>
      <ul v-if="data.fields?.length" class="list-group list-group-flush" style="text-align: left">
        <li v-for="field in data.fields" :key="field.id" class="list-group-item list-group-item-action d-flex justify-content-between">
          <span>
            {{ getFieldLabel(field.type) }}
            <template v-if="field.label"> | {{ field.label }}</template>
            <template v-if="field.text"> | {{ field.text }}</template>
          </span>
          <button class="btn btn-sm btn-close" @click="removeField(field.id)"></button>
        </li>
      </ul>
    </template>
  </BaseNode>
</template>

<style scoped>
.form-select, .form-control {
  font-size: unset;
}
</style>