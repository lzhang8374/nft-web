<template>
	<div>
		<div class="checkCompany-form-first">
			<el-form ref='forms' label-width='90px' inline>
        <el-row>
          <el-form-item label="公司名称:">
          	<el-input disabled v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="所属公司:">
          	<el-cascader
            placeholder=""
          	v-model="form.pid"
          	:options="companyList"
          	:show-all-levels="true"
          	:props="prop"
          	clearable
          	placeholder="请选择上级公司"
            disabled
            style="width: 200px;">
          	</el-cascader>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="负责人:">
          	<el-input disabled v-model="form.master"></el-input>
          </el-form-item>
          <el-form-item label="公司地址:">
          	<el-input disabled v-model="form.address"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="邮政编码:">
          	<el-input disabled v-model="form.zipCode"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:">
          	<el-input disabled v-model="form.phone"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="邮箱地址:">
          	<el-input disabled v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="启用状态:">
            <span v-for="(item,index) in companyUsableDict" v-if="form.useable==item.value">{{item.label}}</span>
          </el-form-item>
        </el-row>
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
						name:'',
						pid:'0',
						address:'',
						master:'',
						phone:'',
						fax:'',
						email:'',
						useable:'1',
						remark:'',
					}
				}
			}
		},
		data() {
			return {
				form: {
					name:'',
					pid:'0',
					address:'',
					master:'',
					phone:'',
					fax:'',
					email:'',
					useable:'1',
					remark:'',
				},

        //公司列表列表
				companyList:[],

        //公司列表级联选择器配置项
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
        },
        
        //集团/公司状态字典
        companyUsableDict:[]
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
        this.getDict()
			},
      //数据字典
      getDict(){
        this.getCompanyUsableDict()
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

			//获取部门列表数据
			getCompanyList(){
			  this.$http.get('/api/syscompany/getCompanyTreeList').then(res => {
			  	if (res.data.code != 0) {
			  		return this.$message.error(res.data.msg)
			  	}
			    let data = res.data.data
			    if(data!=undefined||data!=null){
			      data = this.getTreeData(data)
			      data.unshift(this.emptyMenu)
			      this.companyList = data
			    }
			  }).catch((err) => {})
			},
			reset(){
				this.form = this.dataForm
			},
      //获取公司/集团使用状态字典值
      getCompanyUsableDict(){
        this.$dataDict.getDataDict('COMPANY_USEABLE').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:item.vaule
            }
            this.companyUsableDict.push(option)
          })
        })
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
	.checkCompany-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: flex-end;
		padding: 20px 30px 20px 20px;
	}

	.checkCompany-form-first {
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
