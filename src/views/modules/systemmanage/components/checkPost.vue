<template>
	<div>
		<div class="editPost-form-first">
			<el-form ref='forms' label-width='90px'>
				<el-row>
					<el-form-item label="岗位名称:">
						<el-input v-model.trim="form.postName" disabled></el-input>
					</el-form-item>
				</el-row>
        <el-row>
        	<el-form-item label="岗位编码:">
        		<el-input v-model.trim="form.postCode" disabled></el-input>
        	</el-form-item>
        </el-row>
				<el-row>
					<el-form-item label="岗位描述:">
						<el-input v-model="form.remark" disabled></el-input>
					</el-form-item>
				</el-row>
        <el-row>
          <el-form-item label="启用状态:">
            <span v-for="(item,index) in postStatusDict" v-if="form.status==item.value">{{item.label}}</span>
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
						postName:'',
						postCode:'',
						status:'0',
						remark:'',
					}
				}
			}
		},
		data() {
			return {
				form: {
					postName:'',
					postCode:'',
					status:'0',
					remark:'',
				},
        //岗位状态数据字典值
        postStatusDict:[]
			}
		},
		mounted() {
			this.reset()
		},
		methods: {
			reset(){
				this.form = this.dataForm
        this.getDict()
			},
      //数据字典
      getDict(){
        this.getPostStatusDict()
      },
      //获取岗位状态数据字典
      getPostStatusDict(){
        this.$dataDict.getDataDict('POST_STATUS').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:item.vaule
            }
            this.postStatusDict.push(option)
          })
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
	.editPost-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: flex-end;
		padding: 20px 30px 20px 20px;
	}

	.editPost-form-first {
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
