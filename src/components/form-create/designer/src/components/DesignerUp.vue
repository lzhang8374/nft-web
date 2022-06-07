<template>
  <div class="designer-up-container">
    <div class="designer-up-content">
      <form-create :option='thisOption' :rule='thisRule' :value.sync="thisValueForm" v-model="thisFormApi"></form-create>
    </div>
    <div class="designer-up-footer" v-if="showSubmit||showSave">
      <el-button v-if="showSave" @click="save" type="primary">保存</el-button>
      <el-button v-if="showSubmit" @click="submit" type="success">提交</el-button>
    </div>
  </div>
</template>

<script>
  import create from '@/components/form-create/designer/src/utils/create.js'
  export default {
    props:{
      option:{
        type: String,
        default: '{}'
      },
      rule:{
        type: String,
        default: '[]'
      },
      valueForm:{
        type:Object,
        default:()=>{}
      },
      showSubmit:{
        type:Boolean,
        default:false
      },
      showSave:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return{
        //表单各项的值
        thisValueForm:{},
        //表单默认配置
        thisOption:{
          form: {
            inline: false,
            formInDatabase: "",
            labelPosition: "right",
            size: "mini",
            labelWidth: "125px",
            hideRequiredAsterisk: false,
            showMessage: true,
            inlineMessage: false
          },
          submitBtn: false,
          resetBtn: false
        },
        //表单生成规则
        thisRule:[],
        //表单API
        thisFormApi:{},
      }
    },
    watch: {
        valueForm: {
            handler(newVal) {
                this.thisValueForm = newVal
            },
            deep: true
        },
        thisValueForm: {
          handler(newVal) {
              this.$emit('update:valueForm', Object.assign(this.valueForm,newVal))
          },
          deep: true
        },
        option(newVal){
          this.createOption()
        },
        rule(newVal){
          this.createRule()
        }
    },
    methods:{
      createRule(){
        this.thisRule = create.modify(this.rule)
      },
      createOption(){
        this.thisOption = JSON.parse(this.option)
      },
      save(){
        // this.$http.post('/customfrom/design/saveTableForm',{
        //   dataSourceId:this.thisOption.form.formInDatabase,
        //   tableInfo:this.thisValueForm
        // }).then(res=>{
        //   if(res.data.code!=0){
        //     return this.$message.error(res.data.msg)
        //   }
        //   return this.$message.success('success')
        // })
        this.$emit('save')
      },
      submit(){
        this.$emit('submit')
      },
      //规则校验方法
      validate(fun){
        this.thisFormApi.validate(res=>{
          fun(res)
        })
      },
      //根据字段名获取字段值
      getRuleByField(fieldName){
        if(fieldName&&fieldName!=''){
          let value = this.thisFormApi.getRule(fieldName)
          return value
        }
      }
    },
    created() {
      this.createOption()
      this.createRule()
    }
  }
</script>

<style>
  .designer-up-container{
    width: 100%;
  }
  .designer-up-content{
    width: 100%;
  }
  .designer-up-footer{
    display: flex;
    justify-content: flex-end;
    padding: 0px 20px 20px 20px;
  }
</style>
