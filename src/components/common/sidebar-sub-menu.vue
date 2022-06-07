<template>
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="menu.url" :key="menu.id">
    <template slot="title">
      <i :class="menu.icon"></i>
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu v-for="item in menu.children" :key="item.id" :menu="item"></sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.url" @click="gotoRouteHandle(menu.id)">
    <i :class="menu.icon"></i>
    <span slot="title">{{ menu.name }}</span>
  </el-menu-item>
</template>


<script>
  import SubMenu from './sidebar-sub-menu'
  export default {
    name: "sub-menu",
    props: {
      menu: {
        type: Object,
        required: true
      }
    },
    components: {
      SubMenu
    },
    methods: {
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      gotoRouteHandle(menuId) {
        var route = window.SITE_CONFIG['dynamicMenuRoutes'].filter(item => item.meta.menuId === menuId)[0]
        if (route) {
          this.$router.push({
            name: route.name
          })
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
</style>
