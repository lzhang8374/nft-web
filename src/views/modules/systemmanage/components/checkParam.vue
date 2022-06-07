<template>
	<div>
		<div class="checkParam-form-first">
			<el-form ref='forms' :model='form' :rules='rules' :inline="true" label-width="120px">
				<el-row>
					<el-form-item label="参数名称:" prop="name">
						<el-input v-model="form.name" disabled></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="参数编码:" prop="code">
						<el-input v-model="form.code" disabled></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="配置值:" prop="value">
						<el-input v-model="form.value" disabled></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="备注:">
						<el-input style="width:200px;" type="textarea" :rows="2" v-model="form.remark" disabled></el-input>
					</el-form-item>
				</el-row>
			</el-form>
		</div>
	</div>
</template>
<script>
	import {
		Message
	} from "element-ui";
	export default {
		props: {
			dataForm: {
				type: Object,
			}
		},
		data() {
			return {
				form: {},
				searchForm: {},
				rules: {
					name: [{
						required: true,
						message: '请输入参数名称',
						trigger: 'blur'
					}],
					code: [{
						required: true,
						message: '请输入参数编码',
						trigger: 'blur'
					}],
					value: [{
						required: true,
						message: '请输入配置值',
						trigger: 'blur'
					}],
				},
			}
		},
		created() {},
		mounted() {
			this.reset()
		},
		methods: {
			edit() {
				this.$refs.forms.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交?', '提示', {
							cancelButtonClass: "btn-custom-cancel",
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$http.post('param/param/updateParam', this.form).then(res => {
								if (res.data.code != 0) {
									return Message.error(res.data.msg)
								} else {
									this.$emit('closeDialog')
									return Message.success(res.data.msg)
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
					Message.info('已取消操作')
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


	.checkParam-form-first {
		display: flex;
		justify-content: center;
		padding-top: 20px;
		padding-bottom: 30px;
	}

	.el-button--mini.is-round {
		padding: 5px 10px;
		margin-left: 20px;
		margin-bottom: 5px;
	}
</style>
