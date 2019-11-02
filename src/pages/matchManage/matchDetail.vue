<template>
  <div class="matchSetting">
    <div class="header">
      <el-col :xs="24" :sm="24" :md="7">
        <div title="基本信息" class="left">
          <div class="left-cover">
            <nx-data-card :option="easyDataOption0" v-if="easyDataOption0.isRealy"></nx-data-card>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="17" style>
        <div class="right">
          <el-steps :active="active" finish-status="success" title="赛事设置">
            <!-- <el-step
              class="match-setting-item"
              description="说明:请在这里添加组别，比如儿童组，青年组，老年组"
              title="设置组别"
            ></el-step>-->
            <el-step class="match-setting-item" description="说明:请给不同的组别设置不同的线路" title="设置线路"></el-step>
            <el-step class="match-setting-item" description="说明:请在线路上设置点标和点标任务" title="设置点标"></el-step>
          </el-steps>
          <el-col :xs="12" :sm="6" :md="3" :lg="12" style="width:100%">
            <div class="right-options">
              <template v-for="item in options" v-show="isRealy">
                <a
                  :href="item.url"
                  :id="item._id"
                  :gameId="item.gameId"
                  :pathName="item.pathName"
                  @click="matchLine($event)"
                  class="matchLine"
                >
                  <div :title="item.name" class="option">
                    <svg-icon class-name="item-icon" :icon-class="item.icon"></svg-icon>
                    <div class="item-name">{{item.name}}</div>
                  </div>
                </a>
              </template>
            </div>
          </el-col>
        </div>
      </el-col>
    </div>
    <div class="body">
      <el-col :xs="24" :sm="24" :md="24">
        <el-col :xs="24" :sm="24" :md="7" class="left">
          <el-card class="box-card news">
            <a
              class="new"
              v-for="(item,index) in news"
              :key="index"
              v-show="news.length > 0"
              :href="item.link"
              target="_blank"
            >
              <div class="cover" :style="'background-image:url('+item.cover+')'"></div>
              <div class="desc">
                <div class="text name" v-if="!item.summary">{{item.title}}</div>
                <div class="text name" v-if="item.summary">{{item.summary}}</div>
                <div class="info">{{item.author}}/{{item.createtime | momentTime('YYYY年MM月DD日')}}</div>
              </div>
            </a>
            <div class="new" v-show="news.length == 0">
              <div>暂时没有新闻</div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="17" class="right">
          <nx-data-icons :option="easyDataOption1" class="data-tab"></nx-data-icons>
          <ve-line :data="chartData" class="line"></ve-line>
        </el-col>
      </el-col>
    </div>
  </div>
</template>

