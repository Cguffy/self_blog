<template>
  <div class="log">
    <span
      v-if="loginFailed"
      style="font-size: 30px;color: red;position: absolute; left: 50%; transform: translateX(-50%); top: 100px"
      >{{ errorMessage }}</span
    >
    <a-form class="form" :model="userInfo">
      <a-form-item
        :style="{ position: 'absolute', left: '120px', top: '25px' }"
      >
        <span style="font-size:19px;">
          账号密码登录
        </span>
      </a-form-item>
      <a-form-item :style="{ position: 'absolute', left: '55px', top: '70px' }">
        <a-input
          placeholder="请输入用户名"
          v-model:value="userInfo.username"
          :style="{ width: '240px' }"
        >
          <template #prefix><UserOutlined type="user"/></template>
          <template #suffix>
            <a-tooltip title="用户名长度应为 6~15 个字符">
              <InfoCircleOutlined style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        :style="{ position: 'absolute', left: '55px', top: '120px' }"
      >
        <a-input-password
          v-model:value="userInfo.password"
          placeholder="请输入密码"
          :style="{ width: '240px' }"
        />
      </a-form-item>
      <a-form-item
        :style="{ position: 'absolute', left: '165px', top: '150px' }"
      >
        <router-link to="/user/register">没有账号？马上注册</router-link>
      </a-form-item>
      <a-form-item
        :style="{ position: 'absolute', left: '75px', top: '180px' }"
      >
        <a-button
          type="primary"
          @click="clickLogin"
          :style="{ width: '200px' }"
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { UserOutlined, InfoCircleOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import CryptoJS from "crypto-js";

axios.defaults.withCredentials = true;

export default {
  name: "Login",
  components: {
    UserOutlined,
    InfoCircleOutlined
  },
  data() {
    return {
      userInfo: {
        username: "",
        password: ""
      },
      loginFailed: false,
      errorMessage: "",
      secretKey: "secretkey0123456"
    };
  },
  methods: {
    clickLogin() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      // const self = this;
      const md5Pwd = CryptoJS.MD5(
        "saltValue&&" + this.userInfo.password
      ).toString();
      console.log("login MD5 pwd: ", md5Pwd);
      const password = CryptoJS.AES.encrypt(md5Pwd, this.secretKey).toString();
      console.log("regist encrypt pwd: ", password);
      axios
        .post("http://localhost:3000/app/user/login", {
          username: this.userInfo.username,
          password: password
        })
        .then(res => {
          console.log(res.data.result);
          this.$store.commit("setIsLogin", true);
          this.$store.commit("setUsername", this.userInfo.username);
          console.log(this.$store.state.isLogin);
          this.loginFailed = false;
          this.$router.push("/home");
          // location.reload();
        })
        .catch(err => {
          this.errorMessage = err.response.data.msg;
          console.log(this.errorMessage);
          this.loginFailed = true;
        });
      // if (res.data.result) {
      //   console.log(res.data.result);
      //   this.$store.commit("setIsLogin", true);
      //   this.loginFailed = true;
      //   this.$router.go(-1);
      // }
      // else{

      // }
    }
  }
};
</script>

<style scoped>
.log {
  width: 100vw;
  height: 100vh;
  background-image: url("../static/log_background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}

.form {
  width: 350px;
  height: 250px;
  background: rgba(255, 255, 255, 0.7);
  position: absolute;
  left: 50%;
  transform: translate(-50%, -55%);
  top: 50%;
}
</style>
