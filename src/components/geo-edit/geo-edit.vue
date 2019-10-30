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
          title="上一步"
        ></span>
        <span
          class="el-icon-right next"
          :class="{ active: recordIndex < drawRecord.length - 1 }"
          @click="next()"
          title="下一步"
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
            :before-upload="progress"
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
import { survey } from 'api';
import upload from './upload';
import draw from './draw';
export default {
  name: 'geo-edit',
  mixins: [draw, upload],
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
      isDrawing: false,
      current: '下发范围',
      toolExpand: false,

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
    geoEdit() {
      if (this.toolExpand) return false;
      this.toolExpand = true;
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
    cancel() {
      this.$confirm('是否保存当前范围?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
      })
        .then(() => {
          this.save();
        })
        .catch(() => {
          this.reset();
        });
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
        this.reset();
      }
    },
    reset() {
      this.form.pcGeojson = '';
      this.draw && this.draw.deleteAll();
      this.isDrawing = false;
      this.toolExpand = false;
      this.$emit('finish-edit');
      if (this.upload.success) {
        this.showUploadPopover = false;
        this.upload.success = false;
        this.$refs['upload'] && this.$refs['upload'].clearFiles();
        this.$emit('finish-upload');
      }
    },
    progress(file) {
      let fileType = file.type;
      if (fileType !== 'application/zip' && fileType !== 'application/x-rar') {
        this.$message({
          message: '上传文件只能为压缩包',
          type: 'error',
        });
        return false;
      } else {
        return true;
      }
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
    background-color: #fff;
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
    background-color: #fff;
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
