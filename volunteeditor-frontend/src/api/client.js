import axios from "axios";



export const apiClient = axios.create({
    baseURL: "http://localhost:3000/api"
});



apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    return Promise.reject(
                        new Error(error.response.data.message ?? "Ungültige Anfrage.")
                    );
                case 401:
                    return Promise.reject(
                        new Error("Nicht angemeldet.")
                    );
                case 403:
                    return Promise.reject(
                        new Error("Keine Berechtigung.")
                    );
                case 404:
                    return Promise.reject(new Error("Nicht gefunden."));
                default:
                    return Promise.reject(
                        new Error(
                            error.response.data.message ??
                            "Unbekannter Fehler."
                        )
                    );
            }
        }

        return Promise.reject(
            new Error("Server nicht erreichbar.")
        );
    }
);