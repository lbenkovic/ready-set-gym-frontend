import { defineStore } from "pinia";
import config from "../../config.json";

import axios from "axios";
import { withDirectives } from "vue";

export const useUsersCollectionStore = defineStore("usersCollectionStore", {
    state: () => ({}),
    actions: {
        async updateUserProfilePicture(formData) {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.patch(
                    `${config.BACKEND_URL}/user`,
                    formData,
                    {
                        withCredentials: true,
                    }
                );
                return response;
            } catch (error) {
                console.error(error.response.data);
            }
        },
        async updateUserData(formData) {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.patch(
                    `${config.BACKEND_URL}/user`,
                    formData,
                    {
                        withCredentials: true,
                    }
                );
                console.log("RESPONSE", response);
                return response;
            } catch (error) {
                console.error(error.response.data);
            }
        },
        async fetchUserData(email, password) {
            try {
                const response = await axios.post(
                    `${config.BACKEND_URL}/login`,
                    {
                        email,
                        password,
                    },
                    { withCredentials: true }
                );
                console.log("LOGIN:", response);
                const token = response.data.data.token;
                localStorage.setItem("token", token);
                return response;
            } catch (error) {
                console.error(error.response.data);
            }
        },
        async logoutUser() {
            try {
                await axios.post(
                    `${config.BACKEND_URL}/logout`,
                    {},
                    { withCredentials: true }
                );
            } catch (error) {
                console.error(error.response.data);
            }
        },
        async registerUser(firstName, lastName, email, password) {
            try {
                const response = await axios.post(
                    `${config.BACKEND_URL}/users`,
                    {
                        firstName,
                        lastName,
                        email,
                        password,
                    }
                );
                return response;
            } catch (error) {
                console.error(error.response.data);
            }
        },
        async getUserProfile() {
            try {
                const response = await axios.get(`${config.BACKEND_URL}/user`, {
                    withCredentials: true,
                });
                const data = response;
                return data;
            } catch (error) {
                console.error(error);
            }
        },
    },
});
