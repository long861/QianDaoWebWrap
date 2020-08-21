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
          <el-input v-model="filters.title">
            <template slot="prepend">资产名称:</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="assetType_type" placeholder="资产类型">
            <el-option v-for="item in options" :key="item.key" :label="item.name" :value="item.key">
              <template slot="prepend"></template>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="searchLines">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="success" v-on:click="addAssets">添加资产类型</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div class="table_wrap">
      <div v-if="assets.length > 0">
        <el-table :data="assets" class="table_info" style="width: 100%;">
          <el-table-column type="index" min-width="60"></el-table-column>
          <el-table-column prop="title" label="标题" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cover" label="封面" min-width="90">
            <template slot-scope="scope">
              <img
                :src="scope.row.cover"
                alt
                style="width:70px;height:70px;"
                v-if="scope.row.cover"
              />
              <img alt style="width:0px;height:0px;" v-else />
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" min-width="120"></el-table-column>
          <el-table-column prop="type" label="类型" min-width="120" :formatter="typeFormat"></el-table-column>
          <el-table-column label="操作" min-width="230">
            <template slot-scope="scope">
              <el-button size="small" @click="assetsEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="removeAssets(scope.row)">删除</el-button>
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
  </div>
</template>
<script>
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
      options: [
        { name: "资产", key: "assets" },
        { name: "负债", key: "liabilities" }
      ],
      line_type: [
        { key: "team", value: "团队赛" },
        { key: "self", value: "个人赛" }
      ],
      filters: {
        title: ""
      },
      assetType_type: "assets",
      assets: [],
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
      loading2: false,
      message: ""
    };
  },
  inject: ["reload"],
  methods: {
     typeFormat(row, column) {
      if (row.type == "assets") {
        return "资产";
      } else if (row.type == "liabilities") {
        return "负债";
      }
    },
    assetsEdit(item) {
      this.$router.push({
        path: "/assets/assetsEdit",
        name: "修改资产信息",
        params: { assetsId: item._id }
      });
    },
    addAssets() {
      this.$router.push({
        name: "创建资产类型",
        path: "/assets/createDefault"
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
    removeAssets(item) {
      this.$confirm("确认删除该资产类型吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api
          .post("/api/qd/assets/removeAssetsTypeDefault", { _id: item._id })
          .then(res => {
            if (res.data.code == 1050) {
              return this.$store.dispathch("LogOut").then(() => {
                location.reload();
              });
            } else if (res.data.code == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              if (this.assets.length == 1) {
                if (this.page != 1) {
                  this.page = this.page - 1;
                }
              }
              this.getAssetsDefault();
            } else {
              return this.$message({
                message: res.data.message,
                type: "wraning"
              });
            }
          });
      });
    },
    // handleDel(e) {
    //   const event = e;
    //   const id = e.currentTarget.id;
    //   this.$confirm("确认删除该线路吗?", "提示", {
    //     confirmButtonText: "确认",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(() => {
    //     api.post("/api/matchLines/remove", { _id: id }).then(res => {
    //       if (res.data.code == 1050) {
    //         return this.$store.dispathch("LogOut").then(() => {
    //           location.reload();
    //         });
    //       } else if (res.data.code == 200) {
    //         this.$message({
    //           message: "删除成功",
    //           type: "success"
    //         });
    //         if (this.lines.length == 1) {
    //           if (this.page != 1) {
    //             this.page = this.page - 1;
    //           }
    //         }
    //         this.getLines();
    //       } else {
    //         return this.$message({
    //           message: res.data.message,
    //           type: "wraning"
    //         });
    //       }
    //     });
    //   });
    // },
    handleCurrentChange(val) {
      this.page = val;
      this.getLines();
    },
    searchLines() {
      var that = this;
      var data = {
        page: this.page,
        limit: this.limit,
        title: this.filters.title,
        type: this.assetType_type
      };
      this.loading = true;
      // console.log('----data',data)
      api.post("/api/qd/assets/searchAssetsTypesDefault", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          that.assets = res.data.assets;
          if (res.data.assets.length == 0) {
            this.message = "当前没有数据，快去添加吧！";
          }
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
          //   this.options = res.data.themes;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    getAssetsDefault() {
      var data = {
        page: this.page,
        limit: this.limit
      };
      api.post("/api/qd/assets/getAssetsDefault", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          console.log("=====res assets", res);
          if (res.data.assets.length == 0) {
            this.message = "暂无数据";
          }
          this.assets = res.data.assets;
          this.total = res.data.total;
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
    var getAssetsDefault = () => {
      return this.getAssetsDefault();
    };
    var asyncFun = async () => {
      await getAssetsDefault();
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
