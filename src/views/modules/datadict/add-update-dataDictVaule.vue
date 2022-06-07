<template>
	<el-dialog :visible.sync="visible" :title="dataForm.op==1 ? $t('新增') : (dataForm.op==2 ? $t('编辑') : $t('查看'))"
		:close-on-click-modal="false" :close-on-press-escape="false" width="400px">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :disabled="dataForm.op===3" label-width='100px'>
      <el-row>
        <el-form-item prop="dictTypeCode" label="字典类型码">
          <el-input v-model="dataForm.dictTypeCode" placeholder="请输入字典类型码" :disabled="true" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="text" label="字典值名称">
          <el-input v-model="dataForm.text" placeholder="请输入字典值名称" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="value" label="字典值">
          <el-input v-model="dataForm.value" placeholder="请输入字典值" />
        </el-form-item>
      </el-row>
		</el-form>
		<template slot="footer">
			<el-button v-if="dataForm.op === 3" @click="visible = false">返回</el-button>
			<el-button v-if="dataForm.op != 3" @click="visible = false">取消</el-button>
			<el-button v-if="dataForm.op != 3" type="primary" @click="dataFormSubmitHandle()">确认</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import debounce from 'lodash/debounce';
	export default {
		data() {
			return {
				visible: false,
				dataForm: {
          id: '',
					op: '',
          dictTypeCode: '',
          text: '',
          value: ''
				},
				dataRule: {
          dictTypeCode: [{
						required: true,
						message: '请选择字典编码',
						trigger: 'blur'
					}],
          text: [{
						required: true,
						message: '请输入字典值名称',
						trigger: 'blur'
					}],
          value: [{
						required: true,
						message: '请输入字典值',
						trigger: 'blur'
					}]
				}
			};
		},
		watch: {},
		methods: {
			init() {
				this.visible = true;
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields();
          this.dataForm.dictTypeCode = this.$route.query.dictTypeCode;
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				this.$http.get(`api/dictvalue/${this.dataForm.id}`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = {
						...this.dataForm,
						...res.data
					};
				}).catch(() => {});
			},
			// 表单提交
			dataFormSubmitHandle: debounce(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false;
					}
					this.$http[!this.dataForm.id ? 'post' : 'put']('api/dictvalue', this.dataForm).then(({
						data: res
					}) => {
						if (res.code !== 0) {
							return this.$message.error(res.msg)
						}
						this.$message.success({
							message: this.$t('保存成功'),
							duration: 500,
							onClose: () => {
								this.visible = false;
								this.$emit('refreshDataList');
							}
						});
					}).catch(() => {});
				});
			}, 1000, {
				'leading': true,
				'trailing': false
			})
		}
	}
</script>

<style lang="scss" scoped>
</style>
