import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "HomePage",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/user/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/user/register",
    name: "Register",
    component: () => import("../views/Register.vue")
  },
  {
    path: "/user-center",
    name: "UserCenter",
    component: () => import("../views/UserCenter.vue")
  },
  {
    path: "/user/:username",
    name: "UserHomePage",
    component: () => import("../views/UserHomePage.vue")
  },
  {
    path: "/blogs",
    name: "Blogs",
    component: () => import("../views/AllBlogs.vue")
  },
  {
    path: "/blog/details/:id",
    name: "BlogDetail",
    component: () => import("../views/ShowBlog.vue")
  },
  {
    path: "/blog/md",
    name: "EditBlog",
    component: () => import("../views/EditBlog.vue")
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
