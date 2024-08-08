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
                            ><img :src="data.img_url" width="50" height="50" />
                            &nbsp; {{ data.title }}</label
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
                            ><img
                                :src="data.img_url"
                                width="50"
                                height="50"
                            />&nbsp; {{ data.title }}</label
                        >
                    </div>
                </div>
            </div>
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
        </form>
    </div>
</template>

<script>
import eventBus from "@/eventBus";
import firebase from "firebase/compat/app";
import { useWorkoutPlansCollectionStore } from "@/stores/workoutPlansCollectionStore";
import { useExerciseLiseCollectionStore } from "@/stores/exerciseListCollectionStore";
export default {
    name: "addNewWorkoutPlanModalBody",
    data() {
        return {
            workoutPlanName: "",
            selectedImage: [],
            exercises: null,
            firstHalfExercises: [],
            secondHalfExercises: [],
            selectedExercises: [],
            file: null,
            loading: false,
        };
    },
    setup() {
        const workoutPlansCollectionStore = useWorkoutPlansCollectionStore();
        const exerciseListCollectionStore = useExerciseLiseCollectionStore();
        return { workoutPlansCollectionStore, exerciseListCollectionStore };
    },
    async created() {
        await this.getExercises();
    },
    methods: {
        handleImageSelect(event) {
            this.file = event.target.files[0];
        },
        uploadToStorage() {
            this.loading = true;
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(
                "workoutTitleImages/" + this.file.name
            );
            imageRef
                .put(this.file)
                .then((snapshot) => {
                    snapshot.ref.getDownloadURL().then((imageUrl) => {
                        this.saveNewWorkoutPlan(imageUrl);
                    });
                })
                .catch((error) => {
                    console.error("Error during upload:", error);
                });
        },
        async saveNewWorkoutPlan(imageUrl) {
            const email = localStorage.getItem("userEmail");
            const formData = {
                email: email,
                name: this.workoutPlanName,
                exercises: this.selectedExercises,
                imageUrl: imageUrl,
            };
            const res =
                await this.workoutPlansCollectionStore.saveNewUserWorkoutPlan(
                    formData
                );
            if (res.status === 201) {
                this.loading = false;
                eventBus.emit("success", "Workout plan added successfully!");
                const closeModalData = {
                    closeModal: true,
                };
                eventBus.emit("closeModal", closeModalData);
            }
        },
        handleSelect(id) {
            if (!this.selectedExercises.includes(id)) {
                this.selectedExercises.push(id);
            } else {
                this.selectedExercises = this.selectedExercises.filter((x) => {
                    return x !== id;
                });
            }
        },
        async getExercises() {
            try {
                const res =
                    await this.exerciseListCollectionStore.getExercises();
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
                console.error(
                    "Error fetching recommended workout data:",
                    error
                );
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
