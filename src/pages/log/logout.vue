<template>
  <div></div>
</template>

<script>
// import nxDataDisplay from '@/components/nx-data-display/nx-data-display'

export default {
  name: "report",
  components: {
    //   nxDataDisplay
  },
  data() {
    return {};
  },
  created() {},
  watch: {},
  mounted() {
    this.$store.dispatch("LogOut").then(() => {
      location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
    });
  },
  computed: {}
};
</script>


<style scoped>
/* .item {
  margin-bottom: 16px;
} */
</style>
<style lang ="scss">
/* @import '../../styles/data-card.scss'; */
</style>
