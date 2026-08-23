<script setup>
import { userStore } from "@/services/userStore.js";
</script>

<template>
<nav class="navbar bg-dark navbar-expand-lg fixed-bottom" data-bs-theme="dark">
  <div class="container justify-content-end">
    <div v-show="userStore.role !== 'guest'" class="collapse" id="navbarToggleExternalContent" data-bs-theme="dark">
      <ul class="navbar-nav">
        <li v-if="userStore.role === 'organisation'" class="nav-item">
          <RouterLink class="nav-link text-end" to="/org-admin">Organisations Dashboard</RouterLink>
        </li>
        <li class="nav-item">
          <a class="nav-link text-danger text-end" href="#" @click="userStore.logout()">Abmelden</a>
        </li>
      </ul>
    </div>
    <ul class="navbar-nav w-100 flex-row justify-content-between">
      <li class="nav-item">
        <RouterLink class="nav-link" to="/organisation/list">
          <i class="bi bi-house-heart"></i><br>Organisationen
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/task/list">
          <i class="bi bi-person-raised-hand"></i><br>Aufgaben
        </RouterLink>
      </li>
      <li v-if="userStore.role === 'guest'" class="nav-item">
        <button class="nav-link" data-bs-toggle="modal" data-bs-target="#loginModal">
          <i class="bi bi-person-circle"></i><br>Anmelden
        </button>
      </li>
      <li v-if="userStore.role !== 'guest'" class="nav-item">
        <button class="nav-link" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="bi bi-person-circle"></i><br>{{ userStore.name }}
        </button>
      </li>
    </ul>
  </div>
</nav>
</template>

<style scoped>
.nav-link {
  text-align: center;
}
</style>