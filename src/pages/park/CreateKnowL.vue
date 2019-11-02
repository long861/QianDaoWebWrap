<template>
  <div class="app-container" v-if="isRealy">
    <div class="crumbs">
      <el-breadcrumb separator="/" v-if="!editNews">
        <el-breadcrumb-item>创建</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-else>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
        <el-breadcrumb-item>{{newTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form :model="newsInfo" label-width="120px" ref="newsInfo" :rules="rules">
          <el-form-item label="标题" prop="title" label-width="120px">
            <el-input v-model="newsInfo.title" auto-complete="off" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="概述" prop="summary" label-width="120px">
            <el-input v-model="newsInfo.summary" auto-complete="off" placeholder="请输入概述"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover" label-width="120px">
            <el-upload
              class="avatar-uploader"
              action="/api/upload/One"
              :show-file-list="false"
              accept="image/jpeg, image/png"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              v-loading="loading"
            >
              <img
                v-if="newsInfo.cover"
                :src="newsInfo.cover"
                class="cover"
                style="width:100px;height:100px;"
              >
              <i
                v-if="!newsInfo.cover"
                class="el-icon-plus avatar-uploader-icon"
                style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;line-height: 100px;"
              ></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容" prop="content" label-width="120px">
            <editor
              class="editor"
              :value="newsInfo.content"
              v-on:text_change="on_text_change"
              style="width:100%;"
            ></editor>
          </el-form-item>
          <el-form-item label="类别" prop="tags" label-width="120px">
            <el-radio-group v-model="newsInfo.tags">
              <el-radio :label="item.value" v-for="item in tagsBox" :key="item.value">{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="addLine" @click="createNew">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "underscore";
import Editor from "@/pages/tinymac/editor";
import axios from "axios";
import { api } from "../../axios";
export default {
  data() {
    var checkCount = (rule, value, callback) => {
      var value1 = Number(value);
      if (!value1) {
        callback(new Error("请输入有效数字"));
      } else {
        if (value1 <= 1) {
          callback(new Error("团队赛人数应大于1"));
        } else {
          callback();
        }
      }
    };
    return {
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        summary: [{ required: true, message: "概述不能为空", trigger: "blur" }],
        tags: [{ required: true, message: "类别不能为空", trigger: "blur" }],
        content: [
          { required: true, message: "动态内容不能为空", trigger: "blur" }
        ]
      },
      changeTw: false,
      editNews: false,
      isRealy: false,
      newTitle: "",
      text_change: "",
      newsInfo: { tags: "定向讲堂" },
      tagsBox: [{ value: "定向讲堂" }, { value: "定向宝典" }],
      loading: false
    };
  },
  components: {
    Editor
  },
  inject: ["reload"],
  mounted() {
    if (this.$route.params.newsId) {
      this.getNewsInfo();
    } else {
      this.isRealy = true;
    }
  },
  methods: {
    on_text_change(value) {
      if (!this.changeTw) {
        this.changeTw = true;
      }
      this.text_change = value;
    },
    createNew() {
      const data = Object.assign({}, this.newsInfo);
      data.content = this.text_change || this.newsInfo.content; //注意修改时的tetx
      data.tags = [data.tags];
      api.post("/api/park/createKnowL", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          if (!this.editNews) {
            this.$message({
              message: "创建成功",
              type: "success"
            });
            setTimeout(() => {
              this.$router.push({ path: "/park/knowledge", name: "定向知识" });
            }, 1000);
          } else {
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            setTimeout(() => {
              this.$router.push({ path: "/park/knowledge", name: "定向知识" });
            }, 1000);
          }
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    getNewsInfo() {
      api
        .post("/api/park/NewsInfoById", { _id: this.$route.params.newsId })
        .then(res => {
          if (res.data.code == 1050) {
            return this.$store.dispathch("LogOut").then(() => {
              location.reload();
            });
          } else if (res.data.code == 200) {
            var news = _.extend({}, res.data.News);
            var tag = news.tags[0];
            news.tags = "";
            news.tags = tag;
            this.newsInfo = news;
            this.newTitle = news.title;
            this.editNews = true;
            this.isRealy = true;
          } else {
            return this.$message({
              message: res.data.message,
              type: "wraning"
            });
          }
        });
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        Vue.set(this.newsInfo, "cover", res.data);
        this.$message({
          message: "封面上传成功",
          type: "success"
        });
      } else {
        this.$message.error(res.msg);
      }
      this.loading = false;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type == "image/jpeg" || file.type == "image/png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      this.loading = true;
      return isJPG && isLt2M;
    }
  }
};
</script>

<style scoped>
.app-container {
  overflow-y: hidden;
}
/* #container {
  height: 500px;
} */
.form-box {
  width: 100%;
}
.avatar-uploader {
  display: inline-block;
}
</style>