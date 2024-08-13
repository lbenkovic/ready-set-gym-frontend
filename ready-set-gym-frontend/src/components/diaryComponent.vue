<template>
    <div class="main-container">
        <div class="heading">
            <img
                class="heading-img"
                src="@/assets/logorsg.jpg"
                alt="Logo"
                @click="navigateHome"
            />
        </div>
        <div class="main">
            <div class="title">
                <h1>My progress</h1>
            </div>
            <div class="form-group">
                <label for="datePicker" class="form-label"
                    >Select a Date:</label
                >
                <input
                    id="datePicker"
                    type="date"
                    v-model="date"
                    class="form-control"
                />
            </div>
            <div class="form-group">
                <label for="diaryEntry" class="form-label">Diary Entry:</label>
                <textarea
                    id="diaryEntry"
                    v-model="diaryContent"
                    class="form-control"
                    rows="4"
                    placeholder="Write your thoughts..."
                ></textarea>
                <div class="button-group">
                    <button @click="clearForm" class="btn btn-danger">
                        Clear
                    </button>
                    <button @click="saveEntry" class="btn btn-success">
                        Save
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label for="weightInput" class="form-label"
                    >Enter Weight (kg):</label
                >
                <input
                    id="weightInput"
                    type="number"
                    step="0.1"
                    v-model="weightInput"
                    class="form-control"
                />
                <button @click="addWeight" class="btn btn-success">
                    Record Weight
                </button>
            </div>
            <div v-if="weights.length > 0" class="weight-progress">
                <div class="weight-progress-header">
                    <h2 class="title">Weight Progress</h2>
                </div>
                <div class="canvas-box">
                    <canvas ref="weightChartEl"></canvas>
                </div>
                <div class="weight-history">
                    <h2>Weight History</h2>
                    <ul>
                        <li
                            v-for="weight in weights"
                            :key="weight.date"
                            @click="removeWeight(weight.date)"
                        >
                            <span>{{ weight.weight }}kg</span>
                            <small>{{
                                new Date(weight.date).toLocaleDateString()
                            }}</small>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, shallowRef, computed, watch, nextTick, onMounted } from "vue";
import Chart from "chart.js/auto";
import eventBus from "@/eventBus";
import { useUserDiaryCollectionStore } from "@/stores/userDiaryCollectionStore";
import { useWeightCollectionStore } from "@/stores/weightCollectionStore";

const date = ref("");
const diaryContent = ref("");
const weightInput = ref(0);
const weights = ref([]);

const weightChartEl = ref(null);
const weightChart = shallowRef(null);

const userDiaryCollectionStore = useUserDiaryCollectionStore();
const weightCollectionStore = useWeightCollectionStore();

const currentWeight = computed(() => {
    return weights.value.sort((a, b) => b.date - a.date)[0] || { weight: 0 };
});

const clearForm = () => {
    date.value = "";
    diaryContent.value = "";
    weightInput.value = 0;
};

const saveEntry = async () => {
    const res = await userDiaryCollectionStore.saveDiaryEntry(
        diaryContent.value,
        date.value
    );
    if (res) {
        clearForm();
        eventBus.emit("success", "Diary entry added successfully!");
    }
};

const addWeight = async () => {
    weights.value.push({
        weight: weightInput.value,
        date: new Date().getTime(),
    });
    await weightCollectionStore.recordWeight(weightInput.value);
    updateChart();
    clearForm();
    eventBus.emit("success", "Weight recorded successfully!");
};
const removeWeight = (dateToRemove) => {
    weights.value = weights.value.filter(
        (weight) => weight.date !== dateToRemove
    );
    updateChart();
};

watch(
    weights,
    (newWeights) => {
        const ws = [...newWeights];

        if (weightChart.value) {
            weightChart.value.data.labels = ws
                .sort((a, b) => a.date - b.date)
                .map((weight) => new Date(weight.date).toLocaleDateString())
                .slice(-7);

            weightChart.value.data.datasets[0].data = ws
                .sort((a, b) => a.date - b.date)
                .map((weight) => weight.weight)
                .slice(-7);

            weightChart.value.update();
            return;
        }

        nextTick(() => {
            weightChart.value = new Chart(
                weightChartEl.value.getContext("2d"),
                {
                    type: "line",
                    data: {
                        labels: ws
                            .sort((a, b) => a.date - b.date)
                            .map((weight) =>
                                new Date(weight.date).toLocaleDateString()
                            ),
                        datasets: [
                            {
                                label: "Weight",
                                data: ws
                                    .sort((a, b) => a.date - b.date)
                                    .map((weight) => weight.weight),
                                backgroundColor: "rgba(255, 105, 180, 0.2)",
                                borderColor: "rgba(255, 105, 180, 1)",
                                borderWidth: 1,
                                fill: true,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    },
                }
            );
        });
    },
    { deep: true }
);

const updateChart = async () => {
    const res = await weightCollectionStore.updateChart();
    console.log("res", res);
    if (res) {
        weights.value = res;
        renderChart(weights.value);
    }
};

const renderChart = (weights) => {
    const ctx = weightChartEl.value.getContext("2d");
    if (weightChart.value) {
        weightChart.value.destroy();
    }
    const labels = weights.map((entry) =>
        new Date(entry.date).toLocaleDateString()
    );
    const data = weights.map((entry) => entry.weight);

    weightChart.value = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Weight Progress",
                    data,
                    borderWidth: 2,
                    backgroundColor: "rgba(210, 148, 51, 0.2)",
                    borderColor: "#d29433",
                    tension: 0.1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
};

onMounted(updateChart);
</script>

<style scoped>
.main-container {
    padding: 1rem;
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
    cursor: pointer;
}

.title {
    text-align: center;
    margin-top: 2rem;
}

.form-group {
    margin: 2rem auto;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-label {
    font-family: "Lucida Sans", Geneva, Verdana, sans-serif;
    font-size: medium;
    color: #838383;
    margin-bottom: 0.5rem;
}

.form-control {
    background-color: bisque;
    text-align: center;
    padding: 0.5rem;
    border-radius: 10px;
    width: 100%;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    width: 100%;
}

.btn {
    border-radius: 10px;
    width: 48%;
}

#weightInput,
#diaryEntry {
    margin-bottom: 1rem;
}

.weight-progress {
    margin-top: 3rem;
    display: flex;
    flex-direction: column; /* Stack items vertically */
    align-items: center;
}

.weight-progress-header {
    margin-bottom: 1rem; /* Space between header and chart */
}

.canvas-box {
    width: 100%;
    max-width: 720px;
    background-color: bisque;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
}

.canvas-box canvas {
    max-width: 100%;
    max-height: 100%;
}

.weight-history {
    width: 100%;
    max-width: 720px;
}

.weight-history ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.weight-history ul li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    cursor: pointer;
}

.weight-history ul li:nth-child(even) {
    background-color: #dfdfdf;
}

.weight-history ul li:hover {
    background-color: #f8f8f8;
}

.weight-history ul li:last-of-type {
    border-bottom: none;
}

.weight-history ul li span {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    margin-right: 1rem;
}

.weight-history ul li small {
    color: #888;
    font-style: italic;
}
</style>
