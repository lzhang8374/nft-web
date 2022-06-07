<template>
  <div class="scheduleManage-container">
    <!-- 主体部分 -->
    <el-row>
      <div>
        <el-form label-width="100px" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="bean名称">
            <el-input v-model="dataForm.beanName" placeholder="bean名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="el-icon-delete" @click="deleteHandle()">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="el-icon-video-pause" @click="pauseHandle()">暂停</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="el-icon-refresh-left" @click="resumeHandle()">恢复</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="el-icon-switch-button" @click="runHandle()">执行</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-bell" @click="logHandle()" class="btn-font-reset">日志列表</el-button>
          </el-form-item>
        </el-form>
        <div class="button-add">
          <el-button type="primary" icon="el-icon-circle-plus-outline"  @click="addOrUpdateHandle()"
            >新增</el-button
          >
        </div>
      </div>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
      >
        <el-table-column type="selection" header-align="center" align="center" width="50"> </el-table-column>
        <el-table-column prop="beanName" label="bean名称" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="params" label="参数" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="cronExpression" label="Cron 表达式" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="status" label="状态" sortable="custom" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" size="small">正常</el-tag>
            <el-tag v-else size="small" type="danger">暂停</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑 </el-button>
            <el-button type="text" size="small" @click="pauseHandle(scope.row.id)">暂停</el-button>
            <el-button type="text" size="small" @click="resumeHandle(scope.row.id)">重启</el-button>
            <el-button type="text" size="small" @click="runHandle(scope.row.id)">运行</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        @handleSizeChange="pageSizeChangeHandle"
        @currentChange="pageCurrentChangeHandle"
      >
      </pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"> </add-or-update>
      <!-- 弹窗, 日志列表 -->
      <log v-if="logVisible" ref="log"></log>
    </el-row>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module';
import AddOrUpdate from './schedule-add-or-update';
import Log from './schedule-log';
import pagination from '../../../components/page/Pagination.vue';
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/schedule/page',
        getDataListIsPage: true,
        deleteURL: '/sys/schedule',
        deleteIsBatch: true
      },
      dataForm: {
        beanName: ''
      },
      logVisible: false
    };
  },
  components: {
    AddOrUpdate,
    Log,
    pagination
  },
  methods: {
    // 暂停
    pauseHandle(id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        });
      }
      this.$confirm(
        '确认立即暂停已选中的任务?',
        '暂停任务',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http
            .put('/sys/schedule/pause', id ? [id] : this.dataListSelections.map((item) => item.id))
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success({
                message: res.msg,
                duration: 500,
                onClose: () => {
                  this.getDataList();
                }
              });
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 恢复
    resumeHandle(id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        });
      }
      this.$confirm(
        '确认立即恢复已选中的任务?',
        '恢复任务',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http
            .put('/sys/schedule/resume', id ? [id] : this.dataListSelections.map((item) => item.id))
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success({
                message: res.msg,
                duration: 500,
                onClose: () => {
                  this.getDataList();
                }
              });
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 执行
    runHandle(id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message.warning()({
          message: this.$t('prompt.deleteBatch'),
          duration: 500
        });
      }
      this.$confirm(
        '确认立即执行已选中的任务?',
        '执行任务',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
          this.$http
            .put('/sys/schedule/run', id ? [id] : this.dataListSelections.map((item) => item.id))
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success({
                message: res.msg,
                duration: 500,
                onClose: () => {
                  this.getDataList();
                }
              });
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 日志列表
    logHandle() {
      this.logVisible = true;
      this.$nextTick(() => {
        this.$refs.log.init();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.button-add {
  float: right;
  margin-bottom: 10px;
}
.scheduleManage-container{
  background-color: #FFFFFF;
  height: 100%;
  padding: 30px 10px 10px 10px;
}
</style>