<script>
import svgIcon from "@/components/nx-svg-icon/index";
import nxDataCard from "@/components/nx-data-card/nx-data-card";
import nxDataIcons from "@/components/nx-data-icons/nx-data-icons";
import axios from "axios";
import { api } from "../../axios";
export default {
  name: "report",
  components: {
    nxDataCard,
    svgIcon,
    nxDataIcons
  },
  props: ["matchId"],
  data() {
    return {
      options: [
        // { name: "设置组别", pathName:'Markers', icon: "groups", url: "/matchManage/groups" },
        {
          name: "设置线路",
          pathName: "赛事线路",
          icon: "line",
          url: "/lineManage/list"
        },
        {
          name: "设置点标",
          pathName: "点标设置",
          icon: "marker",
          url: "/markers/lists"
        },
        // { name: "赛事规程", pathName:'MatchRule', icon: "guicheng", url: "/matchManage/groups" },
        // { name: "赛事大数据", pathName:'MatchData', icon: "baobiao", url: "/matchManage/groups" },
        // { name: "赛事H5", pathName:'MatchH5', icon: "H5", url: "/matchManage/groups" },
        // { name: "赛道小程序", pathName:'saodaoXCX', icon: "xcx", url: "/matchManage/groups" },
        // { name: "基本信息", pathName:'basicInfo', icon: "setting", methods: "basicInfo" }
        {
          name: "赛事规程",
          pathName: "nowrap",
          icon: "guicheng",
          url: "/nowrap"
        },
        {
          name: "赛事大数据",
          pathName: "nowrap",
          icon: "baobiao",
          url: "/nowrap"
        },
        { name: "赛事H5", pathName: "nowrap", icon: "H5", url: "/nowrap" },
        { name: "赛道小程序", pathName: "nowrap", icon: "xcx", url: "/nowrap" },
        {
          name: "基本信息",
          pathName: "nowrap",
          icon: "setting",
          url: "/nowrap"
        }
      ],
      items: [],
      active: 1,
      news: [],
      itemMapList: [],
      isRealy: false,
      _id: "baidu.com",
      easyDataOption0: {},
      chartData: {
        columns: ["日期", "重走红军路", "穿越火线", "亲子踏青", "情侣游园"],
        rows: [
          {
            日期: "19.01.1",
            重走红军路: 1393,
            穿越火线: 1093,
            亲子踏青: 2500,
            情侣游园: 2300
          },
          {
            日期: "19.01.3",
            重走红军路: 2923,
            穿越火线: 2623,
            亲子踏青: 4500,
            情侣游园: 2400
          },
          {
            日期: "19.01.2",
            重走红军路: 3530,
            穿越火线: 5230,
            亲子踏青: 2500,
            情侣游园: 2500
          },
          {
            日期: "19.01.4",
            重走红军路: 1723,
            穿越火线: 3423,
            亲子踏青: 3500,
            情侣游园: 2600
          },
          {
            日期: "19.01.5",
            重走红军路: 3792,
            穿越火线: 3492,
            亲子踏青: 4500,
            情侣游园: 2700
          },
          {
            日期: "19.01.6",
            重走红军路: 4593,
            穿越火线: 6293,
            亲子踏青: 1600,
            情侣游园: 2800
          },
          {
            日期: "19.01.7",
            重走红军路: 4593,
            穿越火线: 2293,
            亲子踏青: 2500,
            情侣游园: 2400
          },
          {
            日期: "19.01.8",
            重走红军路: 4593,
            穿越火线: 2293,
            亲子踏青: 2300,
            情侣游园: 2360
          },
          {
            日期: "19.01.9",
            重走红军路: 4593,
            穿越火线: 3293,
            亲子踏青: 3340,
            情侣游园: 4600
          },
          {
            日期: "19.01.10",
            重走红军路: 453,
            穿越火线: 6293,
            亲子踏青: 2500,
            情侣游园: 5500
          },
          {
            日期: "19.01.11",
            重走红军路: 2593,
            穿越火线: 7293,
            亲子踏青: 2500,
            情侣游园: 3500
          },
          {
            日期: "19.01.12",
            重走红军路: 3593,
            穿越火线: 8293,
            亲子踏青: 3400,
            情侣游园: 2500
          },
          {
            日期: "19.01.13",
            重走红军路: 3343,
            穿越火线: 2293,
            亲子踏青: 2700,
            情侣游园: 2460
          },
          {
            日期: "19.01.14",
            重走红军路: 6393,
            穿越火线: 4293,
            亲子踏青: 1620,
            情侣游园: 2460
          },
          {
            日期: "19.01.15",
            重走红军路: 6293,
            穿越火线: 4293,
            亲子踏青: 1600,
            情侣游园: 2600
          },
          {
            日期: "19.01.16",
            重走红军路: 5593,
            穿越火线: 3293,
            亲子踏青: 2500,
            情侣游园: 2560
          },
          {
            日期: "19.01.17",
            重走红军路: 3593,
            穿越火线: 2293,
            亲子踏青: 1500,
            情侣游园: 2460
          }
        ]
      },
      easyDataOption1: {
        color: "rgb(63, 161, 255)",
        span: 4,
        data: [
          {
            title: "总报名费(元)",
            count: 95800.0,
            icon: "icon-cuowu"
          },
          {
            title: "今日报名费(元)",
            count: 1800.0,
            icon: "icon-cuowu"
          },
          {
            title: "访问数量",
            count: 59032,
            icon: "icon-caidanguanli"
          },
          {
            title: "报名数量",
            count: 59032,
            icon: "icon-shujuzhanshi2"
          }
        ]
      }
    };
  },
  created(template) {},
  methods: {
    matchLine(e) {
      e.preventDefault();
      var path = `${$(e.target)
        .parents(".matchLine")
        .attr("href")}`;
      var name = `${$(e.target)
        .parents(".matchLine")
        .attr("pathName")}`;
      if (name == "MatchMarkers" && this.active == 1) {
        return this.$alert("请先设置至少一条路线", "错误");
      }
      var matchId = `${$(e.target)
        .parents(".matchLine")
        .attr("id")}`;
      var gameId = `${$(e.target)
        .parents(".matchLine")
        .attr("gameId")}`;
      this.$router.push({
        path,
        name,
        params: { gameId, matchId }
      });
    }
  },
  watch: {},
  mounted(ev) {
    var that = this;
    var url = `/api/match/getMatchInfo/${this.$route.params.matchId}`;
    api.post(url).then(res => {
      if (res.data.code != 200) {
        return that.$alert(res.data.message, "错误");
      }
      var result = res.data.data;
      that.easyDataOption0 = {
        isRealy: true,
        span: 6,
        borderColor: "#fff",
        data: [
          {
            _id: result._id,
            uuid: result.uuid,
            name: result.name,
            src: result.cover,
            sdate: result.sdate,
            edate: result.edate,
            address: result.address
          }
        ]
      };
      that.news = res.data.News;
      that.items = res.data.Items;
      that.itemMapList = res.data.itemMapList;
      if (that.itemMapList.length > 0) {
        that.active = 3;
      } else {
        if (that.items.length > 0) {
          that.active = 2;
        }
      }
      that._id = that.$route.params.matchId;
      var optionsNew = [];
      for (var i = 0; i < that.options.length; i++) {
        var obj = that.options[i];
        obj._id = that._id;
        obj.gameId = that.easyDataOption0.data[0].uuid;
        optionsNew.push(obj);
      }
      that.options = optionsNew;
      that.isRealy = true;
    });
  },
  computed: {}
};
</script>


