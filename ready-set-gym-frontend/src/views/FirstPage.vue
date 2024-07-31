<template>
  <div
    :style="myStyle"
    id="wrapper"
    class="d-flex flex-column align-items-center justify-content-end"
  >
    <h2 id="naslov">READYSET<span class="gym">GYM</span></h2>
    <p id="text" class="text-white font-weight-bold pb-5">
      Become stronger with our workout plans
    </p>
    <router-link
      to="/signup"
      class="btn btn-primary"
      style="width: 300px; margin: 8px"
      >Get started</router-link
    >
    <router-link
      to="/login"
      class="btn btn-secondary"
      style="width: 300px; margin: 8px"
      >Login</router-link
    >
  </div>
</template>

<script>
export default {
  name: "FirstPage",
  data() {
    return {
      myStyle: {
        backgroundImage: `url(${require("@/assets/login.jpg")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        marginTop: "0",
      },
    };
  },
};
</script>

<style>
#naslov,
#text {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

#wrapper {
  padding-bottom: 100px;
}

#naslov {
  color: white;
  padding-bottom: 20px;
  white-space: nowrap;
}

.gym {
  color: #d29433;
  font-weight: bold;
  white-space: nowrap;
  font-size: 35px;
}

#text {
  color: white;
  padding-bottom: 5px;
  font-size: 20px;
}

.btn {
  white-space: nowrap;
}

.btn-primary {
  background-color: #555050;
  border: none;
  border-radius: 10px;
}

.btn-secondary:hover,
.btn-primary:hover {
  background-color: #d29433;
}

.btn-secondary {
  border-radius: 10px;
}
</style>
