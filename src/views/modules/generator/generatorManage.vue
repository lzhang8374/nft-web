<template>
  <div class='generator-container'>
    <div class='generator-box'>
      <div class='generator-search-form'>
        <el-form :inline='true'>
          <el-form-item label='表名:'>
            <el-input placeholder='请输入表名' v-model='dataForm.tableName'></el-input>
          </el-form-item>
          <el-button icon='el-icon-search' type='primary' round @click='search'>查询</el-button>
          <el-button icon='el-icon-refresh' type='primary' round @click='reset()'>重置</el-button>
          <el-button icon='el-icon-download' type='primary' round @click='codeBatch()'>批量生成</el-button>
          <el-button icon='el-icon-refresh' type='primary' round @click='getDefinedPackage()'>更新表</el-button>
        </el-form>
      </div>
      <div class='generator-search-table'>
        <div>
          <el-table :data='dataList' row-key='id' :indent='50' @selection-change='handleSelect'>
            <el-table-column align='center' type='selection'>
            </el-table-column>
            <el-table-column label='表名称' align='center' prop='tableName'>
            </el-table-column>
            <el-table-column label='存储引擎' align='center' prop='engine'>
            </el-table-column>
            <el-table-column label='表描述' align='center' prop='tableComment'>
            </el-table-column>
            <el-table-column label='创建时间' align='center' prop='createTime'>
            </el-table-column>
            <el-table-column label='操作' align='center'>
              <template slot-scope='scope'>
                <el-button type='text' @click='openDialog(scope.row)'>配置生成数据</el-button>
                <el-button type='text' @click='exportHandle(scope.row)'>生成代码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class='generator-pagination'>
        <pagination @currentChange='pageCurrentChangeHandle' @handleSizeChange='handleSizeChange' :current-page='page'
                    :page-size='limit' :total='total'></pagination>
      </div>
    </div>

    <el-dialog id='generatorDialog' width='430px' :title='title' :visible='dialogVisible'
               v-if='dialogVisible' :before-close='handleDeviceClose' :close-on-click-modal='false'
               :close-on-press-escape='false' destroy-on-close>
      <code-generator @closeDialog='closeDialog()'
                      :tableName='title'></code-generator>
    </el-dialog>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module';
import codeGenerator from './components/codeGenerator';
import pagination from '@/components/page/Pagination.vue';
import qs from 'qs';
import Cookies from 'js-cookie';

export default {
  components: {
    codeGenerator, pagination
  },
  name: 'generator.vue',
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/api/generator/list',
        activatedIsNeed: false,
        getDataListIsPage: true,
        exportURL: '/api/generator/code'
      },
      dataForm: {
        tableName: '',//表名
        engine: '',//引擎
        tableComment: '',//描述
        createTime: ''//创建时间
      },
      codeForm: {
        tableName: '',
        moduleName: '',
        packageName: '',
        prefix: ''
      },
      dialogVisible: false,
      title: '',
      tables: ''
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getData();
    },
    getData() {
      this.getDataList();
    },
    //重置查询条件
    reset() {
      this.dataForm.name = '';
      this.getData();
    },
    search() {
      this.page = 1;
      this.getData();
    },
    handleSelect(selection, row) {
      console.log(selection);
      console.log(row);

      this.tables = '';
      let temp = [];
      for (let i = 0; i < selection.length; i++) {
        temp.push(selection[i].tableName);
      }
      this.tables = temp.join(',');
      console.log(this.tables);
    },
    handleSizeChange(e) {
      this.limit = e;
      this.getDataList();
    },
    closeDialog() {
      this.dialogVisible = false;
      this.title = '';
      this.getData();
    },
    handleDeviceClose() {

    },
    openDialog(row) {
      this.title = '';
      this.dialogVisible = true;
      this.title = row.tableName;
    },
    exportHandle(row) {
      var params = qs.stringify({
        'token': Cookies.get('token'),
        ...this.dataForm
      });
      window.location.href = `${this.$host}${this.mixinViewModuleOptions.exportURL}${'\\' + row.tableName}?${params}`;
    },
    codeBatch() {
      var params = qs.stringify({
        'token': Cookies.get('token'),
        ...this.dataForm
      });
      window.location.href = `${this.$host}${this.mixinViewModuleOptions.exportURL}${'\\codeBatch'}${'\\' + this.tables}?${params}`;
    },
    getDefinedPackage() {
      this.$http.post('/generatior/tableinformation/generateInformation' ).then(res => {
        if (res.data.code !== 0) {
          return this.$message.error(res.data.msg);
        } else {
          console.log(res.data.data);
          this.codeForm = res.data.data;
        }
      }).catch((err) => {
      });
    }
  }
};
</script>

<style scoped>
.generator-box {
  background-color: #ffffff;
  width: 100%;
  padding-top: 0px 10px;
}

.generator-search-form {
  margin: 10px 10px 10px 10px;
  padding: 20px 20px 10px 20px;
  border-color: rgba(0, 0, 0, 0.1);
  border-width: 0.1px;
  border-style: solid;
}

.generator-search-button {
  padding: 10px 20px 10px 20px;
}

.generator-pagination {
  display: flex;
  align-items: center;
  background-color: rgb(253, 253, 253);
  justify-content: center;
}

.generator-search-table {
  border-color: rgba(0, 0, 0, 0.1);
  margin: 10px 10px 10px 10px;
}

.generator-container {
  height: 100%;
  display: flex;
  background-color: #FFFFFF;
  margin-right: 20px;
}

#generatorDialog .el-dialog__body {
  padding: 0px;
}
</style>
