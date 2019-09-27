<template>
  <div class="progress-list">
    <div class="my-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>市级</el-breadcrumb-item>
        <el-breadcrumb-item>任务列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cards">
      <customer-card
        width="24%"
        v-for="(item, index) in data"
        :key="index"
        :data="item"
      />
    </div>
    <div class="list">
      <div class="operation">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="$router.push({ name: 'sj-task' })"
        >
          新增任务
        </el-button>
      </div>
      <el-table :data="list" header-row-class-name="customer-table-header">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="任务名称" prop="taskName"></el-table-column>
        <el-table-column
          label="总图斑数"
          prop="referenceInfo.totalRecord"
        ></el-table-column>
        <el-table-column
          label="完成数"
          prop="referenceInfo.completedRecord"
        ></el-table-column>
        <el-table-column label="进度" width="350px">
          <template slot-scope="scope">
            <v-progress
              :percent="
                scope.row.referenceInfo && scope.row.referenceInfo.percent
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="mini" @click="$router.push('/sj/task')"
              >追加</el-button
            > -->
            <el-button type="text" size="mini" @click="toDetail(scope.row.id)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :total="totalCount"
          layout="total, prev, pager, next"
          :small="true"
          :pager-count="5"
          :current-page="params.pageIndex"
          background
          @current-change="handleCurrentPageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import customerCard from 'components/card/card';
import vProgress from 'components/progress/progress';
import { task } from 'api';
import list from 'mixins/list';
export default {
  name: 'sj-list',
  components: {
    customerCard,
    vProgress,
  },
  mixins: [list],
  data() {
    return {
      data: [
        { name: '总任务数', num: 0 },
        { name: '已开展任务数', num: 0 },
        { name: '总完成进度', num: '0%' },
        { name: '即将到期任务数', num: 0 },
      ],
    };
  },
  mounted() {
    this.getList();
    this.getStatistic();
  },
  methods: {
    toDetail(id) {
      this.$router.push({ name: 'sj-detail', query: { id } });
    },
    async getList() {
      const data = await task.getTaskList(this.params);
      const { dataList, totalCount } = data;
      this.list = dataList;
      this.totalCount = totalCount;
    },
    async getStatistic() {
      const data = await task.getStatistic();
      this.data[0].num = data.total;
      this.data[1].num = data.started;
      this.data[2].num = data.completeRate;
      this.data[3].num = data.expire;
    },
    handleCurrentPageChange(val) {
      this.params.pageIndex = val;
      this.getList();
    },
  },
};
</script>
<style lang="scss">
.progress-list {
  padding: 30px 40px;
  padding-top: 0;
  .list {
    background-color: $base-color;
    .operation {
      padding: 13px 20px;
      background-color: $base-color;
    }
  }
  .my-breadcrumb {
    background-color: #fff;
    border-radius: 4px;
    margin: 10px 0;
    padding: 0 20px;
  }
}
</style>
