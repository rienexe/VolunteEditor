<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { getOrganisation, getTask } from "@/api";


const route = useRoute();
const title = ref(route.meta.title);



watchEffect(async () => {
  const slug = route.params.slug;

  if (slug) {
    if (route.name === 'Organisation') {
      const org = await getOrganisation(slug);
      title.value = org?.name || route.meta.title;
    } else if (route.name === 'Task') {
      const task = await getTask(slug);
      title.value = task?.meta?.title || route.meta.title;
    }
  } else {
    title.value = route.meta.title;
  }
});
</script>

<template>
  <div v-if="route.meta.title" class="fixed-top">
    <div class="text-bg-dark py-2" style="height: 50px">
      <div class="container d-flex align-items-center">
        <RouterLink
            v-if="route.meta.parent"
            :to="route.meta.parent"
            class="lead link-light link-underline-opacity-0 me-2"
        >
          <i class="bi bi-arrow-left"></i>
        </RouterLink>
        <span class="lead text-truncate flex-grow-1">
          {{ title }}
        </span>
      </div>
    </div>
  </div>
</template>