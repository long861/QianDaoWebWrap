<template>
  <div v-if="isRealy">
    <el-col :span="24" class="toolbar">
      <el-form
        :inline="true"
        @submit.native.prevent
        style="padding-right:20px;overflow: hidden;"
        :model="filters"
      >
        <el-form-item>
          <el-input v-model="filters.name" auto-complete="off" placeholder="请输入姓名关键词">
            <template slot="prepend">按姓名查询:</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="search">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="success" v-on:click="addUser">添加</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div class="table_wrap">
      <div v-if="users.length > 0">
        <el-table :data="users" class="table_info" style="width: 100%;">
          <el-table-column type="index" min-width="60"></el-table-column>
          <el-table-column prop="username" label="账号" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="姓名" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="avatar" label="头像" min-width="90">
            <template slot-scope="scope">
              <img
                :src="scope.row.avatar"
                alt
                style="width:70px;height:70px;"
                v-if="scope.row.avatar"
              >
              <img alt style="width:0px;height:0px;" v-else>
            </template>
          </el-table-column>
          <el-table-column prop="isAdmin" label="角色" min-width="140" :formatter="Admin"></el-table-column>
          <el-table-column label="操作" min-width="230">
            <template slot-scope="scope">
              <el-button size="small" @click="userEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="removeUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="text-align: center;">
          <el-pagination
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="10"
            :total="total"
            background
            style="font-size: 20px;"
          ></el-pagination>
        </el-col>
      </div>
      <div v-else class="noMessage">{{message}}</div>
    </div>

    <!--编辑账号-->
    <el-dialog title="编辑账号" :visible.sync="dialogEdit" :close-on-click-modal="false" status-icon>
      <el-form :model="UserData" label-width="120px" ref="UserData" :rules="rules2">
        <el-form-item label="头像" prop="avatar" label-width="120px">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/One"
            :show-file-list="false"
            accept="image/jpeg, image/png"
            :on-success="uploadImg"
            :before-upload="beforeAvatarUpload"
            v-loading="loading2"
          >
            <div class="left-img">
              <img alt :src="avatar" style="width:100%;height: 100%;" v-if="avatar">
              <img src="/static/img/add.svg" alt style="width:100%" v-else>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="账号" prop="username" label-width="120px">
          <el-input type="username" v-model="UserData.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" prop="name">
          <el-input v-model="UserData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="password" label-width="120px">
          <el-input type="password" v-model="UserData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="120px" prop="newPwd">
          <el-input type="password" v-model="UserData.newPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确定密码" label-width="120px" prop="newPwd2">
          <el-input type="password" v-model="UserData.newPwd2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="power" label-width="120px" v-if="roles == 'editor'">
          <el-radio-group v-model="power">
            <el-radio
              disabled
              :label="item.key"
              v-for="item in powers"
              :key="item.key"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="power" label-width="120px" v-else>
          <el-radio-group v-model="power">
            <el-radio :label="item.key" v-for="item in powers" :key="item.key">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="个人描述" label-width="120px" prop="introduction">
          <el-input type="textarea" :rows="2" placeholder="请输入个人描述" v-model="UserData.introduction"></el-input>
        </el-form-item>
        <el-form-item style="text-align: left;">
          <el-button type="primary" class="editLine" @click="updateUser">提交</el-button>
          <el-button @click.native="dialogEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--创建账号-->
    <el-dialog title="创建账号" :visible.sync="dialogCreate" :close-on-click-modal="false">
      <el-form :model="createData" label-width="120px" ref="createData" :rules="rules">
        <el-form-item label="账号/手机号" prop="username" label-width="120px">
          <el-input type="username" v-model="createData.username" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" label-width="120px">
          <el-input type="name" v-model="createData.name"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="power" label-width="120px">
          <el-radio-group v-model="power">
            <el-radio :label="item.key" v-for="item in powers" :key="item.key">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align: left;">
          <el-button type="primary" class="editLine" @click="createUser">提交</el-button>
          <el-button @click.native="dialogCreate=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "underscore";
