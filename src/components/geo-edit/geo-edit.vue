<template>
  <div class="geo-edit">
    <div class="ranges">
      <button
        class="btn btn-toggle"
        :class="{ active: btnOriginActive }"
        v-show="originGeojson"
        @click="handleToggle('下发范围')"
      >
        <svg-icon
          class="svg-icon"
          style="height: 1.5em; width: 1.5em;"
          iconClass="aim"
        />
        <span>下发范围</span>
      </button>
      <button
        class="btn btn-toggle"
        :class="{ active: btnCheckActive }"
        v-show="pcGeojson"
        @click="handleToggle('调查范围')"
      >
        <svg-icon
          class="svg-icon"
          style="height: 1.5em; width: 1.5em;"
          iconClass="aim"
        />
        <span>调查范围</span>
      </button>
      <button
        class="btn btn-toggle"
        :class="{ active: btnAssistActive }"
        v-show="appGeojson && !pcGeojson"
        @click="handleToggle('辅助范围')"
      >
        <svg-icon
          class="svg-icon"
          style="height: 1.5em; width: 1.5em;"
          iconClass="aim"
        />
        <span>辅助范围</span>
      </button>
    </div>
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
      <button class="btn btn-save" v-show="isDrawing" @click="save()">
        保存
      </button>
    </div>
  </div>
</template>

<script>
import d2c from 'd2c';
// import drawStyles from './draw-style';
import { survey } from 'api';
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
    pcGeojson: {
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
      form: {
        pcGeojson: '',
      },
      btnAssistActive: false,
      btnCheckActive: false,
      btnOriginActive: true,
    };
  },
  mounted() {
    if (this.map) {
      this.initDraw();
    }
  },
  methods: {
    handleToggle(name) {
      let active;
      if (name === '调查范围') {
        this.btnCheckActive = !this.btnCheckActive;
        active = this.btnCheckActive;
      } else if (name === '辅助范围') {
        this.btnAssistActive = !this.btnAssistActive;
        active = this.btnAssistActive;
      } else if (name === '下发范围') {
        this.btnOriginActive = !this.btnOriginActive;
        active = this.btnOriginActive;
      }
      this.$emit('toggle-geo-layer', {
        name,
        active,
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
        if (this.pcGeojson) {
          this.handleEdit(this.pcGeojson);
          return true;
        } else if (this.appGeojson) {
          this.handleEdit(this.appGeojson);
          return true;
        } else if (this.originGeojson) {
          this.handleEdit(this.originGeojson);
          return true;
        } else {
          return false;
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
      const { features } = data;
      if (features.length === 0) {
        return false;
      }
      const feature = features[0];
      const { geometry } = feature;
      this.form.pcGeojson = JSON.stringify(geometry);
    },
    async save() {
      const params = {
        taskRecordId: this.$route.query.id,
        pcGeojson: this.form.pcGeojson,
      };
      const res = await survey.saveTaskRecordInfo(params);
      if (res.code === 200 && res.message === 'ok') {
        this.$message({
          type: 'success',
          message: '保存成功',
        });
        this.form.pcGeojson = '';
        this.draw && this.draw.deleteAll();
        this.isDrawing = false;
        this.$emit('finish-edit');
      }
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
    cursor: pointer;
  }
  .btn.active {
    color: #409eff;
  }
  .ranges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
  }
  .btn-toggle {
    margin-right: 5px;
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
