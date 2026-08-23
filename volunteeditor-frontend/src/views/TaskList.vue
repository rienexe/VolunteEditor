<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { getParsedTasks } from "@/utils/taskList.js";
import ListContainer from "@/components/ListContainer.vue";



const tasks = ref([]);

const searchOrganisation = ref('');
const filterSubjectAreas = ref('');
const filterSites = ref('');
const filterRemote = ref(false);
const filterSchedules = ref([]);

const uniqueOrganisations = computed(() => {
  const orgMap = new Map();
  tasks.value.forEach((task) => {
    const slug = task.organisation?.slug;
    const name = task.organisation?.name;

    if (slug && name && !orgMap.has(slug)) {
      orgMap.set(slug, name);
    }
  });

  return Array.from(orgMap.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
});

const allSubjectAreas = computed(() => {
  const subjectAreas = new Set();
  tasks.value.forEach(task =>
      task.tags?.forEach(subjectArea => subjectAreas.add(subjectArea))
  );
  return Array.from(subjectAreas).sort();
});

const allSites = computed(() => {
  const sites = new Set();
  tasks.value.forEach(task =>
      task.taskSites?.sites?.forEach(site => sites.add(site))
  );
  return [...sites].sort();
});

const scheduleOptions = [
  { value: 'single', label: 'Fixierte Termine' },
  { value: 'recurring', label: 'Regelmäßig' },
  { value: 'flexible', label: 'Nach Vereinbarung' }
];

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    const matchesSearch =
        !searchOrganisation.value ||
        task.organisation?.name
            ?.toLowerCase()
            .includes(searchOrganisation.value.toLowerCase());
    const matchesSubjectAreas =
        filterSubjectAreas.value === '' ||
        task.tags?.includes(filterSubjectAreas.value);
    const matchesSites =
        filterRemote.value
            ? true
            : filterSites.value === '' ||
            task.taskSites?.sites?.includes(filterSites.value);
    const matchesRemote =
        !filterRemote.value || task.taskSites?.isRemote;
    const matchesSchedule =
        filterSchedules.value.length === 0 ||
        filterSchedules.value.includes(
            task.temporalDemand?.scheduleType?.type
        );

    return matchesSearch && matchesSubjectAreas && matchesSites && matchesRemote && matchesSchedule;
  });
});



function resetFilters() {
  searchOrganisation.value = '';
  filterSubjectAreas.value = '';
  filterSites.value = '';
  filterRemote.value = false;
  filterSchedules.value = [];
}



onMounted(async () => {
  tasks.value = await getParsedTasks();
});

watch(filterRemote, (isRemote) => {
  if (isRemote) {
    filterSites.value = '';
  }
});
</script>

<template>
  <section class="container my-lg-5" id="filter">
    <div class="d-flex flex-row justify-content-between flex-wrap text-bg-primary p-3 gap-sm-5 gap-2">
      <form class="d-flex align-items-center justify-content-between flex-grow-1" role="search">
        <i class="bi bi-search me-2"></i>
        <input v-model="searchOrganisation" class="form-control fw-bold me-2" type="search" placeholder="Organisation suchen..." list="datalist-organisations">
        <datalist id="datalist-organisations">
          <option v-for="org in uniqueOrganisations" :key="org.slug" :value="org.name"></option>
        </datalist>
        <a class="btn btn-outline-light" href="#tasks">Suchen</a>
      </form>
      <button class="btn text-white px-0" type="button" data-bs-toggle="modal" data-bs-target="#filterModal">
        <i class="bi bi-funnel"></i>
        Filter
      </button>
    </div>
  </section>

  <div class="modal fade" id="filterModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content text-bg-primary">
        <div class="modal-header border-0">
          <h1 class="modal-title fs-5">Suche einschränken</h1>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="mb-3">
              <label class="fw-bold mb-1" for="subjectAreas">Themenbereiche</label>
              <select v-model="filterSubjectAreas" class="form-select rounded-pill" id="subjectAreas">
                <option value="">Alle Bereiche</option>
                <option v-for="subjectArea in allSubjectAreas" :key="subjectArea" :value="subjectArea">{{ subjectArea }}</option>
              </select>
            </div>
          <div class="mb-3">
            <label class="fw-bold mb-1" for="sites">Einsatzort</label>
            <select v-model="filterSites" class="form-select rounded-pill mb-2" style="border-radius: 50px" id="sites" :disabled="filterRemote">
              <option value="">Alle Einsatzorte</option>
              <option v-for="site in allSites" :key="site" :value="site">{{ site }}</option>
            </select>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" v-model="filterRemote" id="remoteCheck" />
              <label class="form-check-label" for="remoteCheck">Ortsunabhängig / Remote</label>
            </div>
          </div>
          <div>
            <label class="fw-bold mb-1" for="organisation">Zeitausmaß</label>
            <div class="bg-white rounded-4 p-2">
              <div class="form-check text-black" v-for="schedule in scheduleOptions" :key="schedule.value">
                <input class="form-check-input" type="checkbox" :id="'schedule-' + schedule.value" :value="schedule.value" v-model="filterSchedules" />
                <label class="form-check-label" :for="'schedule-' + schedule.value">
                  {{ schedule.label }}
                </label>
              </div>
              </div>
            </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn text-white" @click="resetFilters">Filter zurücksetzen</button>
          <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Filter setzen</button>
        </div>
      </div>
    </div>
  </div>

  <section class="container my-5" id="tasks">
    <ListContainer :items="filteredTasks" type="task" layout="grid" />
  </section>
</template>

<style scoped>
@media (max-width: 575px) {
  #filter > div {
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15);
  }
  #filter {
    padding: unset;
  }
}

@media (min-width: 575px) {
  #filter > div {
    border-radius: var(--bs-border-radius);
  }
}

.form-check-input:checked {
  background-color: var(--bs-secondary);
  border-color: var(--bs-secondary);
}
</style>