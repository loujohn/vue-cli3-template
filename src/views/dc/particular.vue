<template>
  <div class="dc-particular">
    <div class="my-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          ><i class="el-icon-s-home"></i> 调查员</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ name: 'dc-list' }"
          >任务列表</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ name: 'dc-detail', query: { id: taskId } }"
          >任务详情</el-breadcrumb-item
        >
        <el-breadcrumb-item>图斑详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="operation-panel">
        <div class="tabs">
          <span
            class="tab"
            :class="{ active: index === activeTabIndex }"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="handleTabClick(index)"
          >
            {{ tab.name }}
          </span>
        </div>
        <div class="content-view">
          <dc-base-info
            :fields="fieldList"
            :canEdit="canEdit"
            v-show="activeTabIndex === 0"
            @submit="handleSubmit"
          />
          <dc-image :imageObj="imageObj" v-show="activeTabIndex === 1" />
          <v-video :videos="videoList" v-show="activeTabIndex === 2" />
        </div>
      </div>
      <div class="map-container">
        <v-map @load="handleMapLoad" />
        <geojson-edit
          ref="geo-edit"
          :map="map"
          :originGeojson="originGeojson"
          :appGeojson="appGeojson"
          :canEdit="canEdit"
          v-if="map"
          @load="handleMapLoad"
        />
      </div>
    </div>
  </div>
</template>
<script>
import vMap from 'components/map/map';
import geojsonEdit from 'components/geo-edit/geo-edit';
import dcImage from 'components/image/dcImage';
import vVideo from 'components/video/video';
import dcBaseInfo from 'components/base-info/dcBaseInfo';
import { task, survey } from 'api';
import turf from 'turf';
import { locationRed } from '../../configs/icon.config';

export default {
  name: 'dc-particular',
  components: {
    vMap,
    geojsonEdit,
    dcImage,
    vVideo,
    dcBaseInfo,
  },
  props: {
    id: {
      type: [Number, String],
    },
  },
  data() {
    return {
      map: null,
      tabs: [{ name: '文字' }, { name: '照片' }, { name: '视频' }],
      activeTabIndex: 0,
      taskId: '',
      fieldList: [],
      imageObj: {},
      videoList: [],
      mapLoaded: false,
      originGeojson: '',
      pcGeojson: '',
      appGeojson: '',
      surveyStatus: '',
      form: {
        taskRecordId: this.id,
        recordJsonStr: '',
        pcGeojson: '',
      },
    };
  },
  computed: {
    canEdit() {
      return this.surveyStatus == 1;
    },
  },
  watch: {
    mapLoaded(val) {
      if (val) {
        if (this.originGeojson) {
          this.initMapLayer(this.map, this.originGeojson);
        }
      }
    },
    id(val) {
      this.form.taskRecordId = val;
      this.getTaskDetail();
    },
  },
  mounted() {
    this.getTaskDetail();
  },
  methods: {
    handleMapLoad(e) {
      this.map = e.target;
      this.mapLoaded = true;
    },
    handleTabClick(index) {
      this.activeTabIndex = index;
    },
    handleSubmit(recordJsonStr) {
      this.form.recordJsonStr = recordJsonStr;
      if (this.$refs['geo-edit'].pcGeojson) {
        this.form.pcGeojson = this.$refs['geo-edit'].pcGeojson;
      }
      survey.saveTaskRecordInfo(this.form).then(async res => {
        if (res.code === 200 && res.message === 'ok') {
          const response = await survey.taskSubmit({ taskRecordIds: this.id });
          if (response.code === 200 && response.message === 'ok') {
            this.$message({
              type: 'success',
              message: '提交成功',
            });
            this.getTaskDetail();
            this.$refs['geo-edit'].pcGeojson = '';
          } else {
            this.$message({
              type: 'error',
              message: response.message,
            });
            return false;
          }
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
          return false;
        }
      });
    },
    async getTaskDetail() {
      const params = { id: this.id };
      const data = await task.getTaskDetail(params);
      let {
        taskId,
        surveyStage,
        referenceInfo: {
          fieldsList,
          farImageFiles,
          nearImageFiles,
          otherImageFiles,
          vedioFiles,
          geojsons,
        },
      } = data;
      this.taskId = taskId;
      this.surveyStatus = surveyStage;
      this.imageObj = { farImageFiles, otherImageFiles, nearImageFiles };
      this.videoList = vedioFiles;
      fieldsList = fieldsList.map(e => {
        if (e.fieldName === 'centerPoint') {
          const { fieldValue } = e;
          return {
            ...e,
            fieldValue: JSON.parse(fieldValue).coordinates,
          };
        } else {
          return e;
        }
      });
      this.fieldList = fieldsList.filter(e => !e.isSpace);
      this.originGeojson = fieldsList.find(e => e.isSpace).fieldValue;
      if (this.mapLoaded) {
        this.setGeojson(this.map, this.originGeojson);
      }
      if (geojsons) {
        const { pcGeojson, appGeojson } = geojsons;
        this.pcGeojson = pcGeojson;
        this.appGeojson = appGeojson;
      }
    },
    initMapLayer(map, geojson) {
      geojson =
        typeof geojson === 'string'
          ? { type: 'Feature', geometry: JSON.parse(geojson) }
          : geojson;
      this.map.addImage('icon-location', locationRed);
      map.addSource('geo-source', {
        type: 'geojson',
        data: geojson,
      });
      map.addLayer({
        id: 'geo-fill',
        type: 'fill',
        source: 'geo-source',
        paint: {
          'fill-opacity': 0.3,
        },
      });
      map.addLayer({
        id: 'geo-line',
        type: 'line',
        source: 'geo-source',
        paint: {
          'line-color': '#c08f01',
          'line-width': 2,
        },
      });
      const center = turf.center(geojson);
      map.addSource('symbol-source', {
        type: 'geojson',
        data: center,
      });
      map.addLayer({
        id: 'symbol-layer',
        type: 'symbol',
        source: 'symbol-source',
        layout: {
          'icon-image': 'icon-location',
          'icon-size': 0.1,
        },
      });
      const bbox = turf.bbox(geojson);
      this.map.fitBounds(bbox, { padding: 200 });
    },
    setGeojson(map, geojson) {
      geojson =
        typeof geojson === 'string'
          ? { type: 'Feature', geometry: JSON.parse(geojson) }
          : geojson;
      this.map.getSource('geo-source').setData(geojson);
      const center = turf.center(geojson);
      this.map.getSource('symbol-source').setData(center);
      const bbox = turf.bbox(geojson);
      this.map.fitBounds(bbox, { padding: 200 });
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$refs['geo-edit'].draw && this.$refs['geo-edit'].draw.deleteAll();
    this.$refs['geo-edit'].isDrawing = false;
    next();
  },
};
</script>

<style lang="scss">
.dc-particular {
  padding: 30px 40px;
  padding-top: 0;
  box-sizing: border-box;
  height: calc(100% - 10px);
  .content-box {
    height: calc(100% - 30px);
    display: flex;
    justify-content: space-between;
    .operation-panel,
    .map-container {
      width: 49.5%;
      height: 100%;
      position: relative;
    }
    .operation-panel {
      background: #fff;
      .tabs {
        background-color: #f1f1f1;
        .tab {
          display: inline-block;
          font-size: 14px;
          padding: 10px 0;
          margin: 0 10px;
          cursor: pointer;
        }
        .tab.active {
          color: #0094ec;
          border-bottom: 3px solid #0094ec;
        }
      }
      .content-view {
        height: calc(100% - 42px);
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
