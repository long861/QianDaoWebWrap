<template>

</template>

<script>
// import nxDataDisplay from '@/components/nx-data-display/nx-data-display'
import lineList from "@/components/lineList/lineList";
import {
  getLinesList,
  removeLines,
  editLines,
  addLine,
  batchRemoveLines
} from "@/api/lines";
export default {
  name: "line-list",
  data() {
    return {
      
    };
  },
  props: {
    linesList: {
      type: Array,
      required:true,
      default: () => {}
    }
  },
  created() {},
  mounted() {},
  methods: {

  },
  watch: {},
  computed: {}
}
</script>


<style scoped>
</style>
<style lang ="scss">

</style>
