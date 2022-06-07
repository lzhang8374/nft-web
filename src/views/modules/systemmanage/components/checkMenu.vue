<template>
  <div>
    <div class="checkMenu-form-first">
      <!-- 菜单 -->
      <el-form v-show="form.type == 0" ref='menuForms' label-width='90px'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称:">
            	<el-input disabled v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级菜单:">
                <el-cascader
                placeholder=""
                v-model="form.pid"
                :options="menuList"
                :show-all-levels="true"
                :props="menuProp"
                clearable
                disabled>
                </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路由:">
            	<el-input disabled v-model="form.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组件路径:">
            	<el-input disabled v-model="form.direction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单图标:">
                <e-icon-picker v-model="form.icon" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单排序:">
            	<el-input disabled v-model="form.sort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否隐藏:">
              <el-input disabled v-for="item in isHiddenDict" :key="item.index" v-model="item.label" v-if="item.value == form.isHidden"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否缓存:">
            	<el-input disabled v-for="item in keepAliveDict" :key="item.index" v-model="item.label" v-if="item.value == form.keepAlive"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="授权码:">
            	<el-input disabled v-model="form.permissions"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 功能菜单 -->
      <el-form v-show="form.type == 1" ref='functionForms' label-width='90px'>
        <el-form-item label="按钮名称:">
        	<el-input disabled v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单:">
            <el-cascader
            placeholder=""
            v-model="form.pid"
            :options="menuList"
            :show-all-levels="true"
            :props="functionProp"
            clearable
            disabled>
            </el-cascader>
        </el-form-item>
        <el-form-item label="按钮排序:">
        	<el-input disabled v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item label="授权码:">
        	<el-input disabled v-model="form.permissions"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
    	dataForm: {
    		type: Object,
    		default: () => {
    			return {
    				name: '',
    				pid: '',
    				url:'',
    				permissions:'',
    				type:0,
    				icon:'',
    				sort:'',
            direction:'',
            isHidden:0,
            keepAlive:0,
            breadCrumb:0
    			}
    		}
    	}
    },
    data(){
      return{
        //菜单信息校验规则
        menuRules: {
        	name: [{
        		required: true,
        		message: '请填写菜单名称',
        		trigger: 'blur'
        	}],
          pid: [{
          	required: true,
          	message: '请填写上级菜单名称',
          	trigger: 'blur'
          }],
          sort: [{
          	required: true,
          	message: '请填写菜单的序号',
          	trigger: 'blur'
          }],
        },
        //功能菜单信息校验规则
        functionRules: {
          name: [{
        		required: true,
        		message: '请填写按钮名称',
        		trigger: 'blur'
        	}],
          pid: [{
          	required: true,
          	message: '请填写上级菜单名称',
          	trigger: 'blur'
          }],
          sort: [{
          	required: true,
          	message: '请填写按钮的序号',
          	trigger: 'blur'
          }],
        },
        //菜单级联选择器配置项
        menuProp:{
          value:'id',
          label:'name',
          children:'children',
          checkStrictly:true,
          emitPath:false,
        },
        //功能菜单级联选择器配置项
        functionProp:{
          value:'id',
          label:'name',
          children:'children',
          checkStrictly:false,
          emitPath:false
        },
        //表单
        form: {
        	name: '',
        	pid: '',
        	url:'',
        	permissions:'',
        	type:0,
        	icon:'',
        	sort:'',
          direction:'',
          isHidden:0,
          keepAlive:0,
          breadCrumb:0
        },
        //已有菜单列表
        menuList:[],
        //0层菜单
        emptyMenu:{
          id:'0',
          name:'无'
        },
        isHiddenDict:[],
        keepAliveDict:[],
      }
    },
    mounted() {
      this.reset()
    },
    created() {
      this.init()
    },
    methods:{
      init(){
        this.getMenuList()
      },
      getDict(){
        this.getIsHiddenDict()
        this.getKeepAliveDict()
      },
      reset(){
      	this.form = this.dataForm
        this.getDict()
        let data = this.menuList[0]
        if(this.form == '0'){
          if(data.id != '0'){
            this.menuList.unshift(this.emptyMenu);
          }
        }else if(this.form == '1'){
          if(data.id == '0'){
            this.menuList.shift()
          }
        }
      },

      //处理菜单树形数据
      getTreeData(data) {
        for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].children);
          }
        }
        return data;
      },

      //获取菜单数据
      getMenuList(){
        this.$http.get('/api/sysmenu/getMenuList').then(res => {
        	if (res.data.code != 0) {
        		return this.$message.error(res.data.msg)
        	}
          let data = res.data.data
          if(data!=undefined||data!=null){
            data = this.getTreeData(data)
            data.unshift(this.emptyMenu)
            this.menuList = data
          }
        }).catch((err) => {})
      },
      //获取菜单显隐字典值
      getIsHiddenDict(){
        this.$dataDict.getDataDict('MENU_IS_HIDDEN').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:parseInt(item.vaule)
            }
            this.isHiddenDict.push(option)
          })
        })
      },
      //获取路由页面是否缓存字典值
      getKeepAliveDict(){
        this.$dataDict.getDataDict('MENU_KEEP_ALIVE').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:parseInt(item.vaule)
            }
            this.keepAliveDict.push(option)
          })
        })
      },
    }
  }
</script>

<style>
  .checkMenu-form-first{
    padding-top: 20px;
    display: flex;
    /* justify-content: center; */
    flex-direction: column;
    align-items: center;
  }
  /*下边按钮区域*/
  .checkMenu-footer {
  	border-top: 1px solid #cfd8dc;
  	text-align: center;
  	display: flex;
  	justify-content: flex-end;
  	padding: 20px 30px 20px 20px;
  }
  .click-button {
  	width: 100px;
  	height: 40px;
  	border-radius: 6px;
  	font-size: 16px;
  }
  .el-button--mini.is-round {
  	padding: 5px 10px;
  	margin-left: 20px;
  	margin-bottom: 5px;
  }
</style>
