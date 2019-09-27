<template>
  <div class="qx-detail">
    <div class="my-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          ><i class="el-icon-s-home"></i> 区县</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ name: 'qx-list' }"
          >任务列表</el-breadcrumb-item
        >
        <el-breadcrumb-item>任务详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
            <el-select
              v-model="form.surveyUserId"
              :size="size"
              @change="getList(form)"
              clearable
            >
              <el-option
                v-for="item in surveyUserList"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <!-- <el-col :span="4">
            <span class="label">图斑编号:</span>
            <el-select
              v-model="form.tbbh"
              :size="size"
            ></el-select>
          </el-col> -->
          <el-col :span="4">
            <span class="label">审核结果:</span>
            <el-select
              v-model="form.checkFlowStage"
              @change="getList(form)"
              :size="size"
              clearable
            >
              <el-option
                v-for="item in stageList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="label">调查时间:</span>
            <el-date-picker
              v-model="time"
              type="daterange"
              align="right"
              @change="timeChange"
              :size="size"
              unlink-panels
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-col>
          <!-- <el-col :span="4">
            <span class="label">到期时间:</span>
            <el-select
              v-model="form.dqsj"
              :size="size"
            ></el-select>
          </el-col> -->
        </el-row>
      </div>
      <el-table
        header-row-class-name="customer-table-header"
        :data="list"
        style="width: 100%;"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          v-for="(item, index) in fields"
          :key="index"
          :label="item.fieldAlias"
          :prop="`referenceInfo.fields[${item.fieldName}]`"
          :width="getWidth(item.fieldAlias)"
        ></el-table-column>
        <el-table-column
          label="调查人员"
          prop="referenceInfo.surverUserName"
        ></el-table-column>
        <el-table-column label="调查时间" prop="surveyTime" width="160"></el-table-column>
        <el-table-column label="阶段">
          <template slot-scope="scope">
            <span :class="getClass(scope.row.checkFlowStage)">{{
              scope.row.checkFlowStage | checkStatus
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.checkFlowStage === 1"
              type="text"
              size="mini"
              @click="getTaskDetail(scope.row)"
              >审核</el-button
            >
            <el-button
              v-else
              type="text"
              size="mini"
              style="color: #999"
              @click="getTaskDetail(scope.row)"
              >查看</el-button
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
      width="1300px"
    >
      <v-review
        @close="close"
        @refresh="refresh"
        :data="detail"
        type="qx"
        :operator="op"
      />
    </el-dialog>
  </div>
</template>

<script>
import customerCard from 'components/card/card';
import vReview from 'components/review/review1';
import list from 'mixins/list';
import { checkStatus, getClass } from 'filters';
import { task, survey } from 'api';
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
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      stageList: [
        {
          label: '未调查',
          value: 0,
        },
        {
          label: '区县未审核',
          value: 1,
        },
        {
          label: '区县未通过',
          value: 2,
        },
        {
          label: '区县已通过',
          value: 3,
        },
        {
          label: '市级未通过',
          value: 4,
        },
        {
          label: '市级已通过',
          value: 5,
        },
      ],
      data: [
        { name: '总图斑数', num: 0 },
        { name: '已完成', num: 0 },
        { name: '待审核', num: 0 },
        { name: '调查中', num: 0 },
      ],
      time: null,
      surveyUserList: [],
      form: {
        surveyUserId: null,
        surveyTimeMin: null,
        surveyTimeMax: null,
        checkFlowStage: null,
      },
      size: 'small',
      fields: [],
      detail: {},
      op: '',
    };
  },
  created() {
    this.getTaskField();
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
      this.getSurveyUserList();
      this.getTaskStatistic();
    });
  },
  filters: {
    checkStatus,
  },
  methods: {
    getClass,
    getWidth(name) {
      switch (name) {
        case '矿山名称':
          return '350px';
        case '地块编号':
        case '行政区名称':
          return '100px';
        default:
          return null;
      }
    },
    open() {
      this.showDialog = true;
    },
    close() {
      this.showDialog = false;
    },
    refresh() {
      this.getList();
    },
    async getTaskField() {
      const params = { taskId: this.id };
      const fields = await task.getTaskField(params);
      this.fields = fields.filter(e => !e.isSpace);
    },
    async getSurveyUserList() {
      const res = await survey.getSurveyUserList({ id: this.id });
      if (res.code.toString() === '200') {
        this.surveyUserList = res.data;
      }
    },
    async getList(searchParams) {
      for (const key in searchParams) {
        if (searchParams.hasOwnProperty(key)) {
          let element = searchParams[key];
          if (!element && element !== 0) {
            searchParams[key] = null;
          }
        }
      }
      const params = {
        ...searchParams,
        ...this.params,
        taskId: this.id,
      };
      const data = await task.getTaskRecordList(params);
      const { dataList, totalCount } = data;
      this.list = dataList;
      this.totalCount = totalCount;
    },
    async getTaskDetail(item) {
      const { id, checkFlowStage } = item;
      let op;
      switch (checkFlowStage) {
        case 1:
          op = 'check';
          break;
        case 4:
          op = 'recheck';
          break;
        default:
          op = 'view';
          break;
      }
      const data = await task.getTaskDetail({ id });
      this.detail = data;
      this.op = op;
      this.showDialog = true;
    },
    handleCurrentPageChange(val) {
      this.params.pageIndex = val;
      this.getList(this.form);
    },
    timeChange(val) {
      this.form.surveyTimeMin = val ? val[0] : null;
      this.form.surveyTimeMax = val ? val[1] : null;
      this.getList(this.form);
    },
    async getTaskStatistic() {
      let data = await task.getTaskStatistic({ taskId: this.id });
      this.data[0].num = data.total;
      this.data[1].num = data.finished;
      this.data[2].num = data.todo;
      this.data[3].num = data.surveying;
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
