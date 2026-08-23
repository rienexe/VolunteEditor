<script setup>
import SchemaCard from "@/components/cards/SchemaCard.vue";
import TaskCard from "@/components/cards/TaskCard.vue";
import WorkflowCard from "@/components/cards/WorkflowCard.vue";



const { items, type, layout, emptyMessage } = defineProps({
  items: { type: Array, required: true },
  type: { type: String, required: true, validator: (v) => ["schema", "task", "workflow"].includes(v) },
  layout: { type: String, default: "grid", validator: (v) => ["grid", "slider"].includes(v) },
  emptyMessage: { type: String, default: "Keine Einträge vorhanden" }
});

const emit = defineEmits(["schema-selected"]);

const getComponent = () => {
  switch (type) {
    case "schema":
      return SchemaCard;
    case "task":
      return TaskCard;
    case "workflow":
      return WorkflowCard;
    default:
      return;
  }
};

const getProps = (item) => {
  switch (type) {
    case "schema":
      return { schema: item };
    case "task":
      return { task: item };
    case "workflow":
      return { workflow: item };
    default:
      return;
  }
};
</script>

<template>
  <!-- Empty State -->
  <template v-if="items.length === 0">
    <slot name="empty">
      <div class="card text-center text-secondary py-3">
        <i class="bi bi-inbox fs-1"></i>
        <p class="mt-2">{{ emptyMessage }}</p>
      </div>
    </slot>
  </template>

  <!-- Grid-Ansicht -->
  <div v-if="layout === 'grid'" class="row row-cols-1 row-cols-md-3 g-4">
    <slot name="prefix" />
    <div v-for="item in items" :key="item.id" class="col">
      <component :is="getComponent()" v-bind="getProps(item)" @schema-selected="emit('schema-selected', $event)">
        <template #editButton>
          <slot name="editButton" :item="item" />
        </template>
      </component>
    </div>
  </div>

  <!-- Slider-Ansicht -->
  <div v-else-if="layout === 'slider'" class="d-flex overflow-auto gap-3">
    <slot name="prefix" />
    <div
        v-for="item in items"
        :key="item.id"
        class="flex-shrink-0"
        style="width: 75vw; max-width: 325px; scroll-snap-align: center;"
    >
      <component :is="getComponent()" v-bind="getProps(item)" @schema-selected="emit('schema-selected', $event)">
        <template #editButton>
          <slot name="editButton" :item="item" />
        </template>
      </component>
    </div>
  </div>
</template>

<style scoped>
.d-flex {
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
}
</style>