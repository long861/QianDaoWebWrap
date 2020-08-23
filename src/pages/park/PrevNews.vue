<template>
  <div v-if="isRealy" class="newInfo">
    <div class="news_header">
      <h3>{{newsInfo.title}}</h3>
      <div class="newsHeader_info">
        <span>{{newsInfo.author}}</span>
        <span class="commas">|</span>
        <span>{{newsInfo.createtime | momentTime(newsInfo.createtime,'YYYY年MM月DD日 HH:mm:ss')}}</span>
        <div v-for="item in tags" :key="item" class="left_tag">
          <span class="commas">|</span>
          <span>{{item}}</span>
        </div>
      </div>
    </div>
    <div class="news_body">
      <div class="ql-container ql-snow">
        <div class="ql-editor"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../../axios";
import _ from "underscore";
import "quill/dist/quill.snow.css";
export default {
  data() {
    return {
      isRealy: false,
      newsInfo: {},
      tags: []
    };
  },
  mounted() {
    this.getNewsInfo();
    setTimeout(() => {
      $(".ql-editor").html(this.newsInfo.content);
    }, 500);
  },
  methods: {
    getNewsInfo() {
      api
        .post("/api/park/NewsInfoById", { _id: this.$route.params.newsId })
        .then(res => {
          if (res.data.code == 1050) {
            return this.$store.dispathch("LogOut").then(() => {
              location.reload();
            });
          } else if (res.data.code == 200) {
            this.newsInfo = res.data.News;
            this.tags = res.data.News.tags;
            this.isRealy = true;
          } else {
            return this.$message({
              message: res.data.message,
              type: "wraning"
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.newInfo {
  width: 800px;
  margin: 20px auto;
  padding: 10px;
  border: solid 1px #d0d0d0;
  min-height: 800px;
}
.newInfo .news_header {
  text-align: center;
}
.newInfo .news_header .newsHeader_info {
  color: #c0c0c0;
  font-size: 14px;
  margin-top: 5px;
}
.left_tag {
  display: inline-block;
}
.commas {
  display: inline-block;
  margin: 0px 10px;
}
.ql-container.ql-snow {
  border: none;
}
</style>