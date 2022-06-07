<template>
  <div class="operationLogManage-container">
    <el-container>
      <el-main>
        <div class="filter_container">
          <el-form ref="dataForm" :model="dataForm" :inline="true">
            <el-form-item label="操作员名称">
              <el-input v-model="dataForm.operUserName" placeholder="请输入操作员名称" class="w200" clearable />
            </el-form-item>
            <el-form-item label="操作模块">
              <el-input v-model="dataForm.operModul" placeholder="请输入操作模块" class="w200" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button type="primary" plain icon="el-icon-refresh" @click="reset()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="page_addrlist">
          <el-table :data="dataList">
            <el-table-column prop="operModul" label="操作模块" show-overflow-tooltip="true" min-width="90px" align="center"></el-table-column>
            <el-table-column prop="operType" label="操作类型" show-overflow-tooltip="true" min-width="90px" align="center"></el-table-column>
            <el-table-column prop="operDesc" label="操作描述" show-overflow-tooltip="true" min-width="90px" align="center"></el-table-column>
            <el-table-column prop="operUserName" label="操作员名称" show-overflow-tooltip="true" min-width="90px" align="center"></el-table-column>
            <el-table-column prop="operMethod" label="操作方法" show-overflow-tooltip="true" min-width="90px" align="center"></el-table-column>
            <el-table-column prop="operUri" label="请求URI" show-overflow-tooltip="true" min-width="90px" align="center"></el-table-column>
            <el-table-column prop="operIp" label="请求IP" show-overflow-tooltip="true" min-width="90px" align="center"></el-table-column>
            <el-table-column prop="operVer" label="版本号" show-overflow-tooltip="true" min-width="90px" align="center"></el-table-column>
            <el-table-column prop="operCreateTime" label="操作时间" show-overflow-tooltip="true" min-width="90px" align="center"></el-table-column>
            <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="120px">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="showDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 弹窗, 新增 / 修改 -->
          <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshDataList"></add-or-update>
        </div>
      </el-main>
      <el-footer height="100px">
        <div class="operationLogManage-pagination">
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
import AddOrUpdate from './view-operationLog';
export default {
  components: {
    pagination,
    AddOrUpdate
  },
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: 'system/operationlog/page',
        getDataListIsPage: true,
        deleteURL: 'system/operationlog',
        deleteIsBatch: false,
        activatedIsNeed: false
      },
      dataForm: {
        operUserName: '',
        operModul: ''
      },
      order: 'desc',
      orderField: 'id'
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
      this.dataForm.operUserName = '';
      this.dataForm.operModul = '';
      this.getDataList();
    },
    handleSizeChange(e) {
      this.limit = e;
      this.getDataList();
    },
    refreshDataList() {
      this.getDataList();
    },
    showDetail(row){
      this.$refs.addOrUpdate.visible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm = JSON.parse(JSON.stringify(row));
      })
    }
  }
}
</script>

<style>
.operationLogManage-container {
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

.page_addrlist {
  border-color: rgba(0, 0, 0, 0.1);
  margin: 10px 10px 10px 10px;
}

.operationLogManage-pagination {
  display: flex;
  align-items: center;
  background-color: rgb(253, 253, 253);
  justify-content: center;
}
</style>
