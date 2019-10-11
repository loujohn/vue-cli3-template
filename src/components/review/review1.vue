<template>
  <div class="sj-review">
    <div class="left">
      <div class="map-container" :style="{ height: containerHeight }">
        <v-map
          @load="handleMapLoad"
          :containerHeight="containerHeight"
          :geojson="geojson"
        />
        <div class="ranges">
          <button
            class="btn"
            :class="{ active: showOriginGeojson }"
            v-show="geojson"
            @click="handleToggle('下发范围')"
          >
            下发范围
          </button>
          <button
            class="btn"
            :class="{ active: showPcGeojson }"
            v-show="pcGeojson"
            @click="handleToggle('调查范围')"
          >
            调查范围
          </button>
        </div>
      </div>
      <!-- <div class="image-container" v-show="showImage">
        <img :src="imagePath" alt="图片" />
      </div> -->
    </div>
    <div class="right">
      <div class="head">
        <div class="tabs">
          <span
            class="tab"
            v-for="(tab, index) in tabs"
            :key="tab.name"
            :class="{ active: index === activeTabIndex }"
            @click="setActiveTabIndex(index)"
            >{{ tab.name }}</span
          >
        </div>
        <span class="close" @click="close()">
          <i class="el-icon-close"></i>
        </span>
      </div>
      <div class="review-box" v-show="activeTabIndex === 0">
        <base-info
          :fields="fieldList"
          :operator="operator"
          :type="type"
          ref="baseInfo"
        ></base-info>
        <div class="suggestion">
          <el-row>
            <el-col :span="4">
              <span class="label">审核意见:</span>
            </el-col>
            <el-col :span="18">
              <el-input
                v-if="operator === 'check' || operator === 'recheck'"
                type="textarea"
                :rows="4"
                v-model="form.suggestion"
              ></el-input>
              <span v-else>{{ suggestion }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="people">
          <span>调查人员: {{ data.surveyUserName }}</span>
          <span>调查日期: {{ data.surveyTime }}</span>
          <el-popover
            placement="top-end"
            ref="popover"
            trigger="manual"
            v-model="visible"
            width="200"
          >
            <span
              style="cursor: pointer;"
              slot="reference"
              @click="togglePopover()"
              >图斑状态:
              <strong :class="getClass(data.checkFlowStage)">{{
                data.checkFlowStage | checkStatus
              }}</strong></span
            >
            <div class="suggestion-content">
              <span class="sug-title">{{ contentTitle }}</span>
              <span class="sug-content">{{ content }}</span>
            </div>
          </el-popover>
        </div>
        <div class="action">
          <div class="toggle"></div>
          <!-- <div class="toggle">
            <span>上一条</span>
            <span>下一条</span>
          </div> -->
          <div class="operation" v-show="operator === 'check'">
            <span>审核:</span>
            <el-radio-group class="radio-group" v-model="form.status">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="0">不通过</el-radio>
            </el-radio-group>
            <el-button size="mini" @click="check()" class="submit-botton"
              >提交</el-button
            >
          </div>
          <div class="operation" v-show="operator === 'recheck'">
            <el-button size="mini" type="primary" @click="recheck()"
              >重新提交</el-button
            >
            <el-button size="mini" type="warning" @click="reDistribute()"
              >重新下发</el-button
            >
          </div>
        </div>
      </div>
      <v-image
        v-show="activeTabIndex === 1"
        :imageObj="imageObj"
        @file-path="handleImage"
        ref="image-preview"
      />
      <v-video v-show="activeTabIndex === 2" :videos="videoList" />
      <manual-upload
        ref="manual-upload"
        :files="attachmentList"
        v-show="showUpload"
      />
      <v-attachments :attachments="attachmentList" v-show="showAttachments" />
    </div>
  </div>
</template>

<script>
import vMap from 'components/map/map';
import vImage from 'components/image/image';
import vVideo from 'components/video/video';
import manualUpload from 'components/upload/manual-upload';
import vAttachments from 'components/attachments/attachments';
import geoHandler from 'mixins/geo-handler';
import baseInfo from '../base-info/baseInfo';
import { task } from 'api';
import turf from 'turf';
import { checkStatus, getClass } from 'filters';
export default {
  name: 'review',
  components: {
    vMap,
    vImage,
    vVideo,
    baseInfo,
    manualUpload,
    vAttachments,
  },
  props: {
    data: {
      type: Object,
    },
    type: {
      type: String,
    },
    operator: {
      type: String,
    },
  },
  mixins: [geoHandler],
  data() {
    return {
      tabs: [
        { name: '基本信息' },
        { name: '照 片' },
        { name: '视 频' },
        { name: '附 件' },
      ],
      activeTabIndex: 0,
      form: {
        taskRecordId: '',
        suggestion: '',
        status: 1,
      },
      fieldList: [],
      imageObj: {},
      containerHeight: '600px',
      // imagePath: '',
      showImage: false,
      videoList: [],
      attachmentList: [],
      content: '',
      contentTitle: '',
      suggestion: '',
      visible: false,
      pcGeojson: '',
      showPcGeojson: false,
      showOriginGeojson: true,
    };
  },
  computed: {
    showUpload() {
      return (
        this.activeTabIndex === 3 &&
        this.type === 'qx' &&
        this.operator !== 'view'
      );
    },
    showAttachments() {
      return (
        (this.activeTabIndex === 3 &&
          this.operator !== 'check' &&
          this.operator !== 'recheck') ||
        (this.type === 'sj' && this.activeTabIndex === 3)
      );
    },
  },
  watch: {
    data: {
      handler: function(val) {
        if (val) {
          this.form.taskRecordId = val.id;
          try {
            this.getFlowLog({
              taskRecordId: val.id,
            });
          } catch (error) {
            console.log('getFlowLog', error);
          }
          if (!val.referenceInfo) return false;
          let {
            referenceInfo: {
              fieldsList,
              farImageFiles,
              nearImageFiles,
              otherImageFiles,
              vedioFiles,
              annexFiles,
              geojsons,
            },
          } = val;
          if (geojsons) {
            this.pcGeojson = geojsons.pcGeojson;
          }
          this.imageObj = { farImageFiles, otherImageFiles, nearImageFiles };
          this.videoList = vedioFiles;
          this.attachmentList = annexFiles;
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
          try {
            this.geojson = fieldsList.find(e => e.isSpace).fieldValue;
          } catch (error) {
            console.error(error);
          }
          if (!this.geojson) return false;
          if (this.map) {
            const geojson = JSON.parse(this.geojson);
            const data = {
              type: 'Feature',
              geometry: geojson,
            };
            this.setGeojson(this.map, 'geo-source', data);
            const center = turf.center(geojson);
            this.addMarker(center);
            this.setGeojson(this.map, 'geo-symbol', center);
            const bbox = turf.bbox(geojson);
            this.map.fitBounds(bbox, { padding: 200 });
          }
        }
      },
      immediate: true,
      deep: true,
    },
    activeTabIndex: function(val) {
      if (val !== 1) {
        // this.showImage = false;
        // this.imagePath = '';
        this.map.setLayoutProperty('direction-symbol', 'visibility', 'none');
        this.$refs['image-preview'].showImage = false;
        this.$refs['image-preview'].activeKey = 'farImageFiles';
        if (this.containerHeight !== '600px') this.containerHeight = '600px';
      }
    },
  },
  filters: {
    checkStatus,
  },
  methods: {
    getClass,
    close() {
      this.$emit('close');
      this.activeTabIndex = 0;
      this.containerHeight = '600px';
      for (let key in this.form) {
        this.form[key] = '';
      }
      this.visible = false;
      this.pcGeojson = '';
      this.showPcGeojson = false;
      this.map.getSource('pc-geo-source') &&
        this.map.getSource('pc-geo-source').setData({
          type: 'FeatureCollection',
          features: [],
        });
    },
    setActiveTabIndex(index) {
      this.activeTabIndex = index;
    },
    check() {
      const files = this.$refs['manual-upload'].fileList;
      let formData = new FormData();
      if (files.length !== 0) {
        files.forEach(file => {
          formData.append('annex', file.raw);
        });
      }
      if (this.type === 'qx') {
        const fieldList = this.$refs['baseInfo'].fieldList;
        const list = fieldList.map(item => {
          const { id, fieldValue } = item;
          return {
            taskFieldsId: id,
            fieldValue,
          };
        });
        formData.append('recordJsonStr', JSON.stringify(list));
      }
      for (let key in this.form) {
        formData.append(key, this.form[key]);
      }
      this.doCheck(formData);
    },
    recheck() {
      const files = this.$refs['manual-upload'].fileList;
      const deletedFileIds = this.$refs['manual-upload'].deletedFileIds;
      const newFiles = files.filter(file => !file.id);
      let formData = new FormData();
      newFiles.forEach(file => {
        formData.append('annex', file.raw);
      });
      formData.append('deleteAnnexIdStr', deletedFileIds.toString());
      const fieldList = this.$refs['baseInfo'].fieldList;
      const list = fieldList.map(item => {
        const { id, fieldValue } = item;
        return {
          taskFieldsId: id,
          fieldValue,
        };
      });
      formData.append('recordJsonStr', JSON.stringify(list));
      this.form = {
        ...this.form,
        status: 1,
      };
      for (let key in this.form) {
        formData.append(key, this.form[key]);
      }
      this.doCheck(formData);
    },
    reDistribute() {
      const params = {
        ...this.form,
        status: 0,
      };
      const formData = new FormData();
      for (let key in params) {
        formData.append(key, params[key]);
      }
      this.doCheck(formData);
    },
    doCheck(params) {
      task.taskCheck(params).then(res => {
        if (res.code.toString() === '200' && res.message === 'ok') {
          this.$message({
            type: 'success',
            message: '成功',
          });
          this.$refs['manual-upload'].$refs['upload'].clearFiles();
          this.$emit('refresh');
          this.close();
        }
      });
    },
    handleImage(data) {
      const { azimuth } = data;
      // this.containerHeight = '300px';
      // this.imagePath = fullPath;
      // this.showImage = true;

      if (azimuth) {
        this.map.setLayoutProperty(
          'direction-symbol',
          'icon-rotate',
          Number(azimuth),
        );
        this.map.setLayoutProperty('direction-symbol', 'visibility', 'visible');
      }
    },
    handleToggle(name) {
      if (name === '调查范围') {
        this.showPcGeojson = !this.showPcGeojson;
        if (this.showPcGeojson) {
          const data = {
            type: 'Feature',
            geometry: JSON.parse(this.pcGeojson),
          };
          if (this.map.getSource('pc-geo-source')) {
            this.map.getSource('pc-geo-source').setData(data);
          } else {
            this.map.addSource('pc-geo-source', {
              type: 'geojson',
              data,
            });
            this.map.addLayer({
              id: 'pc-geo-fill',
              type: 'fill',
              source: 'pc-geo-source',
              paint: {
                'fill-opacity': 0.3,
              },
            });
            this.map.addLayer({
              id: 'pc-geo-line',
              type: 'line',
              source: 'pc-geo-source',
              paint: {
                'line-width': 2,
                'line-color': '#409eff',
              },
            });
          }
        } else {
          this.map.getSource('pc-geo-source') &&
            this.map.getSource('pc-geo-source').setData({
              type: 'FeatureCollection',
              features: [],
            });
        }
      } else if (name === '下发范围') {
        this.showOriginGeojson = !this.showOriginGeojson;
        if (!this.showOriginGeojson) {
          this.marker && this.marker.remove();
          this.setGeojson(this.map, 'geo-source', {
            type: 'FeatureCollection',
            features: [],
          });
          this.setGeojson(this.map, 'geo-symbol', {
            type: 'FeatureCollection',
            features: [],
          });
        } else {
          const geojson = JSON.parse(this.geojson);
          const center = turf.center(geojson);

          this.addMarker(center);
          this.setGeojson(this.map, 'geo-source', {
            type: 'Feature',
            geometry: geojson,
          });
          this.setGeojson(this.map, 'geo-symbol', center);
        }
      }
    },
    async getFlowLog(params) {
      const res = await task.getFlowLog(params);
      const { sjLog, qxLog } = res;
      if (this.type === 'qx') {
        if (!qxLog) return false;
        this.suggestion = qxLog.suggestion;
        if (this.data.checkFlowStage === 4 || this.data.checkFlowStage === 5) {
          this.form.suggestion = qxLog.suggestion;
          this.content = `市级审核意见: ${sjLog.suggestion || '无'}`;
          this.contentTitle = '市级审核意见:';
          this.content = sjLog.suggestion;
        }
      } else if (this.type === 'sj') {
        if (!sjLog) return false;
        this.suggestion = sjLog.suggestion;
        if (qxLog) {
          // this.content = `区县审核意见: ${qxLog.suggestion}`;
          this.contentTitle = '区县审核意见:';
          this.content = qxLog.suggestion;
        }
      }
    },
    togglePopover() {
      if (
        // this.data.checkFlowStage === 3 ||
        this.data.checkFlowStage === 4 ||
        this.data.checkFlowStage === 5
      ) {
        this.visible = !this.visible;
      }
    },
  },
};
</script>

<style lang="scss">
.suggestion-content {
  // padding: 5px 20px;
  // background-color: #f1f1f1;
  // border-radius: 5px;
}
.sug-title {
  padding-right: 4px;
  color: #969696;
}
.sj-review {
  display: flex;
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
  .left,
  .right {
    width: 50%;
    flex-shrink: 0;
  }
  .map-container {
    position: relative;
    // .title {
    //   font-size: $font-xs;
    //   display: block;
    //   background-color: rgba(255, 255, 255, 0.8);
    //   padding: 5px 8px;
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    // }
    .ranges {
      position: absolute;
      top: 3px;
      left: 3px;
      .btn {
        padding: 3px;
        border-radius: 3px;
        background-color: rgba(255, 255, 255, 0.8);
        border: 1px solid #e6e6e6;
        display: inline-block;
        margin-right: 10px;
        font-size: 12px;
        cursor: pointer;
        outline: none;
      }
      .btn.active {
        color: #409eff;
      }
    }
  }
  .image-container {
    border-top: 1px solid #e6e6e6;
    box-sizing: border-box;
    height: 300px;
    overflow: auto;
    img {
      max-width: 100%;
    }
  }
  .right {
    .head {
      padding: 0 20px;
      height: 40px;
      // background-color: #5d7b9a;
      background-color: #0087d7;
      line-height: 40px;
      position: relative;
      .close {
        cursor: pointer;
        font-size: $font-lg;
        position: absolute;
        right: 10px;
        color: #fff;
      }
      .tabs {
        width: 100%;
        height: 100%;
        display: flex;
        span {
          color: #fff;
          width: 25%;
          display: flex;
          justify-content: center;
          height: 100%;
          margin-right: 30px;
          box-sizing: border-box;
          cursor: pointer;
          text-align: center;
        }
        span.active {
          margin-top: 8px;
          // color: #5d7b9a;
          color: #0087d7;
          font-weight: bold;
          background-color: #fff;
          // border-bottom: 3px solid #0094ec;
          border-radius: 5px;
        }
      }
    }
    .suggestion {
      padding: 15px 20px 0px;
      height: 130px;
      box-sizing: border-box;
    }
    .people {
      height: 50px;
      padding: 0 20px;
      background-color: #e8f2f2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .action {
      height: 40px;
      // background-color: #5d7b9a;
      background-color: #0087d7;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: $base-color;
      .toggle {
        span {
          cursor: pointer;
        }
        span:first-child {
          padding-right: 20px;
        }
      }
      .operation {
        .radio-group {
          padding: 0 15px;
          .el-radio {
            // color: #ffffff40;
            color: #fff;
          }
          .el-radio__input.is-checked + .el-radio__label {
            color: #fff;
          }
          .el-radio__input.is-checked .el-radio__inner {
            border-color: #4eb4ee;
            background: #4eb4ee;
          }
        }
        .submit-botton {
          color: #fff;
          width: 80px;
          background-color: #ffffff40;
          border: none;
          border-radius: 15px;
        }
      }
    }
  }
}
</style>
