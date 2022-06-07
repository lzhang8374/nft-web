<template>
  <el-dialog :visible.sync="visible" :title="$t('schedule.log')" :close-on-click-modal="false" :close-on-press-escape="false" width="75%">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.jobId" :placeholder="$t('定时任务Id')" clearable></el-input>
      </el-form-item>
			<el-form-item>
			  <el-input v-model="dataForm.jobName" :placeholder="$t('bean名称')" clearable></el-input>
			</el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      @sort-change="dataListSortChangeHandle"
      height="460"
      style="width: 100%;">
      <el-table-column prop="jobId" label="任务ID" header-align="center" align="center" width="80"></el-table-column>
      <el-table-column prop="beanName" label="bean名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="params"  label="参数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">成功</el-tag>
          <el-tag v-else type="danger" size="small" @click.native="showErrorInfo(scope.row.id)" style="cursor: pointer;">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="times" label="耗时(单位: 毫秒)" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="执行时间" header-align="center" align="center" width="180"></el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle">
    </el-pagination>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module';
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      visible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/sys/scheduleLog/page',
        getDataListIsPage: true
      },
      dataForm: {
        jobId: '',
				jobName: ''
      }
    };
  },
  methods: {
    init () {
      this.visible = true;
      this.getDataList();
    },
    // 失败信息
    showErrorInfo (id) {
      this.$http.get(`/sys/scheduleLog/${id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.$alert(res.data.error);
      }).catch(() => {});
    }
  }
};
</script>
