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
            ref="dc-base-info"
            :fields="fieldList"
            :canEdit="canEdit"
            v-show="activeTabIndex === 0"
            @save-info="handleSave"
          />
          <dc-image
            :imageObj="imageObj"
            ref="image-preview"
            v-show="activeTabIndex === 1"
            @file-path="handleImage"
          />
          <v-video :videos="videoList" v-show="activeTabIndex === 2" />
          <manual-upload
            :files="attachmentList"
            ref="manual-upload"
            v-show="showUpload"
          />
          <v-attachments
            :attachments="attachmentList"
            v-show="showAttachments && !showUpload"
          />
        </div>
        <div class="submit-box">
          <button class="btn btn-back" @click="back()">返回</button>
          <button class="btn btn-submit" v-show="canEdit" @click="submit()">
            提交
          </button>
        </div>
      </div>
      <div class="map-container">
        <v-map @load="handleMapLoad" />
        <geojson-edit
          ref="geo-edit"
          :map="map"
          :originGeojson="originGeojson"
          :appGeojson="appGeojson"
          :pcGeojson="pcGeojson"
          :traceGeojson="traceGeojson"
          :canEdit="canEdit"
          v-if="map"
          @load="handleMapLoad"
          @toggle-geo-layer="toggleGeoLayer"
          @finish-edit="getTaskDetail()"
          @finish-upload="finishUpload"
        />
        <geo-edit-introduction :isDisplay="showIntroduction" />
        <v-compass :map="map" v-if="map" />
      </div>
    </div>
  </div>
</template>
<script>
import vMap from 'components/map/map';
import geojsonEdit from 'components/geo-edit/geo-edit';
import geoEditIntroduction from 'components/geo-edit/introduction';
import vCompass from 'components/compass/compass';
import dcImage from 'components/image/dcImage';
import vVideo from 'components/video/video';
import manualUpload from 'components/upload/manual-upload';
import dcBaseInfo from 'components/base-info/dcBaseInfo';
import vAttachments from 'components/attachments/attachments';
import { task, survey } from 'api';
import mapHandler from 'mixins/map.handler';
import {
  originGeo,
  pcGeo,
  appGeo,
  directionGeo,
  surverUserTrace,
} from '../../configs/layer.config';

