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
      path: "/main",
      name: "main",
      component: () => import("../views/AppMain"),
      children: [
        {
          path: "/",
          alias: "/hello-world",
          name: "placeholder",
          component: () => import("../components/HelloWorld")
        },
        {
          path: "/add-friend",
          name: "add-friend",
          component: () => import("../components/AddFriend")
        },
        {
          path: "/chat/:id",
          name: "chat",
          component: () => import("../components/ChatComponent")
        }
      ]
    }
  ]
});