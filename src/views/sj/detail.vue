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
        :data="item"
        :key="index"
        v-for="(item, index) in data"
        width="24%"
      />
    </div>
    <div class="list">
      <div class="filter">
        <el-row :gutter="30">
          <el-col :span="4">
            <span class="label">调查人员:</span>
            <el-select :size="size" v-model="form.dcry" value></el-select>
          </el-col>
          <el-col :span="4">
            <span class="label">图斑编号:</span>
            <el-select :size="size" v-model="form.tbbh" value></el-select>
          </el-col>
          <el-col :span="4">
            <span class="label">调查时间:</span>
            <el-select :size="size" v-model="form.dcsj" value></el-select>
          </el-col>
          <el-col :span="4">
            <span class="label">审核结果:</span>
            <el-select :size="size" v-model="form.shjg" value></el-select>
          </el-col>
          <el-col :span="4">
            <span class="label">所属区县:</span>
            <el-select :size="size" v-model="form.ssqx" value></el-select>
          </el-col>
        </el-row>
      </div>
      <el-table :data="list" header-row-class-name="customer-table-header">
        <el-table-column
          :key="index"
          :label="item.fieldAlias"
          :prop="`referenceInfo.fields[${item.fieldName}]`"
          v-for="(item, index) in fields"
        ></el-table-column>
        <el-table-column
          label="调查人员"
          prop="referenceInfo.surverUserName"
        ></el-table-column>
        <el-table-column label="调查时间" prop="surveyTime"></el-table-column>
        <el-table-column label="调查状态">
          <template slot-scope="scope">
            <span>{{ scope.row.surveyStatus | sjSurveyStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <el-button
              @click="getTaskDetail(scope.row.id)"
              size="mini"
              type="text"
            >
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :page-count="params.pageIndex"
          :pager-count="5"
          :small="true"
          :total="totalCount"
          @current-change="handleCurrentPageChange"
          background
          layout="total, prev, pager, next"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :show-close="false"
      :visible="showDialog"
      custom-class="my-dialog"
      width="60%"
    >
      <v-review :data="detail" @close="close" />
    </el-dialog>
  </div>
</template>
<script>
import customerCard from 'components/card/card';
import vReview from 'components/review/review';
import list from 'mixins/list';
import { task } from 'api';
import { sjSurveyStatus } from 'filters';
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
      form: {
        tbbh: '',
        dcry: '',
        dcsj: '',
        shjg: '',
        ssqx: '',
      },
      size: 'small',
      detail: {},
    };
  },
  filters: {
    sjSurveyStatus,
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
.sj-detail {
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
}
</style>
