<template>
  <div class="dc-particular">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>调查员</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'dc-list' }"
        >任务列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>任务详情</el-breadcrumb-item>
      <el-breadcrumb-item>图斑详情</el-breadcrumb-item>
    </el-breadcrumb>
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
          <v-image v-show="activeTabIndex === 1" />
          <v-video v-show="activeTabIndex === 2" />
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
export default {
  name: 'dc-particular',
  components: {
    vMap,
    geojsonEdit,
    vImage,
    vVideo,
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
    };
  },
  methods: {
    handleMapLoad(e) {
      this.map = e.target;
    },
    handleTabClick(index) {
      this.activeTabIndex = index;
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
          color: #0e67f2;
          border-bottom: 3px solid #0e67f2;
        }
      }
    }
  }
}
</style>