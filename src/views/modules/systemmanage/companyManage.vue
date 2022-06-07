<template>
	<div class="manage-container">
    <div>
      <el-form :inline="true">
        <el-form-item label="集团/公司名称:">
          <el-input placeholder="请输入集团/公司名称" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="启用状态:">
          <el-select placeholder="请选择启用状态" v-model="dataForm.useable">
            <el-option value="" label="全部"></el-option>
            <el-option
            v-for="(item,index) in companyUsableDict"
            :key="index"
            :value="item.value"
            :label="item.label">
            </el-option>
          </el-select>
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
        <el-table-column label="集团/公司名称" prop="name">
        </el-table-column>
        <el-table-column label="公司负责人" align="center" prop="master">
        </el-table-column>
        <el-table-column label="启用状态" align="center" prop="useable" :formatter="statusFormat">
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="createBy">
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
		width="830px"
		:title="dialogTitle"
		:visible="dialogVisible"
		@close="closeDialog"
		destroy-on-close>
			<add-company v-if="dialogTitle == '新增'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></add-company>
			<edit-company v-else-if="dialogTitle == '编辑'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></edit-company>
			<check-company v-else-if="dialogTitle == '查看'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></check-company>
		</el-dialog>
	</div>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module';
	// import pagination from '@/components/page/Pagination.vue';
	import addCompany from './components/addCompany.vue'
	import editCompany from './components/editCompany.vue'
	import checkCompany from './components/checkCompany.vue'
	export default {
		components: {
			// pagination,
			addCompany,
			editCompany,
			checkCompany
		},
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/api/syscompany/getCompanyTreeList',
					activatedIsNeed: false,
					getDataListIsPage: false,
				},
				dataForm: {
					name:'',
          useable:'',
				},
				addOrUpdateForm:{
					name:'',
					pid:'0',
          address:'',
          master:'',
          phone:'',
          fax:'',
          email:'',
          useable:'1',
          remark:'',
				},

				dialogVisible:false,
				dialogTitle:'',

        //树形配置
        treeProp:{
          children:'children',
          hasChildren:'hasChildren'
        },

        //集团/公司状态字典
        companyUsableDict:[]
			};
		},
		created() {
			this.init()
		},
		methods: {
			init(){
				this.getData()
        this.getDict()
		this.getcompanyList()
			},
			getcompanyList(){
				this.$http('/api/syscompany/getUserCompanyTreeList').then(res=>{
					console.log(res)
				})
			},
      //数据字典
      getDict(){
        this.getCompanyUsableDict()
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
					name:'',
					pid:'0',
					address:'',
					master:'',
					phone:'',
					fax:'',
					email:'',
					useable:'1',
					remark:'',
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
					this.dialogTitle = '新增'
					this.resetAddOrUpdateForm()
					this.dialogVisible = true
				}else if(type == 'edit'){
					this.dialogTitle = '编辑'
					this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
					this.dialogVisible = true
				}else if(type == 'check'){
					this.dialogTitle = '查看'
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
				this.$confirm('确认删除'+row.name+'及其子公司和下属部门'+'?', '提示', {
					cancelButtonClass: "btn-custom-cancel",
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$http.delete('/api/syscompany/deleteCompany/'+row.id).then(res=>{
						if(res.data.code != 0){return this.$message.error(res.data.msg)}
						else{
							this.getData()
							this.$message.success("删除成功!")
						}
					}).catch((err)=>{})
				}).catch((err) => {})
			},

      //数据格式化
      statusFormat(row){
        for(let i=0;i<this.companyUsableDict.length;i++){
          if(row.useable === this.companyUsableDict[i].value){
          	return this.companyUsableDict[i].label
          }
        }
      },
      handleSizeChange(e){
        this.limit = e
        this.getDataList()
      },
      //获取公司/集团使用状态字典值
      getCompanyUsableDict(){
        this.$dataDict.getDataDict('COMPANY_USEABLE').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:item.vaule
            }
            this.companyUsableDict.push(option)
          })
        })
      }
		}
	};
</script>
