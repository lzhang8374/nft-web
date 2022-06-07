<template>
	<div class="manage-container">
    <div>
      <el-form :inline="true">
        <el-form-item label="岗位编码:">
          <el-input placeholder="请输入岗位编码" v-model="dataForm.postCode"></el-input>
        </el-form-item>
        <el-form-item label="岗位名称:">
          <el-input placeholder="请输入岗位名称" v-model="dataForm.postName"></el-input>
        </el-form-item>
        <el-form-item label="启用状态:">
          <el-select placeholder="请选择启用状态" v-model="dataForm.status">
            <el-option value="" label="全部"></el-option>
            <el-option
            v-for="(item,index) in postStatusDict"
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
      <el-table :data="dataList">
        <el-table-column label="岗位名称" align="center" prop="postName">
        </el-table-column>
        <el-table-column label="岗位编码" align="center" prop="postCode">
        </el-table-column>
        <el-table-column label="启用状态" align="center" prop="status" :formatter="statusFormat">
        </el-table-column>
        <el-table-column label="岗位描述" align="center" prop="remark">
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="createBy">
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
        </el-table-column>
        <el-table-column label="操作" align="center">
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
			<add-post v-if="dialogTitle == '新增岗位'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></add-post>
			<edit-post v-else-if="dialogTitle == '编辑岗位'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></edit-post>
			<check-post v-else-if="dialogTitle == '查看岗位'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></check-post>
		</el-dialog>
	</div>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module';
	import pagination from '@/components/page/Pagination.vue';
	import addPost from './components/addPost.vue'
	import editPost from './components/editPost.vue'
	import checkPost from './components/checkPost.vue'
	export default {
		components: {
			pagination,
			addPost,
			editPost,
			checkPost
		},
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/api/syspost/page',
					activatedIsNeed: false,
					getDataListIsPage: true,
				},
				dataForm: {
					postName:'',
          postCode:'',
          status:''
				},

				addOrUpdateForm:{
					postName:'',
					postCode:'',
          status:'0',
          remark:'',
				},
				deptList:null,
				dialogVisible:false,
				dialogTitle:'',

        //岗位状态数据字典值
        postStatusDict:[]
			};
		},
		created() {
			this.init()
		},
		methods: {
			init(){
				this.getData()
        this.getDict()
			},
      //数据字典
      getDict(){
        this.getPostStatusDict()
      },
			getData(){
				this.getDataList()
			},
			reset(){
				this.dataForm.postName = ''
        this.dataForm.postCode = ''
        this.dataForm.status = ''
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
					postName:'',
					postCode:'',
					status:'0',
					remark:'',
				}
			},
			//打开新增/修改对话框
			openDialog(type,row){
				if(type == 'add'){
					this.dialogTitle = '新增岗位'
					this.resetAddOrUpdateForm()
					this.dialogVisible = true
				}else if(type == 'edit'){
					this.dialogTitle = '编辑岗位'
					this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
					this.dialogVisible = true
				}else if(type == 'check'){
					this.dialogTitle = '查看岗位'
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
				this.$confirm('确认删除岗位'+row.postName+'?', '提示', {
					cancelButtonClass: "btn-custom-cancel",
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$http.delete('api/syspost/deletePost/'+row.postId).then(res=>{
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
      //数据格式化
      statusFormat(row){
        for(let i=0;i<this.postStatusDict.length;i++){
          if(row.status === this.postStatusDict[i].value){
          	return this.postStatusDict[i].label
          }
        }
      },
      //获取岗位状态数据字典
      getPostStatusDict(){
        this.$dataDict.getDataDict('POST_STATUS').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:item.vaule
            }
            this.postStatusDict.push(option)
          })
        })
      },
		}
	};
</script>
