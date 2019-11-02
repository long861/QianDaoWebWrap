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
          <label class="left_lable">线路:</label>
          <el-select v-model="itemId" placeholder="请选择线路." @change="selectGetItemId">
            <el-option
              v-for="item in lines"
              :key="item._id"
              :label="item.name"
              :value="item._id"
              v-if="lines.length > 0"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.name" placeholder="请输入任务点关键字">
            <template slot="prepend">任务点名称:</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="searchMarkerByName">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="success" v-on:click="addMarker">添加任务点</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div class="marker_tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="任务点预览" name="first" @click="markerPrev">
          <div id="container1"></div>
        </el-tab-pane>
        <el-tab-pane label="任务点列表" name="second">
          <div class="line" v-if="!NoData">
            <div class="list">
              <div class="wrap" v-for="(item,index) in markers" :key="index">
                <div class="left">
                  <span class="index">{{index + 1}}</span>
                  <div
                    class="left-img"
                    :style="'background-image:url('+item.icon+')'"
                    v-if="item.icon"
                  ></div>
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
                      :title="item.defaultMarkerName"
                      v-if="item.defaultMarkerName"
                    >点标名称：{{item.defaultMarkerName}}</p>
                    <p
                      class="left-desc-explain"
                      :title="item.number"
                      v-if="item.number"
                    >点标编号：{{item.number}}</p>

                    <!-- <p
                      class="left-desc-explain"
                      :title="item.marker_type"
                      v-if="item.marker_type"
                    >打卡类型：{{item.marker_typeVal}}</p>
                    <p class="left-desc-explain" :title="item.isStart" v-if="item.isStart">任务点类别：起点</p>
                    <p class="left-desc-explain" :title="item.isEnd" v-if="item.isEnd">任务点类别：终点</p>
                    <p class="left-desc-explain" v-if="!item.isStart && !item.isEnd">任务点类别：中间点</p>-->
                  </div>
                </div>
                <div class="right">
                  <p style="display:inline-block;padding:10px 0px;line-height:1;">
                    <span @click="upMarkerIndex(item)">
                      <svg-icon icon-class="up" class="upIndex"></svg-icon>
                    </span>
                    <span @click="downMarkerIndex(item)">
                      <svg-icon icon-class="down" class="downIndex"></svg-icon>
                    </span>
                  </p>
                  <el-button
                    type="primary"
                    class="edit-marker"
                    @click="markerEdit(item)"
                    :id="item._id"
                  >基本信息</el-button>
                  <el-button
                    type="primary"
                    class="edit-marker"
                    @click="markerQuestionEdit(item)"
                    :id="item._id"
                  >任务</el-button>
                  <el-button
                    type="danger"
                    class="edit-delete"
                    @click.native="markerRemove(item)"
                    :id="item._id"
                  >删除</el-button>
                </div>
              </div>
            </div>
            <!--工具条-->
            <!-- <el-col :span="24" class="toolbar" style="text-align: center;padding:20px 0px;">
              <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :page-size="1000"
                :total="total"
                background
                style="font-size: 20px;"
              ></el-pagination>
            </el-col>-->
          </div>
          <div v-else class="noData">{{message}}</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="添加任务点"
      :visible.sync="showMarkers"
      :close-on-click-modal="false"
      v-loading="loading3"
    >
      <div id="container"></div>
      <div slot="footer" class="dialog-footer" style="text-align: left;">
        <el-button @click.native="closeSave">取消</el-button>
        <el-button type="primary" class="editLine" @click="saveMarker">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="任务点基本信息"
      :visible.sync="InfoEdit"
      :close-on-click-modal="false"
      style="padding-bottom: 15vh;"
    >
      <el-form :model="markerInfo" label-width="80px" ref="markerInfo" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="markerInfo.name"></el-input>
        </el-form-item>
        <el-form-item
          label="点标名称"
          prop="defaultMarkerName"
          required
          v-if="markerInfo.defaultMarkerName"
        >
          <el-input type="defaultMarkerName" v-model="markerInfo.defaultMarkerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="点标编号" prop="number" required v-if="markerInfo.number">
          <el-input type="number" v-model="markerInfo.number" disabled></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="markerAttr" required>
          <el-radio-group v-model="markerInfo.markerAttr">
            <el-radio :label="item.key" v-for="item in markerAttr" :key="item.key">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
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
      title="任务编辑"
      :visible.sync="QuestionEdit"
      :close-on-click-modal="false"
      style="padding-bottom: 15vh;"
    >
      <el-form :model="markerQuestion" label-width="120px" ref="markerQuestion" :rules="rules">
        <el-form-item label="打卡类型" prop="marker_type" required label-width="120px">
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
          v-if="markerQuestion.marker_type == 3"
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
        <el-form-item label="答案" label-width="120px" v-if="markerQuestion.marker_type == 3">
          <el-checkbox-group v-model="answer" :min="1">
            <el-checkbox :label="item.id" :key="item.id" v-for="item in QA_options"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          label-width="120px"
          required
          v-if="markerQuestion.marker_type == 2"
        >
          <el-input type="pwd" v-model="markerQuestion.password" style="width:78%"></el-input>
          <el-button type="primary" @click="randomPwd" style="margin-top:5px;">随机密码</el-button>
        </el-form-item>
        <el-form-item style="text-align: left;">
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
        return callback(new Error("任务点经度不能为空"));
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
        return callback(new Error("任务点纬度不能为空"));
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
    return {
      rules: {
        name: [
          { required: true, message: "任务点名称不能为空", trigger: "blur" }
        ],
        icon: [{ required: true, message: "上传任务点图标", trigger: "blur" }],
        lat: [{ validator: checkLat, trigger: "blur" }],
        lng: [{ validator: checkLng, trigger: "blur" }],
        tw: [
          { required: true, message: "任务点图文消息不能为空", trigger: "blur" }
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
      limit: 1000,
      itemId: "",
      markers: [],
      markersAll: [],
      NoData: false,
      isRealy: false,
      message: "",
      isMarkerByOneMatch: false,
      defaultMarkers: [],
      initMap: false,
      initMapPrev: false,
      showMarkers: false,
      key: "22HBZ-ZHPWJ-6KLFO-FV5RT-7F2YH-EBBXF",
      markerCount: 0,
      InfoEdit: false,
      icon: "",
      markerInfo: {},
      marker_attr: ["起点", "终点", "中间点"],
      markerAttr: [
        { key: 2, value: "中间点" },
        { key: 0, value: "起点" },
        { key: 1, value: "终点" }
      ],
      changeTw: false,
      text_change: "",
      image: "",
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
      image1: "",
      activeName: "second",
      // loading: false,
      loading2: false,
      loading3: false,
      MarkerBox: []
    };
  },
  inject: ["reload"],
  components: {
    Editor
  },
  methods: {
    upMarkerIndex(item) {
      var data = { _id: item._id, index: item.index, itemId: item.itemId };
      api.post("/api/marker/upMarkerIndex", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.getMarkers();
        } else {
          this.$message({
            message: res.data.message,
            type: "warning"
          });
        }
      });
    },
    downMarkerIndex(item) {
      var data = { _id: item._id, index: item.index, itemId: item.itemId };
      api.post("/api/marker/downMarkerIndex", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.getMarkers();
        } else {
          this.$message({
            message: res.data.message,
            type: "warning"
          });
        }
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getMarkers();
    },
    handleClick(tab, event) {
      if ($(event.target).attr("id") == "tab-first") {
        if (!this.initMapPrev) {
          this.init1();
          this.initMapPrev = true;
        }
      }
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
      var answer = this.answer;
      var id = $(e.target).attr("id");
      var answerIndex = _.indexOf(answer, id);
      if (answerIndex >= 0) {
        answer.splice(answerIndex, 1);
      }
      this.answer = answer;
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
    selectGetItemId(value) {
      this.itemId = value;
      this.filters.name = "";
      var markers = () => {
        this.getMarkers();
      };
      this.initMapPrev = false;
      this.activeName = "second";
      var asyncFun = async () => {
        await markers();
      };
      asyncFun();
    },
    markerQuestionEdit(item) {
      if (!item.password) {
        item.password = "";
      }
      if (item.marker_type == 3) {
        this.QA = item.QA || {};
        var QA_options;
        var answer;
        if (item.QA.options) {
          QA_options = item.QA.options || this.QA_options;
          answer = item.QA.answer || [];
        } else {
          QA_options = this.QA_options;
          answer = this.answer;
        }
        this.QA_options = QA_options;
        this.answer = answer;
        this.image1 = item.QA.img || "";
      }
      this.markerQuestion = _.extend({}, item);
      this.QuestionEdit = true;
    },
    editInfo() {
      const data = Object.assign({}, this.markerInfo);
      var text_change;
      if (this.changeTw) {
        text_change = this.text_change;
        data.tw = text_change;
      }
      data.image = this.image;
      api.post("/api/marker/editMarkerInfo", data).then(res => {
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
    EditQuestion() {
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
          obj.name = `${obj.id}.${obj.value}`;
        }
        data.answer = this.answer;
        data.QA_title = this.QA;
        data.QA_options = this.QA_options;
        data.image1 = this.image1;
      }
      data.password = this.password || this.markerQuestion.password;
      api.post("/api/marker/EditMarkerQuestion", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          var load = () => {
            this.QuestionEdit = false;
            this.reload();
          };
          var asyncFun = async () => {
            await this.$message({
              message: "任务编辑成功",
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
      if (!this.itemId) {
        return this.$message({
          message: "请先添加线路",
          type: "warning"
        });
      }
      var ShowMarkers = () => {
        this.showMarkers = true;
      };
      var asyncFun = async () => {
        await this.init();
        await ShowMarkers();
      };
      asyncFun();
    },
    // markerPrev() {
    //   this.init1();
    // },
    markerPrev() {},
    markerEdit(item) {
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
      this.markerInfo = _.extend({}, item);
      this.image = item.image || "";
      this.changeTw = false;
      this.icon = item.icon || "";
      this.InfoEdit = true;
    },
    // 删除
    markerRemove(item) {
      this.$confirm("确认删除该任务点吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api
          .post("/api/marker/remove", { _id: item._id, itemId: item.itemId })
          .then(res => {
            if (res.data.code == 1050) {
              return this.$store.dispathch("LogOut").then(() => {
                location.reload();
              });
            } else if (res.data.code == 200) {
              if (!res.data.delete) {
                this.$message({
                  message: res.data.message,
                  type: "warning"
                });
              } else {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
              }
              if (this.markers.length == 1) {
                if (this.page != 1) {
                  this.page = this.page - 1;
                }
              }
              this.initMapPrev = false;
              this.getMarkers();
            } else {
              return this.$message({
                message: res.data.message,
                type: "wraning"
              });
            }
          });
      });
    },
    // 获取任务点列表
    getMarkers() {
      if (this.$route.params.itemId && !this.isMarkerByOneMatch) {
        this.itemId = this.$route.params.itemId;
      }
      this.isMarkerByOneMatch = true;
      var that = this;
      var data = {
        page: this.page,
        limit: this.limit,
        itemId: this.itemId,
        name: this.filters.name
      };
      api.post("/api/marker/getMarkersList", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          if (res.data.NoData) {
            this.NoData = res.data.NoData;
            this.message = res.data.message;
          } else {
            this.NoData = res.data.NoData;
          }
          let { lines, markers, MarkersAll } = res.data;
          markers = _.extend([], markers);
          var marker_type = this.marker_type;
          for (var i = 0; i < markers.length; i++) {
            for (var j = 0; j < marker_type.length; j++) {
              if (markers[i].marker_type == marker_type[j].key) {
                markers[i].marker_typeVal = marker_type[j].value;
                break;
              }
            }
          }
          this.markers = markers;
          if (MarkersAll) {
            this.markersAll = MarkersAll;
            this.MarkerBox = _.extend([], MarkersAll);
            this.markerCount = MarkersAll.length;
          } else {
            this.markersAll = [];
            this.MarkerBox = [];
            this.markerCount = 0;
          }
          this.lines = lines || this.lines;
          if (!this.isRealy) {
            if (!this.itemId) {
              if (res.data.noMarker) {
                this.itemId = lines[0]._id;
              }
              if (res.data.hasAll) {
                this.itemId = lines[0]._id;
              }
            }
          } else {
            if (!this.itemId) {
              if (res.data.noLine) {
                this.itemId = "";
              } else {
                this.itemId = lines[0]._id;
              }
            }
          }
          if (res.data.total) {
            this.total = res.data.total || 1;
          }
          this.isRealy = true;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    searchMarkerByName() {
      if (!this.itemId) {
        return this.$message({
          message: "请先添加线路",
          type: "warning"
        });
      }
      var data = {
        name: this.filters.name,
        itemId: this.itemId,
        page: 1,
        limit: this.limit
      };
      api.post("/api/marker/searchMarkerByName", data).then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 500) {
          this.$router.push({ path: "/error" });
        } else if (res.data.code == 200) {
          if (!res.data.noData) {
            this.message = res.data.message;
          }
          this.NoData = res.data.NoData;
          var markers = res.data.markers;
          var marker_type = this.marker_type;
          for (var i = 0; i < markers.length; i++) {
            for (var j = 0; j < marker_type.length; j++) {
              if (markers[i].marker_type == marker_type[j].key) {
                markers[i].marker_typeVal = marker_type[j].value;
                break;
              }
            }
          }
          this.markers = markers;
          this.total = res.data.total;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    init() {
      var that = this;
      $(".csssprite.active").css({
        border: "solid 2px #d0d0d0",
        "border-radius": "50%"
      });
      if (that.markersAll.length == that.MarkerBox.length) {
        var MarkerBox = that.MarkerBox;
      } else {
        var MarkerBox = that.MarkerBox;
        MarkerBox = MarkerBox.splice(0, that.markerCount);
      }
      that.loading3 = true;
      TMap(this.key).then(qq => {
        var center = new window.qq.maps.LatLng(34.40131, 113.862167);
        var map = new window.qq.maps.Map(document.getElementById("container"), {
          center: center,
          zoom: 16
        });
        var infoWin = new window.qq.maps.InfoWindow({
          map: map
        });
        var scaleSize = new qq.maps.Size(30, 30);
        var origin = new qq.maps.Point(0, 0);
        var anchor = new qq.maps.Point(10, 42);
        var defaultmarkers = this.defaultMarkers;
        for (let i = 0; i < defaultmarkers.length; i++) {
          var position = new qq.maps.LatLng(
            defaultmarkers[i].center.lat,
            defaultmarkers[i].center.lng
          );
          var marker = new qq.maps.Marker({
            position,
            map: map,
            icon: new qq.maps.MarkerImage(
              defaultmarkers[i].icon,
              scaleSize,
              origin,
              anchor,
              scaleSize
            )
          });
          var label = new qq.maps.Label({
            position,
            map: map,
            content: defaultmarkers[i].name,
            offset: new qq.maps.Size(-21, -70),
            zIndex: 1000,
            style: { opacity: 0.8 }
          });
          marker.name = defaultmarkers[i].name;
          marker._id = defaultmarkers[i]._id;
          for (var k = 0; k < MarkerBox.length; k++) {
            if (MarkerBox[k].defaultMarkerId == marker._id) {
              marker.setIcon(
                new qq.maps.MarkerImage(
                  "/static/img/nilt.png",
                  scaleSize,
                  origin,
                  anchor,
                  scaleSize
                )
              );
            }
          }
          qq.maps.event.addListener(marker, "click", function(e) {
            if (
              $(e.event.target).hasClass("active") &&
              $(e.event.target).attr("src") != "/static/img/nilt.png"
            ) {
              $(e.event.target).css({ border: "none" });
              $(e.event.target).removeClass("active");
              for (var j = 0; j < MarkerBox.length; j++) {
                if (MarkerBox[j].defaultMarkerId == this._id) {
                  MarkerBox.splice(j, 1);
                  break;
                }
              }
              that.MarkerBox = MarkerBox;
            } else if (
              $(e.event.target).attr("src") != "/static/img/nilt.png" &&
              !$(e.event.target).hasClass("active")
            ) {
              $(e.event.target).css({
                border: "solid 3px red",
                "border-radius": "50%"
              });
              $(e.event.target).addClass("active");
              defaultmarkers[i].defaultMarkerId = this._id;
              MarkerBox.push(defaultmarkers[i]);
              that.MarkerBox = MarkerBox;
            }
          });
        }
        that.loading3 = false;
      });
    },
    init1() {
      var that = this;
      $(".csssprite.active").css({
        border: "solid 2px #d0d0d0",
        "border-radius": "50%"
      });
      TMap(this.key).then(qq => {
        var center = new window.qq.maps.LatLng(34.40131, 113.862167);
        var map = new window.qq.maps.Map(
          document.getElementById("container1"),
          {
            center: center,
            zoom: 15
          }
        );
        var infoWin = new window.qq.maps.InfoWindow({
          map: map
        });
        var scaleSize = new qq.maps.Size(30, 30);
        var origin = new qq.maps.Point(0, 0);
        var anchor = new qq.maps.Point(10, 42);
        var markers = that.markersAll;
        if(markers.length > 0){
          map.panTo(new qq.maps.LatLng(markers[0].center.lat, markers[0].center.lng));
        }
        for (let i = 0; i < markers.length; i++) {
          var position = new qq.maps.LatLng(
            markers[i].center.lat,
            markers[i].center.lng
          );
          var marker = new qq.maps.Marker({
            position,
            map: map,
            icon: new qq.maps.MarkerImage(
              markers[i].icon,
              scaleSize,
              origin,
              anchor
            )
          });
          var label = new qq.maps.Label({
            position,
            map: map,
            content: markers[i].defaultMarkerName,
            offset: new qq.maps.Size(-21, -70),
            zIndex: 1000,
            style: { opacity: 0.8 }
          });
          marker.name = markers[i].defaultMarkerName;
          marker.setIcon(
            new qq.maps.MarkerImage(
              "/static/img/nilt.png",
              scaleSize,
              origin,
              anchor
            )
          );
        }
      });
    },
    getDefaultMarters() {
      api.post("/api/marker/getDefaultMarters").then(res => {
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.defaultMarkers = res.data.defaultMarkers;
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
    closeSave() {
      var markers = this.markers;
      var markerCount = this.markerCount;
      if (markerCount == -1) markerCount = 0;
      markers.splice(markerCount);
      this.markers = markers;
      this.showMarkers = false;
    },
    saveMarker() {
      var markers = this.MarkerBox;
      var markerCount = this.markerCount;
      if (markerCount == -1) markerCount = 0;
      var newMarkers = markers.slice(this.markerCount);
      if (newMarkers.length == 0) {
        return (this.showMarkers = false);
      }
      var data = { newMarkers, count: markerCount, itemId: this.itemId };
      api.post("/api/marker/saveMarkers", data).then(res => {
        this.showMarkers = false;
        if (res.data.code == 1050) {
          return this.$store.dispathch("LogOut").then(() => {
            location.reload();
          });
        } else if (res.data.code == 200) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.getMarkers();
          this.initMapPrev = false;
          this.activeName = "second";
        } else {
          return this.$message({
            message: res.data.message,
            type: "wraning"
          });
        }
      });
    },
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
    }
  },
  mounted() {
    var ansyncFun = async () => {
      await this.getDefaultMarters();
      await this.getMarkers();
    };
    ansyncFun();
  }
};
</script>

<style scoped>
.wrap_box {
  background: #fff;
  padding: 20px;
}
.marker_tab {
  padding-top: 70px;
}
.left-img {
  width: 30px;
  height: 30px;
}
.line .list .wrap .left .left-img {
  width: 30px;
  height: 30px;
}
.avatar-uploader-icon[data-v-1b58e498] {
  line-height: 100px;
  position: relative;
}
.el-icon-plus:before {
  position: absolute;
  left: 35px;
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
#container1 {
  height: 800px;
  border: solid 1px #e0e0e0;
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
.answer {
  margin-bottom: 5px;
}
.el-icon-error {
  cursor: pointer;
}
.upIndex {
  width: 20px;
  height: 20px;
}
.upIndex:hover {
  color: #00b5ad;
  cursor: pointer;
}
.downIndex {
  width: 20px;
  height: 20px;
}
.downIndex:hover {
  color: #00b5ad;
  cursor: pointer;
}
</style>
<style lang ="scss">
@import "../../styles/lineList.scss";
</style>
