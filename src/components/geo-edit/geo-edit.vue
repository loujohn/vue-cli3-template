<template>
  <div class="geo-edit">
    <div class="tools" v-if="canEdit">
      <span class="edit" @click="geoEdit()">
        <svg-icon iconClass="draw" :style="style"></svg-icon>
        编辑
      </span>
      <div class="tool" v-show="toolExpand">
        <span
          class="el-icon-back prev"
          :class="{ active: recordIndex !== 0 }"
          @click="prev()"
        ></span>
        <span
          class="el-icon-right next"
          :class="{ active: recordIndex < drawRecord.length - 1 }"
          @click="next()"
        ></span>
        <span class="restore" @click="restore()">
          <svg-icon :style="style" iconClass="restore"></svg-icon>
          还原
        </span>
        <el-popover v-model="showUploadPopover" trigger="manual">
          <el-upload
            :action="upload.url"
            :headers="upload.headers"
            :limit="1"
            :multiple="false"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-error="handleError"
            :on-exceed="handleExceed"
            ref="upload"
          >
            <el-button
              size="small"
              type="primary"
              icon="el-icon-upload"
              slot="trigger"
              >添加范围</el-button
            >
          </el-upload>
          <span class="custom" slot="reference" @click="showUpload()">
            <svg-icon iconClass="custom" :style="style"></svg-icon>
            自定义
          </span>
        </el-popover>
        <span class="save" @click="save()">
          保存
        </span>
        <span class="cancel" @click="cancel()">
          取消
        </span>
      </div>
    </div>
    <div class="toggles">
      <span
        class="btn origin"
        :class="{ active: btnOriginActive }"
        @click="handleToggle('下发范围')"
        v-show="originGeojson"
      >
        <i class="dot"></i>
        <span class="text">下发范围</span>
      </span>
      <span
        v-show="pcGeojson"
        class="btn pc"
        :class="{ active: btnCheckActive }"
        @click="handleToggle('调查范围')"
      >
        <i class="dot"></i>
        <span class="text">调查范围</span>
      </span>
      <span
        class="btn app"
        :class="{ active: btnAssistActive }"
        v-show="appGeojson && !pcGeojson"
        @click="handleToggle('辅助范围')"
      >
        <i class="dot"></i>
        <span class="text">辅助范围</span>
      </span>
    </div>
  </div>
</template>

<script>
import d2c from 'd2c';
import { survey } from 'api';
import upload from './upload';
export default {
  name: 'geo-edit',
  mixins: [upload],
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
      style: {
        height: '1.5em',
        width: '1.5em',
      },
      form: {
        pcGeojson: '',
      },
      D2c: d2c || window.d2c,
      draw: null,
      mode: 'simple_select',
      featureId: 'geo-edit-id',
      isDrawing: false,
      current: '下发范围',
      data: '',
      show: false,

      toolExpand: false,
      drawRecord: [],
      recordIndex: 0,

      showAppGeojson: false,
      btnAssistActive: false,
      btnCheckActive: false,
      btnOriginActive: true,
      showPopover: false,
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
      if (this.drawRecord.length === 0) {
        this.drawRecord.push(geojson);
      }
      this.draw && this.draw.deleteAll();
      if (geojson) {
        this.form.pcGeojson = geojson;
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
      this.toolExpand = true;
      // this.uploadClear();
      this.isDrawing = true;
      if (this.isDrawing) {
        this.draw && this.draw.deleteAll();
        this.showPopover = true;
        if (this.pcGeojson) {
          this.handleEdit(this.pcGeojson);
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
    restore() {
      if (this.isDrawing) {
        if (this.originGeojson) {
          this.handleEdit(this.originGeojson);
          this.drawRecord = [this.originGeojson];
          this.recordIndex = 0;
        }
      }
    },
    cancel() {
      this.$confirm('是否保存当前范围?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
      })
        .then(() => {
          this.save();
        })
        .catch(() => {
          this.draw && this.draw.deleteAll();
          this.form.pcGeojson = '';
          this.showPopover = false;
          this.isDrawing = false;
          this.toolExpand = false;
        });
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
      let { geometry } = feature;
      geometry = JSON.stringify(geometry);
      if (this.drawRecord.length === this.recordIndex + 1) {
        this.drawRecord.push(geometry);
      } else {
        this.drawRecord.splice(
          this.recordIndex,
          this.drawRecord.length - this.recordIndex,
          geometry,
        );
      }
      this.recordIndex++;
      this.form.pcGeojson = geometry;
    },
    next() {
      this.recordIndex++;
      if (this.recordIndex >= this.drawRecord.length) {
        this.recordIndex = this.drawRecord.length - 1;
      }
      this.handleEdit(this.drawRecord[this.recordIndex]);
    },
    prev() {
      this.recordIndex--;
      if (this.recordIndex < 0) {
        this.recordIndex = 0;
      }
      this.handleEdit(this.drawRecord[this.recordIndex]);
    },
    async save() {
      const formData = new FormData();
      formData.append('taskRecordId', this.$route.query.id);
      formData.append('pcGeojson', this.form.pcGeojson);
      const res = await survey.saveTaskRecordInfo(formData);
      if (res.code === 200 && res.message === 'ok') {
        this.$message({
          type: 'success',
          message: '保存成功',
        });
        this.form.pcGeojson = '';
        this.draw && this.draw.deleteAll();
        this.isDrawing = false;
        this.showPopover = false;
        this.toolExpand = false;
        this.$emit('finish-edit');
        return true;
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
  .tools {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 1);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
    color: #606266;
    display: flex;
    span {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .edit {
      padding-right: 10px;
    }
    .tool {
      display: flex;
      border-left: 1px solid #ccc;
      .prev,
      .next {
        padding: 0 5px;
        font-size: 16px;
        font-weight: bold;
      }
      .prev:hover,
      .prev.active,
      .next:hover,
      .next.active {
        color: #409eff;
      }
      .restore {
        border-left: 1px solid #ccc;
        padding-left: 5px;
      }
      .custom {
        margin-left: 10px;
        border-left: 1px solid #ccc;
      }
      .save {
        border-left: 1px solid #ccc;
        margin-left: 10px;
        padding: 0 5px;
        color: #409eff;
      }
      .cancel {
        color: #f56c6c;
      }
    }
  }
  .toggles {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.6);
    padding: 10px;
    border-radius: 3px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    .btn {
      cursor: pointer;
      padding: 3px 0;
      .text {
        vertical-align: middle;
      }
      .dot {
        vertical-align: middle;
        display: inline-block;
        height: 14px;
        width: 14px;
        border-radius: 100%;
        box-sizing: border-box;
        margin-right: 3px;
        position: relative;
        background-color: #fff;
        &::after {
          content: '';
          display: inline-block;
          height: 4px;
          width: 4px;
          border-radius: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #fff;
        }
      }
    }
    .btn.origin {
      color: #c08f01;
      .dot {
        border: 1px solid #c08f01;
      }
      &.active {
        .dot {
          background-color: #c08f01;
        }
      }
    }
    .btn.pc {
      color: #409eff;
      .dot {
        border: 1px solid #409eff;
      }
      &.active {
        .dot {
          background-color: #409eff;
        }
      }
    }
    .btn.app {
      color: #f56c6c;
      .dot {
        border: 1px solid #f56c6c;
      }
      &.active {
        background-color: #f56c6c;
      }
    }
  }
}
.el-popover {
  min-width: 0;
}
</style>
