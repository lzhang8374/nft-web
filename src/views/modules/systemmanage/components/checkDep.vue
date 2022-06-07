<template>
	<div>
		<div class="checkDep-form-first">
			<el-form ref='forms' label-width='90px'>
				<el-form-item label="部门名称:">
					<el-input disabled v-model="form.name"></el-input>
				</el-form-item>
        <el-form-item label="所属公司:">
        	<el-cascader
          placeholder=""
        	v-model="form.companyId"
        	:options="companyList"
        	:show-all-levels="true"
        	:props="prop"
        	clearable
          disabled
        	placeholder="请选择所属公司">
        	</el-cascader>
        </el-form-item>
				<el-form-item label="所属部门:">
					<el-cascader
          placeholder=""
					v-model="form.pid"
					:options="deptList"
					:show-all-levels="true"
					:props="prop"
					clearable
				  disabled>
					</el-cascader>
				</el-form-item>
			</el-form>
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
		created() {
			this.init()
		},
		methods: {
      init(){
      	this.getCompanyList()
      },
			reset(){
				this.form = this.dataForm
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

	.checkDep-form-first {
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
