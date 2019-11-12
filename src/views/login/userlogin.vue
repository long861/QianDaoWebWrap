<template>
  <el-form
    class="login-form"
    status-icon
    :rules="loginRules"
    ref="loginForm"
    :model="loginForm"
    label-width="0"
  >
    <div class="loginBox">
      <el-form-item prop="phone">
        <el-input
          size="small"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.phone"
          auto-complete="off"
          placeholder="请输入手机号"
        >
          <i slot="prefix" class="icon-yonghu"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          size="small"
          @keyup.enter.native="handleLogin"
          :type="passwordType"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="请输入密码"
        >
          <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
          <i slot="prefix" class="icon-mima"></i>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="checked">记住账号</el-checkbox>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click.native.prevent="handleLogin"
          class="login-submit"
        >登录</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { api } from "../../axios";
export default {
  name: "userlogin",
  data() {
     const validatorPhoneNumber = function (rule, value, callback) {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if(!value){
            return callback(new Error('请输入手机号'))
        }else if(reg.test(value)){
            return callback()
        }else {
            return callback(new Error('手机号格式不正确'))
        }
    }
    const validateCode = (rule, value, callback) => {
      if (this.code.value !== value) {
        this.loginForm.code = "";
        this.refreshCode();
        callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        phone: "",
        password: ""
      },
      checked: false,
      code: {
        src: "",
        value: "",
        len: 4,
        type: "text"
      },
      loginRules: {
        phone: [
          {required: true,trigger: 'blur', validator: validatorPhoneNumber}
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" },
        ]
      },
      passwordType: "password"
    };
  },
  created() {},
  mounted() {},
  computed: {},
  props: [],
  methods: {
    showPassword() {
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          console.log('======',this.loginForm)
          this.$store.dispatch("Login", this.loginForm).then(res => {
            console.log('===login',res)
            if (res.data.code == 200) {
              this.$router.replace({ path: "/dashboard/dashboard" });
            } else if (res.data.code == 505) {
              this.$message({
                message: res.data.message,
                type: "wraning"
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "wraning"
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style>
.loginBox {
  width: 300px;
  height: 244px;
}
.login-form .el-form-item__content {
  width: 100%;
  margin-bottom: 15px;
}
</style>
