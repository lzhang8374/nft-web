<template>
  <div>
    <div class='code-form-first'>
      <el-form ref='forms' :model='codeForm' label-width='90px'>
        <el-row>
          <el-form-item label='包名:'>
            <el-input v-model='codeForm.moduleName' placeholder='请输入包名,默认为module'></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label='路径名:'>
            <el-input v-model='codeForm.packageName' placeholder='请输入路径名,默认为com.cs'></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label='前缀:'>
            <el-input v-model='codeForm.prefix' placeholder='请输入前缀,为空则不去除前缀'></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label='模板版本:'>
            <!--            <el-input v-model="codeForm.templateVersion" placeholder="请输入前缀,为空则不去除前缀"></el-input>-->
            <el-select v-model='codeForm.templateVersion' placeholder='请选择模板版本'>
              <el-option v-for='item in templateVersionList' :key='item.value' :label='item.label'
                         :value='item.value'></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class='addRole-footer'>
      <el-button type='primary' style='margin-right: 11px;' class='click-button' @click='add'>确 定</el-button>
      <el-button @click='cancel' class='click-button'>取 消</el-button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'codeGenerator.vue',
  props: ['tableName'],
  data() {
    return {
      codeForm: {
        id: '',
        name: '',
        moduleName: '',
        packageName: '',
        prefix: '',
        templateVersion: ''
      },
      templateVersionList: [{
        value: 'tradition',
        label: '传统模板'
      }, {
        value: 'bias',
        label: '类领域模板'
      }]
    };
  },
  created() {
    console.log(this.tableName);
    this.getGenerateInformation();
  },
  methods: {
    add() {
      this.$refs.forms.validate((valid) => {
        if (valid) {
          this.$confirm('确认保存?', '提示', {
            cancelButtonClass: 'btn-custom-cancel',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.put('generatior/tableinformation/update', this.codeForm).then(res => {
              if (res.data.code !== 0) {
                return this.$message.error(res.data.msg);
              } else {
                this.$emit('closeDialog');
                return this.$message.success(res.data.msg);
              }
            }).catch((err) => {
            });
          }).catch((err) => {
          });
        }
      });
    },
    cancel() {
      this.$confirm('当前数据未保存，确认要关闭当前弹窗吗?', '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$emit('closeDialog');
        this.$message.info('已取消操作');
      }).catch((err) => {
        console.log(err);
      });
    },
    //获取包结构
    getGenerateInformation() {
      console.log(this.tableName);
      this.$http.get('/generatior/tableinformation/findInformationByTableName/' + this.tableName).then(res => {
        if (res.data.code !== 0) {
          return this.$message.error(res.data.msg);
        } else {
          console.log(res.data.data);
          if (res.data.data === null) {
            return this.$message.error('未生成默认结构,请先更新表');
          } else {
            this.codeForm = res.data.data;
          }
        }
      }).catch((err) => {
      });
    }
  }
};
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
  padding: 20px 20px 1px 5px;
}

.code-form-first {
  display: flex;
  justify-content: center;
  padding-top: 2px;
  max-height: 800px;
}

.el-button--mini.is-round {
  padding: 5px 10px;
  margin-left: 20px;
  margin-bottom: 5px;
}
</style>
