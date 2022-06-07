<template>
	<el-dialog :visible.sync="visible" :title="$t('详情')"
		:close-on-click-modal="false" :close-on-press-escape="false">
    <el-descriptions column=1 :label-style="{'fontSize': '20px'}" :contentStyle="{'fontSize': '20px'}">
      <el-descriptions-item label="操作模块">{{dataForm.operModul}}</el-descriptions-item>
      <el-descriptions-item label="操作类型">{{dataForm.operType}}</el-descriptions-item>
      <el-descriptions-item label="操作描述">{{dataForm.operDesc}}</el-descriptions-item>
      <el-descriptions-item label="请求参数">{{dataForm.operRequParam}}</el-descriptions-item>
      <el-descriptions-item label="返回参数">{{dataForm.operRespParam}}</el-descriptions-item>
      <el-descriptions-item label="操作方法">{{dataForm.operMethod}}</el-descriptions-item>
      <el-descriptions-item label="请求URI">{{dataForm.operUri}}</el-descriptions-item>
      <el-descriptions-item label="请求IP">{{dataForm.operIp}}</el-descriptions-item>
      <el-descriptions-item label="版本号">{{dataForm.operVer}}</el-descriptions-item>
      <el-descriptions-item label="操作员">{{dataForm.operUserName}}</el-descriptions-item>
    </el-descriptions>
		<template slot="footer">
			<el-button @click="visible = false">返回</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				visible: false,
				dataForm: {
				}
			};
		}
	};
</script>

<style lang="scss" scoped>
</style>
