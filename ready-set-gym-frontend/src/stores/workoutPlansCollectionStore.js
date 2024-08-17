import { defineStore } from "pinia";
import config from "../../config.json";
import axios from "axios";

export const useWorkoutPlansCollectionStore = defineStore(
  "workoutPlansCollectionStore",
  {
    state: () => ({
      userWorkouts: [],
    }),
    getters: {
      getAllUserWorkouts: (state) => state.userWorkouts,
      getUserWorkoutPlanData: (state) => (id) => {
        return Array.isArray(state.userWorkouts)
          ? state.userWorkouts.find((plan) => plan._id.toString() === id)
          : null; // Ensure userWorkouts is an array
      },
    },
    actions: {
      async saveNewUserWorkoutPlan(formData) {
        // const token = localStorage.getItem("token");
        const response = await axios.post(
          `${config.BACKEND_URL}/workout-plan`,
          formData,
          { withCredentials: true }
        );
        return response;
      },
      async fetchUserWorkouts() {
        //const email = localStorage.getItem("userEmail");
        const response = await axios.get(`${config.BACKEND_URL}/workout-plan`, {
          withCredentials: true,
        });
        this.userWorkouts = response.data.data.workoutPlans;
      },
    },
  }
);
