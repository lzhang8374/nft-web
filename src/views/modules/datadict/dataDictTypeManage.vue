<template>
  <div class="dataDictTypeManage-container">
    <el-container>
      <el-main>
        <div class="filter_container">
          <el-form ref="dataForm" :model="dataForm" :inline="true">
            <el-form-item label="字典编码:">
              <el-input v-model="dataForm.typeCode" placeholder="请输入字典编码" class="w200" clearable />
            </el-form-item>
            <el-form-item label="字典名称:">
              <el-input v-model="dataForm.dictName" placeholder="请输入字典名称" class="w200" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button type="primary" plain icon="el-icon-refresh" @click="reset()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 添加按钮 -->
        <div class="action_btn">
          <el-button icon="el-icon-plus" type="primary" round @click="addOrUpdateOrDetailHandle(1)">新增</el-button>
        </div>
        <div class="page_addrlist">
          <el-table :data="dataList">
            <el-table-column prop="typeCode" label="字典编码" min-width="90px" align="center"></el-table-column>
            <el-table-column prop="dictName" label="字典名称" min-width="90px" align="center"></el-table-column>
            <el-table-column prop="type" label="字典类型" header-align="center" align="center"  min-width="120px"
                             :show-overflow-tooltip="true" :formatter="changeDataType"></el-table-column>
            <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="120px">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="manageClick(scope.row)">管理</el-button>
                <el-button type="text" size="small" @click="editDataDictType(2, scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteDataDictType(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 弹窗, 新增 / 修改 -->
          <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshDataList"></add-or-update>
        </div>
      </el-main>
      <el-footer height="100px">
        <div class="dataDictTypeManage-pagination">
          <pagination @currentChange="pageCurrentChangeHandle" @handleSizeChange="handleSizeChange" :current-page="page" 
                      :page-size="limit" :total="total"></pagination>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import mixinViewModule from '@/mixins/view-module';
  import pagination from '@/components/page/Pagination';
  import AddOrUpdate from './add-update-dataDictType';
  export default {
    components: {
      pagination,
      AddOrUpdate
    },
    mixins: [mixinViewModule],
    data() {
      return {
        mixinViewModuleOptions: {
          getDataListURL: 'api/dicttype/page',
          getDataListIsPage: true,
          deleteURL: 'api/dicttype',
          deleteIsBatch: false,
          activatedIsNeed: false,
        },
        dataForm: {
          typeCode: '',
          dictName: ''
        },
        dataType: [{
          value: 0,
          label: '元数据'
        }, {
          value: 1,
          label: '业务数据'
        }]
      };
    },
    created() {
      this.getDataList();
      console.log(this.dataList);
    },
    methods: {
      search() {
        this.page = 1;
        this.getDataList();
      },
      reset() {
        this.page = 1;
        this.dataForm.typeCode = '';
        this.dataForm.dictName = '';
        this.getDataList();
      },
      changeDataType(val) {
        for (let item of this.dataType) {
          if (val.type === item.value) {
            return item.label;
          }
        }
        return '';
      },
      manageClick(row) {
        this.$router.push({
          path: '/dataDictVauleManage',
          query: {
            dictTypeCode: row.typeCode
          }
        });
      },
      deleteDataDictType(id) {
        this.$http.get(`/api/dicttype/${id}`).then(res => {
          if (res.data.code != 0) {
            return this.$message.error(res.data.msg);
          }
          if (res.data.data === true) {
            return this.$message.error('设备正在使用,无法删除');
          }
          this.deleteHandle(id);
        }).catch((err) => {});
      },
      handleSizeChange(e) {
        this.limit = e;
        this.getDataList();
      },
      refreshDataList() {
        this.getDataList();
      },
      editDataDictType(op, row){
        this.$refs.addOrUpdate.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.dataForm = JSON.parse(JSON.stringify(row));
          this.$refs.addOrUpdate.dataForm.op = op;
          this.$refs.addOrUpdate.init();
        });
      }
    }
  }
</script>

<style>
  .dataDictTypeManage-container {
    display: flex;
    background-color: #FFFFFF;
    margin-right: 20px;
  }

  .filter_container {
    margin: 10px 10px 10px 10px;
    padding: 20px 20px 10px 20px;
    border-color: rgba(0, 0, 0, 0.1);
    border-width: 0.1px;
    border-style: solid;
  }

  .action_btn {
    padding: 10px 20px 10px 20px;
  }

  .page_addrlist {
    border-color: rgba(0, 0, 0, 0.1);
    margin: 10px 10px 10px 10px;
  }

  .dataDictTypeManage-pagination {
    display: flex;
    align-items: center;
    background-color: rgb(253, 253, 253);
    justify-content: center;
  }
</style>
