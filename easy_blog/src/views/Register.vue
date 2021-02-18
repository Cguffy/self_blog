<template>
  <div class="log">
    <div class="formDiv">
      <span
        v-if="registFailed"
        style="font-size: 13px;color: red;position: absolute; left: 50%; transform: translateX(-50%); top: 28px"
        >{{ errorMessage }}</span
      >
      <span style="font-size:19px;position: absolute; left: 150px; top: 8px;">
        账号注册
      </span>
      <a-form
        class="form"
        ref="ruleForm"
        :model="userInfo"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="userInfo.username"
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input
            type="password"
            v-model:value="userInfo.password"
            placeholder="请输入密码"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="确认密码" name="determinePwd">
          <a-input
            type="password"
            v-model:value="userInfo.determinePwd"
            placeholder="再次输入密码确认"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="昵称" name="nickname">
          <a-input
            v-model:value="userInfo.nickname"
            placeholder="请输入用户昵称"
          />
        </a-form-item>
        <a-form-item label="真实姓名" name="realname">
          <a-input
            v-model:value="userInfo.realname"
            placeholder="请输入您的真实姓名"
          />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="userInfo.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="手机号码" name="phone">
          <a-input
            v-model:value="userInfo.phone"
            placeholder="请输入手机号码"
          />
        </a-form-item>
        <router-link
          to="/user/login"
          :style="{ position: 'absolute', left: '200px', top: '465px' }"
        >
          已有账号？点击登录
        </router-link>
        <a-form-item
          :style="{ position: 'absolute', left: '90px', top: '485px' }"
        >
          <a-button
            type="primary"
            @click="clickRegist"
            html-type="submit"
            :style="{ width: '200px' }"
          >
            注册
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { LockOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import { notification } from "ant-design-vue";
import CryptoJS from "crypto-js";

axios.defaults.withCredentials = true;

export default {
  name: "Login",
  components: {
    LockOutlined
  },
  data() {
    // eslint-disable-next-line no-useless-escape
    const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    const notEmpty = async (rule, value, callback) => {
      if (value.length < 4 || value.length > 15) {
        this.validate.username = false;
        this.validate.password = false;
        return Promise.reject("长度应为 4~15 个字符");
      } else {
        this.validate.username = true;
        this.validate.password = true;
        return Promise.resolve();
      }
    };
    const sameAsPwd = async (rule, value, callback) => {
      // console.log(value);
      if (!value) {
        // console.log("!value");
        this.validate.determinePwd = false;
        return Promise.reject("请再次输入密码");
      }
      if (this.userInfo.password != this.userInfo.determinePwd) {
        this.validate.determinePwd = false;
        return Promise.reject("两次输入密码不一致");
      } else {
        this.validate.determinePwd = true;
        return Promise.resolve();
      }
    };
    const checkEmail = async (rule, value, callback) => {
      if (!value) {
        this.validate.email = true;
        return Promise.resolve();
      }
      if (!emailReg.test(value)) {
        this.validate.email = false;
        return Promise.reject("邮箱不合要求");
      } else {
        this.validate.email = true;
        return Promise.resolve();
      }
    };
    const checkPhone = async (rule, value, callback) => {
      if (!value) {
        this.validate.phone = true;
        return Promise.resolve();
      }
      if (!phoneReg.test(value)) {
        this.validate.phone = false;
        return Promise.reject("手机号不合要求");
      } else {
        this.validate.phone = true;
        return Promise.resolve();
      }
    };
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      userInfo: {
        username: "",
        password: "",
        determinePwd: "",
        nickname: null,
        realname: null,
        email: null,
        phone: null
      },
      secretKey: "secretkey0123456",
      validate: {
        username: false,
        password: false,
        determinePwd: false,
        email: true,
        phone: true
      },
      registFailed: false,
      errorMessage: "",
      rules: {
        username: [
          {
            validator: notEmpty,
            trigger: "blur"
          },
          {
            required: true,
            message: "用户名不可为空",
            trigger: "blur"
          },
          {
            min: 4,
            max: 15,
            message: "用户名应为 4~15 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: notEmpty,
            trigger: "blur"
          },
          {
            required: true,
            message: "密码不可为空",
            trigger: "blur"
          },
          {
            min: 4,
            max: 15,
            message: "密码应为 4~15 个字符",
            trigger: "blur"
          }
        ],
        determinePwd: [
          {
            required: true,
            message: "请再次输入确认密码",
            trigger: "blur"
          },
          {
            validator: sameAsPwd,
            trigger: "blur"
          }
        ],
        nickname: [
          {
            min: 6,
            max: 15,
            message: "昵称应为 6~15 个字符",
            trigger: "blur"
          }
        ],
        email: [
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        phone: [
          {
            validator: checkPhone,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    clickRegist() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      // const self = this;
      if (
        !this.validate.username ||
        !this.validate.password ||
        !this.validate.determinePwd ||
        !this.validate.email ||
        !this.validate.phone
      ) {
        notification.open({
          message: "表项填写不符合要求"
        });
        return;
      }
      const md5Pwd = CryptoJS.MD5(
        "saltValue&&" + this.userInfo.password
      ).toString();
      console.log("regist MD5 pwd: ", md5Pwd);
      const pwd = CryptoJS.AES.encrypt(md5Pwd, this.secretKey).toString();
      console.log("regist encrypt pwd: ", pwd);
      axios
        .post("http://localhost:3000/app/user/register", {
          username: this.userInfo.username,
          password: pwd,
          nickname: this.userInfo.nickname,
          realname: this.userInfo.realname,
          email: this.userInfo.email,
          phone: this.userInfo.phone
        })
        .then(res => {
          console.log(res.data.result);
          this.registFailed = false;
          axios
            .post("http://localhost:3000/app/user/login", {
              username: this.userInfo.username,
              password: pwd
            })
            .then(res => {
              this.$store.commit("setIsLogin", true);
              this.$store.commit("setUsername", this.userInfo.username);
              // console.log(this.$store.state.isLogin);

              this.$router.push("/about");
              // location.reload();
            })
            .catch(err => {
              this.$router.push("/about");
            });
        })
        .catch(err => {
          console.log(err);
          this.errorMessage = err.response.data.msg;
          this.registFailed = true;
        });
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

.formDiv {
  width: 380px;
  height: 530px;
  background: rgba(255, 255, 255, 0.7);
  position: absolute;
  left: 50%;
  transform: translate(-50%, -55%);
  top: 50%;
}

.form {
  padding-top: 45px;
}
</style>
