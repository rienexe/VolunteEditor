import { reactive } from "vue";



export const toastStore = reactive({
    toasts: [],

    addToast(message, type = "info", duration = 5000, action = null) {
        const id = Date.now();

        this.toasts.push({
            id,
            message,
            type,
            action
        });

        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(id);
            }, duration);
        }

        return id;
    },

    removeToast(id) {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }
});