export default {
  name: 'dc-particular',
  components: {
    vMap,
    geojsonEdit,
    geoEditIntroduction,
    vCompass,
    dcImage,
    vVideo,
    dcBaseInfo,
    vAttachments,
    manualUpload,
  },
  props: {
    id: {
      type: [Number, String],
    },
  },
  mixins: [mapHandler],
  data() {
    return {
      map: null,
      tabs: [
        { name: '基本信息' },
        { name: '照片' },
        { name: '视频' },
        { name: '附件' },
      ],
      activeTabIndex: 0,
      taskId: '',
      fieldList: [],
      imageObj: {},
      videoList: [],
      attachmentList: [],
      mapLoaded: false,
      originGeojson: '',
      pcGeojson: '',
      appGeojson: '',
      surveyStatus: '',
      traceGeojson: '',
      checkFlowStage: '',
      form: {
        taskRecordId: this.id,
        recordJsonStr: '',
        pcGeojson: '',
      },
      showIntroduction: false,
      marker: null,
    };
  },
  computed: {
    canEdit() {
      return this.surveyStatus === 1 || this.checkFlowStage === 2;
    },
    showUpload() {
      return this.activeTabIndex === 3 && this.surveyStatus === 1;
    },
    showAttachments() {
      return this.activeTabIndex === 3 && this.surveyStage !== 1;
    },
  },
  watch: {
    mapLoaded(val) {
      if (val) {
        let geojson;
        let isPc;
        if (this.pcGeojson) {
          geojson = this.pcGeojson;
          isPc = true;
        } else {
          geojson = this.originGeojson;
          isPc = false;
        }
        this.initMapLayer(this.map, geojson, isPc);
      }
    },
    id(val) {
      this.form.taskRecordId = val;
      this.getTaskDetail();
    },
    activeTabIndex: function(val) {
      if (val !== 1) {
        this.map.setLayoutProperty(
          directionGeo.symbol.id,
          'visibility',
          'none',
        );
        const bbox = this.getBbox(this.originGeojson);
        this.map.fitBounds(bbox, { padding: 200 });
        this.$refs['image-preview'].activeKey = 'nearImageFiles';
      }
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
    handleSave(recordJsonStr) {
      const formData = new FormData();
      formData.append('taskRecordId', this.id);
      formData.append('recordJsonStr', recordJsonStr);
      survey.saveTaskRecordInfo(formData).then(async res => {
        if (res.code === 200 && res.message === 'ok') {
          this.$message({
            type: 'success',
            message: '同步成功',
          });
        }
        this.getTaskDetail();
      });
    },
    handleSubmit(recordJsonStr) {
      const formData = new FormData();
      const files = this.$refs['manual-upload'].fileList;
      const pcGeojson = this.$refs['geo-edit'].pcGeojson;
      if (files.length !== 0) {
        files.forEach(file => {
          formData.append('annex', file.raw);
        });
      }
      recordJsonStr && formData.append('recordJsonStr', recordJsonStr);
      if (pcGeojson) {
        formData.append('pcGeojson', pcGeojson);
      }
      formData.append('taskRecordId', this.id);
      survey.saveTaskRecordInfo(formData).then(async res => {
        if (res.code === 200 && res.message === 'ok') {
          const response = await survey.taskSubmit({ taskRecordIds: this.id });
          if (response.code === 200 && response.message === 'ok') {
            this.$message({
              type: 'success',
              message: '提交成功',
            });
            this.getTaskDetail();
            this.$refs['geo-edit'].form.pcGeojson = '';
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
        checkFlowStage,
        referenceInfo: {
          fieldsList,
          farImageFiles,
          nearImageFiles,
          otherImageFiles,
          vedioFiles,
          annexFiles,
          geojsons,
          traceGeojson,
        },
      } = data;
      this.taskId = taskId;
      this.surveyStatus = surveyStage;
      this.checkFlowStage = checkFlowStage;
      this.imageObj = { farImageFiles, otherImageFiles, nearImageFiles };
      this.videoList = vedioFiles;
      this.attachmentList = annexFiles;
      this.traceGeojson = traceGeojson;
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
      if (geojsons) {
        const { pcGeojson, appGeojson } = geojsons;
        this.pcGeojson = pcGeojson;
        this.appGeojson = appGeojson;
      } else {
        this.pcGeojson = this.originGeojson;
        this.appGeojson = '';
      }
      if (this.mapLoaded) {
        if (this.pcGeojson) {
          this.setGeojson(this.map, pcGeo, this.pcGeojson);
        } else {
          this.setGeojson(this.map, originGeo, this.originGeojson);
          const center = this.getCenter(this.originGeojson);
          this.marker = this.addMarker(this.map, this.marker, { center });
        }
        const bbox = this.getBbox(this.originGeojson);
        this.map.fitBounds(bbox, { padding: 200 });
      }
    },
    initMapLayer(map, geojson, isPc = false) {
      this.initGeoLayers(map, pcGeo);
      this.initGeoLayers(map, originGeo);
      this.initGeoLayers(map, appGeo);
      this.initLineLayer(map, surverUserTrace);
      this.initSymbolLayer(map, directionGeo);
      if (isPc) {
        this.setGeojson(map, pcGeo, geojson);
      } else {
        this.setGeojson(map, originGeo, geojson);
        const center = this.getCenter(geojson);
        this.marker = this.addMarker(this.map, this.marker, { center });
      }
      const bbox = this.getBbox(geojson);
      this.map.fitBounds(bbox, { padding: 200 });
    },
    finishUpload() {
      const bbox = this.getBbox(this.originGeojson);
      this.map.fitBounds(bbox, { padding: 200 });
    },
    toggleGeoLayer({ name, active }) {
      if (name === '调查范围') {
        if (active) {
          this.setGeojson(this.map, pcGeo, this.pcGeojson);
        } else {
          this.clearGeojson(this.map, pcGeo);
        }
      } else if (name === '辅助线') {
        if (active) {
          this.setGeojson(this.map, appGeo, this.appGeojson);
        } else {
          this.clearGeojson(this.map, appGeo);
        }
      } else if (name === '原始下发图斑') {
        if (!active) {
          this.marker && this.marker.remove();
          this.clearGeojson(this.map, originGeo);
          this.clearGeojson(this.map, directionGeo);
        } else {
          this.setGeojson(this.map, originGeo, this.originGeojson);
          const center = this.getCenter(this.originGeojson);
          this.setGeojson(this.map, directionGeo, center);
          this.marker = this.addMarker(this.map, this.marker, { center });
        }
      } else if (name === '调查足迹') {
        if (active) {
          // this.setGeojson(this.map, surverUserTrace, this.traceGeojson);
          this.setGeojson(this.map, surverUserTrace, this.traceGeojson);
          const bbox = this.getBbox(this.traceGeojson);
          this.map.fitBounds(bbox, {
            padding: 200,
          });
        } else {
          // this.clearGeojson(this.map, surverUserTrace);
          this.clearGeojson(this.map, surverUserTrace);
          const bbox = this.getBbox(this.originGeojson);
          this.map.fitBounds(bbox, {
            padding: 200,
          });
        }
      }
    },
    handleImage(data) {
      const { azimuth, position } = data;
      if (azimuth) {
        this.map.setLayoutProperty(
          directionGeo.symbol.id,
          'icon-rotate',
          Number(azimuth),
        );
        this.map.setLayoutProperty(
          directionGeo.symbol.id,
          'visibility',
          'visible',
        );
      }
      if (position) {
        const point = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: position,
          },
        };
        this.setGeojson(this.map, directionGeo, point);
        this.map.flyTo({ center: position });
      }
    },
    back() {
      this.$router.go(-1);
    },
    submit() {
      if (!this.$refs['dc-base-info'].$refs['form']) {
        let filesList = this.$refs['dc-base-info'].constFieldList;
        for (let i = 0; i < filesList.length; ++i) {
          if (
            filesList[i].is_pc_required === 1 &&
            filesList[i].isEdit === 1 &&
            !filesList[i].fieldValue
          ) {
            this.$message({
              type: 'error',
              message: '请填写必填项',
            });
            return false;
          }
        }
        let formFieldList = this.$refs['dc-base-info'].fieldList;
        const fieldList = formFieldList.map(item => {
          const { id, fieldName } = item;
          return {
            taskFieldsId: id,
            fieldValue: this.$refs['dc-base-info'].form[fieldName],
          };
        });
        this.handleSubmit(JSON.stringify(fieldList));
        return true;
      }
      this.$refs['dc-base-info'].$refs['form'].validate(valid => {
        if (valid) {
          let formFieldList = this.$refs['dc-base-info'].fieldList;
          const fieldList = formFieldList.map(item => {
            const { id, fieldName } = item;
            return {
              taskFieldsId: id,
              fieldValue: this.$refs['dc-base-info'].form[fieldName],
            };
          });
          this.handleSubmit(JSON.stringify(fieldList));
        }
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.map && vm.map.resize();
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs['geo-edit']) {
      this.$refs['geo-edit'].draw && this.$refs['geo-edit'].draw.deleteAll();
      this.$refs['geo-edit'].isDrawing = false;
      this.$refs['geo-edit'].showPopover = false;
      // this.$refs['geo-edit'].uploadClear();
    }
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
        display: flex;
        background-color: #0094ec;
        box-sizing: border-box;
        height: 40px;
        color: #fff;
        font-size: 14px;
        .tab {
          width: 85px;
          padding: 10px 0;
          cursor: pointer;
          display: flex;
          margin-left: 5px;
          align-items: center;
          justify-content: center;
        }
        .tab.active {
          border-top-right-radius: 4px;
          border-top-left-radius: 4px;
          margin-top: 5px;
          background: #fff;
          font-weight: bold;
          border-bottom: 1px solid #0094ec;
          border-bottom: 1px solid #fff;
          color: #0094ec;
        }
      }
      .content-view {
        height: calc(100% - 42px);
      }
      .submit-box {
        text-align: right;
        padding: 10px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        border-top: 1px solid #e6e6e6;
        background-color: #fff;
        .btn {
          height: 36px;
          width: 80px;
          cursor: pointer;
          outline: none;
          border-radius: 5px;
        }
        .btn-back {
          border: 1px solid #0094ec;
          color: #0094ec;
          background-color: #fff;
        }
        .btn-submit {
          margin-left: 10px;
          border: 1px solid #0094ec;
          background-color: #0094ec;
          color: #fff;
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
