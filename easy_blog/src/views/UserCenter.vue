<template>
  <a-layout class="Page">
    <a-layout-sider width="250px" class="Sider">
      <div class="UserInfo">
        <a-avatar
          size="large"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          class="userHome"
          @click="toUserHomePage"
        />
        <span class="userHome" @click="toUserHomePage">
          {{ " " + userInfo.username }}
        </span>
        <div style="font-size: 15px;">
          <span :style="{ margin: '22px' }">{{ blogNum }}<br /></span>
          <span :style="{ margin: '15px' }">博客</span>
        </div>
      </div>
      <div class="AuthorBlogsTitles">
        <span :style="{ fontSize: '20px' }">热门文章</span>
        <div
          v-for="blog in authorHottestBlogs"
          v-bind:key="blog.blogId"
          :style="{ padding: '5px' }"
        >
          <router-link
            :to="{
              name: 'BlogDetail',
              params: { id: blog.blogId }
            }"
            @click="refreshPage"
            :style="{ color: 'rgb(85,85,150)' }"
          >
            <span class="titleLink">{{ blog.title + " " }}</span>
            <EyeOutlined :style="{ color: 'rgb(105,105,105)' }" />
            <span style="color: rgb(155,155,170)">{{ " " + blog.viewed }}</span>
          </router-link>
        </div>
      </div>
    </a-layout-sider>
    <a-layout style="padding: 10px 25px 5px 25px;">
      <a-layout-content class="Content">
        <div>
          <a-tabs>
            <a-tab-pane key="1" tab="个人信息">
              <a-form
                class="form"
                ref="ruleForm"
                :model="userInfo"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                v-if="isEdit"
              >
                <a-form-item label="用户名" required name="username">
                  <a-input
                    placeholder="请输入用户名"
                    v-model:value="userInfo.username"
                    disabled="disabled"
                  >
                    <template #prefix><UserOutlined type="user"/></template>
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
                  <a-input
                    v-model:value="userInfo.email"
                    placeholder="请输入邮箱"
                  />
                </a-form-item>
                <a-form-item label="手机号码" name="phone">
                  <a-input
                    v-model:value="userInfo.phone"
                    placeholder="请输入手机号码"
                  />
                </a-form-item>
              </a-form>
              <a-card
                title="基础信息"
                class="infoCard"
                @click="clickToEdit"
                v-else
              >
                <template #extra>
                  <span class="editText" @click="clickToEdit">编辑</span>
                </template>
                <div style="font-size: 16px">
                  <p>用户名：&emsp;&emsp;{{ userInfo.username }}</p>
                  <p>昵称：&emsp;&emsp;&emsp;{{ userInfo.nickname }}</p>
                  <p>真实姓名：&emsp;{{ userInfo.realname }}</p>
                  <p>邮箱：&emsp;&emsp;&emsp;{{ userInfo.email }}</p>
                  <p>手机：&emsp;&emsp;&emsp;{{ userInfo.phone }}</p>
                </div>
              </a-card>
              <div style="width: 100%" v-if="isEdit">
                <a-button type="primary" @click="clickUpdate" class="updateBtn">
                  提交
                </a-button>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="安全中心">
              <a-form
                class="form"
                ref="ruleForm"
                :model="userInfo"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-item label="密码" name="password">
                  <a-input-password
                    v-model:value="userInfo.password"
                    placeholder="请输入密码"
                  />
                </a-form-item>
                <a-form-item label="确认密码" name="determinePwd">
                  <a-input-password
                    v-model:value="userInfo.determinePwd"
                    placeholder="再次输入密码确认"
                  />
                </a-form-item>
              </a-form>
              <div style="width: 100%">
                <a-button
                  type="primary"
                  @click="clickUpdate('pwd')"
                  class="updateBtn"
                >
                  提交
                </a-button>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { UserOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import axios from "axios";
import CryptoJS from "crypto-js";

export default {
  components: {
    EyeOutlined,
    UserOutlined
  },
  data() {
    // eslint-disable-next-line no-useless-escape
    const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    const sameAsPwd = async (rule, value, callback) => {
      console.log(value);
      if (!value) {
        // console.log("!value");
        return Promise.reject("请再次输入密码");
      }
      if (this.userInfo.password != this.userInfo.determinePwd) {
        return Promise.reject("两次输入密码不一致");
      } else {
        return Promise.resolve();
      }
    };
    const checkEmail = async (rule, value, callback) => {
      if (!value) {
        return Promise.resolve();
      }
      if (!emailReg.test(value)) {
        return Promise.reject("邮箱不合要求");
      } else {
        return Promise.resolve();
      }
    };
    const checkPhone = async (rule, value, callback) => {
      if (!value) {
        return Promise.resolve();
      }
      if (!phoneReg.test(value)) {
        return Promise.reject("手机号不合要求");
      } else {
        return Promise.resolve();
      }
    };
    return {
      blogNum: 0,
      authorHottestBlogs: [],
      userInfo: {},
      isEdit: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      determinePwd: "",
      secretKey: "secretkey0123456",
      rules: {
        password: [
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
  mounted() {
    axios.get("http://localhost:3000/app/user/blogsCount").then(res => {
      this.blogNum = res.data.result;
    });
    axios.get("http://localhost:3000/app/user/selfInfo").then(res => {
      this.userInfo = res.data.userInfo[0];
      this.userInfo.determinePwd = "";
      // console.log(this.userInfo);
    });
    axios
      .get("http://localhost:3000/app/blog/hottest", {
        params: {
          num: 5
        }
      })
      .then(res => {
        this.authorHottestBlogs = res.data;
      });
  },
  methods: {
    toUserHomePage() {
      this.$router.push({
        name: "UserHomePage",
        params: {
          username: this.userInfo.username
        }
      });
    },
    refreshPage() {
      location.reload();
    },
    clickUpdate(clickBtn) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      // const self = this;
      let password = "";
      if (clickBtn == "pwd") {
        const md5Pwd = CryptoJS.MD5(
          "saltValue&&" + this.userInfo.password
        ).toString();
        console.log("user center MD5 pwd: ", md5Pwd);
        password = CryptoJS.AES.encrypt(md5Pwd, this.secretKey).toString();
        console.log("user center encrypt pwd: ", password);
      } else {
        password = CryptoJS.AES.encrypt(
          this.userInfo.password,
          this.secretKey
        ).toString();
        console.log("update info pwd: ", password);
      }
      axios
        .post("http://localhost:3000/app/user/update", {
          username: this.userInfo.username,
          password: password,
          nickname: this.userInfo.nickname,
          realname: this.userInfo.realname,
          email: this.userInfo.email,
          phone: this.userInfo.phone
        })
        .then(res => {
          if (res.data.result) {
            this.isEdit = false;
            notification.open({
              message: "更新成功"
            });
            if (clickBtn == "pwd") {
              location.reload();
            }
          }
        })
        .catch(err => {
          // console.log(err);
          this.errorMessage = err.response.data.msg;
          this.registFailed = true;
        });
    },
    clickToEdit() {
      this.isEdit = true;
    }
  }
};
</script>

<style scoped>
.Page {
  position: relative;
  left: 10vw;
  width: 85vw;
}

.Sider {
  background: rgb(240, 242, 245);
}

.UserInfo {
  width: 100%;
  height: 150px;
  padding: 20px;
  margin: 5px;
  margin-top: 10px;
  border-radius: 3px;
  background: rgb(255, 255, 255);
  font-size: 20px;
}

.userHome:hover {
  color: rgb(250, 85, 50);
  cursor: pointer;
}

.AuthorBlogsTitles {
  width: 250px;
  /* height: 90vh; */
  padding: 25px;
  margin: 5px;
  border-radius: 3px;
  background: #fff;
}

.titleLink:hover {
  color: rgb(250, 85, 50);
}

.Content {
  background: #fff;
  padding: 15px 25px 15px 25px;
  margin: 0;
  min-height: 280px;
  min-width: 500px;
  max-width: 900px;
  border-radius: 3px;
}

.infoCard {
  width: 100%;
}

.infoCard:hover {
  cursor: pointer;
  background: rgb(240, 240, 240);
}

.editText:hover {
  color: rgb(250, 85, 50);
  cursor: pointer;
}

.updateBtn {
  width: 200px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
