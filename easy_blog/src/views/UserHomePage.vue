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
          {{ " " + $route.params.username }}
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
            <a-tab-pane key="1" tab="博客">
              <a-list
                class="AllBlogsList"
                item-layout="horizontal"
                :data-source="allBlogs"
              >
                <template #renderItem="{ item }">
                  <a-list-item>
                    <template #actions>
                      <router-link
                        :to="{
                          name: 'BlogDetail',
                          params: { id: item.blogId }
                        }"
                      >
                        <EyeOutlined />{{ item.viewed }}
                      </router-link>
                      <router-link
                        :to="{
                          name: 'EditBlog',
                          query: { edit: item.blogId }
                        }"
                      >
                        编辑
                      </router-link>
                    </template>
                    <a-list-item-meta :description="descript(item.text)">
                      <template #title>
                        <router-link
                          :to="{
                            name: 'BlogDetail',
                            params: { id: item.blogId }
                          }"
                        >
                          {{ item.title }}
                        </router-link>
                      </template>
                      <template #avatar>
                        <a-avatar
                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          v-on:click="clickItem(item.blogId)"
                          class="listItemUser"
                        />
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { EyeOutlined } from "@ant-design/icons-vue";
import axios from "axios";

export default {
  data() {
    return {
      blogNum: 0,
      allBlogs: [],
      authorHottestBlogs: []
    };
  },
  components: {
    EyeOutlined
  },
  mounted() {
    axios.get("http://localhost:3000/app/user/blogsCount").then(res => {
      this.blogNum = res.data.result;
    });
    axios
      .get("http://localhost:3000/app/blog", {
        params: {
          author: this.$route.params.username
        }
      })
      .then(res => {
        this.allBlogs = res.data;
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
          username: this.$route.params.username
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
    },
    descript(text) {
      if (text.length > 50) {
        return text.substr(0, 50) + "...";
      }
      return text;
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

.AllBlogsList {
  height: 100%;
}

.listItemUser:hover {
  cursor: pointer;
}
</style>
