import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store'
import http from '@/utils/request';
import dataDict from '@/api/datadict.js'
import VueCookies from 'vue-cookies';
import VueParticles from 'vue-particles'
import clipboard from 'clipboard';
import Cookies from 'js-cookie';
import OnlyMessage from './utils/onlyMsgbox';
import {hasPermission} from '@/utils'
import * as echarts from 'echarts'
import formCreate from '@form-create/element-ui'
import FcDesigner from './components/form-create/designer'
import Editor from 'vue2-ace-editor'
import ELEMENT from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import 'babel-polyfill';
import './assets/css/main.scss';
import moment from 'moment';
import eIconPicker from 'e-icon-picker';//element图标选择器
import "e-icon-picker/lib/symbol.js"; //基本彩色图标库
import 'e-icon-picker/lib/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css'; //font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库
import Vue2OrgTree from 'vue2-org-tree';//树形结构组件


var proEnv = require('../config/pro.env');  // 生产环境
var uatEnv = require('../config/test.env');  // 测试环境
var devEnv = require('../config/dev.env');  // 本地环境

Vue.use(Vue2OrgTree)
Vue.use(VueParticles)
Vue.use(VueCookies);
Vue.use(formCreate)
Vue.use(FcDesigner)
//全局删除增加图标
Vue.use(eIconPicker, {FontAwesome: true, ElementUI: true, eIcon: true, eIconSymbol: true});
Vue.use(ELEMENT);

Vue.component('editor', Editor)
Vue.config.productionTip = false;


// // 注册到vue原型上、挂载全局
Vue.prototype.$moment = moment;//赋值使用
Vue.prototype.$http = http;
Vue.prototype.$dataDict = dataDict
Vue.prototype.$hasPermission = hasPermission
Vue.prototype.$message = OnlyMessage;
Vue.prototype.$echarts = echarts
Vue.prototype.clipboard = clipboard;
Vue.prototype.$store = store;
Vue.prototype.$host = process.env.NODE_ENV === 'development' ? devEnv.hosturl : process.env.NODE_ENV === 'test' ? uatEnv.hosturl : proEnv.hosturl; // 根据 process.env.NODE_ENV 的值判断当前是什么环境

new Vue({
  router,
  clipboard,
  store,
  render: h => h(App)
}).$mount('#app');
