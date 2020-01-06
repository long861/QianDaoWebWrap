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
      <el-form-item prop="phone">
        <el-input
          size="small"
          @keyup.enter.native="handleRegister"
          v-model="registerForm.phone"
          auto-complete="off"
          placeholder="请输入手机号"
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
      <el-form-item prop="pwd">
        <el-input
          size="small"
          @keyup.enter.native="handleRegister"
          v-model="registerForm.pwd"
          :type="pwdType"
          auto-complete="off"
          placeholder="请再次密码"
        >
          <i class="el-icon-view el-input__icon" slot="suffix" @click="showPwd"></i>
          <i slot="prefix" class="icon-mima"></i>
        </el-input>
      </el-form-item>
      <div class="register_role">
        <el-radio v-model="registerForm.role" label="1">管理员</el-radio>
        <el-radio v-model="registerForm.role" label="2">会员</el-radio>
      </div>

      <!-- <el-checkbox v-model="checked">记住账号</el-checkbox> -->
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click.native.prevent="handleRegister"
          class="register-submit"
        >注册</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { api } from "../../axios";
import md5 from "md5";
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
    const validatePwd = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error("两次密码不相同"));
      } else {
        callback();
      }
      console.log("=====value", value);
      console.log("====password", this.registerForm.password);
    };
    const validatePassword = (rule, value, callback) => {
      if (
        value.length > 0 &&
        this.registerForm.pwd.length > 0 &&
        value !== this.registerForm.pwd
      ) {
        callback(new Error("两次密码不相同"));
      } else {
        callback();
      }
    };
    const validatorPhoneNumber = function(rule, value, callback) {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("手机号格式不正确"));
      }
    };
    return {
      registerForm: {
        username: "",
        password: "",
        pwd: "",
        role: "1",
        phone: ""
      },
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
        phone: [
          { required: true, trigger: "blur", validator: validatorPhoneNumber }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        pwd: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validatePwd }
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
      passwordType: "password",
      pwdType: "password"
    };
  },
  created() {},
  mounted() {},
  computed: {},
  props: [],
  inject: ["reload"],
  methods: {
    showPassword() {
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    showPwd() {
      this.pwdType === "" ? (this.pwdType = "password") : (this.pwdType = "");
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        console.log("=====vaild", valid);
        if (valid) {
          let { password, pwd, phone, role, username } = this.registerForm;
          password = md5(password);
          pwd = md5(pwd);
          let data = { username, password, pwd, phone, role };
          api
            .post("/api/qd/user/register", data)
            .then(res => {
              console.log("======res register", res);
              var result = res.data;
              if (result.code !== 200) {
                this.$message({
                  message: result.message,
                  type: "wraning"
                });
              } else {
                this.$message({
                  message: "注册成功，请登录",
                  type: "success"
                });
                this.reload();
              }
            })
            .catch(error => {
              this.$message({
                message: error,
                type: "wraning"
              });
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
}
.register_role {
  text-align: center;
  margin-bottom: 5px;
}
.register-submit {
  width: 100%;
  border-radius: 15px;
}
</style>
