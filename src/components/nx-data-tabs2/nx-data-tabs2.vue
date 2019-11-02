<template>
  <div class="data-tabs">
    <el-row :span="24">
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
            <h3 class="item-header-match-name">{{item.name}}</h3>
            <span>{{item.subtitle}}</span>
          </div>
          <div class="item-body">
            <h3>
              <nx-count-up :start="0" :end="item.playersCount"/>&nbsp;人
            </h3>
          </div>
          <div class="item-footer">
            <span>时间:{{ item._start | momentTime('YYYY-MM-DD')}}---{{item._end | momentTime('YYYY-MM-DD')}}</span>
          </div>
          <p class="item-tip">{{item.one}}</p>
        </div>
      </el-col>
    </el-row>
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
      span: this.option.span || 6,
      data: this.option.data || [],
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
    matchSetting(e) {
      e.preventDefault();
      this.$router.push({
        path: `/lineManage/list`,
        name: "线路管理"
      });
    },
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.item-wrap .item-footer {
  position: relative;
}
</style>
