<template>
  <div class="sidebar" :class="{'sidebar-collapse':collapse}">
    <div class="sidebar-menu">
      <el-menu router unique-opened :default-active="this.$route.path" :collapse="collapse" :collapse-transition="false">
        <template v-for="item in items">
            <el-submenu v-if="item.children && item.children.length >= 1 && !collapse" :index="item.id.toString()" :key="item.id">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.name }}</span>
              </template>
              <sub-menu v-for="menu in item.children" :key="menu.id" :menu="menu" />
            </el-submenu>
            <el-submenu v-else-if="item.children && item.children.length >= 1 && collapse" :index="item.id.toString()" :key="item.id">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu class="sidebar-menu-collapse" :default-active="onRoutes" :collapse="false" unique-opened>
                <el-submenu v-if="item.children && item.children.length >= 1 && collapse" :index="item.id.toString()" :key="item.id">
                  <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{ item.name }}</span>
                  </template>
                  <sub-menu v-for="menu in item.children" :key="menu.id" :menu="menu" />
                </el-submenu>
              </el-menu>
            </el-submenu>
            <el-menu-item v-else :key="item.id" :index="item.url">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="sidebar-no-collapse-button">
      <i v-if="collapse" class="el-icon-s-unfold" @click='collapseChage'></i>
      <i v-else class="el-icon-s-fold" @click='collapseChage'></i>
    </div>
  </div>
</template>

<script>
  import bus from '../common/bus';
  import SubMenu from './sidebar-sub-menu';
  import {getMethod} from '../../api/index.js';

  export default {
    inject: ['reload'],
    data() {
      return {
        collapse: false,
        items: []
      };
    },
    components: {
      SubMenu
    },
    computed: {
      onRoutes() {
        setTimeout(() => {
          return this.$route.path.replace('/', '');
        });
      }
    },
    created() {
      this.PERList();
    },
    methods: {
      PERList() {
        //---------------------------------菜单开始-----------------------------------------
        this.items = [
          {
            name:'首页',
            id:1,
            url:'/homepage'
          },
          {
            name:'用户管理',
            id:2,
            children: [
              {
                name:'用户列表',
                id:2.1,
                url:'/userManage'
              },
            ]
          },
          {
            name:'藏品管理',
            id:3,
            children: [
              {
                name:'藏品列表',
                id:3.1,
                url:'/homepage'
              },
            ]
          },
          {
            name:'系统管理',
            id:4,
            children: [
              {
                name:'参数管理',
                id:4.1,
                url:'/paramManage'
              },
            ]
          },
        ]
        //---------------------------------菜单结束-----------------------------------------
      },
      // 侧边栏折叠
      collapseChage() {
        this.collapse = !this.collapse;
        bus.$emit('collapse', this.collapse);
      },
    }
  };
</script>

<style lang="scss" scoped>
  // 未折叠样式
  .sidebar{
    min-width: 200px;
    background-color: var(--global-background-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
  }
  .sidebar-menu{
    overflow: scroll;
    flex:1;
  }
  .sidebar-menu::-webkit-scrollbar{
    width: 0;
  }

  // ElementUI左侧导航栏相关样式
  .sidebar-menu /deep/ .el-menu{
    background-color: var(--global-background-color);
    width: 100%;
  }
  .sidebar-menu /deep/ .el-submenu__title{
    color: var(--global-font-color);
    >i {
      color: var(--global-font-color);
    }
  }
  .sidebar-menu /deep/ .el-submenu__title:hover{
    background-color: rgb(0,21,40);
  }
  .sidebar-menu /deep/ .el-menu-item{
    background-color: var(--global-background-color);
    color:var(--global-font-color);
    >i {
      color: var(--global-font-color);
    }
	.fa{
	  margin:0px 10px 0px 5px;
		color: var(--global-font-color);
	}
  }
  .sidebar-menu /deep/ .el-menu-item.is-active{
    background-color: rgb(24,144,255);
  }
  .sidebar-menu /deep/ .el-menu-item:hover{
    background-color: rgb(0,21,40);
  }
  .sidebar-no-collapse-button{
    font-size: 20px;
    color: var(--global-font-color);
    border-top: 1px solid var(--global-font-color);
    padding: 5px 10px 5px 21px;

    >i {
      cursor: pointer;
    }
  }



  //折叠时样式
  .sidebar-collapse {
    min-width:65px;
  }
  .sidebar-menu-collapse{
    background-color: var(--global-background-color);
  }
  .sidebar-menu-collapse /deep/ .el-menu{
    background-color: var(--global-background-color);
    width: 100%;
  }
  .sidebar-menu-collapse /deep/ .el-submenu__title{
    color: var(--global-font-color);
    >i {
      color: var(--global-font-color);
    }
  }
  .sidebar-menu-collapse /deep/ .el-submenu__title:hover{
    background-color: rgb(0,21,40);
  }
  .sidebar-menu-collapse /deep/ .el-menu-item{
    background-color: var(--global-background-color);
    color:var(--global-font-color);
    >i {
      color: var(--global-font-color);
    }
	.fa{
	  margin: 0px 10px 0px 5px;
	  color: var(--global-font-color);
	}
  }
  .sidebar-menu-collapse /deep/ .el-menu-item.is-active{
    background-color: rgb(24,144,255);
  }
  .sidebar-menu-collapse /deep/ .el-menu-item:hover{
    background-color: rgb(0,21,40);
  }
</style>
