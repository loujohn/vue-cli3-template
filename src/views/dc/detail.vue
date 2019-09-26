<template>
  <div class="dc-detail">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>调查员</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'dc-list' }"
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
    <div class="content">
      <div class="list">
        <div class="filter">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-input
                :size="size"
                placeholder="请输入关键字搜索"
                v-model="params.keyword"
              ></el-input>
            </el-col>
            <el-col :span="8">
              <span class="label">状态:</span>
              <el-select
                v-model="params.surveyStage"
                :size="size"
                @change="handleSelectChange"
              >
                <el-option
                  v-for="(item, index) in surveyStatusList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8" style="text-align: right;">
              <span class="count">已选择0项</span>
              <el-button
                :size="size"
                style="margin-left: 8px; background-color:#0e67f2;color: #fff;"
              >
                <svg-icon iconClass="upload"></svg-icon>
                全部提交
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-table
          header-row-class-name="customer-table-header"
          :data="list"
          style="width: 100%;"
        >
          <el-table-column
            type="selection"
            v-if="params.surveyStage === 1"
          ></el-table-column>
          <el-table-column
            v-for="(item, index) in fields"
            :key="index"
            :label="item.fieldAlias"
            :prop="`referenceInfo.fields[${item.fieldName}]`"
          ></el-table-column>
          <el-table-column
            label="调查人员"
            prop="referenceInfo.surverUserName"
            width="150px"
          ></el-table-column>
          <el-table-column label="状态" width="80px">
            <template slot-scope="scope">
              {{ scope.row.surveyStage | surveyStatus }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template>
              <el-button size="mini" type="text">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            layout="total, prev, pager, next"
            :total="totalCount"
            background
            :small="true"
            :page-count="5"
            @current-change="handleCurrentPageChange"
          ></el-pagination>
        </div>
      </div>
      <div class="map-container">
        <v-map style="border-radius: 3px;" />
      </div>
    </div>
  </div>
</template>
<script>
import customerCard from 'components/card/card';
import vMap from 'components/map/map';
import list from 'mixins/list';
import { surveyStatus } from 'filters';
import { task, survey } from 'api';
export default {
  name: 'dc-detail',
  components: {
    customerCard,
    vMap,
  },
  mixins: [list],
  props: {
    id: {
      type: [Number, String],
    },
  },
  data() {
    return {
      data: [
        { name: '总图斑数', num: 0 },
        { name: '已核实图斑', num: 0 },
        { name: '未核实图斑', num: 0 },
        { name: '已提交图斑', num: 0 },
      ],
      surveyStatusList: [
        { name: '未调查', value: 0 },
        { name: '未提交', value: 1 },
        { name: '审核中', value: 2 },
        { name: '审核失败', value: 3 },
        { name: '已完成', value: 4 },
      ],
      params: {
        pageIndex: 1,
        pageSize: 10,
        surveyStage: 0,
        keyword: '',
      },
      fields: [],
      size: 'small',
    };
  },
  created() {
    this.getTaskField();
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
      this.getTaskStatistic();
    });
  },
  filters: {
    surveyStatus,
  },
  methods: {
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
    async getTaskStatistic() {
      const params = {
        taskId: this.id,
      };
      const data = await survey.taskStatistics(params);
      this.data[0].num = data.total;
      this.data[1].num = data.checked;
      this.data[2].num = data.unchecked;
      this.data[3].num = data.submit;
    },
    handleSelectChange(val) {
      this.params.status = val;
      this.params.pageIndex = 1;
      this.getList();
    },
    handleCurrentPageChange(val) {
      this.params.pageIndex = val;
      this.getList();
    },
  },
};
</script>

<style lang="scss">
.dc-detail {
  padding: 30px 40px;
  padding-top: 0;
  height: 100%;
  box-sizing: border-box;
  .content {
    display: flex;
    justify-content: space-between;
    height: calc(100% - 150px);
    .list,
    .map-container {
      width: 49.3%;
      height: 100%;
      border-radius: 3px;
    }
    .list {
      background-color: $base-color;
      overflow: auto;
      .filter {
        padding: 15px 20px;
        .label {
          width: 60px;
          font-size: $font-sm;
          padding-right: 8px;
        }
        .el-input {
          .el-input__inner {
            background-color: #f8f8f8;
          }
        }
        .el-select {
          width: calc(100% - 68px);
          .el-input__inner {
            background-color: #f8f8f8;
          }
        }
        .count {
          color: #0e67f2;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
