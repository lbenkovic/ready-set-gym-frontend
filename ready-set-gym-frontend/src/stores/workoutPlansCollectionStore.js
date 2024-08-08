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
                const workoutPlanData = state.userWorkouts.filter((plan) => {
                    return plan._id === id;
                });
                return workoutPlanData[0];
            },
        },
        actions: {
            async saveNewUserWorkoutPlan(formData) {
                const token = localStorage.getItem("token");
                const response = await axios.post(
                    `${config.BACKEND_URL}/workout-plan`,
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
            async fetchUserWorkouts() {
                const email = localStorage.getItem("userEmail");
                const response = await axios.get(
                    `${config.BACKEND_URL}/workout-plan/${email}`
                );
                this.userWorkouts = response.data;
            },
        },
    }
);
