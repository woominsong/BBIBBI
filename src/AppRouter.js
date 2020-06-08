import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/index",
      name: "login",
      component: () => import("./components/HelloWorld")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./components/Login")
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./components/Signup")
    }
  ]
});