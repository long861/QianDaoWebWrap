<template>
  <div>
    <!-- <load-ing v-show="!isRealy"></load-ing> -->
    <div class="item" v-loading="loading">
      <h2 class="match-list-title current-match-list">当前赛事</h2>
      <nx-data-tabs :option="currentMatch" v-if="currentMatch.isRealy" v-on:isRemove="isRemove"></nx-data-tabs>
      <h2 class="match-list-title">所有赛事</h2>
      <nx-data-tabs :option="easyDataOption" v-if="easyDataOption.isRealy" v-on:isRemove="isRemove"></nx-data-tabs>
    </div>
  </div>
</template>

<script>
// import nxDataDisplay from '@/components/nx-data-display/nx-data-display'
import nxDataTabs from "@/components/nx-data-tabs/nx-data-tabs";
// import LoadIng from "@/pages/Loading/LoadIng";
import axios from "axios";
import { api } from "../../axios";
export default {
  name: "matchList",
  components: {
    nxDataTabs
    // LoadIng
  },
  data() {
    return {
      currentMatch: {
        span: 6,
        addMatch: true,
        isRealy: false,
        data: []
      },
      easyDataOption: {
        span: 6,
        isRealy: false,
        date: []
      },
      isRealy: false,
      loading: false
    };
  },
  created() {},
  watch: {
    easyDataOption: (newVal, oldVal) => {}
  },
  mounted(ev) {
    var that = this;
    that.loading = true;
    // that.isRealy = false;
    api.post("/api/match/getMatchList").then(res => {
      if (res.data.code == 200) {
        var current = [];
        var result = res.data.data;
        for (var i = 0; i < result.length; i++) {
          if (result[i].MatchState == 0) {
            result[i].subtitle = "未开始";
          } else if (result[i].MatchState == 1) {
            result[i].subtitle = "正在进行";
            current.push(result[i]);
          } else if (result[i].MatchState == 2) {
            result[i].subtitle = "已结束";
          }
        }
        var dataOption = {
          span: 6,
          isRealy: true,
          data: result
        };
        var currentOption = {
          span: 6,
          addMatch: true,
          isRealy: true,
          data: current
        };
        that.currentMatch = currentOption;
        that.easyDataOption = dataOption;
        that.loading = false;
      }
    });
  },
  computed: {},
  inject: ["reload"],
  methods: {
    handleLogin() {
      this.$router.push({ path: "/dashboard/dashboard" });
    },
    isRemove(val) {
      if (val) {
        this.reload();
      }
    }
  }
};
</script>


<style scoped>
.add-match {
  display: flex;
  justify-content: left;
  align-items: center;
}
.item {
  margin-bottom: 16px;
}
.item .match-list-title {
  margin-left: 20px;
}

.to_admin {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  background-color: deepskyblue;
}
</style>
<style lang ="scss">
/* @import '../../styles/data-card.scss'; */
@import "../../styles/data-tabs.scss";
</style>
