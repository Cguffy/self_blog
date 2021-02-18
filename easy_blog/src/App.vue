<template>
  <a-layout>
    <!-- <a-layout-header :style="{ height: '50px' }"> -->
    <div :style="{ position: 'relative', height: 'auto', float: 'left' }">
      <div class="logo" />
      <a-menu
        mode="horizontal"
        v-model:selectedKeys="selectedKeys1"
        :style="{
          height: '50px',
          background: 'rgb(255,255,255)',
          minWidth: '50%'
        }"
      >
        <a-menu-item key="首页">
          <router-link to="/home">首页</router-link>
        </a-menu-item>
        <a-menu-item key="博客">
          <router-link to="/blogs">博客</router-link>
        </a-menu-item>
        <a-menu-item key="程序员学院">
          <router-link to="/about">程序员学院</router-link>
        </a-menu-item>
        <a-menu-item key="下载">
          <router-link to="/about">下载</router-link>
        </a-menu-item>
        <a-menu-item key="论坛">
          <router-link to="/about">论坛</router-link>
        </a-menu-item>
        <a-menu-item key="问答">
          <router-link to="/about">问答</router-link>
        </a-menu-item>
        <a-menu-item key="代码">
          <router-link to="/about">代码</router-link>
        </a-menu-item>
        <a-menu-item key="直播">
          <router-link to="/about">直播</router-link>
        </a-menu-item>
        <a-menu-item key="电子书">
          <router-link to="/about">电子书</router-link>
        </a-menu-item>
        <a-sub-menu key="用户中心" v-if="$store.state.isLogin">
          <template #title>
            <router-link
              :to="{
                name: 'UserHomePage',
                params: { username: $store.state.username }
              }"
            >
              用户
            </router-link>
          </template>
          <a-menu-item key="个人中心">
            <router-link to="/user-center">
              <UserOutlined />
              个人中心
            </router-link>
          </a-menu-item>
          <a-menu-item key="退出">
            <LogoutOutlined />
            <span @click="userLogout">
              退出
            </span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item v-else>
          <router-link to="/user/login">登录/注册</router-link>
        </a-menu-item>
        <a-sub-menu key="创作中心" v-if="$store.state.isLogin">
          <template #title>
            <router-link to="/about">
              创作中心
            </router-link>
          </template>
          <a-menu-item key="写博客">
            <router-link
              :to="{
                name: 'EditBlog',
                query: { new: 1 }
              }"
            >
              写博客
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
      <a-input-search
        v-model:value="searchValue"
        placeholder="search"
        enter-button
        @search="onSearch"
        :style="{
          width: '20%',
          position: 'absolute',
          right: '10px',
          top: '10px'
        }"
      />
    </div>
    <!-- </a-layout-header> -->
    <div :style="{ minHeight: '93vh' }">
      <router-view />
    </div>
  </a-layout>
</template>
<script>
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  LogoutOutlined
} from "@ant-design/icons-vue";
import axios from "axios";

axios.defaults.withCredentials = true;

export default {
  components: {
    UserOutlined,
    // LaptopOutlined,
    // NotificationOutlined,
    LogoutOutlined
  },
  mounted() {
    axios
      .get("http://localhost:3000/app/user/isLogin")
      .then(res => {
        // console.log("is login");
        this.$store.commit("setIsLogin", true);
        this.$store.commit("setUsername", res.data.username);
      })
      .catch(err => {
        // console.log(err.message);
        this.$store.commit("setIsLogin", false);
      });
    // if (res.result) {
    //   console.log("is login");
    //   this.$store.commit("setIsLogin", true);
    // } else {
    //   console.log("is not login");
    //   this.$store.commit("setIsLogin", false);
    // }
  },
  data() {
    return {
      selectedKeys1: ["2"],
      selectedKeys2: ["1"],
      collapsed: false,
      openKeys: ["sub1"],
      searchValue: ""
    };
  },
  computed: {
    userHomePagePath() {
      return "/user/" + this.$store.state.username;
    }
  },
  methods: {
    onSearch(value) {
      const query = {
        searchStr: value
      };
      this.$router.push({
        path: "/search",
        query: query
      });
      // window.open(route.href, "_blank");
    },
    userLogout() {
      axios
        .post("http://localhost:3000/app/user/logout")
        .then(res => {
          // console.log("user logout");
          this.$store.commit("setIsLogin", false);
          this.$router.push({
            name: "Login"
          });
        })
        .catch(err => {
          console.log("error");
          this.$store.commit("setIsLogin", false);
        });
      // if (res.result) {
      //   this.$store.commit("setIsLogin", false);
      // }
    }
  }
};
</script>

<style scoped>
.logo {
  width: 50px;
  height: 25px;
  /* background: rgb(255, 0, 0); */
  background-image: url(https://img-home.csdnimg.cn/images/20201124032511.png);
  background-repeat: no-repeat;
  background-size: cover;
  margin: 10px 0px 10px 10px;
  float: left;
}
</style>