import axios from "axios";
import { api } from "../../axios";
export default {
  name: "report",
  data() {
    var checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号/手机号不能为空"));
      }
      var value1 = Number(value);
      var testMobile = !/^1[34578]\d{9}$/.test(value);
      if (testMobile) {
        return callback(new Error("账号/手机号格式错误,请输入手机号"));
      }
    };
    var password0 = (rule, value, callback) => {
      if (value === "" && (this.UserData.newPwd || this.UserData.newPwd2)) {
        callback(new Error("请输入原密码"));
      } else {
        callback();
      }
    };
    var password1 = (rule, value, callback) => {
      if (value === "" && this.UserData.password) {
        callback(new Error("请输入新密码"));
      } else {
        callback();
      }
    };
    var password2 = (rule, value, callback) => {
      if (value === "" && this.UserData.newPwd) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.UserData.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          { validator: checkUser, trigger: "blur" }
        ],
        power: [{ required: true, message: "角色不能为空", trigger: "blur" }]
      },
      rules2: {
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
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        power: [{ required: true, message: "角色不能为空", trigger: "blur" }]
      },
      isRealy: false,
      message: "",
      loading: false,
      loading2: false,
      users: [],
      filters: {
        name: ""
      },
      avatar: "",
      total: 0,
      page: 1,
      limit: 10,
      dialogEdit: false,
      dialogCreate: false,
      UserData: {},
      createData: {},
      power: "editor",
      powers: [
        { key: "admin", value: "超级管理员" },
        { key: "editor", value: "普通管理员" }
      ]
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  inject: ["reload"],
  mounted() {
    this.getUserList();
  },
  methods: {
    addUser() {
      this.power = "editor";
      this.createData = {};
      this.dialogCreate = true;
    },
    search() {
      this.getUserList();
    },
    userEdit(item) {
      this.UserData = _.extend({}, item);
      this.avatar = item.avatar || "";
      this.power = item.roles[0];
      this.newPwd = "";
      this.dialogEdit = true;
    },
    removeUser(item) {
      this.$confirm("确认删除该账号吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.post("api/user/removeUser", item).then(res => {
            if (res.data.code == 1050) {
              return this.$store.dispathch("LogOut").then(() => {
                location.reload();
              });
            } else if (res.data.code == 200) {
              this.$message({
                message: res.data.message,
                type: "success"
              });
              var users = this.users;
              var page = this.page;
              if (users.length - 1 == 0) {
                if (page != 1) {
                  this.page = page - 1;
                }
              }
              this.getUserList();
            } else {
              return this.$message({
                message: res.data.message,
                type: "wraning"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    },
    createUser(item) {
      const data = Object.assign({}, this.createData);
      data.roles = [this.power];
      api.post("/api/user/createUser", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.filters = { name: "" };
          this.page = 1;
          this.total = 0;
          this.dialogCreate = false;
          this.getUserList();
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    updateUser(item) {
      const data = Object.assign({}, this.UserData);
      data.avatar = this.avatar;
      data.roles = [this.power];
      api.post("/api/user/updateUser", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.dialogEdit = false;
          this.getUserList();
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    getUserList() {
      var data = {
        page: this.page,
        limit: this.limit,
        name: this.filters.name
      };
      api.post("/api/user/getUserList", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          if (res.data.message) this.message = res.data.message;
          this.users = res.data.users;
          this.total = res.data.total;
          this.isRealy = true;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getMarkers();
    },
    uploadImg(res, file) {
      if (res.code === 0) {
        this.avatar = res.data;
      } else {
        this.$message.error(res.msg);
      }
      this.loading2 = false;
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
      this.loading2 = true;
      return isJPG && isLt2M;
    },
    Admin(row, column) {
      var powers = this.powers;
      for (var i = 0; i < powers.length; i++) {
        if (powers[i].key == row.roles[0]) {
          return powers[i].value;
        }
      }
    }
  }
};
</script>

<style scoped>
.toolbar {
  padding: 20px 0px 0px 20px;
}
.left_lable {
  background-color: #f5f7fa;
  font-family: -apple-system-font, "Helvetica Neue", sans-serif;
  font-weight: normal;
  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  height: 36px;
  border: 1px solid #dcdfe6;
  border-radius: 4px 0px 0px 4px;
  padding: 0 20px;
  white-space: nowrap;
  float: left;
}
.table_wrap {
  width: 100%;
  padding: 20px;
}
.table_info {
  width: 100%;
}
.noMessage {
  width: 300px;
  margin: 150px auto;
  text-align: center;
}
.left-img {
  width: 50px;
  height: 50px;
}
.avatar-uploader {
  display: inline-block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
// <style lang ="scss">
// @import "../../styles/lineList.scss";
//
</style>