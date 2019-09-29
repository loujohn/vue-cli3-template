<template>
  <div class="geo-edit">
    <button class="btn btn-toggle">
      <svg-icon
        style="fill: #409eff; height: 1.5em; width: 1.5em;"
        iconClass="aim"
      />下发范围
    </button>
    <div class="btns">
      <button class="btn btn-trigger">
        <svg-icon
          iconClass="draw"
          style="height: 1.5em; width: 1.5em;"
        />空间编辑
      </button>
      <button class="btn btn-save">保存</button>
    </div>
  </div>
</template>

<script>
import d2c from 'd2c';
export default {
  name: 'geo-edit',
  props: ['map', 'geojson'],
  data() {
    return {
      D2c: d2c || window.d2c,
      draw: null,
      mode: 'simple_select',
      data: '',
      drawing: false,
      show: false,
      featureId: 'geo-edit-id',
    };
  },
  watch: {
    geojson: function(oldVal, newVal) {
      if (oldVal) {
        this.draw && this.draw.deleteAll();
        this.draw.changeMode('simple_select');
      }
    },
  },
  mounted() {
    if (this.map) {
      this.initDraw();
    }
  },
  methods: {
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
    handleEdit() {
      if (this.geojson) {
        const geojson = JSON.parse(this.geojson);
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
    bindEvent() {
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
  // position: absolute;
  // top: 10px;
  // right: 10px;
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
    }
  }
}
</style>
