<template>
  <a-layout
    :style="{
      position: 'relative',
      left: '10vw',
      width: '90vw',
      minWidth: '500px',
      maxWidth: '1050px'
    }"
  >
    <a-layout-sider width="250px" style="background: #fff;">
      <a-menu
        mode="inline"
        v-model:selectedKeys="selectedKey"
        :style="{ height: '100vh', borderRight: 0, padding: '25px' }"
      >
        <a-menu-item key="1"><AppleOutlined />最热</a-menu-item>
        <a-menu-item key="2"><AppleOutlined />最新</a-menu-item>
        <a-menu-item key="3"><AndroidOutlined />全部</a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout style="padding: 25px 25px 25px 25px">
      <a-layout-content
        :style="{
          background: '#fff',
          padding: '25px',
          margin: 0,
          minHeight: '280px',
          minWidth: '500px'
        }"
      >
        <a-list
          class="AllBlogsList"
          :loading="loadingList"
          item-layout="horizontal"
          :data-source="getBlogs()"
        >
          <template #loadMore>
            <div
              v-if="showLoadingMore()"
              :style="{
                textAlign: 'center',
                marginTop: '12px',
                height: '32px',
                lineHeight: '32px'
              }"
            >
              <a-spin v-if="loadingMore" />
              <a-button
                v-else
                @click="onLoadMore"
                :style="{ background: 'rgb(255,0,0)' }"
              >
                loading more
              </a-button>
            </div>
          </template>
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
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  AppleOutlined,
  AndroidOutlined,
  EyeOutlined
} from "@ant-design/icons-vue";
import axios from "axios";

export default {
  data() {
    return {
      loadingList: true,
      loadingMore: false,
      showLoadingMoreBtn: true,
      loadTimes: 1,
      selectedKey: ["1"],
      hottestBlogs: [],
      latestBlogs: [],
      allBlogs: []
    };
  },
  components: {
    AppleOutlined,
    AndroidOutlined,
    EyeOutlined
  },
  mounted() {
    axios
      .get("http://localhost:3000/app/blog", {
        params: {
          start: 0,
          num: 10
        }
      })
      .then(res => {
        if (res.data.length <= 0) {
          this.showLoadingMoreBtn = false;
        }
        if (res.data.length < 10) {
          this.showLoadingMoreBtn = false;
          console.log("do not loading more");
        }
        // console.log(this.loadingMore);
        // console.log(res.data);
        // console.log(this.showLoadingMoreBtn);
        this.allBlogs = this.allBlogs.concat(res.data);
        // console.log("all blogs:" + this.allBlogs);
        this.loadingList = false;
      });
    axios
      .get("http://localhost:3000/app/blog/latest", {
        params: {
          num: 10
        }
      })
      .then(res => {
        if (res.data.length <= 0) {
          this.showLoadingMoreBtn = false;
        }
        if (res.data.length < 10) {
          this.showLoadingMoreBtn = false;
          console.log("not loading more");
        }
        // console.log(this.loadingMore);
        // console.log(res.data);
        // console.log(this.showLoadingMoreBtn);
        this.latestBlogs = this.latestBlogs.concat(res.data);
        // console.log("latest blogs:" + this.latestBlogs);
        this.loadingList = false;
      });
    axios
      .get("http://localhost:3000/app/blog/hottest", {
        params: {
          start: 0,
          num: 10
        }
      })
      .then(res => {
        if (res.data.length <= 0) {
          this.showLoadingMoreBtn = false;
        }
        if (res.data.length < 10) {
          this.showLoadingMoreBtn = false;
          console.log("not loading more");
        }
        // console.log(this.loadingMore);
        // console.log(res.data);
        // console.log(this.showLoadingMoreBtn);
        this.hottestBlogs = this.hottestBlogs.concat(res.data);
        // console.log("hottest blogs:" + this.hottestBlogs);
        this.loadingList = false;
      });
  },
  methods: {
    getBlogs() {
      // console.log(this.selectedKey[0]);
      const key = this.selectedKey[0];
      switch (key) {
        case "1":
          // console.log(1);
          return this.hottestBlogs;
        case "2":
          // console.log(2);
          return this.latestBlogs;
        case "3":
          // console.log(3);
          return this.allBlogs;
      }
    },
    showLoadingMore() {
      const key = this.selectedKey[0];
      if (key == 1 || key == 2) {
        return false;
      }
      return this.showLoadingMoreBtn;
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
    },
    onLoadMore() {
      console.log("click load more");
      this.loadingMore = true;
      axios
        .get("http://localhost:3000/app/blog", {
          params: {
            start: this.loadTimes * 10,
            num: 10
          }
        })
        .then(res => {
          if (res.data.length < 10) {
            this.showLoadingMoreBtn = false;
          }
          this.loadTimes++;
          this.allBlogs = this.allBlogs.concat(res.data);
          this.loadingMore = false;
          this.$nextTick(() => {
            window.dispatchEvent(new Event("resize"));
          });
        });
    }
  }
};
</script>

<style scoped>
.AllBlogsList {
  /* background: rgb(0, 255, 0); */
  /* min-height: 350px; */
  height: 100%;
}

.listItemUser:hover {
  cursor: pointer;
}
</style>
