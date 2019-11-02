<template>
  <div class="data-card">
    <el-row :span="24">
      <el-col :span="24" v-for="(item,index) in data" :key="index">
        <div class="item">
          <!-- <img :src="item.src" class="item-img" /> -->
    	    <div class="item-cover" :style="{backgroundImage:'url(' + item.src + ')'}"></div>
          <div class="item-text" :style="{color:colorText,backgroundColor:bgText}">
            <p>名称：{{item.name}}</p>
            <p>时间：{{item.sdate | momentTime('YYYY-MM-DD')}} ~ {{item.edate | momentTime('YYYY-MM-DD')}}</p>
            <p>地点：{{item.address}}</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'nx-data-card',
  data() {
    return {
      span: this.option.span || 6,
      data: this.option.data || [],
      colorText: this.option.colorText || '#fff',
      bgText: this.option.bgText || '#2e323f',
      borderColor: this.option.borderColor || '#2e323f'
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
