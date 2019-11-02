<template>
  <div v-loading="loading">
    <el-col :span="24" class="toolbar">
      <el-form
        :inline="true"
        :model="filters"
        @submit.native.prevent
        style="padding-right:30px;overflow: hidden;"
      >
        <el-form-item>
          <el-input v-model="filters.name">
            <template slot="prepend">线路名称:</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="lineTag" placeholder="请选择线路主题">
            <el-option
              v-for="item in options"
              :key="item.themeId"
              :label="item.name"
              :value="item.themeId"
            >
              <template slot="prepend"></template>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="searchLines">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="success" v-on:click="addLine">添加线路</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <div v-show="lines.length != 0" v-if="isRealy">
      <el-col :span="24" class="toolbar">
        <div class="line">
          <div class="list">
            <div
              class="wrap"
              v-for="(item,index) in lines"
              :key="index"
              style="width:100%;padding-right:30px;"
            >
              <div class="left">
                <span class="index" style="padding-right:30px;">{{index + 1}}</span>
                <div class="left-img" :style="'background-image:url('+item.cover+')'"></div>
                <div class="left-desc">
                  <div class="left-desc-head">
                    <p class="left-desc-name">{{item.name}}</p>
                  </div>
                  <p class="left-desc-explain" :title="item.desc">{{item.desc}}</p>
                  <div class="left-desc-tags">
                    <span
                      v-for="(tag,index) in item.tags"
                      :key="index"
                      :style="{color:tag.color}"
                    >#{{tag.name}}</span>
                  </div>
                  <p class="left-desc-explain">
                    <span>{{item._start | momentTime('YYYY-MM-DD HH:mm:ss')}}</span>
                    <span>~</span>
                    <span>{{item._end | momentTime('YYYY-MM-DD HH:mm:ss')}}</span>
                  </p>
                </div>
              </div>
              <div class="left">
                <p v-if="item.isShow">已发布</p>
                <p v-else>未发布</p>
              </div>
              <div class="right" style="margin-left:0px;">
                <el-button
                  type="primary"
                  class="edit-marker editBtn"
                  @click="markerEdit(item)"
                >任务点设置</el-button>
                <el-button
                  type="primary"
                  class="edit-info editBtn"
                  @click="handleEdit($event)"
                  :id="item._id"
                >信息编辑</el-button>
                <el-button
                  type="danger"
                  class="edit-delete editBtn"
                  @click.native="handleDel($event)"
                  :id="item._id"
                >删除</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>

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
    <div v-show="lines.length == 0" class="noData" v-if="isRealy">当前没有线路，快去添加吧！</div>

    <!--编辑线路-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogLine"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px" ref="editForm" :rules="rules">
        <el-form-item label="封面图片" prop="cover" required>
          <el-upload
            class="avatar-uploader"
            action="/api/upload/One"
            :show-file-list="false"
            accept="image/jpeg, image/png"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            v-loading="loading2"
          >
            <img
              v-if="editForm.cover"
              :src="editForm.cover"
              class="cover"
              style="width:100px;height:100px;"
            >
            <i
              v-if="!editForm.cover"
              class="el-icon-plus avatar-uploader-icon"
              style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;line-height: 100px;"
            ></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="线路名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="线路属性" prop="_type">
          <el-radio-group v-model="editForm._type">
            <el-radio :label="item.key" v-for="item in line_type" :key="item.key">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="editForm._type == 'team'">
          <el-form-item label="队伍人数" prop="_count">
            <el-input type="radius" v-model="editForm._count">
              <template slot="append">人</template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="线路描述" prop="desc">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="editForm.desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="_start">
              <div class="block">
                <el-date-picker
                  v-model="editForm._start"
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
                  v-model="editForm._end"
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
            v-model="tags"
            multiple
            placeholder="请选择"
            @change="selectGet"
            style="display:block"
          >
            <el-option
              v-for="item in options"
              :key="item.themeId"
              :label="item.name"
              :value="item.themeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否发布" prop="isShow">
          <el-switch v-model="editForm.isShow"></el-switch>
        </el-form-item>
        <el-form-item style="text-align: left;">
          <el-button @click.native="dialogLine=false">取消</el-button>
          <el-button type="primary" class="editLine" @click="updateData">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getLinesList, removeLine, editLine, addLine } from "@/api/lines";
