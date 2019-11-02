<template>
  <section class="app-container">
    <!--顶部工具条 （查询、新增、批量删除）-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getGroups">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addGroupPersonal">添加分组(个人)</el-button>
          <el-button type="primary" @click="addGroupTeam">添加分组(团体)</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="batchRemove" :disabled="this.sels.length==0">批量删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表（表格）-->
    <el-table
      :data="groups"
      highlight-current-row
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" width="120"></el-table-column>
      <el-table-column prop="category" label="类别" width="120" :formatter="formatCategory"></el-table-column>
      <el-table-column prop="sex" label="性别限制" width="120" :formatter="formatSex"></el-table-column>
      <el-table-column prop label="人数" width="120" :formatter="formatPeople"></el-table-column>
      <el-table-column prop="age" label="年龄" width="120" :formatter="formatAge"></el-table-column>
      <el-table-column prop="pFee" label="费用" width="120" :formatter="formatFee"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <!--个人报名 - 编辑界面-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogPersonalGroup"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="0">男</el-radio>
            <el-radio class="radio" :label="1">女</el-radio>
            <el-radio class="radio" :label="2">不限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.minAge" :min="0" :max="200"></el-input-number>-
          <el-input-number v-model="editForm.maxAge" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item
          label="人数限制"
          :rules="[{ required: true, message: '年龄不能为空'},{ type: 'number', message: '年龄必须为数字值'}]"
        >
          <el-input type="number" v-model.number="editForm.people" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="报名费" :rules="[{ type: 'number', message: '报名费为数值'}]">
          <el-input type="number" v-model.number="editForm.pFee" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="报名时间">
          <el-date-picker
            v-model="editForm.sDate"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd hh:mm:ss"
            format="yyyy-MM-dd hh:mm:ss"
          ></el-date-picker>-
          <el-date-picker
            v-model="editForm.eDate"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd hh:mm:ss"
            format="yyyy-MM-dd hh:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogPersonalGroup=false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>

    <!--团队 - 编辑界面-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogTeamGroup"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="0">男</el-radio>
            <el-radio class="radio" :label="1">女</el-radio>
            <el-radio class="radio" :label="2">不限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄范围">
          <el-input-number v-model="editForm.minAge" :min="0" :max="200"></el-input-number>-
          <el-input-number v-model="editForm.maxAge" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="团队数量" :rules="[{ type: 'number', message: '必须为数字值'}]">
          <el-input type="number" v-model.number="editForm.teamNum" autocomplete="off">
            <template slot="append">队</template>
          </el-input>
        </el-form-item>
        <el-form-item label="人数范围" :rules="[{ type: 'number', message: '人数为数值'}]">
          <el-input-number v-model="editForm.minTeamPeople" :min="0" :max="200"></el-input-number>-
          <el-input-number v-model="editForm.maxTeamPeople" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="报名费" :rules="[{ type: 'number', message: '报名费为数值'}]">
          <el-input type="number" v-model.number="editForm.pFee" autocomplete="off">
            <el-select
              v-model="editForm.feeCategory"
              slot="prepend"
              placeholder="请选择"
              class="fee-category"
            >
              <el-option label="每人" value="0"></el-option>
              <el-option label="每队" value="1"></el-option>
            </el-select>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="报名时间">
          <el-date-picker
            v-model="editForm.sDate"
            value-format="yyyy-MM-dd hh:mm:ss"
            format="yyyy-MM-dd hh:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>-
          <el-date-picker
            v-model="editForm.eDate"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd hh:mm:ss"
            format="yyyy-MM-dd hh:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogTeamGroup=false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "@/utils/table.js";
import {
  getGroupsList,
  removeGroup,
  editGroup,
  addGroup,
  batchRemoveGroup
} from "@/api/groups";

export default {
  data() {
    return {
      select: "",
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPersonalGroup: false,
      dialogTeamGroup: false,
      filters: {
        name: ""
      },
      users: [],
      groups: [],
      total: 0,
      page: 1,
      sels: [], // 列表选中列
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      // 编辑界面数据
      editForm: {
        id: "0",
        name: "",
        sex: 1,
        category: 0,
        age: 0,
        sDate: "",
        eDate: "",
        minAge: 0,
        maxAge: 0,
        pFee: 0
      },
      // signTime:[this.editForm.sdate,this.editForm.edate],
      addFormVisible: false, // 新增界面是否显示
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 性别
    formatSex: function(row, column) {
      return row.sex == 0 ? "男" : row.sex == 1 ? "女" : "不限";
    },
    //分组类别
    formatCategory: function(row, column) {
      return row.category == 0 ? "个人" : row.category == 1 ? "团体" : "未知";
    },
    //年龄范围
    formatAge(row, column) {
      return `${row.minAge} - ${row.maxAge}`;
    },
    //费用
    formatFee(row, column) {
      if (row.category == 0) {
        return row.pFee == 0 ? "免费" : row.pFee;
      } else if (row.category == 1) {
        return row.tFee == 0 ? "免费" : row.tFee;
      }
    },
    formatPeople(row, column) {
      if (row.category == 0) {
        return row.people + "/人";
      } else if (row.category == 1) {
        return row.teamNum + "/队";
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getGroups();
    },
    // 获取用户列表
    getGroups() {
      const para = {
        page: this.page,
        name: this.filters.name
      };
      getGroupsList(para).then(res => {
        this.total = res.data.total;
        this.groups = res.data.groups;
      });
    },
    // 删除
    handleDel(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        const para = { id: row.id };
        removeGroup(para).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getGroups();
        });
      });
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.dialogStatus = "update";
      this.editForm = Object.assign({}, row);
      if (this.editForm.category == 0) {
        this.dialogPersonalGroup = true;
      } else if (this.editForm.category == 1) {
        this.dialogTeamGroup = true;
      } else {
      }
    },
    // 显示新增界面
    addGroupPersonal() {
      this.dialogStatus = "create";
      this.dialogPersonalGroup = true;
      this.editForm = {
        id: "0",
        name: "",
        sex: 1,
        age: 0,
        category: 0,
        sDate: "",
        eDate: "",
        minAge: "",
        maxAge: "",
        people: "",
        pFee: ""
      };
    },
    addGroupTeam() {
      this.dialogStatus = "create";
      this.dialogTeamGroup = true;
      this.editForm = {
        id: "0",
        name: "",
        sex: 1,
        age: 0,
        category: 1,
        sDate: "",
        eDate: "",
        minAge: "",
        maxAge: "",
        tFee: "",
        teamNum: "",
        minTeamPeople: "",
        maxTeamPeople: "",
        feeCategory: ""
      };
    },
    // 编辑
    updateData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            const para = Object.assign({}, this.editForm);
            // para.birth =
            //   !para.birth || para.birth === ''
            //     ? ''
            //     : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
            editGroup(para).then(res => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.dialogPersonalGroup = false;
              this.dialogTeamGroup = false;
              this.getGroups();
            });
          });
        }
      });
    },
    // 新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editForm.id = parseInt(Math.random() * 100).toString(); // mock a id
            const para = Object.assign({}, this.editForm);
            addGroup(para).then(res => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.dialogPersonalGroup = false;
              this.dialogTeamGroup = false;
              this.getGroups();
            });
          });
        }
      });
    },
    // 全选单选多选
    selsChange(sels) {
      this.sels = sels;
    },
    // 批量删除
    batchRemove() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        const para = { ids: ids };
        batchRemoveGroup(para).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getGroups();
        });
      });
    }
  },
  mounted() {
    this.getGroups();
  }
};
</script>

<style scoped>
.fee-category {
  width: 100px;
}
</style>