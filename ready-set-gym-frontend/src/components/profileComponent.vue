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
                :style="[
                    userImage
                        ? { backgroundImage: 'url(' + userImage + ')' }
                        : {
                              backgroundImage:
                                  'url(' +
                                  require('@/assets/profile.jpg') +
                                  ')',
                          },
                ]"
                @click="openModal(), openModalEvent('edit-profile-picture')"
            >
            </span>
            <h2
                style="margin-top: 20px"
                @click="openModal(), openModalEvent('edit-profile-data')"
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
        <mainModal :active-modal="activeModal" />
    </div>
</template>
<script>
import eventBus from "@/eventBus";
import mainModal from "@/views/modalBody.vue";
import { useUserDiaryCollectionStore } from "@/stores/userDiaryCollectionStore";
import { useUsersCollectionStore } from "@/stores/usersCollectionStore";

export default {
    name: "profileComponent",
    components: {
        mainModal,
    },
    data() {
        return {
            activeModal: false,
            userFullName: "",
            diaries: [],
            userImage: "",
        };
    },
    setup() {
        const userDiaryCollectionStore = useUserDiaryCollectionStore();
        const usersCollectionStore = useUsersCollectionStore();
        return { userDiaryCollectionStore, usersCollectionStore };
    },
    methods: {
        openModal() {
            this.activeModal = !this.activeModal;
        },
        openModalEvent(modalType) {
            const data = {
                modalType: modalType,
            };
            eventBus.emit("openModal", data);
        },
        async getUserProfile() {
            const res = await this.usersCollectionStore.getUserProfile();
            if (res) {
                this.userFullName = `${res.data.data.user.firstName} ${res.data.data.user.lastName}`;
                this.userImage = res.data.imagePath;
            }
        },
        fetchNewUserData() {
            eventBus.on("success", async () => {
                await this.getUserProfile();
                await this.getUserDiary();
            });
        },
        logout() {
            const confirmed = confirm("Really log out?");
            if (confirmed) {
                localStorage.removeItem("token");
                this.$router.push({ name: "login" });
            }
        },
    },
    created() {
        this.getUserProfile();
        eventBus.on("closeModal", (data) => {
            if (data.closeModal) this.activeModal = false;
            this.getUserProfile();
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
</style>
