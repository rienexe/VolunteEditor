import { toastStore, userStore } from "@/services";
import { postVolunteersToTask, deleteVolunteersOfTask } from "@/api/index.js";



export const workflowActions = {
    notification: async (data, context) => {
        if (data.recipient !== userStore.role) {
            return;
        }

        toastStore.addToast(
            data.message ??
            `Neue Nachricht von ${context.org?.name ?? 'Organisation'} erhalten`
        );
    },
    dataRequest: async (data, context) => {
        toastStore.addToast(`${context.org?.name ?? 'Organisation'} bittet dich ein Formular auszufüllen`);
    },
    condition: async (data, context) => {
        // toastStore.addToast(`Workflow Entscheidung: ${data?.decision ?? "Entscheidung ausstehend"}`);
    },
    signupVolunteer: async (data, context) => {
        switch (data?.action) {
            case 'signup':
                await postVolunteersToTask(context.taskId, [context.volunteerId]);
                toastStore.addToast(`Erfolgreich angemeldet für: ${context.taskTitle}`, "success");
                break;
            case 'reject':
                await deleteVolunteersOfTask(context.taskId, [context.volunteerId]);
                break;
            default:
                console.warn(`Unbekannte Aktion für signupVolunteer: ${data?.action}`);
        }
    }
}
