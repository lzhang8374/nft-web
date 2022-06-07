<template>
	<div>
		<div class="checkRole-form-first">
			<el-form ref='forms' label-width='90px'>
				<el-row>
					<el-form-item label="角色名称:">
						<el-input v-model="form.name"  disabled></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="角色描述:">
						<el-input v-model="form.remark" disabled></el-input>
					</el-form-item>
				</el-row>
        <el-row>
        	<el-form-item label="菜单权限:">
        		<el-tree
        		ref="treeMenu"
        		:data="menuList"
        		show-checkbox
        		node-key="id"
        		:props="defaultProps">
        		</el-tree>
        	</el-form-item>
        </el-row>
			</el-form>
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
						id:'',
						name:'',
						remark:'',
						menuIdList:[],
					}
				}
			}
		},
		watch:{
			dataForm:{
				handler:function(val,oldVal){
					this.form = JSON.parse(JSON.stringify(val))
          this.getRoleMenu()
				},
				deep:true,
			}
		},
		data() {
			return {
				form: {
					id:'',
					name:'',
					remark:'',
					menuIdList:[],
				},
				menuList:JSON.parse(JSON.stringify(window.SITE_CONFIG['menuList'])),
				defaultProps:{
					children: 'children',
					label: 'name',
          disabled: 'disabled'
				},
			}
		},
		mounted() {
			this.reset()
		},
		methods: {
			reset(){
				this.form = this.dataForm
        this.getMenuList()
        this.getRoleMenu()
			},

      //处理菜单树形数据
      getTreeData(data) {
        for (var i = 0; i < data.length; i++) {
          data[i].disabled = true
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
      //获取角色菜单
      getRoleMenu(){
      	this.$http.post("/api/sysrolemenu/getRoleMenu",{
      		roleId:this.form.id
      	}).then(res=>{
          if(res.data.code!=0){
            return this.$message.error("获取角色菜单失败")
          }
          this.form.menuIdList = res.data.data
          let roleMenuList = res.data.data
          setTimeout(() => {
            roleMenuList.forEach(value => {
              this.$refs.treeMenu.setChecked(value.menuId,true,false)
            })
          },500)
        })
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

	.checkRole-form-first {
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
