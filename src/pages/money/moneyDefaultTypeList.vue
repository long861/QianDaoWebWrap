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
            <template slot="prepend">收支名称:</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="moneyType_type" placeholder="收支属性">
            <el-option v-for="item in options" :key="item.key" :label="item.value" :value="item.key">
              <template slot="prepend"></template>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="searchMoneyTypes">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="success" v-on:click="addMoneyType">添加资产类型</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div class="table_wrap">
      <div v-if="moneyTypes.length > 0">
        <el-table :data="moneyTypes" class="table_info" style="width: 100%;">
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
          <el-table-column prop="type" label="属性" min-width="120" :formatter="typeFormat"></el-table-column>
          <el-table-column prop="status" label="是否展示" min-width="120" :formatter="statusFormat"></el-table-column>

          <el-table-column label="操作" min-width="230">
            <template slot-scope="scope">
              <el-button size="small" @click="moneyTypeEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="removeMoneyType(scope.row)">删除</el-button>
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
    return {
      moneyType_type: "",
      options: [
        { value: "收入", key: "income" },
        { value: "支出", key: "spending" }
      ],
      line_type: [
        { key: "team", value: "团队赛" },
        { key: "self", value: "个人赛" }
      ],
      filters: {
        title: ""
      },
      moneyTypes: [],
      lines: [],
      total: 0,
      page: 1,
      limit: 10,
      isRealy: false,
      loading: false,
      loading2: false,
      message: ""
    };
  },
  inject: ["reload"],
  methods: {
    statusFormat(row, column) {
      if (row.status == 1) {
        return "是";
      } else if (row.status == 0) {
        return "否";
      }
    },
    typeFormat(row, column) {
      if (row.type == "income") {
        return "收入";
      } else if (row.type == "spending") {
        return "支出";
      }
    },
    moneyTypeEdit(item) {
      this.$router.push({
        path: "/money/defaultType/moneyTypeEdit",
        name: "修改收支信息",
        params: { moneyTypeId: item._id }
      });
    },
    removeMoneyType(item) {
      this.$confirm("确认删除该收支类型吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api
          .post("/api/money/removeMoneyTypeDefault", { _id: item._id })
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
              if (this.moneyTypes.length == 1) {
                if (this.page != 1) {
                  this.page = this.page - 1;
                }
              }
              this.getMoneyTypesDefault();
            } else {
              return this.$message({
                message: res.data.message,
                type: "wraning"
              });
            }
          });
      });
    },
    addMoneyType() {
      this.$router.push({
        name: "创建收支类型",
        path: "/money/defaultType/createDefault"
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getMoneyTypesDefault();
    },
    searchMoneyTypes() {
      var that = this;
      var data = {
        page: this.page,
        limit: this.limit,
        title: this.filters.title,
        type: this.moneyType_type
      };
      this.loading = true;
      api.post("/api/money/searchMoneyTypes", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          that.moneyTypes = res.data.moneyTypes;
          if(res.data.moneyTypes.length == 0){
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
    getMoneyTypesDefault() {
      var data = {
        page: this.page,
        limit: this.limit
      };
      api.post("/api/money/getMoneyTypeDefault", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          console.log("=====res assets", res);
          if (res.data.moneyTypes.length == 0) {
            this.message = "暂无数据";
          }
          this.moneyTypes = res.data.moneyTypes;
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
    this.getMoneyTypesDefault();
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
