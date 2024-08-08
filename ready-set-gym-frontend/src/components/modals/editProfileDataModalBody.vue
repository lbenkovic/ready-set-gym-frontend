<template>
    <div class="container">
        <h1 class="naslov">Edit Profile</h1>
        <form @submit.prevent="changePassword">
            <div class="input-fields">
                <h3 class="naziv">First Name</h3>
                <input
                    type="text"
                    v-model="firstName"
                    class="input-field"
                    required
                />
                <h3 class="naziv">Last Name</h3>
                <input
                    type="text"
                    v-model="lastName"
                    class="input-field"
                    required
                />

                <h3 class="naziv">Old Password</h3>
                <input
                    type="password"
                    v-model="oldPassword"
                    class="input-field"
                    required
                />
                <h3 class="naziv">New Password</h3>
                <input
                    type="password"
                    v-model="newPassword"
                    class="input-field"
                    required
                />

                <div class="submit">
                    <button
                        type="submit"
                        class="btn btn-success btn-save"
                        v-if="!loading"
                    >
                        Save Changes
                    </button>
                    <span
                        v-else
                        class="spinner-border spinner-border-lg"
                        role="status"
                        aria-hidden="true"
                    ></span>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import eventBus from "@/eventBus";
import { useUsersCollectionStore } from "@/stores/usersCollectionStore";
export default {
    name: "editProfileDataModalBody",
    data() {
        return {
            firstName: null,
            lastName: null,
            oldPassword: null,
            newPassword: null,
            loading: false,
        };
    },
    setup() {
        const usersCollectionStore = useUsersCollectionStore();
        return { usersCollectionStore };
    },
    methods: {
        async changePassword() {
            this.loading = true;
            try {
                const formData = {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    old_password: this.oldPassword,
                    new_password: this.newPassword,
                };
                const res =
                    await this.usersCollectionStore.updateUserData(formData);
                if (res.status === 201) {
                    this.loading = false;
                    eventBus.emit("success", "Data updated successfully!");
                    const closeModalData = {
                        closeModal: true,
                    };
                    eventBus.emit("closeModal", closeModalData);
                }
            } catch (error) {
                console.error(error.response);
            }
        },
    },
};
</script>

<style scoped>
.naslov {
    color: #d29433;
    text-align: center;
    margin-bottom: 5vw;
}
.spinner-border {
    color: #d29433;
}
.submit {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 3vw;
}
.naziv {
    color: white;
}
.btn-save {
    border-radius: 20px;
    width: 300px;
    margin-top: 3vw;
    border: none;
}
.input-fields {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.input-field {
    background-color: #d29433;
    width: 300px;
    min-width: 100px;
    padding: 8px 16px 8px 16px;
    border-radius: 20px;
    text-align: center;
    margin: 10px;
}
</style>
