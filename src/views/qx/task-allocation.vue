<template>
  <div class="task-allocation">
    <div class="data">
      <div class="my-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            ><i class="el-icon-s-home"></i> 区县</el-breadcrumb-item
          >
          <el-breadcrumb-item :to="{ name: 'qx-list' }"
            >任务列表</el-breadcrumb-item
          >
          <el-breadcrumb-item>任务分派</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
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
              <span class="select">已选择{{ count }}个</span>
              <el-button
                style="margin-left: 8px; background-color:#0094ec;color: #fff; "
                v-if="!status"
                size="small"
                @click="handleTaskAll()"
              >
                <svg-icon iconClass="分发"></svg-icon> 全部分发
              </el-button>
              <el-button
                @click="handleTaskAll()"
                v-if="status"
                size="small"
                style="margin-left: 8px;"
              >
                <svg-icon iconClass="撤销"></svg-icon> 全部撤回
              </el-button>
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
          width="150px"
        ></el-table-column>
        <el-table-column label="分发状态" width="150px">
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
      <div class="pagination" v-show="showPagination">
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
      <v-draw
        ref="draw"
        v-if="map"
        :map="map"
        @finish-draw="getTasksByRange"
        @cancel="handleCancel"
      />
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
import iconLocationRed from 'assets/images/sj/location.png';
import iconLocationBlue from 'assets/images/sj/location-blue.png';
import iconLocationYellow from 'assets/images/sj/location-yellow.png';
const locationRed = new Image();
locationRed.src = iconLocationRed;
locationRed.style.height = '20px';
locationRed.style.width = '20px';
const locationBlue = new Image();
locationBlue.src = iconLocationBlue;
locationBlue.style.height = '20px';
locationBlue.style.width = '20px';
const locationYellow = new Image();
locationYellow.src = iconLocationYellow;
locationYellow.style.height = '20px';
locationYellow.style.width = '20px';
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
      showPagination: true,
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
    this.getTuBanStatistic();
  },
  filters: {
    distributionStatus,
    distribution,
  },
  methods: {
    async getTuBanStatistic() {
      let data = await task.getTuBanStatistic({ taskId: this.id });
      this.cards[0].value = data.total;
      this.cards[1].value = data.notDistribution;
      this.cards[2].value = data.distribution;
    },
    async getTasksByRange(data) {
      const params = {
        geojson: JSON.stringify(data),
        taskId: this.id,
      };
      const res = await task.taskDistributeByRange(params);
      if (res.code.toString() === '200' && res.message === 'ok') {
        this.showPagination = false;
        this.selectedTasks = res.data.filter(
          e => e.distributionStatus === this.status,
        );
        // const ids = this.selectedTasks.map(e => e.id);
        // this.map.setLayoutProperty()
        let idMap = {};
        this.selectedTasks.map(task => {
          idMap[task.id] = task.id;
        });
        this.map.setLayoutProperty('symbol-layer', 'icon-image', [
          'case',
          ['has', ['get', 'taskRecordId'], ['literal', idMap]],
          'icon-location-yellow',
          'icon-location-red',
        ]);
        this.list = this.selectedTasks;
        this.$refs['table'].toggleAllSelection();
      }
    },
    handleCancel() {
      this.selectedTasks = [];
      this.params.pageIndex = 1;
      this.getList();
      this.showPagination = true;
      this.map.setLayoutProperty('symbol-layer', 'icon-image', [
        'case',
        ['==', ['get', 'distributionStatus'], 0],
        'icon-location-red',
        'icon-location-blue',
      ]);
    },
    async handleTaskAll() {
      this.showPagination = true;
      this.$refs['draw'].showCancel = false;
      if (!this.form.surveyUserId) {
        this.$message({
          type: 'warning',
          message: '请选择调查员',
        });
        return false;
      }
      if (this.selectedTasks.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选图斑',
        });
        return false;
      }
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
        this.handleMap();
      }
    },
    async handleTaskOne(id) {
      if (!this.form.surveyUserId) {
        this.$message({
          type: 'warning',
          message: '请选择调查员',
        });
        return false;
      }
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
        this.handleMap();
      }
    },
    handleStatusChange(val) {
      this.params.pageIndex = 1;
      this.params.distributionStatus = val;
      this.getList();
      if (this.map) {
        this.map.setLayoutProperty('symbol-layer', 'icon-image', [
          'case',
          ['==', ['get', 'distributionStatus'], 0],
          'icon-location-red',
          'icon-location-blue',
        ]);
        this.map.setFilter('task-fill', [
          '==',
          ['get', 'distributionStatus'],
          val,
        ]);

        this.map.setFilter('task-line', [
          '==',
          ['get', 'distributionStatus'],
          val,
        ]);
        this.map.setFilter('symbol-layer', [
          '==',
          ['get', 'distributionStatus'],
          val,
        ]);
      }
    },
    async handleMapLoad(e) {
      this.map = e.target;
      this.handleMap();
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
    handleTaskSelectAll(selection) {
      this.selectedTasks = selection;
    },
    getPointFeatures(geojson) {
      let featureCollection = {
        type: 'FeatureCollection',
        features: [],
      };
      const { features } = geojson;
      featureCollection.features = features.map(feature => {
        const point = turf.center(feature);
        point.properties = { ...feature.properties };
        return point;
      });
      return featureCollection;
    },
    async handleMap() {
      const res = await task.getGeojson({ taskId: this.id });
      if (res.code && res.code.toString() === '200') {
        this.addGeoLayer(res.data);
        this.addSymbolLayer(res.data);
      } else {
        return false;
      }
    },
    addGeoLayer(geojson) {
      if (!geojson) return false;
      if (this.map.getSource('geo-task')) {
        this.map.getSource('geo-task').setData(geojson);
        return;
      }
      this.map.addSource('geo-task', {
        type: 'geojson',
        data: geojson,
      });
      this.map.addLayer({
        id: 'task-fill',
        minzoom: 10,
        type: 'fill',
        source: 'geo-task',
        paint: {
          'fill-color': '#888',
          'fill-opacity': 0.7,
        },
        filter: ['==', 'distributionStatus', 0],
      });
      this.map.addLayer({
        id: 'task-line',
        minzoom: 10,
        type: 'line',
        source: 'geo-task',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'distributionStatus'], 0],
            '#d81e06',
            '#1296db',
          ],
        },
        filter: ['==', ['get', 'distributionStatus'], this.status],
      });
      const bbox = turf.bbox(geojson);
      this.map.fitBounds(bbox);
    },
    addSymbolLayer(geojson) {
      if (!this.map.hasImage('icon-location-red')) {
        this.map.addImage('icon-location-red', locationRed);
      }
      if (!this.map.hasImage('icon-location-blue')) {
        this.map.addImage('icon-location-blue', locationBlue);
      }
      if (!this.map.hasImage('icon-location-yellow')) {
        this.map.addImage('icon-location-yellow', locationYellow);
      }
      const featureCollection = this.getPointFeatures(geojson);
      if (this.map.getSource('symbol-source')) {
        this.map.getSource('symbol-source').setData(featureCollection);
        return;
      }
      this.map.addSource('symbol-source', {
        type: 'geojson',
        data: featureCollection,
      });
      this.map.addLayer({
        id: 'symbol-layer',
        type: 'symbol',
        source: 'symbol-source',
        layout: {
          'icon-image': [
            'case',
            ['==', ['get', 'distributionStatus'], 0],
            'icon-location-red',
            'icon-location-blue',
          ],
          'icon-size': 0.1,
        },
        filter: ['==', ['get', 'distributionStatus'], this.status],
      });
    },
  },
  beforeDestroy() {
    this.map &&
      this.map.getLayer('task-fill') &&
      this.map.removeLayer('task-fill');
    this.map &&
      this.map.getLayer('task-line') &&
      this.map.removeLayer('task-line');
    this.map &&
      this.map.getSource('geo-task') &&
      this.map.removeSource('geo-task');
    this.map &&
      this.map.getLayer('symbol-layer') &&
      this.map.removeLayer('symbol-layer');
    this.map &&
      this.map.getSource('symbol-source') &&
      this.map &&
      this.map.removeSource('symbol-source');
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
        background-color: #0094ec;
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
      align-items: center;
      .select {
        font-size: $font-sm;
        color: #0094ec;
      }
      .select + .el-button {
        border: 1px solid #0094ec;
        color: #0094ec;
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
