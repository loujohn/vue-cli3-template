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
        <el-steps
          :active="activeTabIndex"
          style="width:calc(100% - 10px)"
          finish-status="success"
          simple
        >
          <el-step
            v-for="(tab, index) in tabs"
            :key="index"
            :title="tab.name"
          ></el-step>
        </el-steps>
        <span class="close" @click="close()">
          <i class="el-icon-close"></i>
        </span>
      </div>
      <div class="review-box">
        <div class="base-info" v-show="activeTabIndex === 0">
          <el-row :gutter="10">
            <el-col :span="12" v-for="item in fieldList" :key="item.id">
              <span class="label">{{ item.fieldAlias }}:</span>
              <span class="content">{{ item.fieldValue }}</span>
            </el-col>
          </el-row>
        </div>
        <v-image
          v-show="activeTabIndex === 1"
          :images="imagesList"
          @file-path="hanldeImage"
        />
        <v-video :videos="videoList" v-show="activeTabIndex === 2" />
        <div
          class="approval"
          style="height:470px"
          v-show="activeTabIndex === 3"
        >
          <div class="suggestion">
            <el-form
              ref="form"
              :model="form"
              label-width="100px"
              label-position="left"
            >
              <el-form-item label="审核：">
                <el-radio-group class="radio-group" v-model="form.status">
                  <el-radio :label="1">通过</el-radio>
                  <el-radio :label="0">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审核意见：">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="form.suggestion"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="people">
            <span>调查人员: 王二小</span>
            <span>调查日期: {{ data.surveyTime }}</span>
            <span>图斑状态: {{ data.surveyStatus ? '已审核' : '未审核' }}</span>
          </div>
        </div>
        <div class="action">
          <div class="toggle">
            <span>上一条</span>
            <span>下一条</span>
          </div>
          <div class="operation">
            <template v-if="activeTabIndex < 3">
              <el-button size="mini" @click="pre" v-if="activeTabIndex > 0"
                >上一步</el-button
              >
              <el-button size="mini" @click="next">下一步</el-button>
            </template>
            <template v-else>
              <el-button size="mini" @click="pre" v-if="activeTabIndex > 0"
                >上一步</el-button
              >
              <el-button size="mini" @click="check()">提交</el-button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vMap from 'components/map/map';
import vImage from 'components/image/image';
import vVideo from 'components/video/video';
import imgTest from 'assets/images/sj/test.png';
import { task } from 'api';
import turf from 'turf';
import iconLocation from 'assets/images/sj/location.png';
const img = new Image();
img.src = iconLocation;
img.style.height = '20px';
img.style.width = '20px';
export default {
  name: 'review',
  components: {
    vMap,
    vImage,
    vVideo,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      imgTest,
      tabs: [
        { name: '文字' },
        { name: '照片' },
        { name: '视频' },
        { name: '意见' },
      ],
      activeTabIndex: 0,
      form: {
        taskRecordId: '',
        suggestion: '',
        status: 1,
      },
      fieldList: [],
      imagesList: [],
      geojson: '',
      map: null,
      containerHeight: '600px',
      imagePath: '',
      showImage: false,
      videoList: [],
    };
  },
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
            this.setGeojson('geo-source', data);
            const center = turf.center(geojson);
            this.setGeojson('geo-symbol', center);
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
  methods: {
    pre() {
      this.activeTabIndex -= 1;
    },
    next() {
      this.activeTabIndex += 1;
    },
    close() {
      this.$emit('close');
      this.activeTabIndex = 0;
      this.containerHeight = '600px';
    },
    setActiveTabIndex(index) {
      this.activeTabIndex = index;
    },
    check() {
      const params = {
        ...this.form,
      };
      task.taskCheck(params).then(res => {
        if (res.code.toString() === '200' && res.message === 'ok') {
          this.$message({
            type: 'success',
            message: '提交成功',
          });
          this.close();
        }
      });
    },
    hanldeImage(path) {
      console.log(path);
      this.containerHeight = '300px';
      this.imagePath = path;
      this.showImage = true;
    },
    handleMapLoad(e) {
      const map = e.target;
      this.map = map;
      this.addGeoLayer(map);
      this.addSymbolLayer(map);

      if (this.geojson) {
        const bbox = turf.bbox(JSON.parse(this.geojson));
        this.map.fitBounds(bbox);
      }
    },
    addGeoLayer(map) {
      map.addSource('geo-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
      map.addLayer({
        id: 'geo-fill',
        type: 'fill',
        source: 'geo-source',
        paint: {
          'fill-opacity': 0.3,
        },
      });
      this.map.addLayer({
        id: 'geo-line',
        type: 'line',
        source: 'geo-source',
        paint: {
          'line-color': '#c08f01',
          'line-width': 2,
        },
      });

      if (this.geojson) {
        const geojson = JSON.parse(this.geojson);
        map.getSource('geo-source').setData({
          type: 'Feature',
          geometry: geojson,
        });
      }
    },
    addSymbolLayer(map) {
      map.addImage('icon-location', img);
      map.addSource('geo-symbol', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
      map.addLayer({
        id: 'location-symbol',
        type: 'symbol',
        source: 'geo-symbol',
        layout: {
          'icon-image': 'icon-location',
          'icon-size': 0.15,
        },
      });
      if (this.geojson) {
        const geojson = JSON.parse(this.geojson);
        const center = turf.center(geojson);
        map.getSource('geo-symbol').setData(center);
      }
    },
    setGeojson(sourceId, geojson) {
      this.map &&
        this.map.getSource(sourceId) &&
        this.map.getSource(sourceId).setData(geojson);
    },
  },
  beforeDestroy() {
    this.map.hasImage('icon-location') && this.map.removeImage('icon-location');
    this.map.getLayer('location-symbol') &&
      this.map.removeLayer('location-symbol');
    this.map.getLayer('geo-line') && this.map.removeLayer('geo-line');
    this.map.getLayer('geo-fill') && this.map.removeLayer('geo-fill');
    this.map.getSource('geo-source') && this.map.removeSource('geo-source');
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
    // height: 600px;
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
      padding: 0;
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
      .el-step.is-simple .el-step__head {
        line-height: 100%;
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
    .base-info {
      padding: 30px 20px;
      color: #000;
      height: 470px;
      overflow: auto;
      box-sizing: border-box;
      border-bottom: 1px solid #e6e6e6;
      .label,
      .content {
        display: inline-block;
        padding-bottom: 25px;
      }
      .label {
        width: 110px;
        text-align: left;
      }
    }
    .suggestion {
      padding: 30px 20px;
      height: 420px;
      box-sizing: border-box;
      .el-textarea__inner {
        background-color: #f8f8f8;
      }
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
