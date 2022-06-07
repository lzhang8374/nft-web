<template>
	<div>
		<div class="addRole-form-first">
			<el-form ref='forms' :model='form' :rules='rules' label-width='90px'>
				<el-row>
					<el-form-item label="角色名称:" prop="name">
						<el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="角色描述:">
						<el-input v-model="form.remark" placeholder="请描述该角色"></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="菜单权限:">
						<el-tree
						ref="treeMenu"
						:data="menuList"
						show-checkbox
						node-key="id"
						:props="defaultProps"
						@check-change="handleCheckChange">
						</el-tree>
					</el-form-item>
				</el-row>
			</el-form>
		</div>
		<div class='addRole-footer'>
			<el-button type="primary" style="margin-right: 11px;" class="click-button" @click="add">确 定</el-button>
			<el-button @click="cancel" class="click-button">取 消</el-button>
		</div>
	</div>
</template>
<script>
	export default {
		props:{
			dataForm:{
				type:Object,
				default:()=>{
					return {
						name:'',
						remark:'',
						menuIdList:[],
					}
				}
			}
		},
		data() {
			return {
				form: {
					name:'',
					remark:'',
					menuIdList:[],
				},
				rules: {
					name: [{
						required: true,
						message: '请填写角色名称',
						trigger: 'blur'
					}],
				},
				menuList:[],
				defaultProps:{
					children: 'children',
					label: 'name'
				},
			}
		},
		mounted() {
			this.reset()
		},
		created() {},
		methods: {
			add(){
				this.$refs.forms.validate((valid)=>{
					if(valid){
						this.$confirm('确认提交?', '提示', {
							cancelButtonClass: "btn-custom-cancel",
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$http.post('/api/sysrole/addRole',this.form).then(res=>{
								if(res.data.code != 0){
									return this.$message.error(res.data.msg)
								}else{
									this.$emit('closeDialog')
									return this.$message.success(res.data.msg)
								}
							}).catch((err)=>{})
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
			handleCheckChange(data, checked, indeterminate){
				this.form.menuIdList = []
				let halfChecked = this.$refs.treeMenu.getHalfCheckedKeys()
				let wholeChecked = this.$refs.treeMenu.getCheckedKeys()
				if(halfChecked){
					this.form.menuIdList = this.form.menuIdList.concat(halfChecked)
				}
				if(wholeChecked){
					this.form.menuIdList = this.form.menuIdList.concat(wholeChecked)
				}
			},
      //处理菜单树形数据
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

      //获取菜单数据
      getMenuList(){
        this.$http.get('/api/sysmenu/getMenuAndButtonList').then(res => {
        	if (res.data.code != 0) {
        		return this.$message.error(res.data.msg)
        	}
          let data = res.data.data
          if(data!=undefined||data!=null){
            data = this.getTreeData(data)
            this.menuList = data
          }
        }).catch((err) => {})
      },
			reset(){
				this.form = this.dataForm
        this.getMenuList()
			}
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
	.addRole-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: flex-end;
		padding: 20px 30px 20px 20px;
	}

	.addRole-form-first {
		display: flex;
		justify-content: center;
		padding-top: 20px;
    max-height: 800px;
	}

	.el-button--mini.is-round {
		padding: 5px 10px;
		margin-left: 20px;
		margin-bottom: 5px;
	}
</style>
