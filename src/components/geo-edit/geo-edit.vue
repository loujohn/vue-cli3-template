<template>
  <div class="geo-edit">
    <el-button size="mini" @click="handleEdit()">编辑</el-button>
    <!-- <el-button size="mini" @click="clearDraw()">清除</el-button> -->
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
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
