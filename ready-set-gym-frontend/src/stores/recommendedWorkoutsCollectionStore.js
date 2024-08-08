import { defineStore } from "pinia";
import config from "../../config.json";
import axios from "axios";

export const useRecommendedWorkoutsCollectionStore = defineStore(
    "recommendedWorkoutsCollectionStore",
    {
        state: () => ({}),
        getters: {},
        actions: {
            async fetchRecommendedWorkoutsByName(workoutPlan) {
                const response = await axios.get(
                    `${config.BACKEND_URL}/recommendedworkouts/${workoutPlan}`
                );
                return response.data;
            },
        },
    }
);
