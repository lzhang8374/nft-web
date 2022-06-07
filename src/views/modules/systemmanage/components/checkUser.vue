<template>
	<div>
		<div class="checkUser-form-first">
			<el-form ref="form" label-width="150px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户工号:">
							<el-input v-model="form.username" clearable disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="用户名称:">
							<el-input v-model="form.realName" clearable disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
				    <el-form-item label="所属公司:">
				    	<el-cascader
              placeholder=""
				    	v-model="form.companyId"
				    	:options="companyList"
				    	:show-all-levels="true"
				    	:props="prop"
				    	clearable
              disabled>
				    	</el-cascader>
				    </el-form-item>
					</el-col>
					<el-col :span="12">
					  <el-form-item label="所属部门:">
					  	<el-cascader
              placeholder=""
					  	v-model="form.deptId"
					  	:options="deptList"
					  	:show-all-levels="true"
					  	:props="prop"
					  	clearable
              disabled>
					  	</el-cascader>
					  </el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
				    <el-form-item label="岗位:">
				      <el-select v-model="form.postId" disabled placeholder="">
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
						<el-form-item label="电话:">
							<el-input v-model="form.mobile" clearable disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="邮箱:">
							<el-input v-model="form.email" clearable disabled></el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12">
						<el-form-item label="密码:">
							<el-input v-model="form.password" clearable type="password" disabled></el-input>
						</el-form-item>
					</el-col> -->
          <el-col :span="12">
          	<el-form-item label="角色:">
          		<el-select
          		v-model="form.roleIdList"
          		placeholder=""
          		multiple
          		clearable
          		disabled>
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
          	<el-form-item label="用户状态:">
          		<el-select v-model="form.status" placeholder="" clearable disabled>
          			<el-option
          			v-for="(item,index) in userCountStatusDict"
          			:key="index"
          			:value="item.value"
          			:label="item.label">
          			</el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
					<el-col :span="12">
						<el-form-item label="性别:">
							<span v-for="(item,index) in genderDict" v-if="form.gender==item.value">{{item.label}}</span>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12">
						<el-form-item label="是否为超管:">
							<span v-for="(item,index) in superAdminDict" v-if="form.superAdmin==item.value">{{item.label}}</span>
						</el-form-item>
					</el-col> -->
				</el-row>
			</el-form>
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
		dataForm:{
			handler:function(val,oldVal){
				this.form = JSON.parse(JSON.stringify(val))
			},
			deep:true,
		},
		data() {
			return {
				companyList:[],
				deptList:[],
				roleList:[],
				postList:[],
				form: {
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
        superAdminDict:[],
        //性别字典
        genderDict:[]
			}
		},
		mounted() {
			this.reset()
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
        this.getUserStatusDict()
        this.getSuperAdminDict()
        this.getGenderDict()
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
				this.init()
				if(this.form.companyId!=undefined&&this.form.companyId!=null&&this.form.companyId!=''){
				  this.getDeptList(this.form.companyId)
				}
			},
      //获取用户账号状态字典值
      getUserStatusDict(){
        this.$dataDict.getDataDict('USER_COUNT_STATUS').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:parseInt(item.vaule)
            }
            this.userCountStatusDict.push(option)
          })
        })
      },
      //获取是否超级管理员字典值
      getSuperAdminDict(){
        this.$dataDict.getDataDict('IS_SUPER_ADMIN').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:parseInt(item.vaule)
            }
            this.superAdminDict.push(option)
          })
        })
      },
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

<style lang='css' scoped>
	.click-button {
		width: 100px;
		height: 40px;
		border-radius: 6px;
		font-size: 16px;
	}

	/*下边按钮区域*/
	.equipmentAdd-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: flex-end;
		padding: 20px 30px 20px 20px;
	}

	.checkUser-form-first {
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
