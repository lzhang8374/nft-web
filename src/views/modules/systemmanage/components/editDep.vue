<template>
	<div>
		<div class="editDep-form-first">
			<el-form ref='forms' :model='form' :rules='rules' label-width='90px'>
				<el-form-item label="部门名称:" prop="name">
					<el-input placeholder="请输入部门名称" v-model="form.name"></el-input>
				</el-form-item>
        <el-form-item label="所属公司:" prop="companyId">
        	<el-cascader
        	v-model="form.companyId"
        	:options="companyList"
        	:show-all-levels="true"
        	:props="prop"
        	clearable
          disabled
        	placeholder="请选择所属公司">
        	</el-cascader>
        </el-form-item>
				<el-form-item label="所属部门:" prop="pid">
					<el-cascader
					v-model="form.pid"
					:options="deptList"
					:show-all-levels="true"
					:props="prop"
					clearable
          disabled
					placeholder="请选择上级部门">
					</el-cascader>
				</el-form-item>
			</el-form>
		</div>
		<div class='equipmentAdd-footer'>
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
            companyId:'',
						name: '',
						pid: '0',
					}
				}
			}
		},
		data() {
			return {
				rules: {
					name: [{
						required: true,
						message: '请填写部门名称',
						trigger: 'blur'
					}],
          companyId: [{
          	required: true,
          	message: '请选择所属公司',
          	trigger: 'blur'
          }],
				  pid: [{
				  	required: true,
				  	message: '请选择上级部门',
				  	trigger: 'blur'
				  }],
				},
				form: {
          companyId:'',
					name: '',
					pid: '0',
				},
				//部门列表
				deptList:[],
        //公司列表
        companyList:[],

				//部门级联选择器配置项
				prop:{
				  value:'id',
				  label:'name',
				  children:'children',
				  checkStrictly:true,
				  emitPath:false,
				},

				//0层部门
				emptyMenu:{
				  id:'0',
				  name:'无'
				}
			}
		},
		mounted() {
			this.reset()
		},
		methods: {
			init(){
				this.getCompanyList()
			},
			edit() {
				this.$refs.forms.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交?', '提示', {
							cancelButtonClass: "btn-custom-cancel",
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$http.post('/api/sysdept/editDept', this.form).then(res => {
								if (res.data.code != 0) {
									return this.$message.error(res.data.msg)
								} else {
									this.$emit('closeDialog')
									return this.$message.success(res.data.msg)
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
			      data.unshift(this.emptyMenu)
			      this.deptList = data
			    }
			  }).catch((err) => {})
			},
			reset(){
				this.form = this.dataForm
        this.init()
        if(this.form.companyId!=undefined&&this.form.companyId!=null&&this.form.companyId!=''){
          this.getDeptList(this.form.companyId)
        }
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
	.equipmentAdd-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: flex-end;
		padding: 20px 30px 20px 20px;
	}

	.editDep-form-first {
		padding-top: 20px;
		display: flex;
		justify-content: center;
	}

	.el-button--mini.is-round {
		padding: 5px 10px;
		margin-left: 20px;
		margin-bottom: 5px;
	}
</style>
