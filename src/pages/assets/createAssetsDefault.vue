<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/" v-if="!assetsEdit">
        <el-breadcrumb-item>创建资产类型</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-else>
        <el-breadcrumb-item>修改资产信息</el-breadcrumb-item>
        <el-breadcrumb-item>{{assetsTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form :model="createForm" label-width="80px" ref="createForm" :rules="rules">
          <el-form-item label="封面图片" prop="cover" required>
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
                v-if="createForm.cover"
                :src="createForm.cover"
                class="cover"
                style="width:100px;height:100px;"
              />
              <i
                v-if="!createForm.cover"
                class="el-icon-plus avatar-uploader-icon"
                style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;line-height: 100px;"
              ></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="资产名称" prop="title">
            <el-input v-model="createForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资产属性" prop="type">
            <el-radio-group v-model="createForm.type">
              <el-radio :label="item.key" v-for="item in options" :key="item.key">{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="默认颜色" prop="color">
            <el-color-picker v-model="createForm.color" show-alpha :predefine="predefineColors"></el-color-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="addLine" @click="createData">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { api } from "../../axios";
import _ from "underscore";
export default {
  data() {
    return {
      rules: {
        title: [
          { required: true, message: "资产名称不能为空", trigger: "blur" }
        ],
        type: [{ required: true, message: "资产属性为必选", trigger: "blur" }],
        color: [{ required: true, message: "颜色不能为空", trigger: "blur" }]
      },
      createForm: { type: "assets", color: "rgba(255, 69, 0, 0.68)" },
      filters: {
        name: ""
      },
      options: [
        { value: "资产", key: "assets" },
        { value: "负债", key: "liabilities" }
      ],
      loading: false,
      assetsEdit: false,
      assetsTitle:"",
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577"
      ]
    };
  },
  mounted() {
    if (this.$route.params.assetsId) {
      this.getAssetsInfo();
    } else {
      this.isRealy = true;
    }
  },
  methods: {
    getAssetsInfo() {
      api
        .post("/api/assets/assetsInfoById", {
          _id: this.$route.params.assetsId
        })
        .then(res => {
          console.log("===res", res);
          if (res.data.code == 1050) {
            return this.$store.dispathch("LogOut").then(() => {
              location.reload();
            });
          } else if (res.data.code == 200) {
            this.assetsEdit = true;
            if (res.data.assets) {
              this.createForm = res.data.assets;
              this.assetsTitle = res.data.assets.title;
            } else {
              return this.$message({
                message: "当前资产已被删除",
                type: "wraning"
              });
            }
          } else {
            return this.$message({
              message: res.data.message,
              type: "wraning"
            });
          }
        });
    },
    createData() {
      const data = Object.assign({}, this.createForm);
      api.post("/api/assets/createAssetsDafult", data).then(res => {
        console.log('======res',res)
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          if (!this.assetsEdit) {
            var message = () =>
              this.$message({
                message: "添加成功",
                type: "success"
              });
            var toLineList = () => {
              this.$router.push({ path: "/assets/list", name: "默认资产管理" });
            };
            var asyncFun = async () => {
              await message();
              await toLineList();
            };
            return asyncFun();
          } else {
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            setTimeout(() => {
              this.$router.push({ path: "/assets/list", name: "默认资产管理" });
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
    handleAvatarSuccess(res, file) {
      this.avatarUploading = false;
      if (res.code === 0) {
        Vue.set(this.createForm, "cover", res.data);
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
      if (isJPG && isLt2M) this.avatarUploading = true;
      this.loading = true;
      return isJPG && isLt2M;
    }
  }
};
</script>

<style scoped>
.form-box {
  width: 100%;
}
.left-img {
  width: 50px;
  height: 50px;
}
.avatar-uploader {
  display: inline-block;
}
.avatar-uploader-icon[data-v-1b58e498] {
  line-height: 100px;
  position: relative;
}
.el-icon-plus:before {
  position: absolute;
  left: 40px;
}
.app-container {
  overflow-y: hidden;
}
#container {
  height: 500px;
}
</style>