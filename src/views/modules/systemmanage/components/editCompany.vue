<template>
	<div>
		<div class="editCompany-form-first">
			<el-form ref='forms' :model='form' :rules='rules' label-width='90px' inline>
        <el-row>
          <el-form-item label="公司名称:" prop="name">
          	<el-input placeholder="请输入公司名称" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="所属公司:" prop="pid">
          	<el-cascader
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
          <el-form-item label="负责人:" prop="master">
          	<el-input placeholder="请填写公司负责人" v-model="form.master"></el-input>
          </el-form-item>
          <el-form-item label="公司地址:" prop="address">
          	<el-input placeholder="请填写公司地址" v-model="form.address"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="邮政编码:" prop="zipCode">
          	<el-input placeholder="请填写邮政编码" v-model="form.zipCode"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="phone">
          	<el-input placeholder="请填写公司联系电话" v-model="form.phone"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="邮箱地址:" prop="email">
          	<el-input placeholder="请填写公司邮箱地址" v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="启用状态:" prop="useable">
            <el-radio-group v-model="form.useable">
              <el-radio
              v-for="(item,index) in companyUsableDict"
              :key="index"
              :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
			</el-form>
		</div>
		<div class='editCompany-footer'>
			<el-button type="primary" style="margin-right: 11px;" class="click-button" @click="edit">确 定</el-button>
			<el-button @click="cancel" class="click-button">取 消</el-button>
		</div>
	</div>
</template>
<script>
  import {isEmail,isMobile,isPhone} from "@/utils/validate.js";
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
      var emailValidator = (rule,value,callback)=>{
      	if(value != ''&&!isEmail(value)){
      		callback(new Error("请输入正确的邮箱账号"));
      	}else{
      		callback();
      	}
      }
      var mobileValidator = (rule,value,callback)=>{
      	if(value != ''&&!isMobile(value)&&!isPhone(value)){
      		callback(new Error("请输入正确的电话号码"));
      	}else{
      		callback();
      	}
      }
      var validateInput = (rule, value, callback) => {
        if (!this.checkSpecialKey(value)) {
          callback(new Error("不能含有特殊字符或空格！！"));
        } else {
          callback();
        }
      };
			return {
				rules: {
					name: [{
						required: true,
						message: '请填写集团/公司名称',
						trigger: 'blur'
					},{
            validator: validateInput,
            trigger: 'blur'
          }],
          pid: [{
          	required: true,
          	message: '请选择上级公司',
          	trigger: 'blur'
          }],
          address: [{
          	required: true,
          	message: '请填写集团/公司地址',
          	trigger: 'blur'
          },{
            validator: validateInput,
            trigger: 'blur'
          }],
          master: [{
          	required: true,
          	message: '请填写公司负责人',
          	trigger: 'blur'
          },{
            validator: validateInput,
            trigger: 'blur'
          }],
          phone: [{
          	required: true,
          	message: '请填写公司联系电话',
          	trigger: 'blur'
          },{
						validator:mobileValidator,
            message: '请输入正确的电话号码',
            trigger: 'blur'
					}],
          email: [{
          	required: true,
          	message: '请填写公司邮箱地址',
          	trigger: 'blur'
          },{
						validator:emailValidator,
            message: '请输入正确的邮箱账号',
            trigger: 'blur',
					}],
          useable: [{
          	required: true,
          	message: '请选择公司启用状态',
          	trigger: 'blur'
          }],

				},
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
			edit() {
				this.$refs.forms.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交?', '提示', {
							cancelButtonClass: "btn-custom-cancel",
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$http.post('/api/syscompany/updateCompany', this.form).then(res => {
								if (res.data.code != 0) {
									return this.$message.error(res.data.msg)
								} else {
									this.$emit('closeDialog')
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
					this.$message.info("已取消操作");
				}).catch((err) => {
					console.log(err)
				})
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
	.editCompany-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: flex-end;
		padding: 20px 30px 20px 20px;
	}

	.editCompany-form-first {
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
