<template>
  <div class="data-tabs">
    <el-row :span="24">
      <!-- <div>{{item}}</div> -->
      <el-col
        class="item-wrap"
        :span="span"
        :xs="24"
        :sm="12"
        :md="6"
        v-for="(item,index) in data"
        :key="index"
      >
        <div
          class="item"
          :id="item.matchId"
          @click="matchSetting"
          xs="24"
          :style="{background:item.color}"
        >
          <div class="item-header">
            <h3 class="item-header-match-name">{{item.title}}</h3>
            <span>{{item.subtitle}}</span>
          </div>
          <div class="item-body">
            <h3>
              <nx-count-up :start="0" :end="item.count"/>&nbsp;人
            </h3>
          </div>
          <div class="item-footer">
            <span>时间:{{ item.sdate | momentTime('YYYY-MM-DD')}}---{{item.edate | momentTime('YYYY-MM-DD')}}</span>
            <button class="delete" v-if="item.isDelete" @click="remove($event)">删除</button>
          </div>
          <p class="item-tip">{{item.key}}</p>
        </div>
      </el-col>
      <el-col class="item-wrap" :span="span" :xs="24" :sm="12" :md="6" v-if="addMatch">
        <div class="item add-match" @click="moreMatch" title="创建赛事" xs="24" style>
          <!-- <iframe src="/icons/svg/add.svg" width="300" height="100"></iframe> -->
          <!-- <svg-icon iconClass="add"></svg-icon>  -->
          <img title="创建赛事" class="img-add-match" src="../../assets/images/home/add.png" alt="创建赛事">
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="创建赛事"
      :visible.sync="dialogVisible"
      width="500"
      :before-close="handleClose"
      style="padding-bottom: 15vh;"
    >
      <!-- <span>创建赛事</span> -->
      <el-col class="create-match-wrap" required>
        <div title="轮播图" class="cover-wrap">
          <div class="title">
            <span class="text-danger">*</span>轮播图（至少一张）
          </div>
          <div class="addcover">
            <div v-for="item in slider" class="imgBox">
              <img
                :src="item"
                class="cover"
                style="width:100px;height:100px;margin-right: 5px;border: none;cursor: default;"
              >
              <span class="removeImg" @click="removeImg(item)">删除</span>
            </div>
            <el-upload
              class="avatar-uploader"
              action="/api/upload/One"
              :show-file-list="false"
              accept="image/jpeg,image/png"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <i
                v-loading="loading"
                class="el-icon-plus avatar-uploader-icon"
                style="border: 1px dashed #d9d9d9;width:100px;height:100px;position: relative;"
              ></i>
            </el-upload>
          </div>
        </div>
        <div title="基本信息" class="cover-wrap">
          <div class="title">基本信息（带*的为必填项）</div>
          <div title="基本信息" class="base-info-wrap">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :model="matchData"
              :rules="rules"
            >
              <el-form-item label="名称" prop="name">
                <el-input v-model="matchData.name"></el-input>
              </el-form-item>
              <el-form-item label="简称" prop="shortname">
                <el-input v-model="matchData.shortname"></el-input>
              </el-form-item>
              <el-form-item label="主办城市" prop="city">
                <el-input v-model="matchData.city"></el-input>
              </el-form-item>
              <el-form-item label="详细地址" prop="address" required>
                <el-input v-model="matchData.address">
                  <button slot="append" class="map-pick" @click="innerVisible = true">地图选点</button>
                </el-input>
                <el-input v-model="matchData.location" style="display:none;"></el-input>
              </el-form-item>
              <el-form-item label="比赛时间" required>
                <el-date-picker
                  v-model="matchData.timeAll"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00', '08:00:00']"
                >></el-date-picker>
              </el-form-item>
              <el-form-item label="比赛类型" required prop="matchType">
                <el-select v-model="matchData.matchType" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系电话" prop="linkphone">
                <el-input v-model="matchData.linkphone" type="number"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createMatch">确 定</el-button>
      </div>
    </el-dialog>
    <!--地图选点-->
    <el-dialog width="100" title="地图选点" append-to-body :visible.sync="innerVisible">
      <iframe
        width="100%"
        height="400"
        class="map-iframe"
        id="mapBox"
        frameborder="no"
        src="https://m.amap.com/picker/?center=113.85781,34.402549&key=aabb5b2054b8fce8703eb2f6b5931361"
        @load="loadiframe"
      ></iframe>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "underscore";
