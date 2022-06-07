<template>
	<div>
		<div class="editRegion-form-first">
			<el-form ref='forms' :model='form' :rules='rules' label-width='90px' inline>
        <el-row>
          <el-form-item label="区域名称:" prop="regionName">
          	<el-input placeholder="请输入区域名称" v-model="form.regionName"></el-input>
          </el-form-item>
          <el-form-item label="区域编码:" prop="regionCode">
          	<el-input disabled placeholder="请输入区域编码" v-model="form.regionCode"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="区域层级:" prop="regionLevel">
          	<el-select
            placeholder="请选择区域层级"
            v-model="form.regionLevel"
            @change="handleRegionLevelChange"
            style="width: 200px;">
              <el-option
              v-for="(item,index) in regionLevelDict"
              :key="index"
              :value="item.value"
              :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域:" prop="parentCode">
          	<el-cascader
          	v-model="form.parentCode"
          	:options="regionList"
          	:show-all-levels="true"
          	:props="prop"
          	clearable
          	placeholder="请选择所属区域"
            style="width: 200px;">
          	</el-cascader>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="启用状态:" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
              v-for="(item,index) in regionStatusDict"
              :key="index"
              :label="item.value">
              {{item.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
			</el-form>
		</div>
		<div class='editRegion-footer'>
			<el-button type="primary" style="margin-right: 11px;" class="click-button" @click="edit">确 定</el-button>
			<el-button @click="cancel" class="click-button">取 消</el-button>
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
						regionName:'',
						regionCode:'',
						parentCode:'',
						regionLevel:1,
						status:'1'
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
				rules: {
					regionName: [{
						required: true,
						message: '请填写区域名称',
						trigger: 'blur'
					},{
            validator: validateInput,
            trigger: 'blur'
          }],
          regionCode: [{
          	required: true,
          	message: '请填写区域编码',
          	trigger: 'blur'
          },{
            validator: validateInput,
            trigger: 'blur'
          }],
          regionLevel: [{
          	required: true,
          	message: '请选择区域层级',
          	trigger: 'blur'
          }],
          parentCode: [{
          	required: true,
          	message: '请选择所属区域',
          	trigger: 'blur'
          }],
          status: [{
          	required: true,
          	message: '请选择启用状态',
          	trigger: 'blur'
          }],
				},
				form: {
					regionName:'',
					regionCode:'',
					parentCode:'',
					regionLevel:1,
					status:'1'
				},

        //区域列表
				regionList:[],

        //区域列表级联选择器配置项
        prop:{
          value:'regionCode',
          label:'regionName',
          children:'children',
          checkStrictly:true,
          emitPath:false,
        },

        //0层区域
        emptyMenu:{
          regionCode:'0',
          regionName:'无'
        },
        
        //区域使用状态字典值
        regionStatusDict:[],
        //区域等级字典值
        regionLevelDict:[]
			}
		},
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
							this.$http.post('/api/sysregioninfo/editRegion', this.form).then(res => {
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

      handleRegionLevelChange(regionLevel){
        this.form.parentCode = ''
        this.regionList = []
        if(regionLevel==undefined||regionLevel==null||regionLevel == ''){
          return;
        }
        this.getRegionList(regionLevel)
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
			getRegionList(regionLevel){
			  this.$http.get('/api/sysregioninfo/getRegionTreeList',
        {
          params:{
            regionLevel:regionLevel
          }
        }).then(res => {
			  	if (res.data.code != 0) {
			  		return this.$message.error(res.data.msg)
			  	}
			    let data = res.data.data
			    if(data!=undefined||data!=null){
			      data = this.getTreeData(data)
			      data.unshift(this.emptyMenu)
			      this.regionList = data
			    }
			  }).catch((err) => {})
			},
			reset(){
				this.form = this.dataForm
				if(this.form.regionLevel!=undefined&&this.form.regionLevel!=null&&this.form.regionLevel!=''){
				  this.getRegionList(this.form.regionLevel)
				}
        this.getDict()
			},
      //数据字典
      getDict(){
        this.getRegionStatusDict()
        this.getRegionLevelDict()
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
      //获取区域使用状态字典值
      getRegionStatusDict(){
        this.$dataDict.getDataDict('REGION_STATUS').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:item.vaule
            }
            this.regionStatusDict.push(option)
          })
        })
      },
      //获取区域使用状态字典值
      getRegionLevelDict(){
        this.$dataDict.getDataDict('REGION_LEVEL').then(res=>{
          if(res.code!=0){
            return this.$message.error(res.msg)
          }
          res.data.forEach(item=>{
            let option = {
              label:item.label,
              value:parseInt(item.vaule)
            }
            this.regionLevelDict.push(option)
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
	.editRegion-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: flex-end;
		padding: 20px 30px 20px 20px;
	}

	.editRegion-form-first {
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
