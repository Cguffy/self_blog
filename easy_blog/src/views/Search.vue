<template>
  <a-layout class="Page">
    <a-layout style="padding: 10px 25px 5px 25px;">
      <a-layout-content class="Content">
        <div>
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
      allBlogs: []
    };
  },
  components: {
    EyeOutlined
  },
  mounted() {
    this.loadData();
  },
  watch: {
    "$route": {
      handler(newVal) {
        if (newVal.query.searchStr) {
          this.loadData();
        }
      }
    }
  },
  methods: {
    loadData() {
      axios
        .get("http://localhost:3000/app/blog", {
          params: {
            searchStr: this.$route.query.searchStr
          }
        })
        .then(res => {
          this.allBlogs = res.data;
          this.blogNum = res.data.length;
        });
    },
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
