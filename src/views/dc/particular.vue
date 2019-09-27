<template>
  <div class="dc-particular">
    <div class="my-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><i class="el-icon-s-home"></i> 调查员</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'dc-list' }"
          >任务列表</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ name: 'dc-detail', query: { id: taskId } }"
          >任务详情</el-breadcrumb-item
        >
        <el-breadcrumb-item>图斑详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
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
          <base-info :fields="fieldList" v-show="activeTabIndex === 0" />
          <v-image :imageObj="imageObj" v-show="activeTabIndex === 1" />
          <v-video :videos="videoList" v-show="activeTabIndex === 2" />
        </div>
      </div>
      <div class="map-container">
        <v-map @load="handleMapLoad" />
        <geojson-edit :map="map" v-if="map" />
      </div>
    </div>
  </div>
</template>
<script>
import vMap from 'components/map/map';
import geojsonEdit from 'components/geo-edit/geo-edit';
import vImage from 'components/image/image';
import vVideo from 'components/video/video';
import baseInfo from 'components/base-info/baseInfo';
import { task } from 'api';
export default {
  name: 'dc-particular',
  components: {
    vMap,
    geojsonEdit,
    vImage,
    vVideo,
    baseInfo,
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
    };
  },
  mounted() {
    this.getTaskDetail();
  },
  methods: {
    handleMapLoad(e) {
      this.map = e.target;
    },
    handleTabClick(index) {
      this.activeTabIndex = index;
    },
    async getTaskDetail() {
      const params = { id: this.id };
      const data = await task.getTaskDetail(params);
      let {
        taskId,
        referenceInfo: {
          fieldsList,
          farImageFiles,
          nearImageFiles,
          otherImageFiles,
          vedioFiles,
        },
      } = data;
      this.taskId = taskId;
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
    },
  },
};
</script>

<style lang="scss">
.dc-particular {
  padding: 30px 40px;
  padding-top: 0;
  box-sizing: border-box;
  height: 100%;
  .content {
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
      color:#FFF;
      display:block;
      position:relative;
      text-decoration: none;
      background: #0094ec;
      height: 40px;
      width: 60px;
      line-height:40px;
      padding: 0 10px 0 5px;
      text-align: center;
      margin-right: 23px;
      &:first-child{
        padding-left:15px;
        border-radius: 4px 0 0 4px;
        &:before{
          border:none;
        }
      }

      &:before,
      &:after{
        content: "";
        position:absolute;
        top: 0;
        border:0 solid #0094ec;
        border-width:20px 10px;
        width: 0;
        height: 0;
      }
      &:before{
        left:-20px;
        border-left-color:transparent;
      }
      &:after{
        left:100%;
        border-color:transparent;
        border-left-color:#0094ec;
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