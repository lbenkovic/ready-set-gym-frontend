<template>
  <div>
    <header class="heading">
      <img
        class="heading-img"
        src="@/assets/logorsg.jpg"
        alt=""
        @click="navigateHome"
      />
    </header>
    <main class="main">
      <section class="gender">
        <h1 class="naslov">BMI CALCULATOR</h1>
        <div class="gender-buttons">
          <button
            @click="selectGender('male')"
            :class="{ 'btn-active-male': male, 'btn-inactive': !male }"
            class="gender-btn"
          >
            <span class="material-symbols-outlined gender-icon">male</span>
          </button>
          <button
            @click="selectGender('female')"
            :class="{ 'btn-active-female': female, 'btn-inactive': !female }"
            class="gender-btn"
          >
            <span class="material-symbols-outlined gender-icon">female</span>
          </button>
        </div>
      </section>
      <section class="bmi">
        <div class="input">
          <input
            v-model="height"
            type="number"
            placeholder="Height (cm)"
            class="form-control height"
          />
          <input
            v-model="weight"
            type="number"
            placeholder="Weight (kg)"
            class="form-control weight"
          />
          <input
            v-model="age"
            type="number"
            placeholder="Age"
            class="form-control age"
          />
        </div>
        <button class="btn btn-success" @click="calculateBMI">Calculate</button>
        <div v-if="bmi !== null" class="result">
          <h2>Your BMI: {{ bmi }}</h2>
          <p class="message">{{ bmiMessage }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "CalculateBMIComponent",
  data() {
    return {
      height: null,
      weight: null,
      age: null,
      bmi: null,
      male: false,
      female: false,
    };
  },
  computed: {
    bmiMessage() {
      if (this.bmi === null) return "";
      if (this.bmi < 18.5)
        return "You are undernourished. Consult your doctor to increase body weight.";
      if (this.bmi > 24.9)
        return "You have excess body weight. Consult a doctor to reduce it.";
      return "You have a normal body weight. Eat healthily and engage in physical activity to maintain it.";
    },
    maleBtnStyle() {
      return this.male ? "btn-active-male" : "btn-inactive";
    },
    femaleBtnStyle() {
      return this.female ? "btn-active-female" : "btn-inactive";
    },
  },
  methods: {
    calculateBMI() {
      if (this.height && this.weight) {
        const heightInMeters = this.height / 100;
        this.bmi = (this.weight / heightInMeters ** 2).toFixed(2);
      } else {
        this.bmi = null;
      }
    },
    selectGender(gender) {
      if (gender === "male") {
        this.male = !this.male;
        this.female = false;
      } else if (gender === "female") {
        this.female = !this.female;
        this.male = false;
      }
    },

    navigateHome() {
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
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

.main {
  background-color: black;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gender {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
}

.gender-buttons {
  display: flex;
  flex-direction: row;
  gap: 30px;
}
.gender-btn {
  height: 100px;
  width: 100px;
  border-radius: 20px;
  background-color: #d29433;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gender-icon {
  font-size: 3rem;
}

.btn-active-male {
  background-color: cyan;
}

.btn-active-female {
  background-color: pink;
}

.btn-inactive {
  background-color: #d29433;
}

.bmi {
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-control {
  background-color: #d29433;
  max-width: 300px;
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  margin: 5px;
  color: white;
  border: none;
  box-sizing: border-box;
}

.btn {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  width: 300px;
  border-radius: 20px;
  padding: 10px;
  margin: 20px;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.naslov {
  color: aliceblue;
}

.result {
  color: white;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  text-align: center;
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message {
  color: rgb(222, 174, 43);
}
</style>
