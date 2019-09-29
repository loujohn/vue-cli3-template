<template>
  <div class="dc-detail">
    <div class="my-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          ><i class="el-icon-s-home"></i> 调查员</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ name: 'dc-list' }"
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
                clearable
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
              <span class="count">已选择{{ count }}项</span>
              <el-button
                :size="size"
                style="margin-left: 8px; background-color:#0094ec;color: #fff;"
                @click="submit()"
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
          ref="table"
          @row-click="handleRowClick"
          @select="handleTaskSelect"
          @select-all="handleTaskSelectAll"
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
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="toParticular(scope.row.id)"
                >详情</el-button
              >
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
        // surveyStage: 1,
        surveyState: '',
        keyword: '',
      },
      selectedTasks: [],
      fields: [],
      size: 'small',
    };
  },
  computed: {
    count() {
      return this.selectedTasks.length;
    },
  },
  watch: {
    id(val) {
      this.getTaskField();
      this.$nextTick(() => {
        this.getList();
        this.getTaskStatistic();
      });
    },
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
      this.$nextTick(() => {
        this.list.forEach(row => {
          if (this.selectedTasks.find(e => e.id === row.id)) {
            this.$refs['table'].toggleRowSelection(row, true);
          }
        });
      });
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
    handleMapLoad(e) {
      this.map = e.target;
    },
    handleRowClick(row) {
      console.log(row);
    },
    toParticular(id) {
      this.$router.push({ name: 'dc-particular', query: { id } });
    },
    handleTaskSelect(selection, row) {
      const existed = this.selectedTasks.find(e => e.id === row.id);
      if (existed) {
        this.selectedTasks = this.selectedTasks.filter(e => e.id !== row.id);
      } else {
        this.selectedTasks.push(row);
      }
    },
    handleTaskSelectAll(selection) {
      this.selectedTasks = selection;
    },
    async submit() {
      if (this.count === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一个任务',
        });
        return false;
      }
      const ids = this.selectedTasks.map(task => task.id);
      const params = {
        taskRecordIds: ids.toString(),
      };
      const res = await survey.taskSubmit(params);
      if (res.code === 200 && res.message === 'ok') {
        this.$message({
          type: 'success',
          message: '成功',
        });
        this.selectedTasks = [];
        this.params.pageIndex = 1;
        this.getList();
      }
    },
  },
};
</script>

<style lang="scss">
.dc-detail {
  padding: 30px 40px;
  padding-top: 0;
  height: calc(100% - 10px);
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
          color: #0094ec;
          font-size: 14px;
        }
      }
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
