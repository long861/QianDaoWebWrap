<template>
  <el-form
    class="register-form"
    status-icon
    :rules="registerRules"
    ref="registerForm"
    :model="registerForm"
    label-width="0"
  >
    <div class="registerBox">
      <el-form-item prop="username">
        <el-input
          size="small"
          @keyup.enter.native="handleRegister"
          v-model="registerForm.username"
          auto-complete="off"
          placeholder="请输入用户名"
        >
          <i slot="prefix" class="icon-yonghu"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          size="small"
          @keyup.enter.native="handleRegister"
          :type="passwordType"
          v-model="registerForm.password"
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
          @click.native.prevent="handleRegister"
          class="register-submit"
        >登录</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { api } from "../../axios";
export default {
  name: "userRegister",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (this.code.value !== value) {
        this.registerForm.code = "";
        this.refreshCode();
        callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        username: "",
        password: ""
      },
      // registerForm:{},
      checked: false,
      code: {
        src: "",
        value: "",
        len: 4,
        type: "text"
      },
      registerRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码长度为4位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateCode }
        ],
        mobile: [
          { min: 11, max: 11, message: "手机号为11位", trigger: "blur" },
          { required: true, trigger: "blur", message: "请输入手机号" }
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
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.$store.dispatch("Register", this.registerForm).then(res => {
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
.registerBox {
  width: 300px;
  height: 244px;
}
.register-form .el-form-item__content {
  width: 100%;
  margin-bottom: 15px;
}
</style>
