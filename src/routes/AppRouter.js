import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/index",
      name: "index",
      component: () => import("../views/AppIndex"),
      children: [
        {
          path: "/",
          alias: "/login",
          name: "login",
          component: () => import("../components/Login")
        },
        {
          path: "/signup",
          name: "signup",
          component: () => import("../components/Signup")
        }
      ]
    },
    {
      path: "/corr",
      name: "corr",
      component: () => import("../views/HelloWorld")
    }
  ]
});