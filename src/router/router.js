import Vue from "vue";
import Router from "vue-router";
import editor from "../views/Editor.vue";
import integration from "../views/Integration.vue";
import signIn from "../views/SignIn.vue";
import signOut from "../views/signOut.vue";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/signIn",
      name: "signIn",
      component: signIn
    },
    {
      path: "/signOut",
      name: "signOut",
      component: signOut
    },
    {
      path: "/editor",
      name: "editor",
      component: editor
    },
    {
      path: "/integration",
      name: "integration",
      component: integration
    }
  ]
});
