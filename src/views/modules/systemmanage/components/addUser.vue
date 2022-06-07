<template>
	<div>
		<div class="addUser-form-first">
			<el-form ref="forms" :model="form" :rules="rules" label-width="150px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户工号:" prop="username" :maxlength="10" :minlength="0">
							<el-input v-model="form.username" clearable placeholder="请输入用户工号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="用户名称:" prop="realName">
							<el-input v-model="form.realName" clearable placeholder="请输入用户名称"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
        <el-row>
        	<el-col :span="12">
            <el-form-item label="所属公司:" prop="companyId">
            	<el-cascader
            	v-model="form.companyId"
            	:options="companyList"
            	:show-all-levels="true"
            	:props="prop"
            	clearable
            	placeholder="请选择所属公司"
            	@change="handleCompanyChange">
            	</el-cascader>
            </el-form-item>
        	</el-col>
        	<el-col :span="12">
        	  <el-form-item label="所属部门:" prop="deptId">
        	  	<el-cascader
        	  	v-model="form.deptId"
        	  	:options="deptList"
        	  	:show-all-levels="true"
        	  	:props="prop"
        	  	clearable
        	  	placeholder="请选择所属部门">
        	  	</el-cascader>
        	  </el-form-item>
        	</el-col>
        </el-row>
				<el-row>
					<el-col :span="12">
            <el-form-item label="岗位:" prop="postId">
              <el-select v-model="form.postId" placeholder="请选择岗位" clearable>
                <el-option
                v-for="item in postList"
                :key = "item.postId"
                :value="item.postId"
                :label="item.postName">
                </el-option>
              </el-select>
            </el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="电话:" prop="mobile">
							<el-input v-model="form.mobile" clearable placeholder="请输入电话号码"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="邮箱:" prop="email">
							<el-input v-model="form.email" clearable placeholder="请输入邮箱"></el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12">
						<el-form-item label="密码:" prop="password">
							<el-input v-model.trim="form.password" clearable placeholder="请输入密码" type="password"></el-input>
						</el-form-item>
					</el-col> -->
          <el-col :span="12">
          	<el-form-item label="角色:">
          		<el-select
          		v-model="form.roleIdList"
          		placeholder="请选择角色"
          		multiple
          		clearable>
          			<el-option
          			v-for="item in roleList"
          			:key = "item.id"
          			:value="item.id"
          			:label="item.name">
          			</el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="性别:">
							<el-radio-group v-model="form.gender">
							  <el-radio
							  v-for="(item,index) in genderDict"
							  :key="index"
							  :label="item.value">{{item.label}}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12">
						<el-form-item label="是否为超管:">
							<el-radio-group v-model="form.superAdmin">
							  <el-radio
							  v-for="(item,index) in superAdminDict"
							  :key="index"
							  :label="item.value">{{item.label}}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col> -->
				</el-row>
			</el-form>
		</div>
		<div class='addUser-footer'>
			<el-button type="primary" style="margin-right: 11px;" class="click-button" @click="add">确 定</el-button>
			<el-button @click="cancel" class="click-button">取 消</el-button>
		</div>
	</div>
