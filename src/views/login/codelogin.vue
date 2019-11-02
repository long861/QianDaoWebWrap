<template>
  <el-form class="login-form" status-icon ref="loginForm" :model="loginForm" label-width="0">
    <div class="qrBox">
      <qrcode :value="qrcode" :options="{ size: 200 }"></qrcode>
    </div>
    <div class="qrcode-status">
      <span :class="qclass">{{qstatus}}</span>
    </div>
  </el-form>
</template>

<script>
import { isvalidatemobile } from "@/utils/validate";
import { mapState, mapGetters } from "vuex";
export default {
  name: "codelogin",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      }
    };
  },
  created() {},
  mounted() {},
  watch: {
    token(newToken, oldToken) {
      if (newToken) {
        this.$router.replace({ path: "/dashboard/dashboard" });
      }
    }
  },
  computed: {
    ...mapGetters(["qrcode", "token", "qstatus", "qclass"])
  },
  props: [],
  methods: {}
};
</script>

<style>
.yanzhengma {
  display: block;
  margin-top: 8px;
}
.msg-text {
  display: block;
  width: 60px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.msg-text.display {
  color: #ccc;
}
.qrBox {
  width: 300px;
  height: 200px;
  text-align: center;
}
.qrcode-status {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}
.qstatus-success {
  background-color: #ebf5e6;
  border-color: #cde5c1;
  color: #67c23a;
}
.qstatus-fail {
  background-color: #faebeb;
  border-color: #f5d7d7;
  color: #e55c5c;
}
</style>
