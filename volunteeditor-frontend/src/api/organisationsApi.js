import { apiClient } from "@/api/client.js";



export async function postOrganisation(orgId, orgData) {
    const { data } = await apiClient.post(`/organisations/${orgId}`, orgData);
    return data;
}

export async function getOrganisations(withTaskCount = false) {
    const { data } = await apiClient.get("/organisations", { params: { withTaskCount } });
    return data;
}

export async function getOrganisation(identifier) {
    const { data } = await apiClient.get(`/organisations/${identifier}`);
    return data;
}



// Organisation Profiles
export async function postOrganisationProfile(orgId, blockContent) {
    const { data } = await apiClient.post(`/organisations/profiles/${orgId}`, blockContent);
    return data;
}

export async function getOrganisationProfile(identifier) {
    const { data } = await apiClient.get(`/organisations/profiles/${identifier}`);
    return data;
}