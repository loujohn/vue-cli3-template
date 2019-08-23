<template>
  <div class="sj-detail">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>市级</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'sj-list' }"
        >任务列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>任务详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="cards">
      <customer-card
        v-for="(item, index) in data"
        :key="index"
        :data="item"
        width="24%"
      />
    </div>
    <div class="list">
      <div class="operation"></div>
      <el-table header-row-class-name="customer-table-header" :data="list">
        <el-table-column
          v-for="(item, index) in fields"
          :key="index"
          :label="item.fieldAlias"
          :prop="`referenceInfo.fields[${item.fieldName}]`"
        ></el-table-column>
        <el-table-column label="调查人员" prop="surveyUserId"></el-table-column>
        <el-table-column label="调查时间" prop="surveyTime"></el-table-column>
        <el-table-column label="调查状态">
          <template>
            <span>区县已审核</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="getTaskDetail(scope.row.id)"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          layout="total, prev, pager, next"
          :total="totalCount"
          :small="true"
          background
          :page-count="params.pageIndex"
          :pager-count="5"
          @current-change="handleCurrentPageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :visible="showDialog"
      :show-close="false"
      custom-class="my-dialog"
      width="60%"
    >
      <v-review @close="close" />
    </el-dialog>
  </div>
</template>

<script>
import customerCard from 'components/card/card';
import vReview from 'components/review/review';
import list from 'mixins/list';
import { task } from 'api';
export default {
  name: 'detail',
  components: {
    customerCard,
    vReview,
  },
  props: {
    id: {
      type: [Number, String],
    },
  },
  mixins: [list],
  data() {
    return {
      showDialog: false,
      data: [
        { name: '总图斑数', num: 300 },
        { name: '已完成', num: 200 },
        { name: '待审核', num: 50 },
        { name: '调查中', num: 50 },
      ],
      fields: [],
    };
  },
  created() {
    this.getTaskField();
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    open() {
      this.showDialog = true;
    },
    close() {
      this.showDialog = false;
    },
    async getTaskField() {
      const params = { taskId: this.id };
      this.fields = await task.getTaskField(params);
    },
    async getList() {
      const params = {
        ...this.params,
        taskId: this.id,
      };
      const data = await task.getTaskRecordList(params);
      const { dataList, totalCount } = data;
      this.list = dataList;
      this.totalCount = totalCount;
    },
    async getTaskDetail(id) {
      const data = await task.getTaskDetail({ id });
      console.log(data);
    },
    handleCurrentPageChange(val) {
      this.params.pageIndex = val;
      this.getTaskRecordList();
    },
  },
};
</script>

<style lang="scss">
.sj-detail {
  padding: 30px 40px;
  padding-top: 0;
  .list {
    background-color: $base-color;
    .operation {
      padding: 13px 20px;
      background-color: $base-color;
    }
  }
  .my-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
