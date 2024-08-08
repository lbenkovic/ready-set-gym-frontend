/* eslint-disable */
import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../views/SignUp.vue";
import LogIn from "../views/LogIn.vue";
import FirstPage from "../views/FirstPage.vue";
// import CalculateBMI from "../components/CalculateBMI.vue";
// import DiaryEntry from "../components/Diary.vue";
// import HomePage from "../components/HomePage.vue";
// import ProfileUser from "../components/Profile.vue";
// import EditProfile from "@/components/EditProfile.vue";
import generalView from "@/views/generalView.vue";

const routes = [
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
  },
  {
    path: "/login",
    name: "login",
    component: LogIn,
  },
  {
    path: "/",
    name: "firstpage",
    component: FirstPage,
  },
  // {
  //   path: "/bmi",
  //   name: "bmi",
  //   component: CalculateBMI,
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: "/diary",
  //   name: "diary",
  //   component: DiaryEntry,
  //   meta: { requiresAuth: true },
  // },
  {
    path: "/home",
    name: "home",
    component: generalView,
    meta: { requiresAuth: true },
  },
  // {
  //   path: "/profile",
  //   name: "profile",
  //   component: ProfileUser,
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: "/edit-profile",
  //   name: "EditProfile",
  //   component: EditProfile,
  //   meta: { requiresAuth: true },
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem("token");
    if (!token) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
