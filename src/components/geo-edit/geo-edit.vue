<template>
  <div class="geo-edit">
    <div class="tools" v-if="canEdit">
      <span class="edit" @click="geoEdit()">
        <svg-icon iconClass="edit1" class="my-icon"></svg-icon>
        <span style="color: #409eff">编辑</span>
      </span>
      <div class="tool" v-show="toolExpand">
        <svg-icon
          iconClass="back"
          class="prev"
          :class="{ active: recordIndex !== 0 }"
          @click="prev()"
          title="上一步"
        ></svg-icon>
        <svg-icon
          iconClass="go"
          class="next"
          :class="{ active: recordIndex < drawRecord.length - 1 }"
          @click="next()"
          title="下一步"
        ></svg-icon>
        <span class="restore" @click="handleRestore()">
          <svg-icon class="my-icon" iconClass="reset"></svg-icon>重置
        </span>
        <span class="custom">
          <svg-icon iconClass="uploadMap" class="my-icon"></svg-icon>
          <el-upload
            :action="upload.url"
            :headers="upload.headers"
            :limit="1"
            :multiple="false"
            :before-upload="handleProgress"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-error="handleError"
            :on-exceed="handleExceed"
            ref="upload"
          >
            <el-button size="small" type="text" slot="trigger">导入范围</el-button>
          </el-upload>
        </span>
        <span class="save" @click="save()">保存</span>
        <span class="cancel" @click="cancel()">取消</span>
      </div>
    </div>
    <div class="toggles">
      <span class="btn pc" @click="handleToggle('调查范围')">
        <i class="dot" v-if="!btnCheckActive"></i>
        <i class="el-icon-check" v-else></i>
        <span class="text">调查范围</span>
      </span>
      <span class="btn origin" @click="handleToggle('原始下发图斑')" v-show="originGeojson">
        <i class="dot" v-if="!btnOriginActive"></i>
        <i class="el-icon-check" v-else></i>
        <span class="text">原始下发图斑</span>
      </span>
      <span class="btn app" v-show="appGeojson && !pcGeojson" @click="handleToggle('辅助线')">
        <i class="dot" v-if="!btnAssistActive"></i>
        <i class="el-icon-check" v-else></i>
        <span class="text">辅助线</span>
      </span>
      <span class="btn app" v-show="traceGeojson" @click="handleToggle('调查足迹')">
        <i class="dot" v-if="!btncheckTraceActive"></i>
        <i class="el-icon-check" v-else></i>
        <span class="text">调查足迹</span>
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
    traceGeojson: {
      type: String,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        pcGeojson: '',
      },
      isDrawing: false,
      current: '调查范围',
      toolExpand: false,

      btnAssistActive: false,
      btnCheckActive: true,
      btnOriginActive: true,
      btncheckTraceActive: false,
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
      } else if (name === '辅助线') {
        this.btnAssistActive = !this.btnAssistActive;
        active = this.btnAssistActive;
      } else if (name === '原始下发图斑') {
        this.btnOriginActive = !this.btnOriginActive;
        active = this.btnOriginActive;
      } else if (name === '调查足迹') {
        this.btncheckTraceActive = !this.btncheckTraceActive;
        active = this.btncheckTraceActive;
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
    handleRestore() {
      this.restore();
    }
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
    padding: 5px 10px;
    border-radius: 3px;
    font-size: 14px;
    color: #606266;
    display: flex;
    height: 25px;
    span {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .edit {
      padding-right: 15px;
      .my-icon {
        margin-right: 5px;
        font-size: 18px;
        color: #409eff;
      }
    }
    .tool {
      display: flex;
      align-items: center;
      border-left: 1px solid #ccc;
      padding-left: 10px;
      .prev,
      .next {
        padding: 0 5px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
      }
      .prev:hover,
      .prev.active,
      .next:hover,
      .next.active {
        color: #409eff;
      }
      .restore {
        padding-left: 15px;
        .my-icon {
          margin-right: 5px;
          font-size: 10px;
          color: #409eff;
        }
      }
      .custom {
        padding-left: 20px;
        .my-icon {
          margin-right: 5px;
          font-size: 12px;
          color: #409eff;
        }
        .el-button--text {
          font-size: 14px;
          color: #606266;
          font-weight: normal;
        }
        .el-upload-list {
          display: none;
        }
      }
      .save {
        background: #409eff;
        margin-left: 20px;
        padding: 2px 15px;
        border-radius: 2px;
        color: #fff;
      }
      .cancel {
        background: #f56c6c;
        margin-left: 10px;
        padding: 2px 15px;
        border-radius: 2px;
        color: #fff;
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
        color: #409eff;
      }
      .el-icon-check {
        margin-right: 3px;
        font-size: 2px;
        background-color: #409eff;
        color: #fff;
      }
      .dot {
        vertical-align: middle;
        display: inline-block;
        height: 10px;
        width: 10px;
        border: 1px solid #babcbe;
        background-color: #f4f5f8;
        border-radius: 1px;
        // box-sizing: border-box;
        margin-right: 3px;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // position: relative;
        //   background-color: #fff;
        // &::after {
        //     content: '';
        //     display: inline-block;
        //     height: 4px;
        //     width: 4px;
        //     border-radius: 100%;
        //     position: absolute;
        //     top: 50%;
        //     left: 50%;
        //     transform: translate(-50%, -50%);
        //     background-color: #fff;
        // }
      }
    }
    // .btn.origin {
    // color: #409eff;
    // .dot {
    //   border: 1px solid #409eff;
    // }
    // &.active {
    //   .dot {
    //     border-color: #409eff;
    //     background-color: #409eff;
    //   }
    // }
    // }
    // .btn.pc {
    // color: #409eff;
    // .dot {
    //   border: 1px solid #409eff;
    // }
    // &.active {
    //   .dot {
    //     background-color: #409eff;
    //   }
    // }
    // }
    // .btn.app {
    //   color: #409eff;
    //   .dot {
    //     border: 1px solid #f56c6c;
    //   }
    // &.active {
    //   background-color: #f56c6c;
    // }
    // }
  }
}
.el-popover {
  min-width: 0;
}
</style>
