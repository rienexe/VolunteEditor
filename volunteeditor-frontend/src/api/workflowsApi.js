import { apiClient } from "@/api/client.js";



export async function postWorkflow(workflowSlug, data) {
    const response = await apiClient.post(`/workflows/${workflowSlug}`, data);
    return response.data;
}

export async function getWorkflows(orgId = null) {
    const url = orgId ? `/workflows/${orgId}` : "/workflows";

    try {
        const { data } = await apiClient.get(url);
        return data ?? {};
    } catch (error) {
        console.warn("Workflows konnten nicht geladen werden:", error);
        return {};
    }
}

export async function getWorkflow(workflowSlug) {
    if (!workflowSlug) {
        console.warn("getWorkflow: Kein gültiger workflowSlug übergeben.");
        return;
    }

    const { data } = await apiClient.get(`/workflows/${workflowSlug}`);
    return data;
}

export async function deleteWorkflow(workflowSlug) {
    const { data } = await apiClient.delete(`/workflows/${workflowSlug}`);
    return data;
}


export async function postTaskToWorkflow(updates) {
    const { data } = await apiClient.post("/tasks/update-workflow-slugs", { updates });
    return data;
}



export async function postVolunteersToTask(taskSlug, volunteers) {
    const { data } = await apiClient.post(`/tasks/${taskSlug}/volunteers`, { volunteers });
    return data;
}

export async function deleteVolunteersOfTask(taskSlug, volunteers) {
    const { data } = await apiClient.delete(`/tasks/${taskSlug}/volunteers`, {
        data: { volunteers }
    });

    return data;
}