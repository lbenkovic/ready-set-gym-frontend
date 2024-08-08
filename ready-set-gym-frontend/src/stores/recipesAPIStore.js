import { defineStore } from "pinia";
import config from "../../config.json";

export const useRecipesAPIStore = defineStore("recipesAPIStore", {
    state: () => ({}),
    getters: {},
    actions: {
        async fetchRecipeData() {
            const res = await fetch(config.RECIPES_API_URL).then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            });
            return res.meals;
        },
    },
});
