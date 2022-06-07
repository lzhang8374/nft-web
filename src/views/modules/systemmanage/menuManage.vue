<template>
	<div class="manage-container">
    <div>
      <el-form :inline="true">
        <el-form-item label="菜单名称:">
          <el-input placeholder="请输入菜单名称" v-model="dataForm.name"></el-input>
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
        <el-table-column label="菜单名称" prop="name">
        </el-table-column>
        <el-table-column label="菜单类别" align="center" prop="type" :formatter="typeFormat">
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sort">
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="creator">
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="openDialog('check',scope.row)">查看</el-button>
            <el-button type="text" @click="openDialog('edit',scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteMenu(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
		<el-dialog
		width="730px"
		:title="dialogTitle"
		:visible="dialogVisible"
		@close="closeDialog"
		destroy-on-close>
			<add-menu v-if="dialogTitle == '新增菜单'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></add-menu>
			<edit-menu v-else-if="dialogTitle == '编辑菜单'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></edit-menu>
			<check-menu v-else-if="dialogTitle == '查看菜单'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></check-menu>
		</el-dialog>
	</div>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module';
	import addMenu from './components/addMenu.vue'
	import editMenu from './components/editMenu.vue'
	import checkMenu from './components/checkMenu.vue'
	export default {
		components: {
			addMenu,
			editMenu,
			checkMenu
		},
    inject:['reload'],
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/api/sysmenu/getMenuAndButtonList',
					activatedIsNeed: false,
					getDataListIsPage: false,
				},
				dataForm: {
					name:''
				},
				addOrUpdateForm:{
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
      //初始化
			init(){
				this.getData()
			},
			//获取用户列表
			getData(){
				this.getDataList()
			},
			//重置查询条件
			reset(){
				this.dataForm.name = ''
				this.getData();
			},
			//重置对话框
			resetAddOrUpdateForm(){
				this.addOrUpdateForm = {
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
					this.dialogTitle = '新增菜单'
					this.resetAddOrUpdateForm()
					this.dialogVisible = true
				}else if(type == 'edit'){
					this.dialogTitle = '编辑菜单'
					this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
					this.dialogVisible = true
				}else if(type == 'check'){
					this.dialogTitle = '查看菜单'
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
			deleteMenu(row){
				this.$confirm('确认删除菜单'+row.name+'及其子菜单'+'?', '提示', {
					cancelButtonClass: "btn-custom-cancel",
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$http.get('/api/sysmenu/deleteMenu/'+row.id).then(res=>{
						if(res.data.code != 0){return this.$message.error(res.data.msg)}
						else{
							this.getData()
							this.$message.success("删除成功!")
              setTimeout(()=> {
                location.reload()
              }, 500);
						}
					}).catch((err)=>{})
				}).catch((err) => {})
			},
      handleSizeChange(e){
        this.limit = e
        this.getDataList()
      },

      typeFormat(row){
        if(row.type == '0'){
          return '菜单'
        }else if(row.type == '1'){
          return '按钮/权限'
        }
      }
		}
	};
</script>
