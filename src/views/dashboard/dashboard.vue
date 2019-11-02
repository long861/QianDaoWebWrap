<template>
  <div class="app-container" v-loading="loading">
    <div class="item">
      <h4>活跃人数</h4>
      <nx-data-display :option="option"></nx-data-display>
    </div>
    <div class="item">
      <h4>火热的线路</h4>
      <nx-data-tabs2 :option="easyDataOption" v-if="isRealy"></nx-data-tabs2>
    </div>
    <div class="item">
      <h4>今日大数据详情</h4>
      <nx-data-icons :option="easyDataOption1"></nx-data-icons>
    </div>
    <ve-line :data="chartData"></ve-line>
  </div>
</template>

<script>
import nxDataDisplay from "@/components/nx-data-display/nx-data-display";
import nxDataCard from "@/components/nx-data-card/nx-data-card";
import nxDataTabs2 from "@/components/nx-data-tabs2/nx-data-tabs2";
import nxDataIcons from "@/components/nx-data-icons/nx-data-icons";
import nxGithubCorner from "@/components/nx-github-corner";
import axios from "axios";
import { api } from "../../axios";
export default {
  name: "report",
  components: {
    nxDataDisplay,
    nxDataCard,
    nxDataTabs2,
    nxDataIcons,
    nxGithubCorner
  },
  data() {
    return {
      loading: false,
      isRealy: false,
      option: {
        span: 8,
        color: "#15A0FF",
        data: [
          {
            count: 1682,
            title: "日活跃数"
          },
          {
            count: 35640,
            title: "月活跃数"
          },
          {
            count: 1658130,
            title: "年活跃数"
          }
        ]
      },
      easyDataOption: {},
      easyDataOption1: {
        color: "rgb(63, 161, 255)",
        span: 4,
        data: [
          {
            title: "新用户",
            count: 590,
            icon: "icon-cuowu"
          },
          {
            title: "今日玩家",
            count: 22139,
            icon: "icon-shujuzhanshi2"
          },
          {
            title: "今日帖子",
            count: 35623,
            icon: "icon-jiaoseguanli"
          },
          {
            title: "今日点赞",
            count: 168260,
            icon: "icon-caidanguanli"
          },
          {
            title: "今日评论",
            count: 7860,
            icon: "icon-caidanguanli"
          },
          {
            title: "今日建议",
            count: 5,
            icon: "icon-caidanguanli"
          }
        ]
      },
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
      }
    };
  },
  created() {},
  watch: {},
  mounted(ev) {
    var that = this;
    that.loading = true;
    that.isRealy = false;
    api.post("/api/matchLines/getHotLine", {}).then(res => {
      if (res.data.code == 1050) {
        return this.$store.dispathch("LogOut").then(() => {
          location.reload();
        });
      } else if (res.data.code == 200) {
        var current = [];
        var result = res.data.data;
        var time = Date.now();
        for (var i = 0; i < result.length; i++) {
          if (result[i]._start > time) {
            result[i].subtitle = "未开始";
          } else if (result[i]._start < time && result[i]._end > time) {
            result[i].subtitle = "正在进行";
            current.push(result[i]);
          } else if (result[i]._end < time) {
            result[i].subtitle = "已结束";
          }
        }
        var easyDataOption = {
          span: 6,
          isRealy: true,
          data: result
        };
        that.easyDataOption = easyDataOption;
        that.isRealy = true;
        that.loading = false;
      } else {
        return this.$message({
          message: res.data.message,
          type: "wraning"
        });
      }
    });
  },
  computed: {}
};
</script>

<style scoped>
.item {
  margin-bottom: 16px;
}
</style>
<style lang ="scss">
@import "../../styles/data-card.scss";
@import "../../styles/data-display.scss";
@import "../../styles/data-icons.scss";
@import "../../styles/data-tabs.scss";
.app-container {
  overflow-y: auto;
}
</style>
