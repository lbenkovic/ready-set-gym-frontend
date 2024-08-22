import { defineStore } from "pinia";
import axios from "axios";
import config from "../../config.json";

export const useFriendsStore = defineStore("friendsStore", {
  state: () => ({
    sentRequests: [],
    acceptedRequests: [],
    pendingRequests: [],
  }),
  actions: {
    async fetchRequests() {
      try {
        const [pendingResponse, sentResponse, acceptedResponse] =
          await Promise.all([
            axios.get(`${config.BACKEND_URL}/gym-bros/requests`, {
              withCredentials: true,
            }),
            axios.get(`${config.BACKEND_URL}/gym-bros/sent-requests`, {
              withCredentials: true,
            }),
            axios.get(`${config.BACKEND_URL}/gym-bros`, {
              withCredentials: true,
            }),
          ]);

        this.pendingRequests = pendingResponse.data.data || [];
        this.sentRequests = sentResponse.data.data || [];
        this.acceptedRequests = acceptedResponse.data.data || [];

        console.log("Pending Requests:", this.pendingRequests);
        console.log("Sent Requests:", this.sentRequests);
        console.log("Accepted Requests:", this.acceptedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    },
    async sendFriendRequest(email) {
      try {
        await axios.post(
          `${config.BACKEND_URL}/gym-bros/requests`,
          { email },
          { withCredentials: true }
        );
        await this.fetchRequests();
        console.log("Friend request sent to:", email);
      } catch (error) {
        console.error("Error sending friend request:", error);
      }
    },
    async cancelRequest(email) {
      try {
        await axios.post(
          `${config.BACKEND_URL}/gym-bros/requests/cancel`,
          { email },
          { withCredentials: true }
        );
        await this.fetchRequests();
        console.log("Friend request canceled:", email);
      } catch (error) {
        console.error("Error canceling friend request:", error);
      }
    },
    async acceptRequest(email) {
      try {
        await axios.post(
          `${config.BACKEND_URL}/gym-bros/requests/accept`,
          { email },
          { withCredentials: true }
        );
        await this.fetchRequests();
        console.log("Request accepted:", email);
      } catch (error) {
        console.error("Error accepting request:", error);
      }
    },
    async denyRequest(email) {
      try {
        await axios.post(
          `${config.BACKEND_URL}/gym-bros/requests/deny`,
          { email },
          { withCredentials: true }
        );
        await this.fetchRequests();
        console.log("Request denied:", email);
      } catch (error) {
        console.error("Error denying request:", error);
      }
    },
  },
  getters: {
    isRequestPending: (state) => (email) => state.sentRequests.includes(email),
    isRequestSent: (state) => (email) => state.sentRequests.includes(email),
    isFriend: (state) => (email) => state.acceptedRequests.includes(email),
  },
});
