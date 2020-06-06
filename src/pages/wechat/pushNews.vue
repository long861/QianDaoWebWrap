<template>
  <div class="pushNewsBox">
    <el-row>
      <el-button @click="getToken()">获取token</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
    <template>
      <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="date" label="方法" width="180"></el-table-column>
        <el-table-column prop="name" label="路径" width="180"></el-table-column>
        <el-table-column prop="part" label="入参" width="180"></el-table-column>
        <el-table-column prop="address" label="返回值"></el-table-column>
      </el-table>
    </template>
  </div>
</template>
</div>
 
</template>

<style>
.pushNewsBox {
  margin: 20px;
  padding: 20px;
  border: solid 1px #e0e0e0;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import axios from "axios";
import { api } from "../../axios";
export default {
  name: "report",
  methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      getToken(){
            api.post("/api/wechat/getToken", {}).then(res => {
                console.log('=====api/wechat res',res)
            })
      }
  },
  data() {
    return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
    };
  }
};
</script>