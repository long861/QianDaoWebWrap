<template>
  <div v-if="isRealy">
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" @submit.native.prevent style="padding-right:20px;overflow: hidden;">
        <el-form-item>
          <el-input v-model="name" auto-complete="off" placeholder="请输入主题名称关键词">
            <template slot="prepend">按名称查询:</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="search">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="success" v-on:click="addTheme">创建</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div class="table_wrap">
      <div v-if="themes.length > 0">
        <el-table :data="themes" class="table_info" style="width: 100%;">
          <el-table-column type="index" min-width="60"></el-table-column>
          <!-- <el-table-column
            prop="tags"
            label="类别"
            min-width="90"
            :formatter="tagShow"
            show-overflow-tooltip
          ></el-table-column>-->
          <el-table-column prop="name" label="名称" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cover" label="封面" min-width="90">
            <template slot-scope="scope">
              <img
                :src="scope.row.cover"
                alt
                style="width:70px;height:70px;"
                v-if="scope.row.cover"
              >
              <img alt style="width:0px;height:0px;" v-else>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="时间" min-width="140" :formatter="timeFormat"></el-table-column>
          <el-table-column label="操作" min-width="230">
            <template slot-scope="scope">
              <!-- <el-button size="small" type="primary" @click="prevNews(scope.row)">预览</el-button> -->
              <el-button size="small" @click="themeEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="removetheme(scope.row)">删除</el-button>
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
import _ from "underscore";
import axios from "axios";
import { api } from "../../axios";
import moment from "moment";
export default {
  name: "report",
  data() {
    return {
      tags: "",
      tagsBox: [],
      isRealy: true,
      total: 0,
      page: 1,
      limit: 10,
      isRealy: false,
      name: "",
      themes: [],
      message: "",
      changePage: false
    };
  },
  inject: ["reload"],
  mounted() {
    this.getThemes();
  },
  methods: {
    search() {
      var that = this;
      this.page = 1;
      this.getThemes();
    },
    addTheme() {
      this.$router.push({ path: "/park/theme", name: "创建线路主题" });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getParkNews();
    },
    timeFormat(row, column) {
      var res = moment(row.createdAt).format("YYYY-MM-DD HH:mm");
      return res;
    },
    removetheme(item) {
      this.$confirm("确认删除该线路主题吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.post("/api/theme/removeTheme", { _id: item._id }).then(res => {
          if (res.data.code == 1050) {
            return this.$store.dispathch("LogOut").then(() => {
              location.reload();
            });
          } else if (res.data.code == 200) {
            var message = () => {
              return this.$message({
                message: "删除成功",
                type: "success"
              });
            };
            var reload = () => {
              if (this.themes.length == 1) {
                if (this.page != 1) {
                  this.page = this.page - 1;
                }
              }
              return this.getThemes();
            };
            var asyncFun = async () => {
              await message();
              await reload();
            };
            asyncFun();
          } else {
            return this.$message({
              message: res.data.message,
              type: "wraning"
            });
          }
        });
      });
    },
    themeEdit(item) {
      this.$router.push({
        path: "/park/theme",
        name: "编辑线路主题",
        params: { themeId: item._id }
      });
    },
    getThemes() {
      api
        .post("/api/theme/getTheme", {
          page: this.page,
          limit: this.limit,
          name: this.name
        })
        .then(res => {
          if (res.data.code == 1050) {
            return this.$store.dispathch("LogOut").then(() => {
              location.reload();
            });
          } else if (res.data.code == 200) {
            this.themes = res.data.themes;
            if (res.data.themes.length == 0) {
              this.message = "当前没有主题，快去添加吧！";
            }
            this.total = res.data.total;
            this.isRealy = true;
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
</style>
<style lang ="scss">
@import "../../styles/lineList.scss";
</style>