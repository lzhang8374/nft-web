<template>
  <div class="content-box">
    <v-head />
    <div class="content">
      <v-sidebar />
      <div class="content-main">
        <v-crumbs />
        <div class="content-router-container">
          <transition name="el-fade-in-linear" mode="out-in">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive" :key="$route.name" class="content-router"/>
            </keep-alive>
          </transition>
          <transition name="el-fade-in-linear" mode="out-in">
            <router-view v-if="!$route.meta.keepAlive" :key="$route.name" class="content-router"/>
          </transition>
        </div>
        <el-backtop/>
      </div>
    </div>
  </div>
</template>

<script>
  import vHead from './Header.vue';
  import vSidebar from './Sidebar.vue';
  import vCrumbs from './Crumbs.vue'
  export default {
    components: {
      vHead,
      vSidebar,
      vCrumbs,
    },
    data() {
      return {
        collapse: false,
      }
    },
  }
</script>
<style lang="scss" scoped>
  .content-box{
    display: flex;
    flex-direction: column;
    background-color: rgb(247,248,250);
    height: 100vh;
    .content{
      display: flex;
      flex:1;
      overflow-y: auto;
    }
    .content-main{
      width: 100%;
      margin:0px 0px 0px 20px;
      overflow-y: hidden;
      display: flex;
      flex-direction: column;

      .content-router-container{
        overflow-y: hidden;
        height: 100%;
        .content-router{
          overflow-y: auto;
        }
      }
    }
  }
</style>
