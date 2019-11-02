<template>
  <div v-if="isRealy" class="wrap_box">
    <el-col :span="24" class="toolbar">
      <el-form
        :inline="true"
        :model="filters"
        @submit.native.prevent
        style="padding-right:50px;overflow: hidden;"
      >
        <el-form-item>
          <el-input v-model="filters.name" placeholder="请输入点标名称关键字">
            <template slot="prepend">点标名称:</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="searchMarkerByName">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="success" v-on:click="addMarker">添加点标</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div class="line" v-if="!NoData">
      <div class="list">
        <div class="wrap" v-for="(item,index) in defaultMarkers" :key="index">
          <div class="left">
            <span class="index">{{index + 1}}</span>
            <div class="left-img" :style="'background-image:url('+item.icon+')'" v-if="item.icon"></div>
            <div
              class="left-img"
              style="background-image:url('https://cdn.xidong360.com/201811/a331ffdc5db94f069206a3ef1b428e1c.png')"
              v-else
            ></div>
            <div class="left-desc">
              <div class="left-desc-head">
                <p class="left-desc-name">{{item.name}}</p>
              </div>
              <p
                class="left-desc-explain"
                :title="item.number"
                v-if="item.number"
              >编号：{{item.number}}</p>
              <!-- <p
                class="left-desc-explain"
                :title="item.marker_type"
                v-if="item.marker_type"
              >打卡类型：{{item.marker_typeVal}}</p>
              <p class="left-desc-explain" :title="item.isStart" v-if="item.isStart">点标类别：起点</p>
              <p class="left-desc-explain" :title="item.isEnd" v-if="item.isEnd">点标类别：终点</p>
              <p class="left-desc-explain" v-if="!item.isStart && !item.isEnd">点标类别：中间点</p>-->
            </div>
          </div>
          <div class="right">
            <el-button
              type="primary"
              class="edit-marker"
              @click="markerInfoEdit(item)"
              :id="item._id"
            >基本信息</el-button>
            <el-button
              type="primary"
              class="edit-marker"
              @click="markerEquiEdit(item)"
              :id="item._id"
            >设备</el-button>
            <!-- <el-button
              type="primary"
              class="edit-marker"
              @click="markerQuestionEdit(item)"
              :id="item._id"
            >任务</el-button>-->
            <el-button
              type="danger"
              class="edit-delete"
              @click.native="markerRemove($event)"
              :id="item._id"
            >删除</el-button>
          </div>
        </div>
      </div>
      <!--工具条-->
      <el-col
        :span="24"
        class="toolbar"
        style="text-align: center;background:#fff;padding-bottom:20px;"
      >
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

    <div v-else class="noData" style="text-align: center;">{{message}}</div>
    <!-- 添加点标 -->
    <el-dialog
      title="添加点标"
      :visible.sync="markerAdd"
      :close-on-click-modal="false"
      style="padding-bottom: 15vh;"
    >
      <el-form :model="createMarker" label-width="80px" ref="createMarker" :rules="rules">
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="createMarker.name"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="number" required>
          <el-input
            v-model="createMarker.number"
            onkeyup="this.value=this.value.replace(/\D/g,'')"
            onafterpaste="this.value=this.value.replace(/\D/g,'')"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="类别" prop="markerAttr">
          <el-radio-group v-model="createMarker.markerAttr">
            <el-radio :label="item.key" v-for="item in markerAttr" :key="item.key">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <div class="two_input">
          <el-form-item label="位置" required style="float:left"></el-form-item>
          <el-form-item label-width="0px" required prop="lat" class="input_one">
            <el-input type="lat" v-model="createMarker.lat">
              <template slot="prepend">经度</template>
            </el-input>
          </el-form-item>
          <el-form-item label-width="0px" required prop="lng" class="input_two">
            <el-input type="lng" v-model="createMarker.lng">
              <template slot="prepend">纬度</template>
            </el-input>
          </el-form-item>
        </div>
        <!-- <el-form-item label="标志" prop="icon" required>
          <el-upload
            class="avatar-uploader"
            action="/api/upload/One"
            :show-file-list="false"
            accept="image/jpeg,image/png"
            :on-success="saveIcon"
            :before-upload="beforeAvatarUpload2"
            v-loading="loading"
          >
            <div class="left-img">
              <img alt :src="icon" style="width:100%;height: 100%;" v-if="icon">
              <img src="/static/img/add.svg" alt style="width:100%" v-else>
            </div>
          </el-upload>
        </el-form-item>-->
        <el-form-item label="实景地图" prop="image">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/One"
            :show-file-list="false"
            accept="image/jpeg, image/png"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            v-loading="loading2"
          >
            <img v-if="image" :src="image" class="cover" style="width:100px;height:100px;">
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;line-height: 100px;"
            ></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="介绍" prop="tw" required>
          <editor
            class="editor"
            :value="createMarker.tw"
            title="请输入介绍"
            v-on:text_change="on_text_change"
            style="width:100%;"
          ></editor>
        </el-form-item>
        <el-form-item style="text-align: left;">
          <el-button type="primary" @click="MarkerCreate" class="btnCen">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑点标 -->
    <el-dialog
      title="基本信息编辑"
      :visible.sync="InfoEdit"
      :close-on-click-modal="false"
      style="padding-bottom: 15vh;"
    >
      <el-form :model="markerInfo" label-width="80px" ref="markerInfo" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="markerInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input
            v-model="markerInfo.number"
            onkeyup="this.value=this.value.replace(/\D/g,'')"
            onafterpaste="this.value=this.value.replace(/\D/g,'')"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="类别" prop="markerAttr" required>
          <el-radio-group v-model="markerInfo.markerAttr">
            <el-radio :label="item.key" v-for="item in markerAttr" :key="item.key">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <div class="two_input">
          <el-form-item label="位置" required style="float:left"></el-form-item>
          <el-form-item label-width="0px" prop="lat" class="input_one">
            <el-input type="lat" v-model="markerInfo.lat">
              <template slot="prepend">经度</template>
            </el-input>
          </el-form-item>
          <el-form-item label-width="0px" required prop="lng" class="input_two">
            <el-input type="lng" v-model="markerInfo.lng">
              <template slot="prepend">纬度</template>
            </el-input>
          </el-form-item>
        </div>
        <!-- <el-form-item label="标志" prop="icon">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/One"
            :show-file-list="false"
            accept="image/jpeg,image/png"
            :on-success="saveIcon"
            :before-upload="beforeAvatarUpload2"
            v-loading="loading"
          >
            <div class="left-img">
              <img alt :src="icon" style="width:100%;height: 100%;" v-if="icon">
              <img src="/static/img/add.svg" alt style="width:100%" v-else>
            </div>
          </el-upload>
        </el-form-item>-->

        <el-form-item label="实景地图" prop="image">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/One"
            :show-file-list="false"
            accept="image/jpeg, image/png"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            v-loading="loading2"
          >
            <img v-if="image" :src="image" class="cover" style="width:100px;height:100px;">
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;line-height: 100px;"
            ></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="介绍" prop="tw">
          <editor
            class="editor"
            :value="markerInfo.tw"
            title="请输入介绍"
            v-on:text_change="on_text_change"
            style="width:100%;"
          ></editor>
        </el-form-item>
        <el-form-item style="text-align: left;">
          <el-button type="primary" @click="editInfo" class="btnCen">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="设备编辑"
      :visible.sync="EquiEdit"
      :close-on-click-modal="false"
      style="padding-bottom: 15vh;"
      v-loading="loading"
    >
      <el-form :model="markerEqui" label-width="120px" ref="markerEqui" :rules="rules">
        <el-form-item label="主BeaconsId" prop="major" label-width="120px">
          <el-input type="major" v-model="markerEqui.major"></el-input>
        </el-form-item>
        <el-form-item label="次BeaconsId" prop="minor" label-width="120px">
          <el-input type="minor" v-model="markerEqui.minor"></el-input>
        </el-form-item>
        <el-form-item style="text-align: left;" label-width="120px">
          <el-button type="primary" @click="editEqui" class="btnCen">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="任务编辑"
      :visible.sync="QuestionEdit"
      :close-on-click-modal="false"
      style="padding-bottom: 15vh;"
      v-loading="loading"
    >
      <el-form :model="markerQuestion" label-width="120px" ref="markerQuestion" :rules="rules">
        <el-form-item label="打卡类型" prop="marker_type" label-width="120px" required>
          <el-radio-group v-model="markerQuestion.marker_type">
            <el-radio :label="item.key" v-for="item in markerType" :key="item.key">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务描述" label-width="120px" prop="desc">
          <el-input type="textarea" :rows="2" placeholder="请输入任务描述" v-model="markerQuestion.desc"></el-input>
        </el-form-item>
        <el-form-item
          label="题目"
          label-width="120px"
          required
          v-if="markerQuestion.marker_type == '3'"
        >
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="QA.title"></el-input>
        </el-form-item>
        <el-form-item
          label="图片"
          prop="image1"
          label-width="120px"
          v-if="markerQuestion.marker_type == 3"
        >
          <el-upload
            class="avatar-uploader"
            action="/api/upload/One"
            :show-file-list="false"
            accept="image/jpeg, image/png"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload"
            v-loading="loading2"
          >
            <img v-if="image1" :src="image1" class="cover" style="width:100px;height:100px;">
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;line-height: 100px;"
            ></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="选项"
          label-width="120px"
          required
          v-if="markerQuestion.marker_type == 3"
        >
          <div class="answer" v-for="(item,index) in QA_options">
            <el-row class="answer_item">
              <el-col :span="1">
                <span>{{item.id}}</span>
              </el-col>
              <el-col :span="22">
                <el-input type="name" class="QA_name" v-model="item.value"></el-input>
              </el-col>
              <el-col :span="1">
                <i
                  class="el-icon-error"
                  :index="index"
                  :id="item.id"
                  @click="removeAnswer($event)"
                  style="padding: 0px 5px;"
                ></i>
              </el-col>
            </el-row>
          </div>
          <div class="moreAnswer" style="margin-top:10px;">
            <el-button
              type="primary"
              style="padding:6px 15px;"
              size="small"
              class="addAnswer"
              @click="addAnswer"
            >
              <i class="el-icon-circle-plus" style="font-size:18px;"></i>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item
          label="答案"
          label-width="120px"
          v-if="markerQuestion.marker_type == 3"
          required
        >
          <el-checkbox-group v-model="answer" :min="1">
            <el-checkbox :label="item.id" :key="item.id" v-for="item in QA_options"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          label-width="120px"
          v-if="markerQuestion.marker_type == 2"
        >
          <el-input type="pwd" v-model="markerQuestion.password" style="width:78%"></el-input>
          <el-button type="primary" @click="randomPwd" style="margin-top:5px;">随机密码</el-button>
        </el-form-item>
        <el-form-item style="text-align: left;" label-width="120px">
          <el-button type="primary" @click="EditQuestion" class="btnCen">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { api } from "../../axios";
