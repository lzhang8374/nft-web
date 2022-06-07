<template>
	<div>
		<div class="addPost-form-first">
			<el-form ref='forms' :model='form' :rules='rules' label-width='90px'>
				<el-row>
					<el-form-item label="岗位名称:" prop="postName">
						<el-input v-model.trim="form.postName" placeholder="请输入岗位名称"></el-input>
					</el-form-item>
				</el-row>
        <el-row>
        	<el-form-item label="岗位编码:" prop="postCode">
        		<el-input v-model.trim="form.postCode" placeholder="请输入岗位编码"></el-input>
        	</el-form-item>
        </el-row>
				<el-row>
					<el-form-item label="岗位描述:">
						<el-input v-model="form.remark" placeholder="请描述该岗位"></el-input>
					</el-form-item>
				</el-row>
        <el-row>
          <el-form-item label="启用状态:" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
              v-for="(item,index) in postStatusDict"
              :key="index"
              :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
			</el-form>
		</div>
		<div class='addPost-footer'>
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
						postName:'',
						postCode:'',
						status:'0',
						remark:'',
					}
				}
			}
		},
		data() {
      var validateInput = (rule, value, callback) => {
        if (!this.checkSpecialKey(value)) {
          callback(new Error("不能含有特殊字符或空格！！"));
        } else {
          callback();
        }
      };
			return {
				form: {
					postName:'',
					postCode:'',
					status:'0',
					remark:'',
				},
				rules: {
					postName: [{
						required: true,
						message: '请填写岗位名称',
						trigger: 'blur'
					},{
            validator: validateInput,
            trigger: 'blur'
          }],
          postCode: [{
          	required: true,
          	message: '请填写岗位编码',
          	trigger: 'blur'
          },{
            validator: validateInput,
            trigger: 'blur'
          }],
          status: [{
          	required: true,
          	message: '请选择启用状态',
          	trigger: 'blur'
          }],
				},
        //岗位状态数据字典值
        postStatusDict:[]
			}
		},
		mounted() {
			this.reset()
		},
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
							this.$http.post('/api/syspost/addPost',this.form).then(res=>{
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
			reset(){
				this.form = this.dataForm
        this.getDict()
			},
      //数据字典
      getDict(){
        this.getPostStatusDict()
      },
      //校验特殊字符
      checkSpecialKey(str) {
        let specialKey = "[`~% !@#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
        for (let i = 0; i < str.length; i++) {
          if (specialKey.indexOf(str.substr(i, 1)) != -1) {
            return false;
          }
        }
        return true;
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
	.addPost-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: flex-end;
		padding: 20px 30px 20px 20px;
	}

	.addPost-form-first {
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
