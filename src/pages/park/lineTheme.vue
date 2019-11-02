<template>
  <div class="app-container" v-if="isRealy">
    <div class="crumbs">
      <el-breadcrumb separator="/" v-if="isEdit">
        <el-breadcrumb-item>编辑线路主题</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-else>
        <el-breadcrumb-item>创建线路主题</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form :model="themeInfo" label-width="120px" ref="themeInfo" :rules="rules">
          <el-form-item label="名称" prop="name" label-width="120px">
            <el-input v-model="themeInfo.name" auto-complete="off" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="概述" prop="summary" label-width="120px">
            <el-input v-model="themeInfo.summary" auto-complete="off" placeholder="请输入概述"></el-input>
          </el-form-item>
          <el-form-item label="主题封面" prop="cover" label-width="120px">
            <el-upload
              class="avatar-uploader"
              action="/api/upload/One"
              :show-file-list="false"
              accept="image/jpeg,image/png"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              v-loading="loading"
            >
              <img
                v-if="themeInfo.cover"
                :src="themeInfo.cover"
                class="cover"
                style="width:100px;height:100px;"
              >
              <i
                v-if="!themeInfo.cover"
                class="el-icon-plus avatar-uploader-icon"
                style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;line-height: 100px;"
              ></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="主题内容" prop="content" label-width="120px">
            <editor
              class="editor"
              :value="themeInfo.content"
              v-on:text_change="on_text_change"
              style="width:100%;"
            ></editor>
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
    return {
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        summary: [{ required: true, message: "概述不能为空", trigger: "blur" }],
        content: [
          { required: true, message: "主题内容不能为空", trigger: "blur" }
        ]
      },
      // changeTw: false,
      // editNews: false,
      isRealy: false,
      isEdit:false,
      text_change: "",
      themeInfo: {},
      loading: false,
      content: "",
      isChange: false
    };
  },
  components: {
    Editor
  },
  inject: ["reload"],
  mounted() {
    if (this.$route.params.themeId) {
      this.isEdit = true;
      this.getTheme();
    } else {
      this.isRealy = true;
    }
  },
  methods: {
    createNew() {
      var data = Object.assign({}, this.themeInfo);
      if (this.isChange) {
        data.content = this.content;
      } else {
        data.content = this.themeInfo.content;
      }
      api.post("/api/theme/createTheme", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispatch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          return this.$router.push({
            path: "/park/themeList",
            name: "线路主题"
          });
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    on_text_change(value) {
      this.content = value;
      this.isChange = true;
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        Vue.set(this.themeInfo, "cover", res.data);
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
      const isJPG = (file.type == "image/jpeg") || (file.type == "image/png");
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      this.loading = true;
      return isJPG && isLt2M;
    },
    getTheme() {
      var data = { _id: this.$route.params.themeId };
      api.post("/api/theme/getThemeById", data).then(res => {
        if (res.data.code == 200) {
          this.themeInfo = res.data.theme;
          this.isRealy = true;
        } else if (res.data.code == 1050) {
          return this.$store.dispatch("LogOut").then(() => {
            location.reload();
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "wraning"
          });
          return history.go(-1);
        }
      });
    }
  }
};
</script>

<style scoped>
.app-container {
  overflow-y: hidden;
}
.form-box {
  width: 100%;
}
.avatar-uploader {
  display: inline-block;
}
</style>