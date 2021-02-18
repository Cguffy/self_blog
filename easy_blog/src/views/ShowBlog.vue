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
          {{ " " + blog.author }}
        </span>
        <div style="font-size: 15px;">
          <span :style="{ margin: '22px' }">{{ blogNum }}<br /></span>
          <span :style="{ margin: '15px' }">博客</span>
        </div>
      </div>
      <div class="AuthorBlogsTitles">
        <span :style="{ fontSize: '20px' }">热门文章</span>
        <div
          v-for="blog in authorBlogs"
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
        <div class="BlogTitle">
          <span>
            {{ blog.title }}
          </span>
        </div>
        <div class="BlogInfo">
          <span><UserOutlined />{{ " " + blog.author }}</span>
          <span><FieldTimeOutlined />{{ " " + blog.firstPublic }}</span>
          <span style="color: rgb(155,155,170)">
            <EyeOutlined :style="{ color: 'rgb(105,105,105)' }" />
            {{ " " + blog.viewed }}
          </span>
          <router-link
            v-if="isAuthor"
            :to="{
              name: 'EditBlog',
              query: { edit: blog.blogId }
            }"
            class="edit"
          >
            编辑
          </router-link>
        </div>
        <div class="BlogText" v-html="content"></div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  UserOutlined,
  EyeOutlined,
  FieldTimeOutlined
} from "@ant-design/icons-vue";
import axios from "axios";
import showdown from "showdown";

export default {
  data() {
    return {
      blog: {},
      blogNum: 0,
      authorBlogs: [],
      content: "",
      isAuthor: false
    };
  },
  components: {
    EyeOutlined,
    UserOutlined,
    FieldTimeOutlined
  },
  mounted() {
    // console.log("id: " + this.$route.params.id);
    axios
      .get("http://localhost:3000/app/blog", {
        params: {
          id: this.$route.params.id
        }
      })
      .then(res => {
        this.blog = res.data[0];
        // console.log("blog: " + this.blog);
        const date = this.blog.firstPublic.substring(0, 10);
        const time = this.blog.firstPublic.substring(13, 19);
        let hour = parseInt(this.blog.firstPublic.substring(11, 13));
        hour += 8;
        this.blog.firstPublic = date + " " + hour.toString() + time;
        // console.log(this.$store.state.isLogin);
        // console.log(this.blog.author);
        if (
          this.$store.state.isLogin &&
          this.$store.state.username == this.blog.author
        ) {
          this.isAuthor = true;
        }
        // console.log(this.$store.state.username);
        // console.log(this.blog.author);
        // console.log(this.blog.firstPublic);
        const converter = new showdown.Converter();
        const markdownContent = this.blog.text;
        this.content = converter.makeHtml(markdownContent);
        axios.get("http://localhost:3000/app/user/blogsCount").then(res => {
          this.blogNum = res.data.result;
          // console.log(this.blogNum);
          // console.log(this.blog.blogId);
          // console.log(this.authorBlogs);
        });
        axios
          .post("http://localhost:3000/app/blog/viewed", {
            blogId: `${this.blog.blogId}`
          })
          .then(res => {
            // console.log(res.data.result);
            this.blog.viewed++;
            // console.log(this.blog.author);
            axios
              .get("http://localhost:3000/app/blog/hottest", {
                params: {
                  num: 5
                }
              })
              .then(res => {
                this.authorBlogs = res.data;
                // console.log(this.blog.blogId);
                // console.log(this.authorBlogs);
              });
          })
          .catch(err => {
            console.log("用户未登录");
          });
      });
  },
  methods: {
    toUserHomePage() {
      this.$router.push({
        name: "UserHomePage",
        params: {
          username: this.blog.author
        }
      });
    },
    refreshPage() {
      location.reload();
    },
    clickItem(itemId) {
      this.$router.push({
        name: "BlogDetail",
        params: {
          id: itemId
        }
      });
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

.Content {
  background: #fff;
  padding: 15px 25px 15px 25px;
  margin: 0;
  min-height: 280px;
  min-width: 500px;
  max-width: 900px;
  border-radius: 3px;
}

.BlogTitle {
  font-size: 25px;
  font-weight: bold;
}

.BlogInfo {
  width: 100%;
  height: 65px;
  background: rgb(245, 245, 245);
  border-radius: 5px;
  position: relative;
}

.edit {
  position: absolute;
  right: 10px;
  top: 3px;
}

.BlogInfo > * {
  padding: 5px 5px 5px 15px;
}

.BlogText {
  width: 100%;
  font-size: 25px;
  word-break: break-all;
  word-wrap: break-word;
}

.titleLink:hover {
  color: rgb(250, 85, 50);
}
</style>
