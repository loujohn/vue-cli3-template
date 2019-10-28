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
          :class="{ active: recordIndex !== drawRecord.length - 1 }"
          @click="next()"
        ></span>
        <span class="restore">
          <svg-icon :style="style" iconClass="restore"></svg-icon>
          还原
        </span>
        <span class="custom">
          <svg-icon iconClass="custom" :style="style"></svg-icon>
          自定义
        </span>
        <span class="save">
          保存
        </span>
        <span class="cancel">
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
    <!-- <div class="btns" v-if="canEdit">
      <el-popover
        trigger="manual"
        style="margin-right: 10px;"
        v-model="showPopover"
      >
        <el-button size="small" @click="save()">保存</el-button>
        <el-button size="small" @click="cancel()">取消</el-button>
        <button class="btn btn-trigger" slot="reference" @click="geoEdit()">
          <svg-icon iconClass="draw" :style="style" />编辑
        </button>
      </el-popover>
      <el-popover
        style="margin-right: 10px;"
        placement="bottom-end"
        trigger="manual"
        v-model="showUploadPopover"
      >
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
          <el-button
            size="small"
            style="margin-left: 5px;"
            @click="uploadSave()"
            >保存</el-button
          >
          <el-button
            size="small"
            style="margin-left: 5px;"
            @click="uploadCancel()"
            >取消</el-button
          >
        </el-upload>
        <button class="btn btn-customer" @click="showUpload()" slot="reference">
          <svg-icon iconClass="custom" :style="style" />
          自定义
        </button>
      </el-popover>
      <button
        class="btn btn-restore"
        @click="restore()"
        v-show="pcGeojson && isDrawing"
      >
        <svg-icon iconClass="restore" :style="style" />
        还原
      </button>
    </div> -->
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
      this.handleDraw(this.drawRecord[this.recordIndex]);
    },
    prev() {
      this.recordIndex--;
      if (this.recordIndex < 0) {
        this.recordIndex = 0;
      }
      this.handleDraw(this.drawRecord[this.recordIndex]);
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
  // .btn {
  //   height: 30px;
  //   padding: 0 8px;
  //   outline: 0;
  //   border-radius: 5px;
  //   border: 1px solid #e6e6e6;
  //   background-color: #fff;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   cursor: pointer;
  // }
  // .origin.active {
  //   color: #c08f01;
  // }
  // .pc.active {
  //   color: #409eff;
  // }
  // .app.active {
  //   color: #f56c6c;
  // }
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
    .btn {
      margin-right: 10px;
    }
    .btn:last-of-type {
      margin: 0;
    }
    .btn-trigger {
      color: #606266;
    }
  }
}
.el-popover {
  min-width: 0;
}
</style>
