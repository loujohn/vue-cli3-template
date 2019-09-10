<template>
  <div class="task-allocation">
    <div class="data">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>区县</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'qx-list' }"
          >任务列表</el-breadcrumb-item
        >
        <el-breadcrumb-item>任务分派</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="cards">
        <div class="card" v-for="card in cards" :key="card.name">
          <span class="name">
            <svg-icon
              :style="{ fill: '#fff', width: '1.5em', height: '1.5em' }"
              :iconClass="card.icon"
            ></svg-icon
            >&nbsp;
            {{ card.name }}
          </span>
          <span class="value">
            <svg-icon iconClass="icon" :style="{ fill: '#fff' }"></svg-icon
            >&nbsp;
            {{ card.value }}
          </span>
        </div>
      </div>
      <div class="filter">
        <el-row :gutter="10">
          <el-col :span="6">
            <span class="label">调查人员:</span>
            <el-select v-model="form.surveyUserId" :size="size" clearable>
              <el-option
                v-for="item in surveyUserList"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <span class="label">分发状态:</span>
            <el-select
              v-model="status"
              :size="size"
              @change="handleStatusChange"
            >
              <el-option
                v-for="item in distributionStatusList"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <div class="operation">
              <span v-if="!status" class="select">
                已选择{{ count }}个
                <el-button size="small" @click="handleTaskAll()"
                  ><svg-icon iconClass="分发"></svg-icon> 全部分发</el-button
                >
              </span>
              <el-button
                @click="handleTaskAll()"
                v-if="status"
                size="small"
                style="margin-left: 8px;"
                ><svg-icon iconClass="撤销"></svg-icon> 全部撤回</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        ref="table"
        header-row-class-name="customer-table-header"
        :data="list"
        @select="handleTaskSelect"
        @select-all="handleTaskSelectAll"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          v-for="(item, index) in fields"
          :key="index"
          :label="item.fieldAlias"
          :prop="`referenceInfo.fields[${item.fieldName}]`"
        >
        </el-table-column>
        <el-table-column
          label="调查人员"
          prop="referenceInfo.surverUserName"
        ></el-table-column>
        <el-table-column label="分发状态">
          <template slot-scope="scope">
            <span
              :class="{
                not: !scope.row.distributionStatus,
                'has-dispatch': scope.row.distributionStatus,
              }"
            >
              {{ scope.row.distributionStatus | distributionStatus }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60px">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleTaskOne(scope.row.id)"
            >
              {{ scope.row.distributionStatus | distribution }}
            </el-button>
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
      <v-map @load="handleMapLoad" />
      <v-draw v-if="map" :map="map" @finish-draw="getTasksByRange" />
    </div>
  </div>
</template>

<script>
import { task, survey } from 'api';
import turf from 'turf';
import vMap from 'components/map/map';
import vDraw from 'components/draw';
import list from 'mixins/list';
import { distributionStatus, distribution } from 'filters';
const iconDot = require('assets/images/map/notDispatch.png');
const img = new Image();
img.src = iconDot;
img.style.height = '20px';
img.style.width = '20px';
export default {
  name: 'task-allocation',
  components: {
    vMap,
    vDraw,
  },
  props: {
    id: {
      type: String,
    },
  },
  mixins: [list],
  data() {
    return {
      distributionStatusList: [
        { name: '已分发', value: 1 },
        { name: '未分发', value: 0 },
      ],
      size: 'small',
      map: null,
      cards: [
        { name: '总图斑数', icon: '图斑', value: 300 },
        { name: '未分发', icon: '未分发', value: 300 },
        { name: '已分发', icon: '已分发', value: 300 },
      ],
      status: 0,
      form: {
        surveyUserId: '',
        status: '',
        ids: '',
      },
      params: {
        pageIndex: 1,
        pageSize: 10,
        distributionStatus: 0,
      },
      surveyUserList: [],
      fields: [],
      selectedTasks: [],
    };
  },
  computed: {
    count() {
      return this.selectedTasks.length;
    },
  },
  mounted() {
    this.getSurveyUserList();
    this.getTaskField();
    this.getList();
  },
  filters: {
    distributionStatus,
    distribution,
  },
  methods: {
    async getTasksByRange(data) {
      const params = {
        geojson: JSON.stringify(data),
        taskId: this.id,
      };
      const res = await task.taskDistributeByRange(params);
      if (res.code.toString() === '200' && res.message === 'ok') {
        this.selectedTasks = res.data;
        this.list.forEach(row => {
          if (this.selectedTasks.find(e => e.id === row.id)) {
            this.$refs['table'].toggleRowSelection(row, true);
          }
        });
      }
    },
    async handleTaskAll() {
      const ids = this.selectedTasks.map(e => e.id);
      const params = {
        ...this.form,
        status: this.status ? 0 : 1,
        ids: ids.toString(),
      };
      const res = await task.taskDistribute(params);
      if (res.code.toString() === '200' && res.message === 'ok') {
        this.$message({
          type: 'success',
          message: !this.status ? '分发成功' : '撤回成功',
        });
        this.selectedTasks = [];
        this.params.pageIndex = 1;
        this.getList();
      }
    },
    async handleTaskOne(id) {
      const params = {
        ...this.form,
        status: this.status ? 0 : 1,
        ids: id,
      };
      const res = await task.taskDistribute(params);
      if (res.code.toString() === '200' && res.message === 'ok') {
        this.$message({
          type: 'success',
          message: !this.status ? '分发成功' : '撤回成功',
        });
        this.selectedTasks = [];
        this.params.pageIndex = 1;
        this.getList();
      }
    },
    handleStatusChange(val) {
      this.params.pageIndex = 1;
      this.params.distributionStatus = val;
      this.getList();
    },
    async handleMapLoad(e) {
      this.map = e.target;
      const res = await task.getGeojson({ id: this.id });
      if (res.code && res.code.toString() === '200') {
        this.addGeoLayer(res.data);
      } else {
        return false;
      }
    },
    async getSurveyUserList() {
      const res = await survey.getSurveyUserList({ id: this.id });
      if (res.code.toString() === '200') {
        this.surveyUserList = res.data;
      }
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
      this.$nextTick(() => {
        this.list.forEach(row => {
          if (this.selectedTasks.find(e => e.id === row.id)) {
            this.$refs['table'].toggleRowSelection(row, true);
          }
        });
      });
    },
    handleCurrentPageChange(val) {
      this.params.pageIndex = val;
      this.getList();
    },
    handleTaskSelect(selection, row) {
      const existed = this.selectedTasks.find(e => e.id === row.id);
      if (existed) {
        this.selectedTasks = this.selectedTasks.filter(e => e.id !== row.id);
      } else {
        this.selectedTasks.push(row);
      }
    },
    defaultSelected() {
      this.selectedKsList.forEach(row => {
        this.$refs['table'].toggleRowSelection(row, true);
      });
    },
    handleTaskSelectAll(selection) {
      this.selectedTasks = selection;
    },
    addGeoLayer(geojson) {
      if (!geojson) return false;
      this.map.addSource('geo-task', {
        type: 'geojson',
        data: geojson,
      });
      this.map.addLayer({
        id: 'task-fill',
        type: 'fill',
        source: 'geo-task',
        paint: {
          'fill-color': '#888',
          'fill-opacity': 0.7,
        },
      });
      this.map.addLayer({
        id: 'task-line',
        type: 'line',
        source: 'geo-task',
        paint: {
          'line-color': 'red',
        },
      });
      const bbox = turf.bbox(geojson);
      this.map.fitBounds(bbox);
    },
  },
  beforeDestroy() {
    this.map.getLayer('task-fill') && this.map.removeLayer('task-fill');
    this.map.getLayer('task-line') && this.map.removeLayer('task-line');
    this.map.getSource('geo-task') && this.map.removeSource('geo-task');
  },
};
</script>

<style lang="scss">
.task-allocation {
  display: flex;
  height: 100%;
  overflow: hidden;
  .not {
    color: #f56c6c;
  }
  .has-dispatch {
    color: #67c23a;
  }
  .data {
    width: 50%;
    background-color: #fff;
    overflow: auto;
    .el-breadcrumb {
      padding: 10px 20px;
    }
    .cards {
      display: flex;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #e6e6e6;
      padding-top: 0;
      .card {
        width: 30%;
        background-color: #0e67f2;
        border-radius: 3px;
        padding: 18px 16px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        font-size: $font-sm;
        color: $base-color;
        span {
          display: flex;
          align-items: center;
        }
        .value {
          font-weight: 600;
        }
      }
    }
    .operation {
      display: flex;
      justify-content: flex-end;
      .select {
        font-size: $font-sm;
        color: #0e67f2;
        .el-button {
          background-color: #0e67f2;
          color: #fff;
        }
      }
      .select + .el-button {
        border: 1px solid #0e67f2;
        color: #0e67f2;
      }
    }
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
  .map-container {
    width: 50%;
    flex-shrink: 0;
    height: 100%;
    position: relative;
  }
}
</style>
