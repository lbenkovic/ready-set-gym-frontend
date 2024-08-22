<template>
  <div class="container">
    <form @submit.prevent="uploadToStorage">
      <h2 class="naslov">CREATE NEW WORKOUT PLAN</h2>
      <div class="input-fields">
        <input
          type="file"
          @change="handleImageSelect"
          class="form-control plan-image"
          accept="image/*"
          required
        />
        <input
          class="form-control plan-name"
          type="text"
          placeholder="Naziv plana"
          v-model="workoutPlanName"
          required
        />
      </div>
      <div class="exercises">
        <div class="exercises-list">
          <div
            class="form-check form-check-inline"
            v-for="data in firstHalfExercises"
            :key="data"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :value="data"
              v-model="data.selected"
              @click="handleSelect(data)"
            />

            <label
              ><img :src="data.img_url" width="50" height="50" /> &nbsp;
              {{ data.title }}</label
            >
          </div>
        </div>
        <div class="exercises-list">
          <div
            class="form-check form-check-inline"
            v-for="data in secondHalfExercises"
            :key="data"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :value="data"
              v-model="data.selected"
              @click="handleSelect(data)"
            />

            <label
              ><img :src="data.img_url" width="50" height="50" />&nbsp;
              {{ data.title }}</label
            >
          </div>
        </div>
      </div>
      <div class="submit">
        <button type="submit" class="btn btn-success btn-save" v-if="!loading">
          Save Changes
        </button>
        <span
          v-else
          class="spinner-border spinner-border-lg"
          role="status"
          aria-hidden="true"
        ></span>
      </div>
    </form>
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import { useWorkoutPlansCollectionStore } from "@/stores/workoutPlansCollectionStore";
import { useExerciseLiseCollectionStore } from "@/stores/exerciseListCollectionStore";
import { ref } from "vue";
import { inject } from "vue";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default {
  name: "addNewWorkoutPlanModalBody",
  data() {
    return {
      selectedImage: [],
      exercises: null,
      firstHalfExercises: [],
      secondHalfExercises: [],
    };
  },
  setup() {
    const storage = inject("firebaseStorage");
    const file = ref(null);
    const loading = ref(false);
    const workoutPlansCollectionStore = useWorkoutPlansCollectionStore();
    const exerciseListCollectionStore = useExerciseLiseCollectionStore();
    const workoutPlanName = ref("");
    const selectedExercises = ref([]);

    const handleImageSelect = (event) => {
      file.value = event.target.files[0];
    };

    const uploadToStorage = async () => {
      if (!file.value) return;

      loading.value = true;

      const imageRef = storageRef(
        storage,
        `workoutTitleImages/${file.value.name}`
      );

      try {
        await uploadBytes(imageRef, file.value);
        const imageUrl = await getDownloadURL(imageRef);
        await saveNewWorkoutPlan(imageUrl);
      } catch (error) {
        console.error("Error during upload:", error);
      } finally {
        loading.value = false;
      }
    };

    const saveNewWorkoutPlan = async (imageUrl) => {
      try {
        const email = localStorage.getItem("userEmail");
        const formData = {
          email: email,
          name: workoutPlanName.value,
          exercises: selectedExercises.value,
          imageUrl: imageUrl,
        };
        const res = await workoutPlansCollectionStore.saveNewUserWorkoutPlan(
          formData
        );
        console.log("Response:", res);
        if (res.status === 201) {
          eventBus.emit("success", "Workout plan added successfully!");
          eventBus.emit("closeModal", { closeModal: true });
        } else {
          console.error("Failed to save workout plan:", res);
        }
      } catch (error) {
        console.error("Error during saveNewWorkoutPlan:", error);
      }
    };

    return {
      file,
      loading,
      workoutPlansCollectionStore,
      exerciseListCollectionStore,
      handleImageSelect,
      uploadToStorage,
      selectedExercises,
      workoutPlanName,
    };
  },
  async created() {
    await this.getExercises();
  },
  methods: {
    handleSelect(data) {
      if (!this.selectedExercises) {
        this.selectedExercises = [];
      }

      if (
        !this.selectedExercises.some((exercise) => exercise._id === data._id)
      ) {
        this.selectedExercises.push({
          _id: data._id,
          title: data.title,
          img_url: data.img_url,
          selected: true,
        });
      } else {
        this.selectedExercises = this.selectedExercises.filter(
          (exercise) => exercise._id !== data._id
        );
      }
    },
    async getExercises() {
      try {
        const res = await this.exerciseListCollectionStore.getExercises();
        this.exercises = res.data;
        for (let index = 0; index < this.exercises.length; index++) {
          if (index < 10) {
            this.firstHalfExercises.push(this.exercises[index]);
            this.firstHalfExercises.forEach((x) => {
              x.selected = false;
            });
          } else {
            this.secondHalfExercises.push(this.exercises[index]);
            this.secondHalfExercises.forEach((x) => {
              x.selected = false;
            });
          }
        }
      } catch (error) {
        console.error("Error fetching recommended workout data:", error);
      }
    },
    closeModal() {
      this.workoutPlanName = "";
      this.selectedImage = [];
      this.selectedExercises = [];
      this.firstHalfExercises.forEach((x) => {
        x.selected = false;
      });
      this.secondHalfExercises.forEach((x) => {
        x.selected = false;
      });
      const closeModalData = {
        closeModal: true,
      };
      eventBus.emit("closeModal", closeModalData);
    },
  },
};
</script>

<style scoped>
.input-fields {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vw;
}
.plan-image,
.plan-name {
  background-color: white;
}
.spinner-border {
  color: #d29433;
}
.container {
  width: 600px;
  overflow: auto;
}
.btn-save {
  border-radius: 20px;
  width: 300px;
  margin-top: 3vw;
  border: none;
}
.submit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.naslov {
  color: #d29433;
  text-align: center;
  margin-bottom: 5vw;
}
.exercises {
  display: flex;
  margin-top: 2vh;
  justify-content: space-evenly;
}
.exercises-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