import { TMap } from "@/TMap.js";
import axios from "axios";
import { api } from "../../axios";
import _ from "underscore";
export default {
  name: "report",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("点标名称不能为空"));
      }
    };
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
      lineTag: null,
      options: [],
      line_type: [
        { key: "team", value: "团队赛" },
        { key: "self", value: "个人赛" }
      ],
      filters: {
        name: ""
      },
      lines: [],
      total: 0,
      page: 1,
      limit: 10,
      textMap: {
        update: "编辑线路",
        create: "创建线路"
      },
      dialogStatus: "",
      dialogLine: false,
      editForm: {},
      createForm: {},
      tags: [],
      tagBox: [],
      isRealy: false,
      loading: false,
      loading2: false
    };
  },
  inject: ["reload"],
  methods: {
    handleEdit(e) {
      this.formType = 0;
      this.dialogStatus = "update";
      const id = e.currentTarget.id;
      this.editForm = this.lines.find(n => {
        return n._id == id;
      });
      var editForm = _.extend({}, this.editForm);
      editForm._start = new Date(editForm._start);
      editForm._end = new Date(editForm._end);
      this.editForm = editForm;
      var options = this.options;
      var tagsBox = this.editForm.tagsBox;
      this.tagsBox = this.editForm.tags;
      var tagsBox2 = [];
      for(var i = 0 ; i< tagsBox.length; i++){
        for(var j = 0 ; j < options.length; j++){
          if(tagsBox[i]== options[j].themeId){
            tagsBox2.push(tagsBox[i]);
            break;
          }
        }
      }
      this.tags = tagsBox2;
      this.dialogLine = true;
      setTimeout(function() {
        $("label[for='max']").css("text-align", "center");
      }, 500);
    },
    updateData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const data = Object.assign({}, this.editForm);
          if(data._count && data._count < 2){
             return this.$message({
              message: "团队赛人数应大于1",
              type: "warning"
            });
          }
          data.tags = this.tagsBox ;
           console.log('data.tags',data.tags)
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
        }
      });
    },
    addLine() {
      this.$router.push({ name: "创建线路", path: "/line/create" });
    },
    // createData() {
    //   this.$refs.createForm.validate(valid => {
    //     if (valid) {
    //       this.$confirm("确认提交吗？", "提示", {}).then(() => {
    //         const data = Object.assign({}, this.createForm);
    //         data.tags = this.tagsBox;
    //         if (data.tags.length == 0) {
    //           return this.$message({
    //             message: "请选择线路标签",
    //             type: "warning"
    //           });
    //         }
    //         api.post("api/matchLines/create", data).then(res => {
    //           if (res.data.code != 200) {
    //             return this.$message({
    //               message: "提交成功",
    //               type: "success"
    //             });
    //           }
    //           this.dialogLine = false;
    //           this.reload();
    //         });
    //       });
    //     }
    //   });
    // },
    markerEdit(item) {
      this.$router.push({
        path: "/markers/lists",
        name: "点标设置",
        params: {
          itemId: `${item._id}`
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
            if (this.lines.length == 1) {
              if (this.page != 1) {
                this.page = this.page - 1;
              }
            }
            this.getLines();
          } else {
            return this.$message({
              message: res.data.message,
              type: "wraning"
            });
          }
        });
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getLines();
    },
    getLines() {
      var that = this;
      var data = {
        page: this.page,
        limit: this.limit
      };
      this.loading = true;
      api.post("/api/matchLines/all", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          var resData = res.data.data;
          for (var i = 0; i < resData.length; i++) {
            resData[i].tagsBox = _.pluck(resData[i].tags, "themeId");
          }
          that.lines = resData;
          this.isRealy = true;
          this.total = res.data.total;
          this.loading = false;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
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
      this.loading = true;
      api.post("/api/matchLines/searchLines", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          var resData = res.data.data;
          for (var i = 0; i < resData.length; i++) {
            resData[i].tagsBox = _.pluck(resData[i].tags, "_id");
          }
          that.lines = resData;
          this.isRealy = true;
          this.total = res.data.total;
          this.loading = false;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    handleAvatarSuccess(res, file) {
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
  },
  mounted() {
    var getLines = () => {
      return this.getLines();
    };
    var getTheme = () => {
      return this.getTheme();
    };
    var asyncFun = async () => {
      await getLines();
      await getTheme();
    };
    asyncFun();
  }
};
</script>


<style lang ="scss">
@import "../../styles/lineList.scss";
</style>
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
.editBtn {
  margin-bottom: 5px;
}
.noData {
  width: 500px;
  margin: auto auto;
  padding-top: 150px;
}
.left-desc-explain {
  width: 400px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
