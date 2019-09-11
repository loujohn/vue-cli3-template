<template>
  <div class="draw" @click="toggle()">
    <span>
      <svg-icon iconClass="draw" style="height: 1.5em; width: 1.5em;" />空间选择
    </span>
    <span v-show="show" class="confirm" @click="confirm()">确定</span>
    <span v-show="show" class="clear" @click="clear()">清除</span>
  </div>
</template>

<script>
import d2c from 'd2c';
export default {
  name: 'd2c-map-draw',
  props: ['map'],
  data() {
    return {
      D2c: d2c || window.d2c,
      draw: null,
      mode: 'draw_polygon',
      range: '',
      drawing: false,
      data: '',
      show: false,
    };
  },
  methods: {
    toggle() {
      this.drawing = !this.drawing;
      if (this.drawing) {
        this.initDraw();
      } else {
        this.draw.deleteAll();
        this.draw.changeMode('simple_select');
      }
    },
    initDraw() {
      if (this.map.draw) {
        this.draw = this.map.draw;
      } else {
        this.draw = new this.D2c.draw({
          displayControlsDefault: false,
          styles: [
            {
              id: 'gl-draw-line',
              type: 'line',
              filter: [
                'all',
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'static'],
              ],
              layout: {
                'line-cap': 'round',
                'line-join': 'round',
              },
              paint: {
                'line-color': '#D20C0C',
                'line-dasharray': [0.2, 2],
                'line-width': 2,
              },
            },
            // polygon fill
            {
              id: 'gl-draw-polygon-fill',
              type: 'fill',
              filter: [
                'all',
                ['==', '$type', 'Polygon'],
                ['!=', 'mode', 'static'],
              ],
              paint: {
                'fill-color': '#D20C0C',
                'fill-outline-color': '#D20C0C',
                'fill-opacity': 0.1,
              },
            },
            // polygon outline stroke
            // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
            {
              id: 'gl-draw-polygon-stroke-active',
              type: 'line',
              filter: [
                'all',
                ['==', '$type', 'Polygon'],
                ['!=', 'mode', 'static'],
              ],
              layout: {
                'line-cap': 'round',
                'line-join': 'round',
              },
              paint: {
                'line-color': '#D20C0C',
                // 'line-dasharray': [0.2, 2],
                // 'line-width': 2,
              },
            },
            // vertex point halos
            {
              id: 'gl-draw-polygon-and-line-vertex-halo-active',
              type: 'circle',
              filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static'],
              ],
              paint: {
                'circle-radius': 5,
                'circle-color': '#FFF',
              },
            },
            // vertex points
            {
              id: 'gl-draw-polygon-and-line-vertex-active',
              type: 'circle',
              filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static'],
              ],
              paint: {
                'circle-radius': 3,
                'circle-color': '#D20C0C',
              },
            },

            // INACTIVE (static, already drawn)
            // line stroke
            {
              id: 'gl-draw-line-static',
              type: 'line',
              filter: [
                'all',
                ['==', '$type', 'LineString'],
                ['==', 'mode', 'static'],
              ],
              layout: {
                'line-cap': 'round',
                'line-join': 'round',
              },
              paint: {
                'line-color': '#000',
                'line-width': 3,
              },
            },
            // polygon fill
            {
              id: 'gl-draw-polygon-fill-static',
              type: 'fill',
              filter: [
                'all',
                ['==', '$type', 'Polygon'],
                ['==', 'mode', 'static'],
              ],
              paint: {
                'fill-color': '#000',
                'fill-outline-color': '#000',
                'fill-opacity': 0.1,
              },
            },
            // polygon outline
            {
              id: 'gl-draw-polygon-stroke-static',
              type: 'line',
              filter: [
                'all',
                ['==', '$type', 'Polygon'],
                ['==', 'mode', 'static'],
              ],
              layout: {
                'line-cap': 'round',
                'line-join': 'round',
              },
              paint: {
                'line-color': '#000',
                'line-width': 3,
              },
            },
          ],
        });
        this.map.draw = this.draw;
        this.map.addControl(this.draw);
      }
      this.draw.changeMode(this.mode);
      this.bindEvent();
    },
    bindEvent() {
      this.map.on('draw.create', this.handleDraw);
      this.map.on('draw.update', this.handleDraw);
      this.map.on('draw.modechange', this.handleMode);
    },
    handleDraw() {
      this.data = this.draw.getAll();
      this.show = true;
    },
    clear() {
      this.draw.deleteAll();
      this.draw.changeMode(this.mode);
      this.show = false;
    },
    confirm() {
      const { features } = this.data;
      const feature = features[0];
      this.$emit('finish-draw', feature.geometry);
    },
    handleMode(e) {
      if (e.mode !== this.mode) {
        this.draw.changeMode(this.mode);
      }
    },
    offEvent() {
      this.map.off('draw.create', this.handleDraw);
      this.map.on('draw.update', this.handleDraw);
      this.map.off('draw.modeChange', this.handleMode);
    },
    destroy() {
      this.offEvent();
      this.draw.changeMode('simple_select');
    },
  },
};
</script>

<style lang="scss">
.draw {
  position: absolute;
  top: 10px;
  right: 15px;
  display: flex;
  span {
    display: flex;
    align-items: center;
    background-color: $base-color;
    border-radius: 3px;
    font-size: 12px;
    padding: 6px;
    cursor: pointer;
    display: inline-block;
    margin-right: 5px;
  }
  .confirm {
    color: #67c23a;
  }
  .clear {
    color: #409eff;
  }
}
</style>
