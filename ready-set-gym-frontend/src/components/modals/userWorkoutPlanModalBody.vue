<template>
    <div class="container" v-if="workoutPlanData">
        <div class="image-container">
            <img
                class="heading-img"
                :src="workoutPlanData.titleImagePath"
                alt="Workout Image"
            />
        </div>
        <h1 style="color: #d29433">{{ workoutPlanData.planName }}</h1>
        <div v-if="workoutPlanData.exercisesArray" class="exercise-container">
            <div
                v-for="exercise in workoutPlanData.exercisesArray"
                :key="exercise"
                class="exercise-card"
            >
                <img :src="exercise.img_url" alt="Exercise Image" />
                <h4>{{ exercise.title }}</h4>
            </div>
        </div>
    </div>
</template>
<script>
import { useWorkoutPlansCollectionStore } from "@/stores/workoutPlansCollectionStore";

export default {
    name: "userWorkoutPlanModalBody",
    data() {
        return {
            workoutPlanData: null,
        };
    },
    props: {
        workoutPlan: {
            type: String,
            required: true,
        },
    },
    setup() {
        const workoutPlansCollectionStore = useWorkoutPlansCollectionStore();
        return { workoutPlansCollectionStore };
    },
    created() {
        if (this.workoutPlan) {
            this.workoutPlanData =
                this.workoutPlansCollectionStore.getUserWorkoutPlanData(
                    this.workoutPlan
                );
        }
    },
};
</script>
<style scoped>
.container h1 {
    text-align: center;
    margin-bottom: 20px;
}
.exercise-container {
    align-items: center;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}
.exercise-card {
    margin-top: 2vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 350px;
}

.exercise-container img {
    max-width: 200px;
    height: auto;
    margin-right: 20px;
}

.exercise-container h2 {
    text-align: center;
    margin: 0;
}

.image-container {
    text-align: center;
}
.heading-img {
    width: 50%;
    max-height: 400px;
    object-fit: cover;
}
</style>
