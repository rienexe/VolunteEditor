<script setup>
import { ref, computed, onMounted} from "vue";
import { getOrganisations } from "@/api";



const organisations = ref([]);

const sortedOrganisations = computed(() => {
  return [...organisations.value].sort((a, b) =>
      a.name.localeCompare(b.name, "de", { sensitivity: "base" })
  );
});



onMounted(async () => {
  organisations.value = await getOrganisations(true);
});
</script>

<template>
  <section class="container my-5">
    <ul class="list-group list-group-flush">
      <li v-for="org in sortedOrganisations"
          class="list-group-item list-group-item-action d-flex flex-column flex-md-row align-items-center gap-3">
        <img
            v-if="org.logo"
            :src="org.logo"
            class="img-thumbnail align-self-md-start"
            style="width: 30vw; max-width: 100px; object-fit: contain; aspect-ratio: 1/1"
        >
        <div
            v-else="org.logo"
            class="img-thumbnail align-self-md-start"
            style="width: 30vw; max-width: 100px; object-fit: contain; background: var(--bs-light); aspect-ratio: 1/1"
        ></div>
        <div>
          <h3>{{ org.name }}</h3>
          <span class="description" v-html="org.description">
          </span>
          <div class="fw-bold d-flex flex-row flex-wrap">
            <div v-if="org.assignedVolunteers.length > 0" class="me-3"><i class="bi bi-person-hearts"></i> {{ org.assignedVolunteers.length }} Freiwillige engagiert</div>
            <div v-if="org.taskCount > 0"><i class="bi bi-clipboard-heart"></i> {{ org.taskCount }} offen Aufgaben</div>
          </div>
          <RouterLink :to="org.slug" class="stretched-link"></RouterLink>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
}

@media (max-width: 768px) {
  .description {
    -webkit-line-clamp: 5;
  }
}
</style>