</template>
<script>
	import {isEmail,isMobile,isPhone} from "@/utils/validate.js";
	export default {
		props:{
			dataForm:{
				type:Object,
				default:()=>{
					return {
						username: '',
						realName: '',
            companyId: '',
						deptId: '',
            postId: '',
						superAdmin:0,
						gender:2,
						mobile: '',
						email: '',
						password: '',
						roleIdList:[],
						status:1
					}
				}
			}
		},
		data() {
			var emailValidator = (rule,value,callback)=>{
				if(value != ''&&!isEmail(value)){
					callback(new Error("请输入正确的邮箱账号"));
				}else{
					callback();
				}
			}
			var mobileValidator = (rule,value,callback)=>{
				if(value != ''&&!isMobile(value)&&!isPhone(value)){
					callback(new Error("请输入正确的电话号码"));
				}else{
					callback();
				}
			}
      var validateInput = (rule, value, callback) => {
        if (!this.checkSpecialKey(value)) {
          callback(new Error("不能含有特殊字符或空格！！"));
        } else {
          callback();
        }
      };
			return {
				rules: {
					username: [{
						required: true,message: '请填写用户工号',trigger: 'blur'
					},{
            min: 0, max: 10, message: '长度在 0 到 10 个字符', trigger: 'blur',
          },{
            validator: validateInput,
            trigger: 'blur'
          }],
					realName: [{
						required: true,message: '请填写用户名称',trigger: 'blur'
					},
          {
            validator: validateInput,
            trigger: 'blur'
          }],
          companyId:[{
          	required: true,message: '请选择所属公司',trigger: 'blur'
          }],
					deptId:[{
						required: true,message: '请选择所属部门',trigger: 'blur'
					}],
          postId:[{
          	required: true,message: '请选择岗位',trigger: 'blur'
          }],
					mobile:[{
						validator:mobileValidator,message: '请输入正确的电话号码',trigger: 'blur'
					}],
					email:[{
						validator:emailValidator, message: '请输入正确的邮箱账号',trigger: 'blur',
					}],
				},
        companyList:[],
				deptList:[],
				roleList:[],
        postList:[],
				form: {
					username: '',
					realName: '',
          companyId:'',
					deptId: '',
					superAdmin:0,
					gender:2,
					mobile: '',
					email: '',
					password: '',
					roleIdList:[],
					status:1
				},
        //部门级联选择器配置项
        prop:{
          value:'id',
          label:'name',
          children:'children',
          checkStrictly:true,
          emitPath:false,
        },

        //用户状态数据字典
        userCountStatusDict:[],
        //是否超级管理员字典
        // superAdminDict:[],
        //性别字典
        genderDict:[]
			}
		},
		mounted() {
			this.reset()
		},
		created() {
			this.init()
		},
		methods: {
			init(){
				this.getCompanyList()
        this.getPostInfo()
				this.getRoleInfo()
        this.getDict()
			},
      //数据字典
      getDict(){
        // this.getUserStatusDict()
        // this.getSuperAdminDict()
        this.getGenderDict()
      },
			add(){
				this.$refs.forms.validate((valid)=>{
					if(valid){
						this.$confirm('确认提交?', '提示', {
							cancelButtonClass: "btn-custom-cancel",
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$http.post('/api/sysuser/addUser',this.form).then(res=>{
								if(res.data.code != 0){
									return this.$message.error(res.data.msg)
								}else{
									this.$emit('closeDialog')
									return this.$message.success(res.data.msg)
								}
							}).catch((err)=>{})
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
				}).catch((err) => {})
			},
			//处理部门树形数据
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

			//获取公司列表数据
			getCompanyList(){
			  this.$http.get('/api/syscompany/getCompanyTreeList').then(res => {
			  	if (res.data.code != 0) {
			  		return this.$message.error(res.data.msg)
			  	}
			    let data = res.data.data
			    if(data!=undefined||data!=null){
			      data = this.getTreeData(data)
			      this.companyList = data
			    }
			  }).catch((err) => {})
			},

			//获取部门列表数据
			getDeptList(companyId){
			  this.$http.get('/api/sysdept/getDeptTreeList',
			  {
			    params:{
			      companyId:companyId
			    },
			  }).then(res => {
			  	if (res.data.code != 0) {
			  		return this.$message.error(res.data.msg)
			  	}
			    let data = res.data.data
			    if(data!=undefined||data!=null){
			      data = this.getTreeData(data)
			      this.deptList = data
			    }
			  }).catch((err) => {})
			},

			//当选择的公司发生变化时
			handleCompanyChange(companyId){
			  this.form.pid = ''
			  this.deptList = []
			  if(companyId==undefined||companyId==null||companyId == ''){
			    return;
			  }
			  this.getDeptList(companyId)
			},
			//获取角色信息
			getRoleInfo(){
				this.$http.post('/api/sysrole/getRoleInfoList',{}).then(res=>{
					if(res.data.code != 0){return this.$message.error(res.data.msg)}
					this.roleList = res.data.data
				}).catch((err)=>{})
			},
      //获取岗位信息
      getPostInfo(){
      	this.$http.get('/api/syspost/getPostInfoList').then(res=>{
      		if(res.data.code != 0){return this.$message.error(res.data.msg)}
      		this.postList = res.data.data
      	}).catch((err)=>{})
      },
			reset(){
				this.form = this.dataForm
			},
      //校验特殊字符
      checkSpecialKey(str) {
        let specialKey = "[`~% !@#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
        for (let i = 0; i < str.length; i++) {
          if (specialKey.indexOf(str.substr(i, 1)) != -1) {
            return false;
          }
        }
        return true;
      },
      //获取用户账号状态字典值
      // getUserStatusDict(){
      //   this.$dataDict.getDataDict('USER_COUNT_STATUS').then(res=>{
      //     if(res.code!=0){
      //       return this.$message.error(res.msg)
      //     }
      //     res.data.forEach(item=>{
      //       let option = {
      //         label:item.label,
      //         value:parseInt(item.vaule)
      //       }
      //       this.userCountStatusDict.push(option)
      //     })
      //   })
      // },
      //获取是否超级管理员字典值
      // getSuperAdminDict(){
      //   this.$dataDict.getDataDict('IS_SUPER_ADMIN').then(res=>{
      //     if(res.code!=0){
      //       return this.$message.error(res.msg)
      //     }
      //     res.data.forEach(item=>{
      //       let option = {
      //         label:item.label,
      //         value:parseInt(item.vaule)
      //       }
      //       this.superAdminDict.push(option)
      //     })
      //   })
      // },
      //获取性别字典值
      getGenderDict(){
        this.$dataDict.getDataDict('GENDER').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:parseInt(item.vaule)
            }
            this.genderDict.push(option)
          })
        })
      },
		}
	}
</script>

<style>

	.click-button {
		width: 100px;
		height: 40px;
		border-radius: 6px;
		font-size: 16px;
	}

	/*下边按钮区域*/
	.addUser-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: flex-end;
		padding: 20px 20px 20px 20px;
	}

	.addUser-form-first {
		display: flex;
		justify-content: flex-start;
		padding-top: 20px;
	}

	.el-button--mini.is-round {
		padding: 5px 10px;
		margin-left: 20px;
		margin-bottom: 5px;
	}
</style>
