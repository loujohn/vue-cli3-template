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
      <el-table header-row-class-name="customer-table-header" :data="tableData">
        <el-table-column label="图斑编号" prop="tbbh"></el-table-column>
        <el-table-column label="图斑名称" prop="tbmc"></el-table-column>
        <el-table-column label="图斑类型" prop="tblx"></el-table-column>
        <el-table-column label="截止日期" prop="endTime"></el-table-column>
        <el-table-column label="描述信息" prop="msxx"></el-table-column>
        <el-table-column label="备注" prop="bz"></el-table-column>
        <el-table-column label="调查人员" prop="dcry"></el-table-column>
        <el-table-column label="调查事件" prop="dcsj"></el-table-column>
        <el-table-column label="调查状态">
          <template>
            <span>已完成</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template>
            <el-button type="text" size="mini" @click="open()">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          layout="total, prev, pager, next"
          :total="100"
          :small="true"
          background
          :pager-count="5"
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
    };
  },
  methods: {
    open() {
      this.showDialog = true;
    },
    close() {
      this.showDialog = false;
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
}
</style>
