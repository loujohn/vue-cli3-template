<template>
  <div class="task-allocation">
    <div class="data">
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
          <el-col :span="5">
            <span class="label">调查人员:</span>
            <el-select v-model="form.dcry" :size="size"></el-select>
          </el-col>
          <el-col :span="5">
            <span class="label">分发状态:</span>
            <el-select v-model="form.status" :size="size"></el-select>
          </el-col>
          <el-col :span="5">
            <span class="label">图斑编号:</span>
            <el-select v-model="form.tbbh" :size="size"></el-select>
          </el-col>
          <el-col :span="9">
            <div class="operation">
              <span class="select">
                已选择38个
                <el-button size="small"
                  ><svg-icon iconClass="分发"></svg-icon> 全部分发</el-button
                >
              </span>
              <el-button size="small" style="margin-left: 8px;"
                ><svg-icon iconClass="撤销"></svg-icon> 全部撤回</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table header-row-class-name="customer-table-header">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="图斑预编号"></el-table-column>
        <el-table-column label="图斑面积(亩)"></el-table-column>
        <el-table-column label="图斑类型"></el-table-column>
        <el-table-column label="调查人员"></el-table-column>
        <el-table-column label="分发状态"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </div>
    <div class="map-container">
      <v-map />
    </div>
  </div>
</template>

<script>
import { task } from 'api';
import turf from 'turf';
import vMap from 'components/map/map';
export default {
  name: 'task-allocation',
  components: {
    vMap,
  },
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      size: 'small',
      map: null,
      cards: [
        { name: '总图斑数', icon: '图斑', value: 300 },
        { name: '未分发', icon: '未分发', value: 300 },
        { name: '已分发', icon: '已分发', value: 300 },
      ],
      form: {
        dcry: '',
        status: '',
        tbbh: '',
      },
    };
  },
  methods: {
    async handleMapLoad(map) {
      this.map = map;
      const res = await task.getGeojson({ id: this.id });
      if (res.code.toString() === '200') {
        this.addGeoLayer(res.data);
      }
    },
    addGeoLayer(geojson) {
      if (!geojson) return false;
      if (this.map.getSource('geo-task')) {
        this.map.getSource('geo-task').setData(geojson);
        return false;
      } else {
        this.map.addSource('geo-task', {
          type: 'geojson',
          data: geojson,
        });
      }
      !this.map.getLayer('geo-task') &&
        this.map.addLayer({
          id: 'task-layer',
          type: 'fill',
          source: 'geo-task',
          paint: {
            'fill-color': 'green',
            'fill-opacity': 0.6,
          },
        });
      const bbox = turf.bbox(geojson);
      this.map.fitBounds(bbox);
    },
  },
  beforeDestroy() {
    this.map.getLayer('task-layer') && this.map.removeLayer('task-layer');
    this.map.getSource('geo-task') && this.map.removeSource('geo-task');
  },
};
</script>

<style lang="scss">
.task-allocation {
  display: flex;
  height: 100%;
  overflow: hidden;
  .data {
    width: 50%;
    background-color: #fff;
    .cards {
      display: flex;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #e6e6e6;
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
  }
}
</style>
