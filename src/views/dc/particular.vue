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
      <div class="operation-panel"></div>
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
export default {
  name: 'dc-particular',
  components: {
    vMap,
    geojsonEdit,
  },
  data() {
    return {
      map: null,
    };
  },
  methods: {
    handleMapLoad(e) {
      this.map = e.target;
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
    }
  }
}
</style>