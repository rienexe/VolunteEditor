<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  }
});
</script>

<template>
  <div class="card h-100">
    <div class="card-img-top overflow-hidden rounded-top" style="height: 150px;">
      <div v-if="task.workTypeAndDemand?.isUrgent" class="position-absolute badge text-bg-primary fs-5 m-2"><i class="bi bi-alarm"></i></div>
      <img
          v-if="task.image"
          :src="task.image"
          class="w-100 h-100 object-fit-cover"
      />

      <div v-else class="w-100 h-100 bg-light"></div>
    </div>
    <div class="card-body d-flex flex-column justify-content-between gap-2">
      <div>
        <div v-if="task.organisation" class="small text-secondary">{{ task.organisation.name }}</div>
        <h5 class="card-title">{{ task.title }}</h5>
        <p v-if="task.description" class="card-text small line-clamp-2">{{ task.description }}</p>
      </div>
      <ul style="list-style-type: none" class="fw-bold ps-0">
        <li v-if="task.taskSites?.isRemote">
          <i class="bi bi-wifi"></i> Ortsunabhängig / Remote
        </li>
        <li v-if="task.taskSites?.isChanging">
          <i class="bi bi-arrow-repeat"></i> Einsatzort wechselnd
        </li>
        <li v-if="task.taskSites?.sites.length">
          <i class="bi bi-geo-alt"></i>
          {{ task.taskSites.sites.join(', ') }}
        </li>
        <li v-if="task.temporalDemand?.durationType">
          <span v-html="task.temporalDemand.durationType.icon"></span>
          {{ task.temporalDemand.durationType.label }}
        </li>
        <li v-if="task.temporalDemand?.scheduleType">
          <span v-html="task.temporalDemand.scheduleType.icon"></span>
          {{ task.temporalDemand.scheduleType.label }}
        </li>
      </ul>
      <div v-if="task.tags?.length" class="d-flex flex-wrap gap-1">
        <template v-for="tag in task.tags" :key="tag">
          <span class="badge text-bg-primary">{{ tag }}</span>
        </template>
      </div>
      <div class="d-grid gap-1 mt-3">
        <div class="d-flex justify-content-between gap-2">
          <slot name="editButton" :task="task">
            <RouterLink :to="`/task/${task.id}`" class="btn btn-primary w-100">Mehr erfahren</RouterLink>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>