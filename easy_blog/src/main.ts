import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import { Button, Layout, Menu, Breadcrumb, Input } from 'ant-design-vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

createApp(App)
  // .use(Button)
  // .use(Layout)
  // .use(Menu)
  // .use(Breadcrumb)
  // .use(Input)
  .use(Antd)
  .use(store)
  .use(router)
  .mount("#app");
