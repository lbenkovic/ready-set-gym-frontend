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
    <div class="move-plan-container" type="button" @click="movePlan">
      <span>DELETE PLAN</span>
      <span class="material-symbols-outlined">delete</span>
    </div>
  </div>
</template>
<script>
import { useWorkoutPlansCollectionStore } from "@/stores/workoutPlansCollectionStore";
import eventBus from "@/eventBus";

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
  watch: {
    workoutPlan: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const workoutPlanData =
            this.workoutPlansCollectionStore.getUserWorkoutPlanData(newVal);
          console.log("Workout Plan Data:", workoutPlanData); // Log the fetched data
          this.workoutPlanData = workoutPlanData;
        }
      },
    },
  },
  methods: {
    async movePlan() {
      try {
        const response = await this.workoutPlansCollectionStore.deletePlan(
          this.workoutPlanData._id
        );
        if (response.message === "Plan deleted successfully.") {
          eventBus.emit("planMoved", this.workoutPlanData._id);
          this.closeModal(); // Close the modal in this component
          eventBus.emit("closeModal"); // Emit an event to notify the parent component
        } else {
          console.error("Failed to delete plan:", response.message);
        }
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    },
    closeModal() {
      eventBus.emit("closeModal");
    },
  },
  created() {
    eventBus.on("closeModal", () => {
      this.closeModal();
    });
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

.move-plan-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  background-color: #d9534f; /* Red tone */
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
}
.move-plan-container:hover {
  background-color: #c9302c; /* Darker red on hover */
}
</style>
