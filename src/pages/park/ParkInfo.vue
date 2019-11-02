<template>
  <div class="app-container">
    <el-tabs type="border-card" @tab-click="changeTab">
      <el-tab-pane label="基本信息" key="1">
        <el-form :model="ParkInfo" label-width="80px" ref="ParkInfo" :rules="rules1" class="tab">
          <input type="hidden" name="tab" value="1">
          <el-form-item label="名称" prop="name" label-width="120px">
            <el-input v-model="ParkInfo.name" auto-complete="off" placeholder="请输入园区名称"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address" label-width="120px">
            <el-input v-model="ParkInfo.address" auto-complete="off" placeholder="请输入园区地址"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone" label-width="120px">
            <el-input v-model="ParkInfo.phone" auto-complete="off" placeholder="请输入园区联系方式"></el-input>
          </el-form-item>
          <el-form-item label="介绍" prop="desc" label-width="120px">
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入园区介绍"
              v-model="ParkInfo.desc"
              label-width="120px"
            ></el-input>
          </el-form-item>
          <el-form-item style="text-align: left;" label-width="120px">
            <el-button type="primary" @click="saveBtn($event)" class="btnCen">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="开放时间" @click="changeTab($event)" key="2">
        <el-form :model="ParkInfo" label-width="80px" ref="ParkInfo" :rules="rules1" class="tab">
          <input type="hidden" name="tab" value="2">
          <el-form-item label="开放时间" prop="validtime" label-width="120px">
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入园区开放时间"
              v-model="ParkInfo.validtime"
              label-width="120px"
            ></el-input>
          </el-form-item>
          <el-form-item style="text-align: left;" label-width="120px">
            <el-button type="primary" @click="saveBtn($event)" class="btnCen">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="地理交通" @click="changeTab($event)" key="3">
        <el-form :model="ParkInfo" label-width="80px" ref="ParkInfo" :rules="rules1" class="tab">
          <input type="hidden" name="tab" value="3">
          <el-form-item label="地理交通" prop="addressInfo" label-width="120px">
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入园区地理交通"
              v-model="ParkInfo.addressInfo"
              label-width="120px"
            ></el-input>
          </el-form-item>
          <el-form-item style="text-align: left;" label-width="120px">
            <el-button type="primary" @click="saveBtn($event)" class="btnCen">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="防护须知" @click="changeTab($event)" key="4">
        <el-form
          :model="ParkInfo"
          label-width="80px"
          ref="ParkInfo"
          class="tab"
          :rules="rules1"
          v-if="isTab"
        >
          <input type="hidden" name="tab" value="4">
          <el-form-item label="防护须知" prop="parkRules" label-width="120px">
            <editor
              class="editor"
              :value="ParkInfo.parkRules"
              v-on:text_change="on_text_change"
              style="width:100%;padding:0px"
            ></editor>
          </el-form-item>
          <el-form-item style="text-align: left;" label-width="120px">
            <el-button type="primary" @click="saveBtn($event)" class="btnCen">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { TMap } from "@/TMap.js";
import axios from "axios";
import { api } from "../../axios";
import _ from "underscore";
import Editor from "@/pages/tinymac/editor";
export default {
  data() {
    return {
      rules1: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "园区介绍不能为空", trigger: "blur" }
        ],
        validtime: [
          { required: true, message: "开放时间不能为空", trigger: "blur" }
        ],
        addressInfo: [
          { required: true, message: "园区交通不能为空", trigger: "blur" }
        ],
        parkRules: [
          { required: true, message: "防护须知不能为空", trigger: "blur" }
        ]
      },
      rule: "",
      tab: "0",
      isRealy: false,
      changeTw: false,
      isTab: false,
      text_change: "",
      key: "22HBZ-ZHPWJ-6KLFO-FV5RT-7F2YH-EBBXF",
      ParkInfo: {}
    };
  },
  components: {
    Editor
  },
  mounted() {
    var getParkInfo = () => {
      return this.getParkInfo();
    };
    var asyncFun = async () => {
      await getParkInfo();
    };
    asyncFun();
  },
  methods: {
    changeTab(tab, event) {
      this.tab = tab.index;
      if (this.tab == 3) {
        this.isTab = true;
      }
    },
    getParkInfo() {
      api.post("/api/park/getParkInfo", {}).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.ParkInfo = _.extend({}, res.data.Park);
          this.isRealy = true;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    saveBtn(e) {
      const data = Object.assign({}, this.ParkInfo);
      data.tab = this.tab;
      if (data.tab == 3) {
        data.parkRules = this.text_change || data.parkRules;
      }
      api.post("/api/park/updateParkInfo", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    on_text_change(value) {
      if (!this.changeTw) {
        this.changeTw = true;
      }
      this.text_change = value;
    }
  }
};
</script>

<style scoped>
.app-container {
  overflow-y: auto;
}
</style>