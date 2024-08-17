<template>
  <div class="heading">
    <img class="heading-img" src="@/assets/logorsg.jpg" alt="Logo" />
    <button class="logout-button">
      <span class="material-symbols-outlined logout" @click="logout">
        power_settings_new
      </span>
    </button>
  </div>
  <div class="main">
    <div class="my-profile">
      <h1>My Profile</h1>
    </div>

    <div class="user-profile-img">
      <span
        class="material-symbols-outlined profile-pic"
        :style="{
          backgroundImage: userImage
            ? 'url(' + userImage + ')'
            : 'url(' + require('@/assets/profile.jpg') + ')',
        }"
        @click="openModal('edit-profile-picture')"
      >
      </span>
      <h2 style="margin-top: 20px" @click="openModal('edit-profile-data')">
        {{ userFullName }}
      </h2>
    </div>

    <!-- Display Diaries -->
    <div class="my-diaries">
      <h2 class="my-diaries-text">My Diaries</h2>
      <div v-if="diaries.length > 0">
        <div v-for="(diary, index) in diaries" :key="index" class="diary-entry">
          <div class="diary-date">{{ formatDate(diary.date) }}</div>
          <div class="diary-content">{{ diary.content }}</div>
          <button @click="deleteDiaryEntry(diary._id)" class="delete-btn">
            Delete
          </button>
        </div>
      </div>
      <div v-else>
        <p>No diary entries found.</p>
      </div>
    </div>

    <!-- Carousel for Saved Recipes -->
    <div class="saved-recipes-carousel">
      <h2>Your Saved Recipes</h2>
    </div>
    <div v-if="recipes.length > 0" class="carousel-container">
      <div id="recipeCarousel" class="carousel slide carousel-custom">
        <div class="carousel-indicators">
          <button
            v-for="(recipe, index) in recipes"
            :key="'indicator-' + index"
            type="button"
            :data-bs-target="'#recipeCarousel'"
            :data-bs-slide-to="index"
            :class="{ active: index === 0 }"
            :aria-current="index === 0 ? 'true' : 'false'"
            :aria-label="'Slide ' + (index + 1)"
          ></button>
        </div>
        <div class="carousel-inner">
          <div
            v-for="(recipe, index) in recipes"
            :key="'item-' + index"
            :class="['carousel-item', { active: index === 0 }]"
            @click="showRecipeDetails('recipe-detail-modal', recipe)"
          >
            <img
              :src="recipe.recipe.strMealThumb"
              class="d-block w-100"
              :alt="recipe.recipe.strMeal"
            />
            <div class="carousel-caption d-none d-md-block">
              <h5>{{ recipe.recipe.strMeal }}</h5>
            </div>
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#recipeCarousel"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#recipeCarousel"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>

    <mainModal :active-modal="activeModal" :key="activeModal" />
    <recipeDetailModal :activeModal="activeModal" />

    <!-- Toast for success message -->
    <div v-if="successMessage" class="toast">
      {{ successMessage }}
    </div>
    <confirmation-modal
      :isVisible="isModalVisible"
      message="Really log out?"
      @confirm="handleLogout"
      @cancel="closeModal"
      @close="closeModal"
    />
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import mainModal from "@/views/modalBody.vue";
import { useUserDiaryCollectionStore } from "@/stores/userDiaryCollectionStore";
import { useUsersCollectionStore } from "@/stores/usersCollectionStore";
import { onMounted, ref, watch, nextTick } from "vue";
import confirmationModal from "@/components/modals/confirmationModal.vue";
import { useRecipesAPIStore } from "@/stores/recipesAPIStore";
import bootstrap from "bootstrap";
import recipeDetailModal from "@/components/modals/recipeDetailModal.vue";

