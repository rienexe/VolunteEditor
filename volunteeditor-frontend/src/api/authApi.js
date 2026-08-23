import { apiClient } from "@/api/client.js";



export async function authenticate(email, password, role) {
    const { data } = await apiClient.post("/auth/login", {
        email,
        password,
        role
    });

    return data;
}