<template>
  <div v-if="isRealy">
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" @submit.native.prevent style="padding-right:20px;overflow: hidden;">
        <el-form-item>
          <label class="left_lable">按类别查询:</label>
          <el-select v-model="tagsBox" placeholder="请选择类别">
            <el-option v-for="item in tags" :key="item.key" :label="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="search">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="success" v-on:click="addNews">创建</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div class="table_wrap">
      <div v-if="news.length > 0">
        <el-table :data="news" class="table_info" style="width: 100%;">
          <el-table-column type="index" min-width="60"></el-table-column>
          <el-table-column prop="tags" label="类别" min-width="90" :formatter="tagShow"></el-table-column>
          <el-table-column prop="title" label="标题" min-width="120" show-overflow-tooltip></el-table-column>
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
          <el-table-column prop="createtime" label="时间" min-width="140" :formatter="timeFormat"></el-table-column>
          <el-table-column label="操作" min-width="230">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="prevNews(scope.row)">预览</el-button>
              <el-button size="small" @click="newsEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="removeNews(scope.row)">删除</el-button>
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
      tags: [{ value: "定向宝典" }, { value: "定向讲堂" }],
      tagsBox: [],
      isRealy: true,
      total: 0,
      page: 1,
      limit: 10,
      isRealy: false,
      news: [],
      message: ""
    };
  },
  inject: ["reload"],
  mounted() {
    this.getParkNews();
  },
  methods: {
    search() {
      var that = this;
      this.page = 1;
      if (this.tagsBox) {
        api
          .post("/api/park/getKnowLByTags", {
            tags: this.tagsBox,
            page: this.page,
            limit: this.limit
          })
          .then(res => {
            if (res.data.code == 1050) {
              return this.$store.dispathch("LogOut").then(() => {
                location.reload();
              });
            } else if (res.data.code == 200) {
              this.news = res.data.News;
              if (res.data.News.length == 0) {
                that.message = res.data.message;
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
      } else {
        this.reload();
      }
    },
    addNews() {
      this.$router.push({ path: "/park/createKnowL", name: "创建定向知识" });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getParkNews();
    },
    tagShow: function(row, column) {
      return row.tags[0];
    },
    timeFormat(row, column) {
      var res = moment(row.createtime).format("YYYY-MM-DD HH:mm");
      return res;
    },
    removeNews(item) {
      this.$confirm("确认删除该定向知识吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.post("/api/park/removeNews", { _id: item._id }).then(res => {
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
              if (this.news.length == 1) {
                if (this.page != 1) {
                  this.page = this.page - 1;
                }
              }
              return this.getParkNews();
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
    newsEdit(item) {
      this.$router.push({
        path: "/park/editKnowL",
        name: "修改定向知识",
        params: { newsId: item._id }
      });
    },
    prevNews(item) {
      this.$router.push({
        path: "/park/prev",
        name: "预览",
        params: { newsId: item._id }
      });
    },
    getParkNews() {
      api
        .post("/api/park/getKnowL", {
          page: this.page,
          limit: this.limit,
          tags: this.tagsBox
        })
        .then(res => {
          if (res.data.code == 1050) {
            return this.$store.dispathch("LogOut").then(() => {
              location.reload();
            });
          } else if (res.data.code == 200) {
            this.news = res.data.News;
            if (res.data.News.length == 0) {
              this.message = res.data.message;
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