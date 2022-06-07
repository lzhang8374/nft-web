<template>
	<div class="manage-container">
    <div>
      <el-form :inline="true">
        <el-form-item label="用户姓名:">
          <el-input v-model="dataForm.realName" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属公司:">
          <el-cascader
          v-model="dataForm.companyId"
          :options="companyList"
          :show-all-levels="true"
          :props="prop"
          clearable
          placeholder="请选择所属公司"
          @change="handleCompanyChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="所属部门:">
          <el-cascader
          v-model="dataForm.deptId"
          :options="deptList"
          :show-all-levels="true"
          :props="prop"
          clearable
          placeholder="请选择所属部门">
          </el-cascader>
        </el-form-item>
        <el-form-item label="用户状态:" label-width="72px">
          <el-select placeholder="请选择用户状态" :clearable="true" v-model="dataForm.status">
            <el-option :value="''" label="全部"></el-option>
            <el-option
            v-for="(item,index) in userCountStatusDict"
            :key="index"
            :value="item.value"
            :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="search()">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manage-add-or-update-button">
      <el-button icon="el-icon-plus" type="primary" @click="openDialog('add')" v-if="$hasPermission('usermanage:save')">新增</el-button>
    </div>
    <div>
      <el-table :data="dataList">
        <el-table-column label="用户工号" align="center" prop="username">
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="realName">
        </el-table-column>
        <el-table-column label="性别" align="center" prop="gender" :formatter="sexFormate">
        </el-table-column>
        <el-table-column label="公司" align="center" prop="companyName">
        </el-table-column>
        <el-table-column label="部门" align="center" prop="deptName">
        </el-table-column>
        <el-table-column label="岗位" align="center" prop="postName">
        </el-table-column>
        <!-- <el-table-column label="电话" align="center" prop="mobile">
        </el-table-column> -->
        <!-- <el-table-column label="邮箱" align="center" prop="email">
        </el-table-column> -->
        <!-- <el-table-column label="超管" align="center" prop="superAdmin" :formatter="superAdminFormate">
        </el-table-column> -->
        <!-- <el-table-column label="创建时间" align="center" prop="createDate">
        </el-table-column> -->
        <!-- <el-table-column label="更新时间" align="center" prop="updateDate">
        </el-table-column> -->
        <el-table-column label="用户状态" align="center" prop="status" :formatter="statusFormate">
        </el-table-column>
        <el-table-column label="操作" align="center" prop="">
          <template slot-scope="scope">
            <el-button type="text" @click="openDialog('check',scope.row)">查看</el-button>
            <el-button type="text" @click="openDialog('edit',scope.row)" v-if="$hasPermission('usermanage:edit')">编辑</el-button>
            <el-button type="text" @click="resetUserPassword(scope.row)">重置密码</el-button>
            <el-button type="text" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <v-pagination @currentChange="pageCurrentChangeHandle" @handleSizeChange="handleSizeChange" :current-page="page" :page-size="limit" :total="total"></v-pagination>
    </div>
		<el-dialog
		width="830px"
		:title="dialogTitle"
		:visible="dialogVisible"
		@close="closeDialog"
		destroy-on-close>
			<add-user v-if="dialogTitle == '新增用户'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></add-user>
			<edit-user v-else-if="dialogTitle == '编辑用户'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></edit-user>
			<check-user v-else-if="dialogTitle == '查看用户'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></check-user>
		</el-dialog>
	</div>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module';
	import vPagination from '@/components/page/Pagination.vue';
	import addUser from '@/views/modules/systemmanage/components/addUser.vue';
	import editUser from '@/views/modules/systemmanage/components/editUser.vue';
	import checkUser from '@/views/modules/systemmanage/components/checkUser.vue';
	export default {
		components: {
			vPagination,
			addUser,
			editUser,
			checkUser
		},
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/api/sysuser/getUserInfoPage',
					activatedIsNeed: false,
					getDataListIsPage: true,
				},
				dataForm: {
					realName:'',
          companyId:'',
					deptId:'',
					status:'',
				},

				addOrUpdateForm:{
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
					status: 1
				},

				deptList:[],
        companyList:[],

        //部门级联选择器配置项
        prop:{
          value:'id',
          label:'name',
          children:'children',
          checkStrictly:true,
          emitPath:false,
        },

				dialogVisible:false,
				dialogTitle:'',

        //用户状态数据字典
        userCountStatusDict:[],
        //是否超级管理员字典
        superAdminDict:[],
        //性别字典
        genderDict:[]
			};
		},
		created() {
			this.init()
		},
		methods: {
			//初始化
			init(){
				this.getData()
				this.getCompanyList()
        this.getDict()
			},
      //数据字典
      getDict(){
        this.getUserStatusDict()
        // this.getSuperAdminDict()
        this.getGenderDict()
      },
			//数据格式化
			statusFormate(row){
        for(let i=0;i<this.userCountStatusDict.length;i++){
          if(row.status === this.userCountStatusDict[i].value){
          	return this.userCountStatusDict[i].label
          }
        }
			},
			// superAdminFormate(row){
			// 	for(let i=0;i<this.superAdminDict.length;i++){
			// 	  if(row.superAdmin === this.superAdminDict[i].value){
			// 	  	return this.superAdminDict[i].label
			// 	  }
			// 	}
			// },
			sexFormate(row){
				for(let i=0;i<this.genderDict.length;i++){
				  if(row.gender === this.genderDict[i].value){
				  	return this.genderDict[i].label
				  }
				}
			},
			//获取用户列表
			getData(){
				this.getDataList()
			},
			//重置查询条件
			reset(){
				this.dataForm.realName = ''
        this.dataForm.companyId = ''
				this.dataForm.deptId = ''
				this.dataForm.status = ''
        this.deptList = []
				this.getData();
			},
			//重置对话框
			resetAddOrUpdateForm(){
        this.page = 1
				this.addOrUpdateForm = {
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
					status: 1
				}
			},
			//查询
			search(){
        this.page= 1
				this.getData();
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
			  this.dataForm.deptId = ''
			  this.deptList = []
			  if(companyId==undefined||companyId==null||companyId == ''){
			    return;
			  }
			  this.getDeptList(companyId)
			},
			//打开新增/修改对话框
			openDialog(type,row){
				if(type == 'add'){
					this.dialogTitle = '新增用户'
					this.resetAddOrUpdateForm()
					this.dialogVisible = true
				}else if(type == 'edit'){
					this.dialogTitle = '编辑用户'
					this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
					this.dialogVisible = true
				}else if(type == 'check'){
					this.dialogTitle = '查看用户'
					this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
					this.dialogVisible = true
				}
			},
			//关闭对话框
			closeDialog(){
				this.dialogVisible = false
				this.dialogTitle = ''
				this.getData()
			},
			//删除用户
			deleteUser(row){
				this.$confirm('确认删除用户'+row.username+'?', '提示', {
					cancelButtonClass: "btn-custom-cancel",
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$http.get('/api/sysuser/deleteUser/'+row.id).then(res=>{
						if(res.data.code != 0){return this.$message.error(res.data.msg)}
						else{
							this.getData()
							this.$message.success("删除成功!")
						}
					}).catch((err)=>{})
				}).catch((err) => {})
			},
      //重置用户密码
      resetUserPassword(row){
      	this.$confirm('确认重置用户'+row.username+'的密码?', '提示', {
      		cancelButtonClass: "btn-custom-cancel",
      		confirmButtonText: '确定',
      		cancelButtonText: '取消',
      		type: 'warning'
      	}).then(async () => {
      		this.$http.get('/api/sysuser/resetUserPassword/'+row.id).then(res=>{
      			if(res.data.code != 0){return this.$message.error(res.data.msg)}
      			else{
      				this.getData()
      				this.$message.success("重置密码成功!")
      			}
      		}).catch((err)=>{})
      	}).catch((err) => {})
      },
      handleSizeChange(e){
        this.limit = e
        this.getDataList()
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
	};
</script>
