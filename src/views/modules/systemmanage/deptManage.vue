<template>
	<div class="manage-container">
    <div>
      <el-form :inline="true">
        <el-form-item label="公司名称:">
          <el-input placeholder="请输入公司名称" v-model="dataForm.companyName"></el-input>
        </el-form-item>
        <el-form-item label="部门名称:">
          <el-input placeholder="请输入部门名称" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manage-add-or-update-button">
      <el-button icon="el-icon-plus" type="primary" @click="openDialog('add')">新增</el-button>
    </div>
    <div>
      <el-table :data="dataList" row-key="id" :tree-props="treeProp" :indent="50">
        <el-table-column label="部门名称" prop="name">
        </el-table-column>
        <el-table-column label="所属公司" align="center" prop="companyName">
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="creator">
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="openDialog('check',scope.row)">查看</el-button>
            <el-button type="text" @click="openDialog('edit',scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
		<el-dialog
		width="430px"
		:title="dialogTitle"
		:visible="dialogVisible"
		@close="closeDialog"
		destroy-on-close>
			<add-dep v-if="dialogTitle == '新增部门'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></add-dep>
			<edit-dep v-else-if="dialogTitle == '编辑部门'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></edit-dep>
			<check-dep v-else-if="dialogTitle == '查看部门'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></check-dep>
		</el-dialog>
	</div>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module';
	import addDep from './components/addDep.vue'
	import editDep from './components/editDep.vue'
	import checkDep from './components/checkDep.vue'
	export default {
		components: {
			// pagination,
			addDep,
			editDep,
			checkDep
		},
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/api/sysdept/getDeptTreeList',
					activatedIsNeed: false,
					getDataListIsPage: false,
				},
				dataForm: {
          companyName:'',
					name:''
				},
				addOrUpdateForm:{
          companyId:'',
					name:'',
					pid:'',
				},

				dialogVisible:false,
				dialogTitle:'',

        //树形配置
        treeProp:{
          children:'children',
          hasChildren:'hasChildren'
        }
			};
		},
		created() {
			this.init()
		},
		methods: {
			init(){
				this.getData()
			},
			//获取用户列表
			getData(){
				this.getDataList()
			},
			//重置查询条件
			reset(){
				this.dataForm.companyName = ''
        this.dataForm.name = ''
				this.getData();
			},
			//重置对话框
			resetAddOrUpdateForm(){
				this.addOrUpdateForm = {
          companyId:'',
					name:'',
					pid:'',
				}
        this.page= 1
			},
			//查询
			search(){
        this.page= 1
				this.getData();
			},
			//打开新增/修改对话框
			openDialog(type,row){
				if(type == 'add'){
					this.dialogTitle = '新增部门'
					this.resetAddOrUpdateForm()
					this.dialogVisible = true
				}else if(type == 'edit'){
					this.dialogTitle = '编辑部门'
					this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
					this.dialogVisible = true
				}else if(type == 'check'){
					this.dialogTitle = '查看部门'
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
				this.$confirm('确认删除'+row.name+'及其子部门'+'?', '提示', {
					cancelButtonClass: "btn-custom-cancel",
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$http.get('/api/sysdept/deleteDept/'+row.id).then(res=>{
						if(res.data.code != 0){return this.$message.error(res.data.msg)}
						else{
							this.getData()
							this.$message.success("删除成功!")
						}
					}).catch((err)=>{})
				}).catch((err) => {})
			},
      handleSizeChange(e){
        this.limit = e
        this.getDataList()
      },
		}
	};
</script>
