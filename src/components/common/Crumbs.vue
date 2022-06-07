<template>
  <div class="bread-crumb" v-if="$route.meta.menuId!='1'">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in $route.meta.title" :key="item.index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    props: {},
    mounted() {},
    watch: {},

    methods: {}
  };
</script>

<style lang="scss" scoped>
  .bread-crumb{
    height: 30px;
    display: flex;
    align-items: center;
    padding: 10px 0px 10px 0px;
  }

  .bread-crumb .el-breadcrumb{
    font-size: 16px;
  }
  .bread-crumb /deep/ .el-breadcrumb__separator{
    margin: 0px 3px 0px 3px;
  }
</style>
