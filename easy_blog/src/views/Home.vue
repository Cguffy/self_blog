<template>
  <a-layout>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
        mode="inline"
        v-model:selectedKeys="selectedKeys2"
        v-model:openKeys="openKeys"
        :style="{ height: '100%', borderRight: 0 }"
      >
        <a-sub-menu key="sub1">
          <template #title>
            <span><UserOutlined />subnav 1</span>
          </template>
          <a-menu-item key="1">option1</a-menu-item>
          <a-menu-item key="2">option2</a-menu-item>
          <a-menu-item key="3">option3</a-menu-item>
          <a-menu-item key="4">option4</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span><laptop-outlined />subnav 2</span>
          </template>
          <a-menu-item key="5">option5</a-menu-item>
          <a-menu-item key="6">option6</a-menu-item>
          <a-menu-item key="7">option7</a-menu-item>
          <a-menu-item key="8">option8</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <template #title>
            <span><notification-outlined />subnav 3</span>
          </template>
          <a-menu-item key="9">option9</a-menu-item>
          <a-menu-item key="10">option10</a-menu-item>
          <a-menu-item key="11">option11</a-menu-item>
          <a-menu-item key="12">option12</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout-content
        :style="{
          background: '#fff',
          padding: '24px',
          height: '90vh',
          margin: 0
        }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  LogoutOutlined
} from "@ant-design/icons-vue";

export default {
  components: {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    // LogoutOutlined
  },
  data() {
    return {
      selectedKeys1: ["2"],
      selectedKeys2: ["1"],
      collapsed: false,
      openKeys: ["sub1"],
      searchValue: "",
      isLogin: true
    };
  },
  methods: {
    onSearch(value) {
      console.log("use value", value);
      console.log("or use this.value", this.searchValue);
    },
    userLogout() {
      this.isLogin = !this.isLogin;
    }
  }
};
</script>

<style scoped></style>
