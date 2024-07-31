import { defineStore } from "pinia";
import config from "../../config.json";
import axios from "axios";

export const useUsersCollectionStore = defineStore("usersCollectionStore", {
  state: () => ({}),
  getters: {},
  actions: {
    async updateUserProfilePicture(formData) {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${config.BACKEND_URL}/user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    },
    async updateUserData(formData) {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${config.BACKEND_URL}/user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    },
    async fetchUserData(email, password) {
      const response = await axios.post(`${config.BACKEND_URL}/auth`, {
        email: email,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      return response;
    },
    async registerUser(firstName, lastName, email, password) {
      try {
        const response = await axios.post(`${config.BACKEND_URL}/users`, {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        });
        return response;
      } catch (error) {
        console.error(error.response.data);
      }
    },
    async getUserProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${config.BACKEND_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response;
      } catch (error) {
        console.error(error.response.data);
      }
    },
  },
});
