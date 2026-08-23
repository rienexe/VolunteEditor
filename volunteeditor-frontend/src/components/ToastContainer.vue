<script setup>
import { toastStore } from "@/services/toastStore.js";



async function executeAction(toast) {
  if (!toast.action?.handler) return;

  await toast.action.handler();

  toastStore.removeToast(toast.id);
}
</script>

<template>
  <div
      class="toast-container position-fixed bottom-0 end-0 p-3"
      style="z-index: 9999"
  >
    <div
        v-for="t in toastStore.toasts"
        :key="t.id"
        class="toast align-items-center border-0 mb-3 fade show"
        :class="`text-bg-${t.type}`"
        role="alert"
    >
      <div class="d-flex">
        <div class="toast-body">{{ t.message }}
          <div>
            <button
                v-if="t.action"
                type="button"
                class="btn btn-sm text-dark text-nowrap my-2"
                @click="executeAction(t)"
            >
              {{ t.action.label }}
            </button>
          </div>
        </div>
        <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="toastStore.removeToast(t.id)"
        ></button>
      </div>
    </div>
  </div>
</template>
