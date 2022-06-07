import Vue from 'vue';
import Router from 'vue-router';
import http from '@/utils/request';

var URL = require('../../config/url');

Vue.use(Router);


//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
// push
Router.prototype.push = function push(location, onResolve, onReject) {
	return originalPush.call(this, location).catch(err => {
		return;
	});
};
// replace
Router.prototype.replace = function replace(location, onResolve, onReject) {
	return originalReplace.call(this, location).catch(err => err);
};


/*
path:页面URL路径地址,
component:页面组件,
name:页面名称,
meta:自定义属性集合,
  {
    menuId:菜单唯一索引,
    title:菜单名称数组，由其祖先节点的名称和自身的名称组成
    keepAlive:页面是否保活,若为true,则第二次进入该页面时,将不会执行created,mounted钩子
    isHidden:页面是否显示在左侧菜单栏中
    permissions:页面权限
  }
route = {
  path: "/"+menuList[i].url,
  component: (resolve) => require(['@/components/page/404'], resolve),
  name: menuList[i].url,
  meta: {
    menuId: menuList[i].id,
    title: menuTitle,
    keepAlive: menuList[i].isHidden==0?true:false,
    isHidden:menuList[i].isHidden==0?true:false,
    permissions:menuList[i].permissions?menuList[i].permissions.split(","):[]
  }
};
*/

// 页面路由(独立页面)
export const pageRoutes = [
	{
		path: '/404',
		component: (resolve) => require(['@/components/page/404'], resolve),
		name: '404',
		meta: {
			title: '404未找到'
		},
		beforeEnter(to, from, next) {
			// 拦截处理特殊业务场景
			// 如果, 重定向路由包含__双下划线, 为临时添加路由
			if (/__.*/.test(to.redirectedFrom)) {
				return next(to.redirectedFrom.replace(/__.*/, ''));
			}
			next();
		}
	},
	{
		path: '/login',
		component: (resolve) => require(['./../components/page/Login.vue'], resolve),
		name: 'login',
		meta: {
			title: '登录'
		}
	},
	{
		path: '/',
		component: (resolve) => require(['../components/common/Home.vue'], resolve),
		name: 'main',
		redirect: {
			name: 'homepage'
		  },
		children:[
			{
				path: '/homepage',
				component: (resolve) => require(['@/views/modules/homepage/homepage.vue'], resolve),
				name: 'homepage',
				meta: {
					title: ['首页']
				  }
			},
			//------------------------------------------菜单路由开始--------------------------------------------------
			{
				path: '/userManage',
				component: (resolve) => require(['./../views/modules/systemmanage/userManage.vue'], resolve),
				name: 'userManage',
				meta: {
					title: ['用户管理']
				}
			},
			{
				path: '/paramManage',
				component: (resolve) => require(['./../views/modules/systemmanage/paramManage.vue'], resolve),
				name: 'paramManage',
				meta: {
					title: ['参数管理']
				}
			},
			//------------------------------------------菜单路由结束--------------------------------------------------
		],
		meta: {
			title: '主入口布局'
		}
	},
];

const createRouter = () => new Router({
	mode: 'history',
	scrollBehavior: () => ({
		y: 0
	}),
	base: URL.baseUrl,
	routes: pageRoutes
});
const router = createRouter();

/**
 * 判断当前路由是否为页面路由
 * @param {*} route 当前路由
 * @param {*} pageRoutes 页面路由
 */
export function fnCurrentRouteIsPageRoute(route, pageRoutes = []) {
	var temp = [];
	for (var i = 0; i < pageRoutes.length; i++) {
		if (route.path === pageRoutes[i].path) {
			return true;
		}
		if (pageRoutes[i].children && pageRoutes[i].children.length >= 1) {
			temp = temp.concat(pageRoutes[i].children);
		}
	}
	return temp.length >= 1 ? fnCurrentRouteIsPageRoute(route, temp) : false;
}

/**
 * require方式获取页面组件
 * @param {*} view 页面组件路径
 */
export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 * @param {*} ancestorNodes 祖先路由节点数组
 */
export function fnAddDynamicMenuRoutes(menuList = [], routes = [], ancestorNodes = []) {
	for (var i = 0; i < menuList.length; i++) {
		if (menuList[i].children && menuList[i].children.length >= 1) {
      //如果当前节点有孩子节点，则将当前节点加入到祖先节点数组中
      ancestorNodes.push(menuList[i])
      //深度优先搜递归
      fnAddDynamicMenuRoutes(menuList[i].children,routes,ancestorNodes)
      continue;
		}

    //构建标题数组
    let menuTitle = []
    for(let i=0; i<ancestorNodes.length; i++){
      menuTitle.push(ancestorNodes[i].name)
    }
    menuTitle.push(menuList[i].name)

		// 组装路由
		var route = {
			path: "/"+menuList[i].url,
			component: loadView(menuList[i].direction),
			name: menuList[i].url,
			meta: {
				menuId: menuList[i].id,
				title: menuTitle,
				keepAlive: menuList[i].keepAlive==0?true:false,
        isHidden:menuList[i].isHidden==0?true:false,
        permissions:menuList[i].permissions?menuList[i].permissions.split(","):[]
			}
		};
		routes.push(route);
	}

  //从祖先数组中弹出当前节点的父节点
  ancestorNodes.pop();
  return routes
}

export default router;