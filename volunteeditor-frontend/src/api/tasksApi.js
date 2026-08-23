import { apiClient } from "@/api/client.js";



export async function postTask(taskSlug, data) {
    const response = await apiClient.post(`/tasks/${taskSlug}`, data);
    return response.data;
}

export async function getTasks(orgId = null) {
    const url = orgId ? `/tasks/${orgId}` : "/tasks";
    const { data } = await apiClient.get(url);
    return data ?? {};
}

export async function getTask(taskSlug) {
    if (!taskSlug) {
        console.warn("getTask: Kein gültiger taskSlug übergeben.");
        return;
    }

    const { data } = await apiClient.get(`/tasks/${taskSlug}`);
    return data ?? {};
}

export async function patchTaskBlockContent(taskSlug, blockContent) {
    const { data } = await apiClient.patch(`/tasks/${taskSlug}/block-content`, {
        blockContent
    });

    return data;
}

export async function deleteTask(slug) {
    const { data } = await apiClient.delete(`/tasks/${slug}`);
    return data;
}



export async function getTaskSchema(slug) {
    if (!slug) {
        console.warn("getTaskSchema: Kein gültiger slug übergeben.");
        return;
    }

    const { data } = await apiClient.get(`/tasks/schemas/${slug}`);
    return data ?? {};
}

export async function getTaskSchemas(orgId = null) {
    const url = orgId ? `/tasks/schemas/${orgId}` : "/tasks/schemas";

    const { data } = await apiClient.get(url);
    return data ?? {};
}

export async function postTaskSchema(slug, data) {
    const response = await apiClient.post(`/tasks/schemas/${slug}`, data);
    return response.data;
}

export async function deleteTaskSchema(slug) {
    const { data } = await apiClient.delete(`/tasks/schemas/${slug}`);
    return data;
}