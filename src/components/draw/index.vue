<template>
  <div class="draw" @click="toggle()">
    <span
      class="trigger"
      :class="{ 'is-drawing': drawing, 'not-drawing': !drawing }"
    >
      <svg-icon iconClass="draw" style="height: 1.5em; width: 1.5em;" />空间选择
    </span>
  </div>
</template>

<script>
import d2c from 'd2c';
import drawStyle from './draw-style';
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
          styles: drawStyle,
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
      this.$confirm('确定使用该范围?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.confirm();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
          this.draw.deleteAll();
          this.draw.changeMode(this.mode);
        });
    },
    clear() {
      this.draw.deleteAll();
      this.draw.changeMode(this.mode);
      this.show = false;
    },
    confirm() {
      const { features } = this.data;
      const feature = features[0];
      this.draw.deleteAll();
      this.draw.changeMode('simple_select');
      this.drawing = false;
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
  .trigger {
    display: flex;
    align-items: center;
    background-color: $base-color;
    border-radius: 3px;
    font-size: 12px;
    padding: 6px;
    cursor: pointer;
    margin-right: 5px;
  }
  .is-drawing {
    color: #409eff;
  }
  .not-drawing {
    color: #303133;
  }
}
</style>
