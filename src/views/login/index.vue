<template>
  <div class="login">
    <div class="login-container pull-height" @keyup.enter.native="handleLogin">
      <div class="login-info text-white animated fadeInLeft">
        <div class="logo" style="margin-top:-426px">
          <!-- <img
            :src="website(_host_).logo"
            width="160px"
            height="160px"
            alt="logo"
            style="vertical-align: middle;border-radius: 50%;"
          > -->
          <img
            src="../../images/logo.jpg"
            width="160px"
            height="160px"
            alt="logo"
            style="vertical-align: middle;border-radius: 50%;"
          >
        </div>
        <h2 class="login-info-title">{{website(_host_).info.title}}</h2>
        <ul class="login-info-list">
          <li class="login-info-item" v-for="(item, index) in website(_host_).info.list" :key="index">
            <!-- <i class="el-icon-check"></i> -->
            &nbsp;{{item}}
          </li>
        </ul>
      </div>
      <div class="login-border animated fadeInRight">
        <div class="login-main">
          <h4 class="login-title">登录{{website(_host_).title}}</h4>
          <el-tabs v-model="activeName">
            <el-tab-pane label="扫码登录" name="code">
              <codeLogin></codeLogin>
            </el-tab-pane>
            <el-tab-pane label="用户密码" name="user">
              <userLogin></userLogin>
            </el-tab-pane>
            <el-tab-pane label="用户注册" name="userRegister">
              <userRegister></userRegister>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="foot-copyright">
      <span>©2019 {{website(_host_).provider}}</span>
    </div>
  </div>
</template>
<script>
import userLogin from "./userlogin";
import codeLogin from "./codelogin";
import userRegister from './userRegister';
import { mapGetters } from "vuex";
export default {
  name: "login",
  components: {
    userLogin,
    codeLogin,
    userRegister
  },
  data() {
    return {
      activeName: "code"
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["website"])
  },
  props: [],
  methods: {
    getdomaininfo() {
      
    }
  }
};
</script>

<style lang="scss">
.login {
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}
.login-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
  height: 900px;
}
.login-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/top_images/login.png");
  background-size: cover;
}
.login-info {
  padding-left: 60px;
}
.login-info-title {
  line-height: 90px;
}
.login-info-item {
  font-size: 14px;
}
.login-border {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 30px 50px 25px 50px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 1px 1px 2px #eee;
}
.login-main {
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
}
.login-main > h3 {
  margin-bottom: 20px;
}
.login-main > p {
  color: #76838f;
}
.login-title {
  margin: 0 0 20px;
  text-align: center;
  color: #409eff;
  letter-spacing: 3px;
}
.login-submit {
  margin-top: 20px;
  width: 100%;
  border-radius: 28px;
}
.login-form {
  margin: 10px 0;
  .el-form-item__content {
    width: 270px;
  }
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-input {
    input {
      text-indent: 5px;
      border-color: #dcdcdc;
      border-radius: 3px;
    }
    .el-input__prefix {
      i {
        padding: 0 5px;
        font-size: 16px !important;
      }
    }
  }
}
.login-code {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 0 0 10px;
}
.login-code-img {
  margin-top: 2px;
  width: 100px;
  height: 32px;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 32px;
  text-indent: 5px;
  text-align: center;
}
.foot-copyright {
  text-align: center;
}
.el-tabs__content{
  overflow: auto;
  min-height: 330px;
}
</style>