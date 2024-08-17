<template>
  <div class="home-page">
    <div class="heading">
      <img class="heading-img" src="@/assets/logorsg.jpg" alt="Logo" />
    </div>
    <div class="main">
      <div class="header">
        <h1>Let's crush it!</h1>
      </div>
      <div class="container mt-3">
        <div class="search-container">
          <span class="search-icon">&#128269;</span>
          <input
            class="form-control search-bar"
            placeholder="Search"
            v-model="searchText"
          />
        </div>
      </div>
      <div class="recommended-workout">
        <h1>RECOMMENDED WORKOUTS</h1>
      </div>

      <div id="carouselExampleCaptions" class="carousel slide carousel-custom">
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div class="carousel-inner">
          <div
            class="carousel-item active"
            @click="openModalEvent('recommended-workout-plan', 'crossFit')"
          >
            <img
              src="@/assets/crossfit.jpg"
              class="d-block w-100"
              alt="Crossfit"
            />
            <div class="carousel-caption d-none d-md-block">
              <h1>CROSSFIT</h1>
              <p>
                Transform your body, push your limits, and gain strength with
                CrossFit! Every day is a new chance to progress, no matter your
                level.
              </p>
            </div>
          </div>
          <div
            class="carousel-item"
            @click="openModalEvent('recommended-workout-plan', 'lowerBody')"
          >
            <img
              src="@/assets/lower-body.jpg"
              class="d-block w-100"
              alt="Lower Body"
            />
            <div class="carousel-caption d-none d-md-block">
              <h1>LOWER BODY ATTACK</h1>
              <p>
                Unleash the power in your legs with Lower Body Attack! Sculpt
                and strengthen your lower body with dynamic, challenging
                exercises.
              </p>
            </div>
          </div>
          <div
            class="carousel-item"
            @click="openModalEvent('recommended-workout-plan', 'upperBody')"
          >
            <img
              src="@/assets/upper-body.jpg"
              class="d-block w-100"
              alt="Upper Body"
            />
            <div class="carousel-caption d-none d-md-block">
              <h1>UPPER BODY ATTACK</h1>
              <p>
                Get your upper body in top shape with Upper Body Attack! Focus
                on arms, shoulders, and chest with a challenging workout that
                delivers impressive gains.
              </p>
            </div>
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
    <div class="my-workout" v-if="searchText === ''">
      <span class="my-workouts-span">CREATE YOUR OWN WORKOUT</span>
      &nbsp;&nbsp;&nbsp;
      <span
        class="material-symbols-outlined add-new-button"
        type="button"
        @click="openModalEvent('add-new-workout-plan')"
      >
        add_box
      </span>
    </div>
    <div
      id="carouselExampleIndicators"
      class="carousel slide carousel-custom-my-workout"
    >
      <div class="carousel-inner">
        <div
          class="carousel-item"
          :class="{ active: index === 0 }"
          v-for="(plan, index) in userWorkouts"
          :key="plan._id"
          @click="openModalEvent('user-workout-plan', plan._id), openModal()"
        >
          <img
            class="d-block w-100 carousel-image"
            :src="plan.titleImagePath"
            :alt="plan.planName"
          />
          <div class="carousel-caption-my-workout d-none d-md-block">
            <h5>{{ plan.planName }}</h5>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <mainModal
      :active-modal="activeModal"
      :modal-type="modalType"
      :workout-plan="currentWorkoutPlan"
    />
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import mainModal from "@/views/modalBody.vue";

import { useExerciseLiseCollectionStore } from "@/stores/exerciseListCollectionStore";
import { useWorkoutPlansCollectionStore } from "@/stores/workoutPlansCollectionStore";

export default {
  name: "homePageComponent",
  data() {
    return {
      activeModal: false,
      currentWorkoutPlan: "", // Variable to keep track of the current workout plan
      modalType: "recommended-workout-plan",
      searchText: "",
      userWorkouts: [],
    };
  },
  components: {
    mainModal,
  },
  setup() {
    const exerciseListCollectionStore = useExerciseLiseCollectionStore();
    const workoutPlansCollectionStore = useWorkoutPlansCollectionStore();
    return { exerciseListCollectionStore, workoutPlansCollectionStore };
  },
  async created() {
    await this.workoutPlansCollectionStore.fetchUserWorkouts();
    this.fetchExerciseList();
    this.fetchUserWorkouts();
    this.fetchNewUserWorkouts();
    eventBus.on("closeModal", (closeModalData) => {
      if (closeModalData.closeModal) {
        console.log("Closing modal..."); // Debug output
        this.activeModal = false;
        console.log("Modal status:", this.activeModal); // Should be false
      }
    });
  },
  methods: {
    openModalEvent(modalType, workoutPlan) {
      console.log("Opening modal for workout plan ID:", workoutPlan);
      this.modalType = modalType;
      this.currentWorkoutPlan = workoutPlan;
      this.activeModal = true;
      eventBus.emit("openModal", {
        modalType: modalType,
        workoutPlan: workoutPlan,
      });
    },
    openModal() {
      this.activeModal = !this.activeModal;
    },
    fetchUserWorkouts() {
      this.userWorkouts = this.workoutPlansCollectionStore.getAllUserWorkouts;
      console.log("User Workouts:", this.userWorkouts);
    },
    fetchNewUserWorkouts() {
      eventBus.on("success", async () => {
        await this.workoutPlansCollectionStore.fetchUserWorkouts();
        this.fetchUserWorkouts();
      });
    },
    async fetchExerciseList() {
      const res = await this.exerciseListCollectionStore.getExercises();
      this.exerciseList = res.data;
    },
  },
};
</script>

<style scoped>
.home-page {
  position: relative;
  height: 100%;
}

.carousel-item:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.heading {
  display: flex;
  align-items: center;
  padding: 1vw 5vw 0 2vw;
  height: 7vh;
  background-color: #000;
}
.heading-img {
  max-height: 80%;
  max-width: 250px;
  height: 10vh;
  width: auto;
}
.header {
  padding-top: 5px;
  padding-left: 20px;
  color: #d29433;
}
.search-bar {
  background-color: #9a9494;
  color: black;
  text-align: center;
}
.form-control {
  border-radius: 50px;
}
.search-container {
  position: relative;
}
.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
  font-size: 24px;
}
.recommended-workout {
  margin: 20px;
  color: white;
}
.carousel-custom {
  max-width: 800px;
  margin: 0 auto;
}
.carousel-item img {
  object-fit: cover;
  width: 100%;
  height: auto;
}
.carousel-caption {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: #fff;
  text-align: center;
  width: 100%;
  padding: 10px;
}
.my-workout {
  padding-top: 30px;
}
.my-workouts-span {
  padding-top: 50px;
  margin: 20px;
  color: white;
  font-size: 2.5rem;
  font-weight: 500;
}

.add-new-button {
  scale: 1.7;
  color: #d29433;
}

.carousel-custom-my-workout {
  max-width: 300px;
  margin: 0 auto;
}

.carousel-caption-my-workout {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: #fff;
  text-align: center;
  width: 100%;
  padding: 10px;
  background: rgba(
    0,
    0,
    0,
    0.5
  ); /* Semi-transparent background for readability */
  border-radius: 8px; /* Add border radius for rounded corners */
}
</style>