import nxCountUp from "@/components/nx-count-up/index.vue";
import axios from "axios";
import { api } from "../../axios";
export default {
  components: {
    nxCountUp
  },
  name: "nx-data-tabs",
  data() {
    return {
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        shortname: [
          { required: true, message: "简称不能为空", trigger: "blur" }
        ],
        city: [{ required: true, message: "城市不能为空", trigger: "blur" }],
        linkphone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ]
      },
      slider: [],
      dialogVisible: false, // 创建赛事
      innerVisible: false, // 地图选点
      matchKind: "", // 赛事类别
      span: this.option.span || 6,
      data: this.option.data || [],
      addMatch: this.option.addMatch || false,
      labelPosition: "right",
      value4: "",
      matchData: {},
      options: [
        {
          value: 1,
          label: "游览线路"
        },
        {
          value: 2,
          label: "比赛线路"
        }
      ],
      loading: false
    };
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    },
    easyDataOption: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    moreMatch() {
      this.matchData = {};
      this.slider = [];
      this.dialogVisible = true;
    },

    handleClose(done) {
      done();
    },
    removeImg(item) {
      var slider = this.slider;
      var index = _.indexOf(slider, item);
      if (index > -1) {
        var newSlider = slider.splice(index, 1);
      }
    },
    matchSetting(e) {
      e.preventDefault();
      this.$router.push({
        path: `/matchInfo`,
        name: "赛事详情",
        params: { matchId: e.currentTarget.id }
      });
    },
    remove(e) {
      e.stopPropagation();
      var that = this;
      var _id = $(e.target)
        .parents(".item")
        .attr("id");
      that
        .$confirm("确认删除吗？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          api.post("/api/match/delete", { _id }).then(res => {
            if (res.data.code != 200) {
              that.$emit("isRemove", false);
            }
            that.$emit("isRemove", true);
          });
        });
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        var slider = this.slider;
        slider.push(res.data);
        this.slider = slider;
      } else {
        this.$message.error(res.msg);
      }
      this.loading = false;
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type == "image/jpeg") || (file.type == "image/png");
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
    createMatch() {
      var that = this;
      const data = Object.assign({}, this.matchData);
      var sliders = this.slider;
      data.slider = this.slider;
      data.ecId = "xydSXCsZ38TqQshY7";
      data.domainId = "PFSvkHRcArfzJEuZt";
      api.post("api/match/createMatch", data).then(res => {
        if (res.data.code != 200) {
          return this.$message({
            message: res.data.message,
            type: "warning"
          });
        }
        that.$emit("isRemove", true);
      });
    },
    loadiframe() {
      let iframe = document.getElementById("mapBox").contentWindow;
      iframe.postMessage("hello", "https://m.amap.com/picker/");
      window.addEventListener(
        "message",
        function(e) {
          if (e.data.command != "COMMAND_GET_TITLE") {
            this.matchData.location = e.data.location;
            this.matchData.address = e.data.address;
          }
        }.bind(this),
        false
      );
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.imgBox {
  display: inline-block;
  position: relative;
  cursor: default;
}
.removeImg {
  position: absolute;
  top: 30px;
  width: 100px;
  padding: 10px 0px;
  background: rgba(255, 0, 0, 0.8);
  text-align: center;
  cursor: pointer;
  display: none;
}
// .imgBox span{
//   display: none;
// }
.imgBox:hover .removeImg {
  display: block;
  cursor: pointer;
}
.text-danger {
  color: #f56c6c;
  margin-right: 4px;
}
.addcover .cover:hover {
  cursor: pointer;
}
.avatar-uploader {
  display: inline;
}
.el-icon-plus:before {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.item-wrap .item:hover .item-footer .delete {
  display: inline-block;
}
.item-wrap .item-footer {
  position: relative;
}
.item-wrap .item-footer .delete {
  display: none;
  position: absolute;
  right: 0px;
  padding: 3px 8px;
  background: #fff;
  font-size: 14px;
  color: #333;
  border: none;
  border-radius: 5px;
  z-index: 999;
}
.item-wrap .item-footer .delete:hover {
  background: red;
  border: solid 1px #fff;
  color: #fff;
}
.create-match-wrap {
  border: solid 1px #eee;
  border-radius: 10px;
  padding: 0px 10px;
}
.create-match-wrap .cover-wrap .map-pick {
  background: none;
  border: none;
  padding: 10px 0px;
  margin: 0px -15px;
}
.create-match-wrap .cover-wrap .title {
  background: whitesmoke;
  margin: 0px -10px 10px;
  border-radius: 5px 5px 0px 0px;
  padding: 15px;
  font-size: 18px;
}
.create-match-wrap .cover-wrap .addcover img {
  width: 80px;
  height: 80px;
  border: solid;
}
</style>
