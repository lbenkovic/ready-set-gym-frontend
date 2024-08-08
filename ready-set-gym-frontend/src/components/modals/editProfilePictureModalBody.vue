<template>
    <div class="container">
        <h1 class="naslov">New profile picture</h1>
        <form @submit.prevent="uploadToStorage">
            <div class="input-fields">
                <input
                    type="file"
                    @change="handleImageSelect"
                    class="form-control picture-input"
                    accept="image/*"
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
import firebase from "firebase/compat/app";
import { useUsersCollectionStore } from "@/stores/usersCollectionStore";
import eventBus from "@/eventBus";

export default {
    name: "editProfilePictureModalBody",
    data() {
        return {
            file: null,
            loading: false,
        };
    },
    setup() {
        const usersCollectionStore = useUsersCollectionStore();
        return { usersCollectionStore };
    },
    methods: {
        handleImageSelect(event) {
            this.file = event.target.files[0];
        },
        uploadToStorage() {
            this.loading = true;
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(
                "profileImages/" + this.file.name
            );
            imageRef
                .put(this.file)
                .then((snapshot) => {
                    snapshot.ref.getDownloadURL().then((imageUrl) => {
                        this.saveImagePathToUserDB(imageUrl);
                    });
                })
                .catch((error) => {
                    console.error("Error during upload:", error);
                });
        },
        async saveImagePathToUserDB(imagePath) {
            const email = localStorage.getItem("userEmail");
            const formData = {
                email: email,
                imagePath: imagePath,
            };
            const res =
                await this.usersCollectionStore.updateUserProfilePicture(
                    formData
                );
            if (res.status === 201) {
                this.loading = false;
                eventBus.emit(
                    "success",
                    "Profile picture updated successfully!"
                );
                const closeModalData = {
                    closeModal: true,
                };
                eventBus.emit("closeModal", closeModalData);
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
.btn-save {
    border-radius: 20px;
    width: 300px;
    border: none;
}
.input-fields {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.picture-input {
    width: 450px;
    background-color: white;
}
.submit {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 3vw;
}
</style>
