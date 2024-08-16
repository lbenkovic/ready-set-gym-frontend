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

    <mainModal :active-modal="activeModal" :key="activeModal" />

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
import { onMounted, ref } from "vue";
import confirmationModal from "@/components/modals/confirmationModal.vue";

export default {
  name: "profileComponent",
  components: {
    mainModal,
    confirmationModal,
  },
  setup() {
    const userDiaryCollectionStore = useUserDiaryCollectionStore();
    const usersCollectionStore = useUsersCollectionStore();
    const userImage = ref("");
    const userFullName = ref("");
    const diaries = ref([]); // Koristimo ref za reaktivnu promenljivu
    const successMessage = ref("");
    const isModalVisible = ref(false);

    const fetchUserProfile = async () => {
      const response = await usersCollectionStore.getUserProfile();
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.user
      ) {
        userFullName.value = `${response.data.data.user.firstName} ${response.data.data.user.lastName}`;
        userImage.value = response.data.data.user.imagePath || "";
      }
    };

    const fetchUserDiaries = async () => {
      const diariesResponse = await userDiaryCollectionStore.getUserDiary();
      if (diariesResponse) {
        diaries.value = diariesResponse; // Setujemo diaries sa reaktivnim ref
      }
    };

    onMounted(() => {
      fetchUserProfile();
      fetchUserDiaries(); // Fetch user diaries on component mount
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

    const logout = () => {
      isModalVisible.value = true; // Show the custom confirmation modal
    };

    const handleLogout = () => {
      isModalVisible.value = false;
      usersCollectionStore.logoutUser().then(() => {
        this.$router.push({ name: "login" });
      });
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return {
      userFullName,
      userImage,
      diaries,
      successMessage,
      isModalVisible,
      fetchUserDiaries,
      deleteDiaryEntry,
      logout,
      handleLogout,
      closeModal,
      formatDate,
    };
  },
  created() {
    eventBus.on("closeModal", (data) => {
      if (data.closeModal) this.activeModal = false;
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
  margin-top: 20px;
}

.diary-entry {
  background-color: #d29433;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
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
</style>
