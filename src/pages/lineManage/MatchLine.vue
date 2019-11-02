<template>
  <div>
    <!--顶部工具条 （查询、新增、批量删除）-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="filters.name">
            <template slot="prepend">线路名称:</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="lineTag" placeholder="请选择线路类型">
            <el-option
              v-for="item in options"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            >
              <template slot="prepend"></template>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="searchLines">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" v-on:click="addLine">添加线路</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 线路列表 组件-->
    <div class="line">
      <div class="list">
        <div class="wrap" v-for="(item,index) in lines" :key="index">
          <div class="left">
            <span class="index">{{index + 1}}</span>
            <div class="left-img" :style="'background-image:url('+item.cover+')'"></div>
            <div class="left-desc">
              <div class="left-desc-head">
                <p class="left-desc-name">{{item.name}}</p>
                <span class="left-desc-time">{{item.created | momentTime('YYYY-MM-DD')}}</span>
              </div>
              <p class="left-desc-explain" :title="item.desc">{{item.desc}}</p>
              <div class="left-desc-tags">
                <span
                  v-for="(tag,index) in item.tags"
                  :key="index"
                  :style="{color:tag.color}"
                >#{{tag.name}}</span>
              </div>
            </div>
          </div>
          <div class="right">
            <el-button type="primary" class="edit-marker">点标设置</el-button>
            <el-button
              type="primary"
              class="edit-info"
              @click="handleEdit($event)"
              :id="item._id"
              :img="item.cover"
            >信息编辑</el-button>
            <el-button
              type="danger"
              class="edit-delete"
              @click.native="handleDel($event)"
              :id="item._id"
            >删除线路</el-button>
          </div>
        </div>
      </div>
    </div>

    <!--底部工具条 （页码）-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!-- 创建线路 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogLine"
      :close-on-click-modal="false"
      v-loading="avatarUploading"
      element-loading-text="拼命上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      v-if="dialogStatus == 'create'"
    >
      <el-form :model="createForm" label-width="80px" ref="createForm">
        <el-form-item label="封面图片" prop="cover" required>
          <el-upload
            class="avatar-uploader"
            action="/api/upload/One"
            :show-file-list="false"
            accept="image/jpeg, image/png"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="createForm.cover"
              :src="createForm.cover"
              class="cover"
              style="width:100px;height:100px;"
            >
            <i
              class="el-icon-plus avatar-uploader-icon"
              style="border: 1px dashed #d9d9d9;width:100px;height:100px;"
            ></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="线路名称" prop="name" required>
          <el-input v-model="createForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="线路描述" prop="desc" required>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="createForm.desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <div class="block">
                <el-date-picker v-model="createForm.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="线路标签" required>
          <el-select v-model="tags" multiple placeholder="请选择" @change="selectGet">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogLine=false">取消</el-button>
        <el-button type="primary" class="addLine" @click="createData">添加</el-button>
      </div>
    </el-dialog>

    <!--编辑线路-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogLine"
      :close-on-click-modal="false"
      v-loading="avatarUploading"
      element-loading-text="拼命上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      v-else-if="dialogStatus == 'update'"
    >
      <el-form :model="editForm" label-width="80px" ref="editForm">
        <el-form-item label="封面图片" prop="cover" required>
          <el-upload
            class="avatar-uploader"
            action="/api/upload/One"
            :show-file-list="false"
            accept="image/jpeg, image/png"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="editForm.cover"
              :src="editForm.cover"
              class="cover"
              style="width:100px;height:100px;"
            >
            <i
              class="el-icon-plus avatar-uploader-icon"
              style="border: 1px dashed #d9d9d9;width:100px;height:100px;"
            ></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="线路名称" prop="name" required>
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="线路描述" prop="desc" required>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="editForm.desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <div class="block">
                <el-date-picker v-model="editForm.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="线路标签" required>
          <el-select v-model="tags" multiple placeholder="请选择" @change="selectGet">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogLine=false">取消</el-button>
        <el-button type="primary" class="editLine" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getLinesList, removeLine, editLine, addLine } from "@/api/lines";
