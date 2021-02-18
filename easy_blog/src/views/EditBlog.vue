<template>
  <a-layout class="NavigationBar">
    <div class="NavigationDiv">
      <a-input
        v-model:value="blogInfo.title"
        placeholder="文章标题"
        class="BlogTitle"
      >
      </a-input>
      <a-button type="primary" @click="postBlog" class="postBtn">
        发布文章
      </a-button>
    </div>
  </a-layout>
  <a-layout class="Page">
    <div>
      <div class="writeDiv">
        <textarea v-model="blogInfo.text" class="writeArea" />
      </div>
      <div class="toolBar">
        <a-upload
          v-model:file-list="fileList"
          name="file"
          list-type="picture"
          action="http://localhost:3000/app/file"
          :headers="headers"
          @change="handleChange"
          :withCredentials="true"
        >
          <a-button type="default" class="addImgBtn">
            <UploadOutlined />添加图片
          </a-button>
        </a-upload>
      </div>
      <div class="DisplayDiv" v-html="displayContent"></div>
    </div>
  </a-layout>
</template>
<script>
import { UploadOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import axios from "axios";
import showdown from "showdown";
import { ref } from "vue";

export default {
  data() {
    const fileList = ref([]);
    const handleChange = info => {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        console.log(info);
        console.log(`result array: ${info.file.response.result[0]}`);
        this.blogInfo.text += `![](http://localhost:3000/app/file/${info.file.response.result[0]})`;
      } else if (info.file.status === "error") {
        console.log(`${info.file.name} file upload failed.`);
      }
    };
    return {
      blogInfo: {
        title: "",
        text: ""
      },
      converter: new showdown.Converter(),
      fileList,
      handleChange,
      headers: {
        authorization: "authorization-text"
      },
      blog: {},
      authorBlogs: [],
      content: "",
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
    UploadOutlined
  },
  mounted() {
    if (this.$route.query.edit) {
      axios
        .get("http://localhost:3000/app/blog", {
          params: {
            id: this.$route.query.edit
          }
        })
        .then(res => {
          console.log(res.data[0]);
          this.blogInfo = res.data[0];
        });
    }
  },
  computed: {
    displayContent() {
      return this.converter.makeHtml(this.blogInfo.text);
    }
  },
  methods: {
    postBlog() {
      if (this.blogInfo.title == "" || this.blogInfo.text == "") {
        notification.open({
          message: "文章标题与内容不可为空"
        });
        return;
      }
      if (this.$route.query.edit) {
        axios
          .post("http://localhost:3000/app/blog/update", {
            blogId: this.blogInfo.blogId,
            title: this.blogInfo.title,
            text: this.blogInfo.text
          })
          .then(res => {
            notification.open({
              message: "发布文章成功"
            });
            this.$router.push({
              name: "UserHomePage",
              params: { username: this.$store.state.username }
            });
          });
      } else {
        axios
          .post("http://localhost:3000/app/blog", {
            blogId: 0,
            author: this.$store.state.username,
            title: this.blogInfo.title,
            text: this.blogInfo.text
          })
          .then(res => {
            notification.open({
              message: "发布文章成功"
            });
            this.$router.push({
              name: "UserHomePage",
              params: { username: this.$store.state.username }
            });
            // location.reload();
          })
          .catch(err => {
            this.errorMessage = err.response.data.msg;
            // console.log(this.errorMessage);
            this.loginFailed = true;
          });
      }
    }
  }
};
</script>

<style scoped>
div {
  float: left;
}

.NavigationBar {
  width: 95%;
  height: 55px;
}

.NavigationDiv {
  width: 100%;
  height: 100%;
}

.BlogTitle {
  width: calc(100% - 170px);
  height: 45px;
  padding-left: 20px;
  font-size: 20px;
  border-radius: 22px;
  margin: 5px 0px 0px 20px;
}

.postBtn {
  background-image: linear-gradient(
    to right,
    rgb(255, 180, 65),
    rgb(255, 30, 65)
  );
  border-radius: 20px;
  border-width: 0px;
  min-width: 120px;
  height: 45px;
  margin-left: 30px;
}

.Page {
  width: 100vw;
}

.writeDiv {
  width: calc(50% - 90px);
}

.writeArea {
  width: 100%;
  min-height: calc(100vh - 112px);
  height: 100%;
  border-width: 0px;
  outline: none;
  resize: none;
  font-size: 15px;
  background: rgb(240, 242, 245);
  padding: 10px;
}

.toolBar {
  width: 180px;
  min-height: calc(100vh - 105px);
  background: white;
}

.addImgBtn {
  border-radius: 3px;
  color: black;
  border-color: gray;
  min-width: 120px;
  height: 45px;
  margin: 30px;
}

.DisplayDiv {
  width: calc(50% - 90px);
  min-height: calc(100vh - 105px);
  background: rgb(240, 242, 245);
  padding: 5px;
  font-size: 18px;
}

.DisplayArea {
  width: 100%;
  min-height: calc(100vh - 120px);
  border-width: 0px;
  outline: none;
  resize: none;
  font-size: 15px;
  background: white;
}
</style>
