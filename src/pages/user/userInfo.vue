<template>
  <div class="app-container" v-loading="loading1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>我的账户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form :model="userInfo" label-width="120px" ref="userInfo" :rules="rules">
          <el-form-item label="账号" prop="title" label-width="120px">
            <el-input
              v-model="userInfo.phone"
              auto-complete="off"
              placeholder="请输入账号"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" label-width="120px" prop="name">
            <el-input v-model="userInfo.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="avatar" label-width="120px">
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
                v-if="userInfo.avatar"
                :src="userInfo.avatar"
                class="cover"
                style="width:100px;height:100px;"
              >
              <i
                v-if="!userInfo.avatar"
                class="el-icon-plus avatar-uploader-icon"
                style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;line-height: 100px;"
              ></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="个人描述" prop="introduction" label-width="120px">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入个人描述"
              v-model="userInfo.note"
            ></el-input>
          </el-form-item>
          <el-form-item label="原密码" prop="password" label-width="120px">
            <el-input type="password" v-model="userInfo.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" label-width="120px" prop="newPwd">
            <el-input type="password" v-model="userInfo.newPwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确定密码" label-width="120px" prop="newPwd2">
            <el-input type="password" v-model="userInfo.newPwd2" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="power" label-width="120px">
            <el-radio-group v-model="power">
              <el-radio
                :label="item.key"
                v-for="item in powers"
                :key="item.key"
              >{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="addLine" @click="updateUser">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { api } from "../../axios";
import md5 from 'md5';
export default {
  data() {
    var password0 = (rule, value, callback) => {
      if (value === "" && (this.userInfo.newPwd || this.userInfo.newPwd2)) {
        callback(new Error("请输入原密码"));
      } else {
        callback();
      }
    };
    var password1 = (rule, value, callback) => {
      if (value === "" && this.userInfo.password) {
        callback(new Error("请输入新密码"));
      } else {
        callback();
      }
    };
    var password2 = (rule, value, callback) => {
      if (value === "" && this.userInfo.newPwd) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userInfo.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        password: [
          { validator: password0, trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        newPwd: [
          { validator: password1, trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        newPwd2: [
          { validator: password2, trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ]
        // avatar: [{ required: true, message: "头像不能为空", trigger: "blur" }]
      },
      userInfo: {},
      loading1: true,
      // newPwd: "",
      loading: false,
      powers: [
        { key: "admin", value: "超级管理员" },
        { key: "editor", value: "普通管理员" }
      ],
      power: ""
    };
  },
  computed: {
    ...mapGetters(["loginUserId"])
  },
  methods: {
    updateUser() {
      let data = Object.assign({}, this.userInfo);
      let roles = this.power;
      // console.log('-roles',roles)
      data.roles = [roles];
      if(data.password){
        data.password = md5(data.password);
      }
      if((data.password && !data.newPwd)){
        return this.$message({
            message: '请输入新密码',
            type: "wraning"
          });
      }
      if(data.newPwd){
        data.newPwd = md5(data.newPwd);
      }
      if((data.password && !data.newPwd2)){
        return this.$message({
            message: '请输入确定密码',
            type: "wraning"
          });
      }
      if(data.newPwd2){
        data.newPwd2 = md5(data.newPwd2);
      }
      
      console.log('------data',data)
      // data.newPwd = this.newPwd;
      api.post("/api/qd/user/updateUser", data).then(res => {
        console.log('----------res update',res)
        if (res.data.code == 1050) {
          return this.$store.dispatch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 500 || res.data.code == 404) {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        } else if (res.data.code == 200) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.userInfo = res.data.userInfo;
          this.power = res.data.userInfo.roles[0];
        }
      });
    },
    getUserInfo() {
      api.post("/api/qd/user/getInfo", {}).then(res => {
        console.log('------res getInfo',res);
        if (res.data.code == 500) {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        } else if (res.data.code == 1050) {
          this.$message({
            message: res.data.message,
            type: "wraning"
          });
          return this.$store.dispatch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.userInfo = res.data.user;
          this.power = res.data.user.roles[0];
          this.loading1 = false;
        }
      });
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        Vue.set(this.userInfo, "avatar", res.data);
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
    }
  },
  mounted() {
    this.getUserInfo();
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