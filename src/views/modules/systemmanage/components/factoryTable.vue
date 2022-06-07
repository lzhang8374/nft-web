<template>
  <div class="factoryTable-container">
    <div class="factoryTable-search-form">
      <el-form :inline="true" label-width="100px">
        <!-- 查询条件 -->
        <el-row>
          <el-form-item label="组织编号">
            <el-input v-model="dataForm.code"></el-input>
          </el-form-item>
          <el-form-item label="组织名称">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item label="组织类型">
            <el-select v-model="dataForm.unitType" style="width: 100%;">
              <el-option label="工厂" value="01"></el-option>
              <el-option label="车间" value="02"></el-option>
			  <el-option label="区域" value="03"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="负责人">
            <el-input v-model="dataForm.contractName"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="dataForm.contractTelphone"></el-input>
          </el-form-item>
		  <el-form-item style="padding-left: 30px;">
          <el-button icon="el-icon-search" type="primary" round @click="search()">查询</el-button>
          <el-button icon="el-icon-refresh" type="primary" round @click="reset()">重置</el-button>
		  </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="factoryTable-search-table">
      <div>
        <el-table :data="dataList">
          <!-- 表格展示的列 -->
          <el-table-column label="组织编号" align="center" prop="code">
          </el-table-column>
          <el-table-column label="组织名称" align="center" prop="name">
          </el-table-column>
          <el-table-column label="父级组织" align="center" prop="parentUnitName">
          </el-table-column>
          <el-table-column label="负责人" align="center" prop="contractName">
          </el-table-column>
          <el-table-column label="联系电话" align="center" prop="contractTelphone">
          </el-table-column>
          <el-table-column label="位置" align="center" prop="position">
          </el-table-column>
          <el-table-column label="创建人" align="center" prop="creator">
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime">
          </el-table-column>
          <!-- <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="openDialog('check',scope.row)">查看</el-button>
              <el-button type="text" @click="openDialog('edit',scope.row)">编辑</el-button>
              <el-button type="text" @click="deleteUser(scope.row)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="factoryTable-pagination">
        <v-pagination @currentChange="pageCurrentChangeHandle" @handleSizeChange="handleSizeChange" :current-page="page"
          :page-size="limit" :total="total"></v-pagination>
      </div>
    </div>
    <el-dialog id="factoryDialog2" width="430px" :title="dialogTitle" :visible="dialogVisible" @close="closeDialog"
      destroy-on-close>
      <productUnitEdit v-if="dialogTitle == '编辑'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm">
      </productUnitEdit>
    </el-dialog>
  </div>
</template>

<script>
  import mixinViewModule from '@/mixins/view-module';
  import vPagination from '@/components/page/Pagination.vue';
  import productUnitEdit from './productUnitEdit.vue'
  export default {
    components: {
      vPagination,
      productUnitEdit
    },
    mixins: [mixinViewModule],
    data() {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/unit/factoryunit/getFactoryUnitPage',
          activatedIsNeed: false,
          getDataListIsPage: true,
        },
        //查询条件Form
        dataForm: {
          id: '',
          name: '',
          code: '',
          unitType: '',
          parentUnitId: '',
          contractName: '',
          contractTelphone: '',
          address: '',
          longitude: '',
          latitude: '',
        },
        //新增/修改Form
        addOrUpdateForm: {
          id: '',
          name: '',
          code: '',
          unitType: '',
          parentUnitId: '',
          contractName: '',
          contractTelphone: '',
          address: '',
          longitude: '',
          latitude: '',
        },

        dialogVisible: false,
        dialogTitle: '',
        treeDate: [],
        filterText: "",
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        topologInfo: {}
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    created() {
      this.init()
    },
    methods: {
      //获取当前节点
      handleNodeClick(data) {
        this.getTopolog(data)
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      //初始化
      init() {
        this.getData()
      },
      getData() {
        this.getDataList()
      },
      //重置查询条件Form
      reset() {
        this.dataForm.name = ''
        this.dataForm.code = ''
        this.dataForm.contractName = ''
        this.dataForm.contractTelphone = ''
        this.dataForm.unitType = ''
        this.getData();
      },
      //重置新增修改Form
      resetAddOrUpdateForm() {
        this.page = 1
        this.addOrUpdateForm = {
          id: '',
          staffId: '',
          creator: '',
          createTime: '',
          updater: '',
          updateTime: '',
          teamId: '',
          isDeleted: '',
          staffName: '',
        }
      },
      //查询按钮
      search() {
        this.page = 1
        this.getData();
      },

      //打开新增/修改对话框
      openDialog(type, row) {
        if (type == 'edit') {
          this.dialogTitle = '编辑'
          this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
          this.dialogVisible = true
        }
      },
      //关闭新增/修改对话框
      closeDialog() {
        this.dialogVisible = false
        this.dialogTitle = ''
        this.getData()
      },
      //删除按钮
      deleteUser(row) {
        this.$confirm('确认删除?', '提示', {
          cancelButtonClass: "btn-custom-cancel",
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.$http('/unit/factoryunit/deleteFactoryUnit/' + row.id).then(({
            data: res
          }) => {
            if (res.code != 0) {
              return this.$message.error(res.data.msg)
            } else {
              this.getData()
              this.$message.success("删除成功!")
            }
          }).catch((err) => {})
        }).catch((err) => {})
      },
      handleSizeChange(e) {
        this.limit = e
        this.getDataList()
      },
    }
  };
</script>


<style>
  .factoryTable-box {
    background-color: #ffffff;
    width: 100%;
    padding-top: 0px 10px;
  }

  .factoryTable-search-form {
    margin: 10px 10px 10px 10px;
    padding: 20px 20px 10px 20px;
    border-color: rgba(0, 0, 0, 0.1);
    border-width: 0.1px;
    border-style: solid;
	text-align: left;
  }

  .factoryTable-search-button {
    padding: 10px 20px 10px 20px;
  }

  .factoryTable-pagination {
    display: flex;
    align-items: center;
    background-color: rgb(253, 253, 253);
    justify-content: center;
  }

  .factoryTable-search-table {
    border-color: rgba(0, 0, 0, 0.1);
    margin: 10px 10px 10px 10px;
  }

  .factoryTable-container {
    height: 100%;
    display: flex;
    background-color: #FFFFFF;
    margin-right: 20px;
    flex-direction: column;
  }

  #factoryDialog2 .el-dialog__body {
    padding: 10px;
  }
</style>
