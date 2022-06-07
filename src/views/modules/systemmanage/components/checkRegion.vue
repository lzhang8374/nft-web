<template>
	<div>
		<div class="checkRegion-form-first">
			<el-form ref='forms' label-width='90px' inline>
        <el-row>
          <el-form-item label="区域名称:">
          	<el-input disabled v-model="form.regionName"></el-input>
          </el-form-item>
          <el-form-item label="区域编码:">
          	<el-input disabled v-model="form.regionCode"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="区域层级:">
          	<el-select
            placeholder=""
            v-model="form.regionLevel"
            style="width: 200px;"
            disabled>
              <el-option
              v-for="(item,index) in regionLevelDict"
              :key="index"
              :value="item.value"
              :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域:">
          	<el-cascader
            placeholder=""
          	v-model="form.parentCode"
          	:options="regionList"
          	:show-all-levels="true"
          	:props="prop"
          	clearable
            disabled
            style="width: 200px;">
          	</el-cascader>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="启用状态:">
            <span v-for="(item,index) in regionStatusDict" v-if="form.status==item.value">{{item.label}}</span>
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
	.checkRegion-footer {
		border-top: 1px solid #cfd8dc;
		text-align: center;
		display: flex;
		justify-content: flex-end;
		padding: 20px 30px 20px 20px;
	}

	.checkRegion-form-first {
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
