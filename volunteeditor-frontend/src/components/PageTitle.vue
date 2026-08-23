<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { getOrganisation, getTask } from "@/api";



const route = useRoute();
const title = ref(route.meta.title);



watchEffect(async () => {
  const slug = route.params.slug;

  if (slug && route.name === 'Organisation') {
    const org = await getOrganisation(slug);
    title.value = org?.name || route.meta.title;

  } else if (slug && route.name === 'Task') {
    const task = await getTask(slug);
    title.value = task?.meta?.title || route.meta.title;

  } else {
    title.value = route.meta.title;
  }
});
</script>

<template>
  <section class="container my-5">
    <h1>{{ title }}</h1>
  </section>
</template>