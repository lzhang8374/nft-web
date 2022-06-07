<template>
	<div>
		<div class="productUnitAdd-form-first">
			<el-form ref='forms' :model='form' :rules='rules' label-width='90px'>
				<el-form-item label="组织编号:" prop="code">
					<el-input v-model="form.code" placeholder="请输入唯一组织编号"></el-input>
				</el-form-item>
				<el-form-item label="组织名称:" prop="name">
					<el-input v-model="form.name" placeholder="请输入组织名称"></el-input>
				</el-form-item>
				<el-form-item label="组织类型" prop="unitType">
					<el-select v-model="form.unitType" placeholder="请选择组织类型" style="width: 100%;"
						@change="getparentUnit($event)">
						<el-option label="工厂" value="01"></el-option>
						<el-option label="车间" value="02"></el-option>
						<el-option label="区域" value="03"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="父级组织" prop="parentUnitId">
					<el-cascader :key="cascaderKey" v-model="value" show-all-levels :options="options" :props="prop"
						@change="handleChange"></el-cascader>
				</el-form-item>
				<el-form-item label="负责人" prop="contractName">
					<el-input v-model="form.contractName" placeholder="请输入负责人信息"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="contractTelphone">
					<el-input v-model="form.contractTelphone" placeholder="请输入信息"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<div class='productUnitAdd-footer'>
			<el-button type="primary" style="margin-right: 11px;" class="click-button" @click="add">确 定</el-button>
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
						code: '',
						name: '',
						unitType: '',
						parentUnitId: '',
						contractName: '',
						contractTelphone: '',
					}
				}
			}
		},
		data() {
			return {
				//级联选择器配置项
				prop:{
				  value:'id',
				  label:'label',
				  children:'children',
				  emitPath:false,
				},
				cascaderKey: 1,
				parentUnitList: [],
				options: [],
				value: [],
				form: {
					code: '',
					name: '',
					unitType: '',
					parentUnitId: '',
					contractName: '',
					contractTelphone: '',
				},
				searchForm: {
					code: '',
					name: '',
					unitType: '',
					parentUnitId: '',
					contractName: '',
					contractTelphone: '',
				},
				rules: {
					code: [{
						required: true,
						message: '请输入唯一组织编号',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入组织名称',
						trigger: 'blur'
					}],
					unitType: [{
						required: true,
						message: '请填写组织类型',
						trigger: 'blur'
					}],
					parentUnitId: [{
						required: true,
						message: '请选组父级组织',
						trigger: 'blur'
					}]
				},
			}
		},
		watch: {
			options(val) {
				this.cascaderKey++
			}
		},
		mounted() {
			this.reset()
		},
		methods: {
			handleChange(value) {
				this.form.parentUnitId = value
			},
			//处理部门树形数据
			getTreeData(data) {
				console.log(data)
				for (var i = 0; i < data.length; i++) {
					if (data[i].children.length < 1) {
						// children若为空数组，则将children设为undefined
						data[i].children = undefined;
						if(this.form.unitType == '03'){
							if(data[i].unitType != '02'){
								data[i].children = [];
							}
						}
					} else {
						// children若不为空数组，则继续 递归调用 本方法
						this.getTreeData(data[i].children);
					}
				}
				console.log(data)
				return data;
			},
			getparentUnit(event) {
				if (event == "01") {
					this.cascaderKey = 1
					this.form.parentUnitId = ""
					this.value = []
					this.options = []
					this.$http('/unit/factoryunit/getALLTopolog/' + '00').then(res => {
						this.options = this.getTreeData(res.data.data)
					})
				} else if (event == "02") {
					this.cascaderKey = 1
					this.form.parentUnitId = ""
					this.options = []
					this.value = []
					this.$http('/unit/factoryunit/getALLTopolog/' + '01').then(res => {
						this.options = this.getTreeData(res.data.data)
					})
				} else if (event == "03") {
					this.cascaderKey = 1
					this.form.parentUnitId = ""
					this.value = []
					this.options = []
					this.$http('/unit/factoryunit/getALLTopolog/' + '02').then(res => {
						this.options = this.getTreeData(res.data.data)
					})
				}
			},
			add() {
				this.$refs.forms.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交?', '提示', {
							cancelButtonClass: "btn-custom-cancel",
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$http.post('/unit/factoryunit/addFactoryUnit', this.form).then(res => {
								if (res.data.code != 0) {
									return this.$message.error(res.data.msg)
								} else {
									this.$emit('closeDialog')
									this.$emit('getTableList')
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
					this.$message({
						type: 'info',
						message: '已取消操作'
					});
				}).catch((err) => {
					console.log(err)
				})
			},
			reset() {
				this.form = this.dataForm
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
	.productUnitAdd-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: center;
		padding: 20px 30px 20px 20px;
	}

	.productUnitAdd-form-first {
		display: flex;
		justify-content: center;
		padding-top: 20px;
	}

	.el-button--mini.is-round {
		padding: 5px 10px;
		margin-left: 20px;
		margin-bottom: 5px;
	}
</style>
