import { defineStore } from "pinia";
import config from "../../config.json";

import axios from "axios";

export const useUsersCollectionStore = defineStore("usersCollectionStore", {
  state: () => ({
    searchResults: [],
    searchLoading: false,
  }),
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
          `${config.BACKEND_URL}/auth/login`,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
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
          `${config.BACKEND_URL}/auth/logout`,
          {},
          { withCredentials: true }
        );
      } catch (error) {
        console.error(error.response.data);
      }
    },
    async registerUser(firstName, lastName, email, password) {
      try {
        const response = await axios.post(`${config.BACKEND_URL}/auth/signup`, {
          firstName,
          lastName,
          email,
          password,
        });
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
    async searchUsers(query) {
      this.searchLoading = true;
      try {
        const response = await axios.get(
          `${config.BACKEND_URL}/user/${query}`,
          {
            withCredentials: true,
          }
        );
        this.searchResults = response.data.data.users;
        this.searchLoading = false;
      } catch (error) {
        console.error(error.response.data);
        this.searchLoading = false;
      }
    },
  },
});