import _ from "underscore";
import { TMap } from "@/TMap.js";
import Editor from "@/pages/tinymac/editor";
export default {
  name: "report",
  data() {
    var checkLat = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("点标经度不能为空"));
      }
      var value1 = Number(value);
      if (!value1) {
        callback(new Error("请输入数字值"));
      } else {
        if (value1 <= 0) {
          callback(new Error("经度不能为负值"));
        }
      }
    };
    var checkLng = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("点标纬度不能为空"));
      }
      var value1 = Number(value);
      if (!value1) {
        callback(new Error("请输入数字值"));
      } else {
        if (value1 <= 0) {
          callback(new Error("纬度不能为负值"));
        }
      }
    };
    var checkMajor = (rule, value, callback) => {
      var value1 = Number(value);
      if (!value1) {
        callback(new Error("请输入数字值"));
      } else {
        if (value1 <= 0) {
          callback(new Error("纬度不能为负值"));
        }
      }
    };
    var checkPwd = (rule, value, callback) => {
      var value1 = Number(value);
      if (!value1) {
        callback(new Error("请输入数字值"));
      } else {
        if (value1 < 0) {
          callback(new Error("密码格式不正确"));
        }
      }
    };
    // var checkNumber = (rule, value, callback)=>{
    //   var value1 = Number(value);
    //   if (!value1) {
    //     callback(new Error("请输入数字值"));
    //   } else {
    //     if (value1 < 0) {
    //       callback(new Error("密码格式不正确"));
    //     }
    //   }
    // }
    return {
      rules: {
        name: [
          { required: true, message: "点标名称不能为空", trigger: "blur" }
        ],
        number: [
          { required: true, message: "编号不能为空", trigger: "blur" }
          // { validator: checkNumber, trigger: "blur"  }
        ],
        icon: [{ required: true, message: "上传点标图标", trigger: "blur" }],
        lat: [{ validator: checkLat, trigger: "blur" }],
        lng: [{ validator: checkLng, trigger: "blur" }],
        tw: [
          { required: true, message: "点标图文消息不能为空", trigger: "blur" }
        ],
        major: [
          { required: true, message: "主BeaconsId不能为空", trigger: "blur" },
          { validator: checkMajor, trigger: "blur" }
        ],
        desc: [
          { required: true, message: "任务描述不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { validator: checkPwd, trigger: "blur" }
        ]
      },
      marker_type: [
        { key: "1", value: "自主打卡" },
        { key: "2", value: "线下任务打卡" },
        { key: "3", value: "线上任务打卡" }
      ],
      filters: {
        name: ""
      },
      lines: [],
      total: 0,
      page: 1,
      limit: 10,
      itemId: "",
      markers: [],
      NoData: false,
      isRealy: false,
      message: "",
      defaultMarkers: [],
      key: "22HBZ-ZHPWJ-6KLFO-FV5RT-7F2YH-EBBXF",
      icon: "",
      markerAttr: [
        { key: 2, value: "中间点" },
        { key: 0, value: "起点" },
        { key: 1, value: "终点" }
      ],
      InfoEdit: false,
      markerInfo: {},
      markerIcons: [
        {
          name: "起点",
          icon: "https://cdn.xidong360.com/images/map/start.png"
        },
        {
          name: "终点",
          icon: "https://cdn.xidong360.com/images/map/end.png"
        }
      ],
      text_change: "",
      tw: "",
      changeTw: false,
      EquiEdit: false,
      markerEqui: {},
      markerQuestion: {},
      QuestionEdit: false,
      QA: {},
      QA_options: [
        { id: "A", name: "A.", value: "" },
        { id: "B", name: "B.", value: "" },
        { id: "C", name: "C.", value: "" },
        { id: "D", name: "D.", value: "" }
      ],
      answer: [],
      password: "",
      markerType: [
        { key: "1", value: "自主打卡" },
        { key: "2", value: "线下任务打卡" },
        { key: "3", value: "线上任务打卡" }
      ],
      markerAdd: false,
      createMarker: {},
      image: "",
      image1: "",
      loading: false,
      loading2: false
    };
  },
  inject: ["reload"],
  watch: {
    markerQuestion: (newVal, oldVal) => {
      console.log(1);
    }
  },
  components: {
    Editor
  },
  mounted() {
    var asyncFun = async () => {
      await this.getDefaultMarters();
    };
    asyncFun();
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getDefaultMarters();
    },
    markerInfoEdit(item) {
      item.lat = item.center.lat;
      item.lng = item.center.lng;
      if (!item.isStart && !item.isEnd) {
        item.markerAttr = 2;
      } else {
        if (item.isStart) {
          item.markerAttr = 0;
        }
        if (item.isEnd) {
          item.markerAttr = 1;
        }
      }
      this.image = item.image || "";
      this.markerInfo = _.extend({}, item);
      this.changeTw = false;
      this.icon = item.icon || "";
      this.InfoEdit = true;
    },
    markerEquiEdit(item) {
      this.markerEqui = _.extend({}, item);
      this.EquiEdit = true;
    },
    markerQuestionEdit(item) {
      if (!item.password) {
        item.password = "";
      }
      if (item.marker_type == 3) {
        this.QA = item.QA || {};
        var QA_options;
        var answer;
        if (item.QA && item.QA.options) {
          QA_options = item.QA.options || this.QA_options;
          answer = item.QA.answer || [];
        } else {
          QA_options = this.QA_options;
          answer = this.answer;
        }
        this.QA_options = QA_options;
        this.answer = answer;
        this.image1 = item.QA.image || "";
      }
      this.markerQuestion = _.extend({}, item);
      this.QuestionEdit = true;
    },
    MarkerCreate() {
      const data = Object.assign({}, this.createMarker);
      var text_change;
      if (this.changeTw) {
        text_change = this.text_change;
        data.tw = text_change;
      }
      // data.icon = this.icon;
      data.image = this.image;
      api.post("/api/marker/createDefaultMarker", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          var load = () => {
            this.InfoEdit = false;
            this.reload();
          };
          var asyncFun = async () => {
            await this.$message({
              message: "添加点标成功",
              type: "success"
            });
            await load();
          };
          asyncFun();
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    editInfo() {
      const data = Object.assign({}, this.markerInfo);
      var text_change;
      if (this.changeTw) {
        text_change = this.text_change;
        data.tw = text_change;
      }
      // data.icon = this.icon;
      data.image = this.image;
      api.post("/api/marker/editInfo", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          var load = () => {
            this.InfoEdit = false;
            this.getDefaultMarters();
          };
          var asyncFun = async () => {
            await this.$message({
              message: "信息编辑成功",
              type: "success"
            });
            await load();
          };
          asyncFun();
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    editEqui(item) {
      const data = Object.assign({}, this.markerEqui);
      api.post("/api/marker/editEqui", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          var load = () => {
            this.EquiEdit = false;
            this.getDefaultMarters();
          };
          var asyncFun = async () => {
            await this.$message({
              message: "设备编辑成功",
              type: "success"
            });
            await load();
          };
          asyncFun();
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    EditQuestion(item) {
      const data = Object.assign({}, this.markerQuestion);
      if (data.marker_type == 3) {
        let options = this.QA_options;
        for (var i = 0; i < options.length; i++) {
          var obj = options[i];
          if (obj.value == "" || obj.value == null || obj.value == undefined) {
            return this.$message({
              message: "题目选项不能为空",
              type: "warning"
            });
          }
          obj.name = `${obj.name}${obj.value}`;
        }
        data.answer = this.answer;
        data.QA_title = this.QA;
        data.QA_options = this.QA_options;
        data.image1 = this.image1;
      }
      if (data.marker_type == 3) {
        data.image1 = this.image1;
      }
      data.password = this.password || this.markerQuestion.password;
      api.post("/api/marker/EditQuestion", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          var load = () => {
            this.QuestionEdit = false;
            this.getDefaultMarters();
          };
          var asyncFun = async () => {
            await this.$message({
              message: "设备编辑成功",
              type: "success"
            });
            await load();
          };
          asyncFun();
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    addMarker() {
      this.createMarker = { markerAttr: 2 };
      this.icon = "";
      this.image = "";
      this.changeTw = false;
      this.markerAdd = true;
    },
    // 删除
    markerRemove(e) {
      const id = e.currentTarget.id;
      this.$confirm("确认删除该点标吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.post("/api/marker/removeDefaultMarker", { _id: id }).then(res => {
          if (res.data.code == 1050) {
            return this.$store.dispathch("LogOut").then(() => {
              location.reload();
            });
          } else if (res.data.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            if (this.defaultMarkers.length == 1) {
              if (this.page != 1) {
                this.page = this.page - 1;
              }
            }
            this.getDefaultMarters();
          } else {
            return this.$message({
              message: res.data.message,
              type: "wraning"
            });
          }
        });
      });
    },
    changeIcon(item, e) {
      this.icon = item.icon;
      $(e.target)
        .addClass("active")
        .siblings()
        .removeClass("active");
    },
    on_text_change(value) {
      if (!this.changeTw) {
        this.changeTw = true;
      }
      this.text_change = value;
    },
    removeAnswer(e) {
      var QA_options = this.QA_options;
      var index = $(e.target).attr("index");
      QA_options.splice(index, 1);
      for (var i = index; i < QA_options.length; i++) {
        var num = Number(65 + Number(i));
        QA_options[i].id = String.fromCharCode(Number(65 + Number(i)));
        var name = QA_options[i].name || "";
        QA_options[i].name = name;
      }
      this.answer = [];
      this.QA_options = QA_options;
    },
    addAnswer() {
      var QA_options = this.QA_options;
      let id = String.fromCharCode(65 + QA_options.length);
      let name = `${id}.`;
      QA_options.push({ id, name, value: "" });
    },
    randomPwd() {
      var num = Math.floor(Math.random() * 9999);
      num = ("000000" + num).substr(-4);
      this.password = num;
      Vue.set(this.markerQuestion, "password", num);
    },
    searchMarkerByName() {
      var data = {
        name: this.filters.name,
        page: 1,
        limit: this.limit
      };
      api.post("/api/marker/searchDefaultMarkerByName", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          if (res.data.NoData) {
            this.message = res.data.message;
          }
          this.NoData = res.data.NoData;
          this.total = res.data.total;
          this.defaultMarkers = res.data.markers;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    saveIcon(res, file) {
      this.avatarUploading = false;
      if (res.code === 0) {
        this.icon = res.data;
      } else {
        this.$message.error(res.msg);
      }
      this.loading = false;
    },
    // saveIcon
    handleAvatarSuccess(res, file) {
      this.avatarUploading = false;
      if (res.code === 0) {
        this.image = res.data;
      } else {
        this.$message.error(res.msg);
      }
      this.loading2 = false;
    },
    handleAvatarSuccess1(res, file) {
      this.avatarUploading = false;
      if (res.code === 0) {
        this.image1 = res.data;
      } else {
        this.$message.error(res.msg);
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
      if (isJPG && isLt2M) this.avatarUploading = true;
      this.loading2 = true;
      return isJPG && isLt2M;
    },
    beforeAvatarUpload2(file) {
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
    getDefaultMarters() {
      api
        .post("/api/marker/getDefaultMartersAll", {
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          if (res.data.code == 1050) {
            return this.$store.dispathch("LogOut").then(() => {
              location.reload();
            });
          } else if (res.data.code == 200) {
            var defaultMarkers = res.data.defaultMarkers;
            var marker_type = this.marker_type;
            for (var i = 0; i < defaultMarkers.length; i++) {
              for (var j = 0; j < marker_type.length; j++) {
                if (defaultMarkers[i].marker_type == marker_type[j].key) {
                  defaultMarkers[i].marker_typeVal = marker_type[j].value;
                  break;
                }
              }
            }
            this.defaultMarkers = defaultMarkers;
            if (res.data.defaultMarkers.length > 0) {
              this.NoData = false;
            } else {
              this.NoData = true;
              this.message = this.data.message;
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
.wrap_box {
  background: #fff;
}
.line .list .wrap .left .left-img {
  width: 30px;
  height: 30px;
}
.left-img {
  width: 50px;
  height: 50px;
}
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
.noData {
  width: 500px;
  margin: auto auto;
  padding-top: 150px;
}
#container {
  height: 500px;
}
.icon_img {
  width: 50px;
  height: 50px;
  border: solid 5px #e0e0e0;
  border-radius: 50%;
  margin: 3px 5px;
}
.icon_img.active {
  border: solid 5px #00b5ad;
}
.edit-marker {
  margin-bottom: 5px;
}
.two_input {
  overflow: hidden;
}
.two_input .input_one {
  float: left;
  width: 35%;
}
.two_input .input_two {
  float: right;
  margin: 0px;
  width: 35%;
}
.answer {
  margin-bottom: 5px;
}
.el-icon-error {
  cursor: pointer;
}
</style>
<style lang ="scss">
@import "../../styles/lineList.scss";
</style>