export default {
  name: "profileComponent",
  components: {
    mainModal,
    confirmationModal,
    recipeDetailModal,
  },
  data() {
    return {
      activeModal: false,
      userFullName: "",
      diaries: [],
      userImage: "",
      successMessage: "",
      isModalVisible: false,
    };
  },
  setup() {
    const userDiaryCollectionStore = useUserDiaryCollectionStore();
    const usersCollectionStore = useUsersCollectionStore();
    const recipesAPIStore = useRecipesAPIStore();
    const successMessage = ref("");
    const userImage = ref("");
    const diaries = ref([]);
    const recipesAPI = useRecipesAPIStore();
    const recipes = ref([]);

    const fetchUserProfile = async () => {
      const response = await usersCollectionStore.getUserProfile();
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.user
      ) {
        userImage.value = response.data.data.user.imagePath || "";
      }
    };
    // Slušanje događaja za ažuriranje slike
    eventBus.on("updateUserImage", (newImagePath) => {
      userImage.value = newImagePath;
    });

    const fetchUserDiaries = async () => {
      const diariesResponse = await userDiaryCollectionStore.getUserDiary();
      if (diariesResponse) {
        diaries.value = diariesResponse; // Setujemo diaries sa reaktivnim ref
      }
    };
    const fetchUserRecipes = async () => {
      try {
        const response = await recipesAPI.fetchUsersRecipes();
        console.log(response); // Log the response to see its structure
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.recipes
        ) {
          recipes.value = response.data.data.recipes.map((recipe) => {
            // Ensure recipe.recipe is a string before parsing
            const recipeData =
              typeof recipe.recipe === "string"
                ? JSON.parse(recipe.recipe)
                : recipe.recipe;
            return {
              ...recipe,
              recipe: recipeData,
            };
          });
        }
      } catch (error) {
        console.error("Error fetching user recipes:", error);
      }
    };

    onMounted(() => {
      fetchUserProfile();
      fetchUserDiaries();
      fetchUserRecipes();
    });

    // Slušanje događaja za ažuriranje slike
    eventBus.on("updateUserImage", (newImagePath) => {
      userImage.value = newImagePath;
    });

    const deleteDiaryEntry = async (diaryId) => {
      const res = await userDiaryCollectionStore.deleteDiaryEntry(diaryId);
      if (res) {
        diaries.value = diaries.value.filter((diary) => diary._id !== diaryId);
        successMessage.value = "Diary entry deleted successfully!";
        setTimeout(() => {
          successMessage.value = "";
        }, 1500);
      }
    };

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return {
      userDiaryCollectionStore,
      usersCollectionStore,
      userImage,
      diaries,
      deleteDiaryEntry,
      formatDate,
      successMessage,
      recipes,
    };
  },
  methods: {
    async getUserDiary() {
      const res = await this.userDiaryCollectionStore.getUserDiary();
      // console.log(res);
    },
    async getUserProfile() {
      const res = await this.usersCollectionStore.getUserProfile();
      if (res && res.data && res.data.data && res.data.data.user) {
        this.userFullName = `${res.data.data.user.firstName} ${res.data.data.user.lastName}`;
        this.userImage = res.data.data.user.imagePath;
      }
    },
    fetchNewUserData() {
      eventBus.on("success", async () => {
        await this.getUserProfile();
        await this.getUserDiary();
      });
    },
    async openModal(modalType) {
      this.activeModal = true;
      eventBus.emit("openModal", { modalType });
    },
    async openModal(modalType) {
      this.activeModal = true;
      eventBus.emit("openModal", { modalType });
    },

    async getUserProfile() {
      const res = await this.usersCollectionStore.getUserProfile();
      if (res && res.data && res.data.data && res.data.data.user) {
        this.userFullName = `${res.data.data.user.firstName} ${res.data.data.user.lastName}`;
        this.userImage = res.data.data.user.imagePath;
      }
    },
    fetchNewUserData() {
      eventBus.on("success", async () => {
        await this.getUserProfile();
        await this.getUserDiary();
      });
    },
    async logout() {
      this.isModalVisible = true; // Show the custom confirmation modal
    },
    handleLogout() {
      this.isModalVisible = false;
      this.usersCollectionStore.logoutUser().then(() => {
        this.$router.push({ name: "login" });
      });
    },
    closeModal() {
      this.isModalVisible = false;
    },
    showRecipeDetails(modalType, recipe) {
      this.activeModal = true;
      eventBus.emit("openRecipeModal", { recipe });
    },
  },
  created() {
    eventBus.on("closeModal", (data) => {
      if (data.closeModal) this.activeModal = false;
    });
    eventBus.on("recipeMoved", (recipeId) => {
      this.recipes = this.recipes.filter((recipe) => recipe._id !== recipeId);
    });
    this.getUserProfile();
    this.getUserDiary();
    eventBus.on("updateUserImage", async (newImagePath) => {
      console.log("Received new image path:", newImagePath);
      this.userImage = newImagePath;
      this.successMessage = "Profile picture updated successfully!";
      setTimeout(() => {
        this.successMessage = "";
      }, 1500);
    });
    eventBus.on("openRecipeModal", (data) => {
      console.log("Received recipe data:", data.recipe); // Verify data
      this.recipe = data.recipe;
      this.activeModal = true;
    });
  },
};
</script>
<style scoped>
.mdi-chevron-right,
.mdi-chevron-left {
  color: black;
}
.logout-button {
  border-radius: 100%;
  background-color: black;
  border: none;
}
.heading {
  margin: 0;
  padding: 1vw 5vw 0 2vw;
  height: 7vh;
  background-color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.heading-img {
  height: 7vh;
  width: auto;
}
.logout {
  color: red;
  scale: 1.5;
}
.page-name,
.my-diaries,
.my-profile {
  width: 100%;
  padding-left: 2.25vw;
  padding-top: 1vw;
}
.profile-pic {
  font-size: 200px;
}
.user-profile-img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.my-diaries-text {
  color: #d29433;
}
.card-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card {
  width: 25vw;
  height: 15vh;
  background-color: white;
  padding: 1vw 2vw 1vw 2vw;
}
.card-heading {
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.delete {
  color: red;
}
.class-heading-text {
  display: inline;
}
.card-text {
  font-size: 0.8rem;
  color: black;
}
.card-content {
  width: 100%;
  margin-top: 1vw;
}
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
}

.profile-pic {
  display: inline-block;
  width: 200px;
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}
.my-diaries {
  margin-top: 100px;
  padding: 0 10vx;
  text-align: center;
}

.diary-entry {
  background-color: #d29433;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.diary-date {
  font-weight: bold;
  margin-bottom: 8px;
}

.diary-content {
  margin-bottom: 12px;
}

.delete-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #ff0000;
}
.carousel-container {
  display: flex;
  justify-content: center; /* Center the carousel container horizontally */
  margin-top: 20px;
}

.carousel {
  max-width: 300px; /* Set the max-width to match the homepage carousel */
  margin: 0 auto; /* Center the carousel within the container */
}

.carousel-item {
  object-fit: cover;
  width: 100%; /* Ensure the image fills the container */
  height: auto; /* Maintain aspect ratio */
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
  background: rgba(
    0,
    0,
    0,
    0.5
  ); /* Add a semi-transparent background for better readability */
  border-radius: 8px; /* Optional: Add some border radius to the caption background */
}

.carousel-control-prev,
.carousel-control-next {
  filter: invert(1); /* Optional: Adjust the color of the carousel controls */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #000; /* Optional: Adjust the background color of the icons */
  border-radius: 50%; /* Optional: Make the background of the icons circular */
}
.saved-recipes-carousel {
  margin-top: 20px;
  text-align: center;
}
</style>