import UploadOne from "@/pages/upload/UploadOne";
import axios from "axios";
import { api } from "../../axios";
import _ from "underscore";
export default {
  name: "report",
  data() {
    return {
      lineTag: null,
      MatchId: "",
      page: 1,
      limit: 10,
      tags: [],
      tagBox: [],
      options: [
        { name: "无限制", value: "无限制", color: "orange" },
        { name: "亲子路线", value: "亲子路线", color: "green" },
        { name: "红色路线", value: "红色路线", color: "red" },
        { name: "情侣路线", value: "情侣路线", color: "red" },
        { name: "游览路线", value: "游览路线", color: "blue" }
      ],
      filters: {
        name: ""
      },
      lines: [],
      avatarUploading: false,
      // img:'',
      total: 0,
      textMap: {
        //弹出框状态、编辑或保存
        update: "编辑线路",
        create: "创建线路"
      },
      dialogStatus: "",
      dialogLine: false, //弹出框状态
      editForm: {},
      createForm: {},
      formType: 0,
      dialogImageUrl: "",
      dialogVisible: false,
      inputVisible: false,
      inputValue: ""
    };
  },
  components: {
    UploadOne
  },
  inject: ["reload"],
  methods: {
    // 显示编辑界面
    handleEdit(e) {
      this.formType = 0;
      this.dialogStatus = "update";
      const id = e.currentTarget.id;
      this.editForm = this.lines.find(n => {
        return n._id == id;
      });
      this.tags = this.editForm.tagsBox;
      this.tagsBox = this.editForm.tags;
      this.dialogLine = true;
    },
    // 显示新增界面
    addLine() {
      this.formType = 1;
      this.createForm.name = "";
      this.createForm.desc = "";
      this.createForm.cover = "";
      this.tags = [];
      this.tagsBox = [];
      this.createForm = {
        matchId: this.$route.params.matchId,
        name: "",
        desc: "",
        cover: "",
        tags: []
      };
      this.dialogStatus = "create";
      this.dialogLine = true;
    },
    handleAvatarSuccess(res, file) {
      this.avatarUploading = false;
      if (this.formType == 0) {
        if (res.code === 0) {
          this.editForm.cover = res.data;
        } else {
          this.$message.error(res.msg);
        }
      } else if (this.formType == 1) {
        if (res.code === 0) {
          this.createForm.cover = res.data;
        } else {
          this.$message.error(res.msg);
        }
      }
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
      return isJPG && isLt2M;
    },
    // 编辑
    updateData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            const data = Object.assign({}, this.editForm);
            data.tags = this.tagsBox;
            if (data.tags.length == 0) {
              return this.$message({
                message: "请选择线路标签",
                type: "warning"
              });
            }
            api.post("api/matchLines/edit", data).then(res => {
              if (res.data.code == 1050) {
                return this.$store.dispathch("LogOut").then(() => {
                  location.reload();
                });
              } else if (res.data.code == 200) {
                this.reload();
              } else {
                return this.$message({
                  message: res.data.message,
                  type: "wraning"
                });
              }
            });
          });
        }
      });
    },
    selectGet(value) {
      var tagsBox = [];
      let obj = {};
      value.find(val => {
        var obj = this.options.find(item => {
          return item.name == val;
        });
        tagsBox.push(obj);
      });
      this.tagsBox = tagsBox;
    },
    // 新增
    createData: function() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            const data = Object.assign({}, this.createForm);
            data.tags = this.tagsBox;
            if (data.tags.length == 0) {
              return this.$message({
                message: "请选择线路标签",
                type: "warning"
              });
            }
            api.post("api/matchLines/create", data).then(res => {
              if (res.data.code != 200) {
                return this.$message({
                  message: "提交成功",
                  type: "success"
                });
              }
              this.dialogLine = false;
              this.reload();
            });
          });
        }
      });
    },
    // 删除
    handleDel(e) {
      const event = e;
      const id = e.currentTarget.id;
      this.$confirm("确认删除该线路吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.post("/api/matchLines/remove", { _id: id }).then(res => {
          if (res.data.code == 1050) {
            return this.$store.dispathch("LogOut").then(() => {
              location.reload();
            });
          } else if (res.data.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.reload();
          } else {
            return this.$message({
              message: res.data.message,
              type: "wraning"
            });
          }
        });
      });
    },
    // 切换页码
    handleCurrentChange(val) {
      this.page = val;
      this.getGroups();
    },
    // 查询
    searchLines() {
      var that = this;
      var data = {
        matchId: that.$route.params.matchId,
        gameId: that.$route.params.gameId,
        page: this.page,
        limit: this.limit,
        name: this.filters.name,
        lineTag: this.lineTag
      };
      api.post("/api/matchLines/searchLines", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          var resData = res.data.data;
          for (var i = 0; i < resData.length; i++) {
            resData[i].tagsBox = _.pluck(resData[i].tags, "value");
          }
          that.lines = resData;
          this.total = res.data.total;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    // 获取线路列表
    getLines() {
      var that = this;
      var MatchId = that.$route.params.matchId;
      var gameId = that.$route.params.gameId;
      var data = {
        matchId: MatchId,
        gameId,
        page: this.page,
        limit: this.limit
      };
      api.post("/api/matchLines/BymatchId", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          var resData = res.data.data;
          for (var i = 0; i < resData.length; i++) {
            resData[i].tagsBox = _.pluck(resData[i].tags, "value");
          }
          that.lines = resData;
          this.total = res.data.total;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    }
  },
  mounted() {
    this.getLines();
  }
};
</script>

<style scoped>
.avatar-uploader-icon[data-v-1b58e498] {
  line-height: 100px;
  position: relative;
}
.el-icon-plus:before {
  position: absolute;
  left: 35px;
}
.toolbar {
  padding: 20px 0px 0px 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang ="scss">
@import "../../styles/lineList.scss";
</style>
