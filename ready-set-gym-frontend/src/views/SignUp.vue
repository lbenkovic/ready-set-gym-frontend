<template>
  <div class="main">
    <div class="header" :style="{ 'padding-left': '15px' }">
      <router-link to="/" class="btn-dark" style="width: 100px">
        <span class="btn-dark material-symbols-outlined"> arrow_back_ios </span>
      </router-link>
    </div>
    <h2 :style="{ color: 'white', 'text-align': 'center' }">
      Create your account
    </h2>

    <div class="input-signup">
      <h3 class="naziv">First name</h3>
      <input type="first-name" v-model="userName" class="input-field" />
      <h3 class="naziv">Last name</h3>
      <input type="last-name" v-model="surname" class="input-field" />
      <h3 class="naziv">E-mail</h3>
      <input type="email" v-model="email" class="input-field" />
      <h3 class="naziv">Password</h3>
      <input type="password" v-model="password" class="input-field" />

      <div class="submit">
        <button
          type="button"
          class="btn btn-success"
          :style="btnStyleGreen"
          @click="registerUser"
        >
          Create account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUsersCollectionStore } from "@/stores/usersCollectionStore.js";
export default {
  name: "SignUp",
  data() {
    return {
      userName: "",
      surname: "",
      email: "",
      password: "",
      btnStyleGreen: {
        borderRadius: "20px",
        width: "300px",
        marginTop: "10px",
        border: "none",
      },
    };
  },
  setup() {
    const usersCollectionStore = useUsersCollectionStore();
    return { usersCollectionStore };
  },
  methods: {
    async registerUser() {
      const res = await this.usersCollectionStore.registerUser(
        this.userName,
        this.surname,
        this.email,
        this.password
      );
      if (res) {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
.naziv {
  color: white;
}

.input-signup {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

.submit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.btn-dark {
  background-color: black;
  border: none;
  margin: 20px 0 0 10px !important;
  padding: 0 !important;
}

.btn-dark:hover {
  background-color: black;
}
.btn-dark:focus {
  border: none;
}
.btn-dark:active {
  border: none;
}
.btn-dark::-moz-focus-inner {
  border: 0;
}
</style>
