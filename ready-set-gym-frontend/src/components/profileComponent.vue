<template>
    <div class="heading">
        <img class="heading-img" src="@/assets/logorsg.jpg" alt="" />
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
            <h2
                style="margin-top: 20px"
                @click="openModal('edit-profile-data')"
            >
                {{ userFullName }}
            </h2>
        </div>
        <div class="my-diaries">
            <h2 class="my-diaries-text">Read my diaries</h2>
        </div>
        <div
            v-for="(diary, index) in diaries"
            :key="index"
            class="card-container"
        >
            <div class="card">
                <div class="card-heading">
                    <h5 class="class-heading-text">{{ diary.date }}</h5>
                    <button @click="deleteDiaryEntry(index)">
                        <span class="material-symbols-outlined delete">
                            delete
                        </span>
                    </button>
                </div>
                <div class="card-content">
                    <p class="card-text">{{ diary.content }}</p>
                </div>
            </div>
        </div>
        <mainModal v-if="activeModal" :active-modal="activeModal" />

        <!-- Toast za prikaz poruke o uspjehu -->
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
// Ostale uvoze zadrži kako jesu
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
        const userImage = ref("");

        onMounted(() => {
            fetchUserProfile();
        });

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
        eventBus.on("closeModal", (data) => {
            console.log("closeModal event received:", data);
            if (data.closeModal) {
                this.activeModal = false;
            }
        });

        return { userDiaryCollectionStore, usersCollectionStore, userImage };
    },
    methods: {
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
        async deleteDiaryEntry(index) {
            // Tvoja funkcionalnost za brisanje dnevnika
        },
    },
    created() {
        this.getUserProfile();

        eventBus.on("updateUserImage", async (newImagePath) => {
            console.log("Received new image path:", newImagePath);
            this.userImage = newImagePath;
            this.successMessage = "Profile picture updated successfully!";
            setTimeout(() => {
                this.successMessage = "";
                window.location.reload(); // Ovo će osvježiti stranicu
            }, 1500);
        });
        // eventBus.on("closeModal", (data) => {
        //   console.log("closeModal event received:", data);
        //   if (data.closeModal) {
        //     this.activeModal = false;
        //   }
        // });
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
</style>