<style scoped>
.matchSetting {
  padding: 40px 30px;
  width: 100%;
  height: 100%;
}
.matchSetting .header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.matchSetting .header .right {
  padding: 0px 30px;
  height: 100%;
}
.matchSetting .header .right .right-options {
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 40px 0px 0px 0px;
  overflow: auto;
}
/* .element::-webkit-scrollbar {
  width: 0 !important;
}

.element { 
  -ms-overflow-style: none;
   overflow: -moz-scrollbars-none;
} */

.matchSetting .header .right .right-options .item-name {
  font-size: 14px;
  color: black;
  margin-top: 10px;
}
.matchSetting .header .right .right-options .item-icon {
  width: 60px;
  height: 60px;
}

.matchSetting .header .right .right-options .option {
  padding: 20px;
  text-align: center;
  border-radius: 5px;
  /* background: #f5f5f5; */
  border: 1px solid #f5f5f5;
  cursor: pointer;
  margin: 0px 20px;
  width: 100px;
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.matchSetting .header .right .right-options .option:hover {
  background: #f5f5f5;
}
.matchSetting .header .right .match-setting-item {
  cursor: pointer;
}

.matchSetting .body {
  display: flex;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.matchSetting .body .right .data-tab {
  padding-top: 20px;
}
.matchSetting .body .right .line {
  padding: 30px 20px 0px 20px;
}
.matchSetting .body .left .news .new {
  padding: 15px 0px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  justify-content: left;
  align-items: center;
  cursor: pointer;
}
.matchSetting .body .left .news .new:hover {
  background: #f5f5f5;
}

.matchSetting .body .left .new .cover {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 3px;
  height: 60px;
  width: 60px;
  margin-right: 10px;
}

.matchSetting .body .left .new .name {
  width: 340px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
  font-size: 15px;
}

.matchSetting .body .left .new .info {
  font-size: 15px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(170, 170, 170, 1);
}
</style>
<style lang ="scss">
@import "../../styles/data-card.scss";
@import "../../styles/data-icons.scss";
/* @import '../../styles/data-card.scss'; */
</style>
