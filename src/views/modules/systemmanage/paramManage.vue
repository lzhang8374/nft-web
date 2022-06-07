<template>
  <div class="manage-container">
    <div>
      <el-form :inline="true">
        <el-form-item label="参数名称:">
          <el-input v-model="dataForm.name" placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item label="参数编码:">
          <el-input v-model="dataForm.code" placeholder="请输入参数编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manage-add-or-update-button">
      <el-button icon="el-icon-plus" type="primary" @click="openDialog('add')">新增</el-button>
    </div>
    <div>
      <el-table :data="dataList">
        <!-- 表格展示的列 -->        
        <el-table-column label="参数编码" align="center" prop="code">
        </el-table-column>
        <el-table-column label="参数名称" align="center" prop="name">
        </el-table-column>
        <el-table-column label="配置值" align="center" prop="value" >
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="openDialog('edit',scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteModel(scope.row)">删除</el-button>
            <el-button type="text" @click="openDialog('check',scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <v-pagination @currentChange="pageCurrentChangeHandle" @handleSizeChange="handleSizeChange" :current-page="page"
        :page-size="limit" :total="total"></v-pagination>
    </div>
    <el-dialog width="830px" :title="dialogTitle" :visible="dialogVisible"
      @close="closeDialog" destroy-on-close>
      <addParam v-if="dialogTitle == '新增'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm">
      </addParam>
      <editParam v-else-if="dialogTitle == '编辑'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm">
      </editParam>
	  <checkParam v-else-if="dialogTitle == '查看'" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm">
	  </checkParam>
    </el-dialog>
  </div>
</template>

<script>
  import mixinViewModule from '@/mixins/view-module';
  import vPagination from '@/components/page/Pagination.vue';
  import addParam from './components/addParam.vue';
  import editParam from './components/editParam.vue';
  import checkParam from './components/checkParam.vue';
  //新增/修改/查看子组件
  export default {
    components: {
      vPagination,
      addParam,
      editParam,
	  checkParam
    },
    mixins: [mixinViewModule],
    data() {
      return {
        mixinViewModuleOptions: {
          getDataListURL: 'param/param/page',
          activatedIsNeed: false,
          getDataListIsPage: true,
        },
        //查询条件Form
        dataForm: {
          id:"",
          name:"",
          code:"",
          value:"",
		  remark:""
        },
        //新增/修改Form
        addOrUpdateForm: {
          id:"",
          name:"",
          code:"",
          value:"",
          remark:""
        },
        dialogVisible: false,
        dialogTitle: '',
        value1: true,
      };
    },
    created() {
      this.init()
    },
    methods: {
      //初始化
      init() {
        this.getData()
      },
      //获取数据列表
      getData() {
        this.getDataList()
      },
      //重置查询条件Form
      reset() {
        this.dataForm = {
          name:"",
          code:"",
        }
        this.getData();
      },
      //重置新增修改Form
      resetAddOrUpdateForm() {
        this.page = 1
        this.addOrUpdateForm = {
          name:"",
          code:"",
        }
      },
      //查询按钮
      search() {
        this.page = 1
        this.getData();
      },

      //打开新增/修改对话框
      openDialog(type, row) {
        if (type == 'add') {
          this.dialogTitle = '新增'
          this.resetAddOrUpdateForm()
          this.dialogVisible = true
        } else if (type == 'edit') {
          this.dialogTitle = '编辑'
          this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
          this.dialogVisible = true
        }
		else if (type == 'check') {
		  this.dialogTitle = '查看'
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
      deleteModel(row) {
        this.$confirm('确认删除?', '提示', {
          cancelButtonClass: "btn-custom-cancel",
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.$http('param/param/deleteParam/'+row.id).then(({
            data: res
          }) => {
            if (res.code != 0) {
              return this.$message.error(res.msg)
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
