<template>
  <div class="geo-edit">
    <button class="btn btn-toggle">
      <svg-icon
        style="fill: #409eff; height: 1.5em; width: 1.5em;"
        iconClass="aim"
      />
      <span v-show="showAppGeojson" @click="handleToggle('下发范围')"
        >下发范围</span
      >
      <span v-show="!showAppGeojson" @click="handleToggle('调查范围')"
        >调查范围</span
      >
    </button>
    <div class="btns" v-if="canEdit">
      <button
        class="btn btn-trigger"
        @click="geoEdit()"
        :class="{ active: isDrawing }"
      >
        <svg-icon
          iconClass="draw"
          :style="{ height: '1.5em', width: '1.5em' }"
        />空间编辑
      </button>
      <button class="btn btn-save" v-show="isDrawing">保存</button>
    </div>
  </div>
</template>

<script>
import d2c from 'd2c';
// import drawStyles from './draw-style';
export default {
  name: 'geo-edit',
  props: {
    map: {
      type: Object,
    },
    originGeojson: {
      type: String,
    },
    appGeojson: {
      type: String,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      D2c: d2c || window.d2c,
      draw: null,
      mode: 'simple_select',
      data: '',
      drawing: false,
      show: false,
      featureId: 'geo-edit-id',
      showAppGeojson: false,
      isDrawing: false,
      pcGeojson: '',
    };
  },
  mounted() {
    if (this.map) {
      this.initDraw();
    }
  },
  methods: {
    handleToggle(name) {
      switch (name) {
        case '调查范围': {
          if (!this.isDrawing) {
            if (this.appGeojson) {
              this.addGeoLayer(this.map, this.appGeojson);
              this.showAppGeojson = true;
            }
          } else {
            if (this.appGeojson) {
              this.handleEdit(this.appGeojson);
              this.showAppGeojson = true;
            }
          }
          break;
        }
        case '下发范围': {
          if (!this.isDrawing) {
            this.clearGeoLayer(this.map);
            this.showAppGeojson = false;
          } else {
            this.clearGeoLayer(this.map);
            this.handleEdit(this.originGeojson);
            this.showAppGeojson = false;
          }
        }
      }
    },
    addGeoLayer(map, geojson) {
      geojson =
        typeof geojson === 'string'
          ? { type: 'Feature', geometry: JSON.parse(geojson) }
          : geojson;
      if (map.getSource('app-geo-source')) {
        this.setGeojson(map, geojson);
        return true;
      }
      map.addSource('app-geo-source', {
        type: 'geojson',
        data: geojson,
      });
      map.addLayer({
        id: 'app-geo-fill',
        type: 'fill',
        source: 'app-geo-source',
        paint: {
          'fill-opacity': 0.3,
          'fill-color': '#0087D7',
        },
      });
      map.addLayer({
        id: 'app-geo-line',
        type: 'line',
        source: 'app-geo-source',
        paint: {
          'line-width': 2,
          'line-color': '#F56C6C',
        },
      });
    },
    setGeojson(map, geojson) {
      geojson =
        typeof geojson === 'string'
          ? { type: 'Feature', geometry: JSON.parse(geojson) }
          : geojson;
      map.getSource('app-geo-source').setData(geojson);
    },
    clearGeoLayer(map) {
      map.getSource('app-geo-source').setData({
        type: 'FeatureCollection',
        features: [],
      });
    },
    initDraw() {
      if (this.map.draw) {
        this.draw = this.map.draw();
      } else {
        this.draw = new this.D2c.draw({
          displayControlsDefault: false,
        });
        this.map.addControl(this.draw);
      }
      this.bindEvent();
    },
    clearDraw() {
      this.draw && this.draw.deleteAll();
    },
    handleEdit(geojson) {
      this.draw && this.draw.deleteAll();
      if (geojson) {
        geojson = JSON.parse(geojson);
        const feature = {
          id: this.featureId,
          type: 'Feature',
          properties: {},
          geometry: geojson,
        };
        this.draw.add(feature);
        this.draw.changeMode('direct_select', {
          featureId: this.featureId,
        });
      }
    },
    geoEdit() {
      this.isDrawing = !this.isDrawing;
      if (this.isDrawing) {
        this.draw && this.draw.deleteAll();
        if (this.showAppGeojson) {
          this.appGeojson && this.handleEdit(this.appGeojson);
        } else {
          this.originGeojson && this.handleEdit(this.originGeojson);
        }
      } else {
        this.draw && this.draw.deleteAll();
      }
    },
    bindEvent() {
      this.map.doubleClickZoom.disable();
      this.map.on('draw.create', this.handleDraw);
      this.map.on('draw.update', this.handleDraw);
      this.map.on('draw.modechange', this.handleMode);
    },
    handleDraw() {
      const data = this.draw.getAll();
      console.log(data);
    },
    clear() {
      this.draw.deleteAll();
      this.draw.changeMode(this.mode);
      this.show = false;
    },
    handleMode(e) {
      if (e.mode !== this.mode) {
        this.draw.changeMode(this.mode);
      }
    },
    offEvent() {
      this.map.off('draw.create', this.handleDraw);
      this.map.off('draw.update', this.handleDraw);
      this.map.off('draw.changeMode', this.handleMode);
    },
    destroy() {
      this.offEvent();
      this.draw.changeMode('simple_select');
    },
  },
};
</script>

<style lang="scss">
.geo-edit {
  .btn {
    height: 30px;
    padding: 0 8px;
    outline: 0;
    border-radius: 5px;
    border: 1px solid #e6e6e6;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0094ec;
    cursor: pointer;
  }
  .btn-toggle {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .btns {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    .btn-trigger {
      margin-right: 10px;
      color: #606266;
    }
    .btn-trigger.active {
      color: #0094ec;
    }
  }
}
</style>
