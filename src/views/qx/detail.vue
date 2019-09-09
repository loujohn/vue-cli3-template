<template>
  <div class="qx-detail">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>区县</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'qx-list' }"
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
      <div class="filter">
        <el-row :gutter="30">
          <el-col :span="4">
            <span class="label">调查人员:</span>
            <el-select v-model="form.dcry" :size="size"></el-select>
          </el-col>
          <el-col :span="4">
            <span class="label">图斑编号:</span>
            <el-select v-model="form.tbbh" :size="size"></el-select>
          </el-col>
          <el-col :span="4">
            <span class="label">调查时间:</span>
            <el-select v-model="form.dcsj" :size="size"></el-select>
          </el-col>
          <el-col :span="4">
            <span class="label">审核结果:</span>
            <el-select v-model="form.shjg" :size="size"></el-select>
          </el-col>
          <el-col :span="4">
            <span class="label">到期时间:</span>
            <el-select v-model="form.dqsj" :size="size"></el-select>
          </el-col>
        </el-row>
      </div>
      <el-table header-row-class-name="customer-table-header" :data="list">
        <el-table-column
          v-for="(item, index) in fields"
          :key="index"
          :label="item.fieldAlias"
          :prop="`referenceInfo.fields[${item.fieldName}]`"
        ></el-table-column>
        <el-table-column
          label="调查人员"
          prop="referenceInfo.surverUserName"
        ></el-table-column>
        <el-table-column label="调查时间" prop="surveyTime"></el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span :class="getClass(scope.row.checkFlowStage)">{{
              scope.row.checkFlowStage | checkStatus
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.checkFlowStage === 1"
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
          :page-count="params.pageIndex"
          :small="true"
          background
          :pager-count="5"
          @current-change="handleCurrentPageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :visible="showDialog"
      :show-close="false"
      custom-class="my-dialog"
      width="1100px"
    >
      <v-review @close="close" :data="detail" />
    </el-dialog>
  </div>
</template>

<script>
import customerCard from 'components/card/card';
import vReview from 'components/review/review';
import list from 'mixins/list';
import { task } from 'api';
import { checkStatus, getClass } from 'filters';
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
      form: {
        dcry: '',
        tbbh: '',
        dcsj: '',
        scjg: '',
        dqsj: '',
      },
      size: 'small',
      fields: [],
      detail: {},
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
  filters: {
    checkStatus,
  },
  methods: {
    getClass,
    open() {
      this.showDialog = true;
    },
    close() {
      this.showDialog = false;
    },
    async getTaskField() {
      const params = { taskId: this.id };
      const fields = await task.getTaskField(params);
      this.fields = fields.filter(e => !e.isSpace);
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
      this.detail = data;
      this.showDialog = true;
    },
    handleCurrentPageChange(val) {
      this.params.pageIndex = val;
      this.getList();
    },
  },
};
</script>

<style lang="scss">
.qx-detail {
  padding: 30px 40px;
  padding-top: 0;
  .list {
    background-color: $base-color;
    .filter {
      padding: 15px 20px;
      .label {
        width: 60px;
        font-size: $font-sm;
        padding-right: 8px;
      }
      .el-select {
        width: calc(100% - 68px);
        .el-input__inner {
          background-color: #f8f8f8;
        }
      }
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
  .no-survey {
    color: #909399;
  }
  .qx-no-check {
    color: #e6a23c;
  }
  .qx-no-pass {
    color: #f56c6c;
  }
  .qx-has-passed {
    color: #409eff;
  }
  .sj-no-pass {
    color: #f56c6c;
  }
  .sj-has-passed {
    color: #67c23a;
  }
}
</style>
