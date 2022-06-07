<template>
  <div>
    <div class="editMenu-form-first">
      <!-- 菜单 -->
      <el-form v-show="form.type == 0" ref='menuForms' :model='form' :rules='menuRules' label-width='90px'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称:" prop="name">
            	<el-input placeholder="请输入菜单名称" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级菜单:" prop="pid">
                <el-cascader
                v-model="form.pid"
                :options="menuList"
                :show-all-levels="true"
                :props="menuProp"
                clearable
                disabled
                placeholder="请选择上级菜单">
                </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路由:">
            	<el-input placeholder="请输入菜单路由" v-model="form.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="页面路径:">
            	<el-input placeholder="请输入组件路径" v-model="form.direction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单图标:" prop="icon">
                <e-icon-picker v-model="form.icon"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单排序:" prop="sort">
            	<el-input placeholder="请填写菜单的排序" v-model="form.sort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否隐藏:" prop="isHidden">
              <el-radio-group v-model="form.isHidden" placeholder="请选择页面是否隐藏">
                <el-radio v-for="(item,index) in isHiddenDict" :key="item.index" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否缓存:" prop="keepAlive">
              <el-radio-group v-model="form.keepAlive" placeholder="请选择页面是否缓存">
                <el-radio v-for="(item,index) in keepAliveDict" :key="item.index" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="授权码:" prop="permission">
              <el-input placeholder="请填写授权码(若有多个,用逗号隔开)" v-model="form.permissions"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 功能菜单 -->
      <el-form v-show="form.type == 1" ref='functionForms' :model='form' :rules='functionRules' label-width='90px'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="按钮名称:" prop="name">
            	<el-input placeholder="请输入按钮名称" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级菜单:" prop="pid">
                <el-cascader
                v-model="form.pid"
                :options="menuList"
                :show-all-levels="true"
                :props="functionProp"
                clearable
                placeholder="请选择上级菜单">
                </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="按钮排序:" prop="sort">
            	<el-input placeholder="请填写按钮的排序" v-model="form.sort"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权码:" prop="permission">
            	<el-input placeholder="请填写授权码(若有多个,用逗号隔开)" v-model="form.permissions"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class='editMenu-footer'>
    	<el-button type="primary" style="margin-right: 11px;" class="click-button" @click="edit">确 定</el-button>
    	<el-button @click="cancel" class="click-button">取 消</el-button>
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
      var zeroValidator = (rule,value,callback)=>{
        //正整数正则表达式
        var r = /^[0-9]*[1-9][0-9]*$/;
      	if(!r.test(value)){
      		callback(new Error("无效字符，请输入正整数"));
      	}else if(value<=0){
      		callback(new Error("无效字符，请输入正整数"));
      	}else{
      	  callback();
      	}
      }
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
          },{
						validator:zeroValidator,
            message: '无效字符，请输入正整数',
            trigger: 'input'
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
          },{
						validator:zeroValidator,
            message: '无效字符，请输入正整数',
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
      edit() {
      	this.$refs[this.form.type==0?'menuForms':'functionForms'].validate((valid) => {
      		if (valid) {
      			this.$confirm('确认提交?', '提示', {
      				cancelButtonClass: "btn-custom-cancel",
      				confirmButtonText: '确定',
      				cancelButtonText: '取消',
      				type: 'warning'
      			}).then(() => {
      				this.$http.post('/api/sysmenu/editMenu', this.form).then(res => {
      					if (res.data.code != 0) {
      						return this.$message.error(res.data.msg)
      					} else {
      						this.$emit('closeDialog')
      						this.$message.success(res.data.msg)
                  setTimeout(()=> {
                    location.reload()
                  }, 500);
      					}
      				}).catch((err) => {})
      			}).catch((err) => {})
      		}
      	})
      },
      cancel() {
      	this.$confirm('当前数据未保存，确认要关闭当前弹窗吗?', '提示', {
      		cancelButtonClass: "btn-custom-cancel",
      		confirmButtonText: '确定',
      		cancelButtonText: '取消',
      		type: 'warning'
      	}).then(async () => {
      		this.$emit('closeDialog')
      		this.$message.info("已取消操作");
      	}).catch((err) => {
      		console.log(err)
      	})
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
  .editMenu-form-first{
    padding-top: 20px;
    display: flex;
    /* justify-content: center; */
    flex-direction: column;
    align-items: center;
  }
  /*下边按钮区域*/
  .editMenu-footer {
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
