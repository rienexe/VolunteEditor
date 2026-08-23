<script setup>
import { userStore } from "@/services/userStore.js";
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body fixed-top">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <img src="/src/assets/images/fw_pass_logo.svg" height="44px" alt="Logo">
        <img src="/src/assets/images/civolunteer-logo.png" height="44px" class="border-start border-2 ms-2 ps-2" alt="Logo">
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/organisation/list">Organisationen</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/task/list">Aufgaben</RouterLink>
          </li>
        </ul>
        <button
            v-if="userStore.role === 'guest'"
            href="#"
            class="btn btn-outline-primary d-flex"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
        >
          Anmelden
        </button>
        <div v-else class="dropdown">
          <a class="btn btn-light dropdown-toggle d-flex flex-row align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle me-2" style="font-size: 2.25rem"></i>
            <div class="text-start">
              <span class="fw-bold">{{ userStore.name }}</span>
              <template v-if="userStore.role === 'organisation'">
                <br>
                {{ userStore.orgName }}
              </template>
            </div>
          </a>
          <ul class="dropdown-menu">
            <li v-if="userStore.role === 'organisation'">
              <RouterLink class="dropdown-item" to="/org-admin">Organisations Dashboard</RouterLink>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click="userStore.logout()">Abmelden</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-toggler {
  border: 0;
  width: 50px;
  height: 50px;
  padding: 0;
  margin: -8px -15px
}

.nav-link {
  text-transform: uppercase;
}
</style>