<template>
  <div class="sj-review">
    <div class="left">
      <div class="map-container" :style="{ height: containerHeight }">
        <v-map
          @load="handleMapLoad"
          :containerHeight="containerHeight"
          :geojson="geojson"
        />
        <span class="title">空间查看</span>
      </div>
      <div class="image-container" v-show="showImage">
        <img :src="imagePath" alt="图片" />
      </div>
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
                v-if="operator === 'check'"
                type="textarea"
                :rows="4"
                v-model="form.suggestion"
              ></el-input>
              <span v-else>{{ form.suggestion }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="people">
          <span>调查人员: {{ data.surveyUserName }}</span>
          <span>调查日期: {{ data.surveyTime }}</span>
          <span>图斑状态: {{ data.checkFlowStage | checkStatus }}</span>
        </div>
        <div class="action">
          <div class="toggle">
            <span>上一条</span>
            <span>下一条</span>
          </div>
          <div class="operation" v-show="operator === 'check'">
            <span>审核:</span>
            <el-radio-group class="radio-group" v-model="form.status">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="0">不通过</el-radio>
            </el-radio-group>
            <el-button size="mini" @click="check()">提交</el-button>
          </div>
        </div>
      </div>
      <v-image
        v-show="activeTabIndex === 1"
        :images="imagesList"
        @file-path="handleImage"
      />
      <v-video v-show="activeTabIndex === 2" :videos="videoList" />
      <manual-upload v-show="activeTabIndex === 3" />
    </div>
  </div>
</template>

<script>
import vMap from 'components/map/map';
import vImage from 'components/image/image';
import vVideo from 'components/video/video';
import manualUpload from 'components/upload/manual-upload';
import geoHandler from 'mixins/geo-handler';
import baseInfo from '../base-info/baseInfo';
import { task } from 'api';
import turf from 'turf';
import { checkStatus } from 'filters';
export default {
  name: 'review',
  components: {
    vMap,
    vImage,
    vVideo,
    baseInfo,
    manualUpload,
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
        { name: '文字' },
        { name: '照片' },
        { name: '视频' },
        { name: '附件' },
      ],
      activeTabIndex: 0,
      form: {
        taskRecordId: '',
        suggestion: '',
        status: 1,
      },
      fieldList: [],
      imagesList: [],
      containerHeight: '600px',
      imagePath: '',
      showImage: false,
      videoList: [],
    };
  },
  computed: {},
  watch: {
    data: {
      handler: function(val) {
        if (val) {
          this.form.taskRecordId = val.id;
          if (!val.referenceInfo) return false;
          let {
            referenceInfo: { fieldsList, imageFiles, vedioFiles },
          } = val;
          this.imagesList = imageFiles;
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
            this.setGeojson(this.map, 'geo-symbol', center);
            const bbox = turf.bbox(geojson);
            this.map.fitBounds(bbox);
          }
        }
      },
      immediate: true,
      deep: true,
    },
    activeTabIndex: function(val) {
      if (val !== 1) {
        this.showImage = false;
        this.imagePath = '';
        if (this.containerHeight !== '600px') this.containerHeight = '600px';
      }
    },
  },
  filters: {
    checkStatus,
  },
  methods: {
    close() {
      this.$emit('close');
      this.activeTabIndex = 0;
      this.containerHeight = '600px';
      for (let key in this.form) {
        this.form[key] = '';
      }
    },
    setActiveTabIndex(index) {
      this.activeTabIndex = index;
    },
    check() {
      const params = {
        ...this.form,
      };
      // console.log(this.$refs.review1Word.form);
      task.taskCheck(params).then(res => {
        if (res.code.toString() === '200' && res.message === 'ok') {
          this.$message({
            type: 'success',
            message: '提交成功',
          });
          this.$emit('refresh');
          this.close();
        }
      });
    },
    handleImage(path) {
      this.containerHeight = '300px';
      this.imagePath = path;
      this.showImage = true;
    },
  },
};
</script>

<style lang="scss">
.sj-review {
  display: flex;
  .left,
  .right {
    width: 50%;
    flex-shrink: 0;
  }
  .map-container {
    position: relative;
    .title {
      font-size: $font-xs;
      display: block;
      background-color: rgba(255, 255, 255, 0.8);
      padding: 5px 8px;
      position: absolute;
      top: 0;
      left: 0;
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
      height: 50px;
      background-color: #f1f1f1;
      line-height: 50px;
      position: relative;
      .close {
        cursor: pointer;
        font-size: $font-lg;
        position: absolute;
        right: 10px;
      }
      .tabs {
        height: 100%;
        display: flex;
        span {
          display: flex;
          height: 100%;
          margin-right: 30px;
          box-sizing: border-box;
          cursor: pointer;
        }
        span.active {
          color: #0e67f2;
          border-bottom: 3px solid #0e67f2;
        }
      }
    }
    .suggestion {
      padding: 30px 20px;
      height: 170px;
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
      height: 80px;
      background-color: #0e67f2;
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
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
