<template>
	<div class="manage-container">
    <div>
      <el-form :inline="true">
        <el-form-item label="角色名称:">
          <el-input placeholder="请输入角色名称" v-model="dataForm.roleName"></el-input>
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
      <el-table :data="dataList">
        <el-table-column label="角色名称" align="center" prop="name">
        </el-table-column>
        <el-table-column label="角色描述" align="center" prop="remark">
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="creator">
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
        </el-table-column>
        <el-table-column label="更新人" align="center" prop="updater">
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime">
        </el-table-column>
        <el-table-column label="操作" align="center" prop="">
          <template slot-scope="scope">
            <el-button type="text" @click="openDialog('check',scope.row)">查看</el-button>
            <el-button type="text" @click="openDialog('edit',scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteRole(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <pagination @currentChange="pageCurrentChangeHandle" @handleSizeChange="handleSizeChange" :current-page="page" :page-size="limit"
        :total="total">
      </pagination>
    </div>
		<el-dialog
		width="430px"
		:title="dialogTitle"
		:visible="dialogVisible"
		@close="closeDialog"
		destroy-on-close>
			<add-role v-if="dialogTitle == '新增角色'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></add-role>
			<edit-role v-else-if="dialogTitle == '编辑角色'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></edit-role>
			<check-role v-else-if="dialogTitle == '查看角色'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></check-role>
		</el-dialog>
	</div>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module';
	import pagination from '@/components/page/Pagination.vue';
	import addRole from './components/addRole.vue'
	import editRole from './components/editRole.vue'
	import checkRole from './components/checkRole.vue'
	export default {
		components: {
			pagination,
			addRole,
			editRole,
			checkRole
		},
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/api/sysrole/getRoleInfoPage',
					activatedIsNeed: false,
					getDataListIsPage: true,
				},
				dataForm: {
					roleName:'',
				},

				addOrUpdateForm:{
					name:'',
					remark:'',
					menuIdList:[],
				},
				deptList:null,
				dialogVisible:false,
				dialogTitle:'',
			};
		},
		created() {
			this.init()
		},
		methods: {
			init(){
				this.getData()
			},
			getData(){
				this.getDataList()
			},
			reset(){
				this.dataForm.roleName = ''
        this.page = 1
				this.getData();
			},
			//查询
			search(){
        this.page = 1
				this.getData();
			},
			//重置对话框
			resetAddOrUpdateForm(){
				this.addOrUpdateForm = {
					name:'',
					remark:'',
					menuIdList:[],
				}
			},
			//打开新增/修改对话框
			openDialog(type,row){
				if(type == 'add'){
					this.dialogTitle = '新增角色'
					this.resetAddOrUpdateForm()
					this.dialogVisible = true
				}else if(type == 'edit'){
					this.dialogTitle = '编辑角色'
					this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
					this.dialogVisible = true
				}else if(type == 'check'){
					this.dialogTitle = '查看角色'
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
			deleteRole(row){
				this.$confirm('确认删除角色'+row.name+'?', '提示', {
					cancelButtonClass: "btn-custom-cancel",
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$http.get('api/sysrole/deleteRole/'+row.id).then(res=>{
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
