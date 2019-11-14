<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/" v-if="!moneyTypeEdit">
        <el-breadcrumb-item>创建收支类型</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-else>
        <el-breadcrumb-item>修改收支信息</el-breadcrumb-item>
        <el-breadcrumb-item>{{moneyTitle}}</el-breadcrumb-item>
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
          <el-form-item label="收支名称" prop="title">
            <el-input v-model="createForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="收支属性" prop="type">
            <el-radio-group v-model="createForm.type">
              <el-radio :label="item.key" v-for="item in options" :key="item.key">{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="默认展示" prop="status">
            <el-radio-group v-model="createForm.status">
              <el-radio :label="item.key" v-for="item in Status" :key="item.key">{{item.value}}</el-radio>
            </el-radio-group>
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
        type: [{ required: true, message: "资产属性为必选", trigger: "blur" }],
        status: [
          { required: true, message: "资产是否展示为必选", trigger: "blur" }
        ]
      },
      createForm: { type: "income", status: 1 },
      filters: {
        name: ""
      },
      options: [
        { value: "收入", key: "income" },
        { value: "支出", key: "spending" }
      ],
      Status: [{ value: "是", key: 1 }, { value: "否", key: 0 }],
      loading: false,
      moneyTypeEdit: false,
      moneyTitle: ""
    };
  },
  mounted() {
    if (this.$route.params.moneyTypeId) {
      this.getMoneyTypeInfo();
    } else {
      this.isRealy = true;
    }
  },
  methods: {
    getMoneyTypeInfo() {
      api
        .post("/api/money/MoneyTypeInfoById", {
          _id: this.$route.params.moneyTypeId
        })
        .then(res => {
          console.log("===res", res);
          if (res.data.code == 1050) {
            return this.$store.dispathch("LogOut").then(() => {
              location.reload();
            });
          } else if (res.data.code == 200) {
            this.moneyTypeEdit = true;
            if (res.data.moneyTypes) {
              this.createForm = res.data.moneyTypes;
              this.moneyTitle = res.data.moneyTypes.title;
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
      if (!data.cover) {
        return this.$message({
          message: "请上传封面图片",
          type: "wraning"
        });
      }
      api.post("/api/money/createMoneyTypeDafult", data).then(res => {
        console.log("======res", res);
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          if (!this.moneyTypeEdit) {
            var message = () =>
              this.$message({
                message: "添加成功",
                type: "success"
              });
            var toLineList = () => {
              this.$router.push({
                path: "/money/defaultType/list",
                name: "默认收支类型"
              });
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
              this.$router.push({
                path: "/money/defaultType/list",
                name: "默认收支类型"
              });
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