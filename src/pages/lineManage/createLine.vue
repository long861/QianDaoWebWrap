<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>创建线路</el-breadcrumb-item>
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
              >
              <i
                v-if="!createForm.cover"
                class="el-icon-plus avatar-uploader-icon"
                style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;line-height: 100px;"
              ></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="线路名称" prop="name">
            <el-input v-model="createForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="线路属性" prop="_type">
            <el-radio-group v-model="createForm._type">
              <el-radio :label="item.key" v-for="item in line_type" :key="item.key">{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="createForm._type == 'team'">
            <el-form-item label="队伍人数" prop="_count">
              <el-input type="radius" v-model="createForm._count">
                <template slot="append">人</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="线路描述" prop="desc">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="createForm.desc"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动时间" required>
            <el-col :span="11">
              <el-form-item prop="_start">
                <div class="block">
                  <el-date-picker
                    v-model="createForm._start"
                    type="datetime"
                    placeholder="请选择线路开启时间"
                    style="width:100%;"
                  ></el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center;">~</el-col>
            <el-col :span="11">
              <el-form-item prop="_end">
                <div class="block">
                  <el-date-picker
                    v-model="createForm._end"
                    type="datetime"
                    placeholder="请选择线路关闭时间"
                    style="width:100%;"
                  ></el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="线路主题" required>
            <el-select
              v-model="tagBox"
              multiple
              placeholder="请选择"
              @change="selectGet"
              style="display:block;"
            >
              <el-option
                v-for="item in options"
                :key="item.themeId"
                :label="item.name"
                :value="item.themeId"
              ></el-option>
            </el-select>
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
    var checkCount = (rule, value, callback) => {
      var value1 = Number(value);
      if (!value1) {
        callback(new Error("请输入有效数字"));
      } else {
        if (value1 <= 1) {
          callback(new Error("团队赛人数应大于1"));
        } else {
          callback();
        }
      }
    };
    return {
      rules: {
        name: [
          { required: true, message: "点标名称不能为空", trigger: "blur" }
        ],
        _type: [{ required: true, message: "线路属性为必选", trigger: "blur" }],
        _count: [
          { required: true, message: "人数不能为空", trigger: "blur" },
          { validator: checkCount, trigger: "blur" }
        ],
        desc: [{ required: true, message: "线路描述不能为空", trigger: "blur" }]
      },
      createForm: { _type: "team", isShow: false },
      isRealy: false,
      tags: [],
      tagBox: [],
      filters: {
        name: ""
      },
      options: [],
      line_type: [
        { key: "team", value: "团队赛" },
        { key: "self", value: "个人赛" }
      ],
      loading: false
    };
  },
  mounted() {
    this.getTheme();
    $("label[for='max']").css("text-align", "center");
  },
  methods: {
    createData() {
      const data = Object.assign({}, this.createForm);
      data.tags = this.tagsBox;
      api.post("/api/matchLines/createLine", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          var message = () =>
            this.$message({
              message: "添加成功",
              type: "success"
            });
          var toLineList = () => {
            this.$router.push({ path: "/lineManage/list", name: "线路管理" });
          };
          var asyncFun = async () => {
            await message();
            await toLineList();
          };
          return asyncFun();
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    selectGet(value) {
      var tagsBox = [];
      let obj = {};
      value.find(val => {
        var obj = this.options.find(item => {
          return item.themeId == val;
        });
        tagsBox.push(obj);
      });
      this.tagsBox = tagsBox;
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
    },
    getTheme() {
      api.post("/api/theme/getThemeAll", {}).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.options = res.data.themes;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
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
.lineNum {
  overflow: hidden;
}
.lineNum .min,
.lineNum .max {
  float: left;
}
#container {
  height: 500px;
}
.csssprite.active {
  border: "solid 2px #d0d0d0";
  border-radius: "50%";
}
.choice_merker {
  font-size: 12px;
  line-height: 0px;
  display: inline-block;
  padding: 10px 5px;
  border: solid 1px #e0e0e0;
  border-radius: 5px;
  margin-right: 5px;
}
.remove_marker {
  cursor: pointer;
}
</style>