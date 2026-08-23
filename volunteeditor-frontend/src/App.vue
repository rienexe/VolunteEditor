<script setup>
import AppHeader from "@/components/header/AppHeader.vue";
import AppMobileHeader from "@/components/header/AppMobileHeader.vue";
import PageTitle from "@/components/PageTitle.vue";
import AppFooter from "@/components/footer/AppFooter.vue";
import AppMobileFooter from "@/components/footer/AppMobileFooter.vue";
import ToastContainer from "@/components/ToastContainer.vue";
import LoginModal from "@/components/modals/LoginModal.vue";
</script>

<template>
  <header>
    <AppHeader class="d-none d-sm-block shadow" />
    <AppMobileHeader class="d-sm-none shadow" />
  </header>

  <main>
    <PageTitle class="d-none d-sm-block" />
    <RouterView />
  </main>

  <footer>
    <AppFooter class="d-none d-sm-block" />
    <AppMobileFooter class="d-sm-none" />
  </footer>

  <ToastContainer />
  <LoginModal />
</template>

<style>
main {
  padding-top: 70px;
}

@media (max-width: 575px) {
  main {
    padding-top: 50px;
    padding-bottom: 80px;
  }
}
</style>