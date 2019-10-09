<template>
  <div class="progress-list">
    <div class="my-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          ><i class="el-icon-s-home"></i> 区县</el-breadcrumb-item
        >
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
      <el-table :data="list" header-row-class-name="customer-table-header">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="任务名称" prop="taskName"></el-table-column>
        <el-table-column
          width="120"
          label="总图斑数"
          prop="referenceInfo.totalRecord"
        ></el-table-column>
        <el-table-column
          width="120"
          label="完成数"
          prop="referenceInfo.completedRecord"
        ></el-table-column>
        <el-table-column label="要求完成时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.completeTime | dateFormatter }}
          </template>
        </el-table-column>
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
            <el-button type="text" size="mini" @click="toDetail(scope.row.id)"
              >详情</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="toAllocation(scope.row.id)"
              >分派</el-button
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
import { dateFormatter } from 'filters';
export default {
  name: 'qx-list',
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
  filters: {
    dateFormatter,
  },
  methods: {
    toDetail(id) {
      this.$router.push({ name: 'qx-detail', query: { id } });
    },
    toAllocation(id) {
      this.$router.push({ name: 'task-allocation', query: { id } });
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
    .el-breadcrumb {
      padding: 0px;
    }
    .el-breadcrumb__item {
      color: #fff;
      display: block;
      position: relative;
      text-decoration: none;
      background: #0094ec;
      height: 40px;
      width: 60px;
      line-height: 40px;
      padding: 0 10px 0 5px;
      text-align: center;
      margin-right: 23px;
      &:first-child {
        padding-left: 15px;
        border-radius: 4px 0 0 4px;
        &:before {
          border: none;
        }
      }

      &:before,
      &:after {
        content: '';
        position: absolute;
        top: 0;
        border: 0 solid #0094ec;
        border-width: 20px 10px;
        width: 0;
        height: 0;
      }
      &:before {
        left: -20px;
        border-left-color: transparent;
      }
      &:after {
        left: 100%;
        border-color: transparent;
        border-left-color: #0094ec;
      }

      .el-breadcrumb__inner {
        color: #fff;
      }
      .el-breadcrumb__separator {
        display: none;
      }
    }
  }
}
</style>
