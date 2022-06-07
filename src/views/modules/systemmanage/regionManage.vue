<template>
	<div class="manage-container">
    <div>
      <el-form :inline="true">
        <el-form-item label="区域编码:">
          <el-input placeholder="请输入区域编码" v-model="dataForm.regionCode"></el-input>
        </el-form-item>
        <el-form-item label="区域名称:">
          <el-input placeholder="请输入区域名称" v-model="dataForm.regionName"></el-input>
        </el-form-item>
        <el-form-item label="区域层级:">
          <el-select
          placeholder="请选择区域层级"
          v-model="dataForm.regionLevel">
          <el-option label="全部" :value="''"></el-option>
            <el-option
            v-for="(item,index) in regionLevelDict"
            :key="index"
            :value="item.value"
            :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态:">
          <el-select placeholder="请选择启用状态" v-model="dataForm.status">
            <el-option value="" label="全部"></el-option>
            <el-option
            v-for="(item,index) in regionStatusDict"
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
        <el-table-column label="区域名称" align="center" prop="regionName">
        </el-table-column>
        <el-table-column label="区域编码" align="center" prop="regionCode">
        </el-table-column>
        <el-table-column label="区域层级" align="center" prop="regionLevel" :formatter="regionLevelFormat">
        </el-table-column>
        <el-table-column label="启用状态" align="center" prop="status" :formatter="statusFormat">
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
		width="830px"
		:title="dialogTitle"
		:visible="dialogVisible"
		@close="closeDialog"
		destroy-on-close>
			<add-region v-if="dialogTitle == '新增区域'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></add-region>
			<edit-region v-else-if="dialogTitle == '编辑区域'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></edit-region>
			<check-region v-else-if="dialogTitle == '查看区域'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></check-region>
		</el-dialog>
	</div>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module';
	import pagination from '@/components/page/Pagination.vue';
	import addRegion from './components/addRegion.vue'
	import editRegion from './components/editRegion.vue'
	import checkRegion from './components/checkRegion.vue'
	export default {
		components: {
			pagination,
			addRegion,
			editRegion,
			checkRegion
		},
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/api/sysregioninfo/page',
					activatedIsNeed: false,
					getDataListIsPage: true,
				},
				dataForm: {
					regionName:'',
          regionCode:'',
          status:'',
          regionLevel:'',
				},

				addOrUpdateForm:{
					regionName:'',
					regionCode:'',
          parentCode:'',
          regionLevel:1,
					status:'1'
				},
				deptList:null,
				dialogVisible:false,
				dialogTitle:'',

        //区域使用状态字典值
        regionStatusDict:[],
        //区域等级字典值
        regionLevelDict:[]
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
        this.getRegionStatusDict()
        this.getRegionLevelDict()
      },
			getData(){
				this.getDataList()
			},
			reset(){
				this.dataForm.regionName = ''
        this.dataForm.regionCode = ''
        this.dataForm.status = ''
        this.dataForm.regionLevel = ''
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
					regionName:'',
					regionCode:'',
					parentCode:'',
					regionLevel:1,
					status:'1'
				}
			},
			//打开新增/修改对话框
			openDialog(type,row){
				if(type == 'add'){
					this.dialogTitle = '新增区域'
					this.resetAddOrUpdateForm()
					this.dialogVisible = true
				}else if(type == 'edit'){
					this.dialogTitle = '编辑区域'
					this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
					this.dialogVisible = true
				}else if(type == 'check'){
					this.dialogTitle = '查看区域'
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
				this.$confirm('确认删除区域'+row.regionName+'?', '提示', {
					cancelButtonClass: "btn-custom-cancel",
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$http.get('api/sysregioninfo/deleteRegion/'+row.regionCode).then(res=>{
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
        for(let i=0;i<this.regionStatusDict.length;i++){
          if(row.status === this.regionStatusDict[i].value){
          	return this.regionStatusDict[i].label
          }
        }
      },
      regionLevelFormat(row){
        for(let i=0;i<this.regionLevelDict.length;i++){
          if(row.regionLevel === this.regionLevelDict[i].value){
          	return this.regionLevelDict[i].label
          }
        }
      },
      //获取区域使用状态字典值
      getRegionStatusDict(){
        this.$dataDict.getDataDict('REGION_STATUS').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:item.vaule
            }
            this.regionStatusDict.push(option)
          })
        })
      },
      //获取区域使用状态字典值
      getRegionLevelDict(){
        this.$dataDict.getDataDict('REGION_LEVEL').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:parseInt(item.vaule)
            }
            this.regionLevelDict.push(option)
          })
        })
      }
		}
	};
</script>
