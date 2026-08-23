<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import { authenticate, getOrganisation } from "@/api/index.js";
import { userStore } from '@/services/userStore.js';
import { toastStore } from "@/services/toastStore.js";

import { Modal } from 'bootstrap';



const router = useRouter();

let loginModalInstance = null;
const loginModalRef = ref(null);
const selectedRole = ref(null);
const email = ref('');
const password = ref('');

let hiddenHandler;



function selectRole(role) {
  email.value = '';
  password.value = '';
  selectedRole.value = role;
}

function resetRole() {
  selectedRole.value = null;
  password.value = '';
}

async function login() {
  const role = selectedRole.value;

  try {
    if (!role || !email.value) {
      throw new Error('Ungültige oder unvollständige Angaben');
    }

    const data = await authenticate(
        email.value,
        password.value,
        role
    );

    if (!data) {
      return;
    }

    if (data.role === 'organisation') {
      const org = await getOrganisation(data.id);

      if (!org?.name) {
        new Error('Organisation konnte nicht geladen werden');
      }

      userStore.loginAs(data.role, data.id, data.name, org.name);
    } else {
      userStore.loginAs(data.role, data.id, data.name);
    }


    loginModalInstance?.hide();

    await router.push('/');
  } catch (error) {
    toastStore.addToast(error.message, 'danger');
  }
}



onMounted(() => {
  loginModalInstance = Modal.getOrCreateInstance(loginModalRef.value);

  hiddenHandler = () => {
    selectedRole.value = null;
    email.value = "";
    password.value = "";
  };

  loginModalRef.value.addEventListener("hidden.bs.modal", hiddenHandler);
});

onUnmounted(() => {
  loginModalRef.value?.removeEventListener(
      "hidden.bs.modal",
      hiddenHandler
  );
});
</script>

<template>
  <div class="modal fade" id="loginModal" ref="loginModalRef" tabindex="-1" aria-labelledby="loginModal" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body container">
          <div class="mb-5">
            <h2>Anmelden</h2>
            <p>Freiwilliges Engagement hat in Österreich einen großen Stellenwert.</p>
          </div>
          <transition name="fade" mode="out-in">
            <div v-if="!selectedRole" key="select" class="d-flex justify-content-evenly">
              <button class="btn d-flex flex-column" type="button" @click="selectRole('organisation')">
                <i class="bi bi-people h1"></i>
                <span class="lead text-uppercase pb-1">Organisationen</span>
                Login oder Registrierung für<br>Vertreter:innen von Organisationen
                <span class="text-decoration-underline pt-2">Login</span>
              </button>
              <button class="btn d-flex flex-column" type="button" @click="selectRole('volunteer')">
                <i class="bi bi-person-raised-hand h1"></i>
                <span class="lead text-uppercase pb-1">Freiwillige Privatpersonen</span>
                Login oder Registrierung für<br>freiwillige tätige Privatpersonen
                <span class="text-decoration-underline pt-2">Login</span>
              </button>
            </div>
            <div v-else-if="selectedRole === 'organisation'" key="org">
              <button class="btn mb-3" type="button" @click="resetRole">
                <i class="bi bi-arrow-left"></i> Nutzerrolle auswählen
              </button>
              <form @submit.prevent="login">
                <div class="form-floating">
                  <input v-model="email" type="email" class="form-control" id="inputOrgEmail" placeholder="" autofocus>
                  <label for="inputOrgEmail">E-Mail-Adresse</label>
                </div>
                <div class="form-floating mt-2 mb-3">
                  <input v-model="password" type="password" class="form-control" id="inputOrgPassword" placeholder="">
                  <label for="inputOrgPassword">Password</label>
                </div>
                <div class="text-end">
                  <button type="submit" class="btn btn-primary">Anmelden</button>
                  <div class="form-text">
                    <a class="link-dark link-underline-opacity-0" href="#">Haben Sie Ihr Passwort vergessen?</a>
                  </div>
                </div>
              </form>
            </div>
            <div v-else key="vol">
              <button class="btn mb-3" type="button" @click="resetRole">
                <i class="bi bi-arrow-left"></i> Nutzerrolle auswählen
              </button>
              <form @submit.prevent="login">
              <div class="form-floating">
                <input v-model="email" type="email" class="form-control" id="inputVolEmail" placeholder="" autofocus>
                <label for="inputVolEmail">E-Mail-Adresse</label>
              </div>
              <div class="form-floating mt-2 mb-3">
                <input v-model="password" type="password" class="form-control" id="inputVolPassword" placeholder="">
                <label for="inputVolPassword">Password</label>
              </div>
              <div class="text-end">
                <button type="submit" class="btn btn-primary">Anmelden</button>
                <div class="form-text">
                  <a class="link-dark link-underline-opacity-0" href="#">Haben Sie Ihr Passwort vergessen?</a>
                </div>
              </div>
              </form>
            </div>
          </transition>
        </div>
        <div class="modal-footer flex-column border-0">
          <div class="container rounded text-bg-primary p-3">
            <span class="lead">Gemeinsam jede Situation erfolgreich meistern.</span>
            <p>Freiwilliges Engagement hat in Österreich einen großen Stellenwert.</p>
            <div class="text-end">
              <button class="btn btn-outline-light">Jetzt Registrieren</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>