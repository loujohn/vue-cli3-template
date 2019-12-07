<template>
  <div class="image">
    <div class="my-radio-group">
      <el-radio-group v-model="activeKey" @change="handleChange">
        <el-radio-button label="nearImageFiles">近 景</el-radio-button>
        <el-radio-button label="farImageFiles">远 景</el-radio-button>
        <el-radio-button label="otherImageFiles">其 它</el-radio-button>
      </el-radio-group>
      <span class="show-big-picture" @click="showBigPicture()" v-show="fullPath"
        >查看原图</span
      >
    </div>
    <el-row :gutter="10" v-show="!isEmpty">
      <el-col :span="6" v-for="(image, index) in images" :key="index">
        <el-image
          style="width: 100%; height: 140px; cursor: pointer;"
          fit="fit"
          :src="`${staticUrl}${image.filePath}`"
          @click="handleImageClick(image)"
          :class="current === index ? 'beChoose' : 'normal'"
        >
          <div slot="error">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </el-col>
    </el-row>
    <div v-show="isEmpty" class="no-image">
      <span>暂无图片</span>
    </div>
    <!-- <div class="preview" v-show="showImage">
      <div class="close">
        <span class="el-icon-circle-close" @click="close()"></span>
      </div>
      <img style="max-width: 100%;" :src="fullPath" alt="" />
    </div> -->
    <el-dialog
      :append-to-body="true"
      :visible="dialogVisible"
      close="pic-dialog"
      :before-close="close"
    >
      <div class="my-carousel">
        <el-button
          class="review-left"
          type="primary"
          icon="el-icon-arrow-left"
          circle
          @click="goPre"
        ></el-button>
        <el-button
          class="review-right"
          type="primary"
          icon="el-icon-arrow-right"
          circle
          @click="goNext"
        ></el-button>
        <div class="review-pic">
          <el-image :src="fullPath" fit="contain">
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
              <a>加载失败</a>
            </div>
          </el-image>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { staticUrl } from 'config';
export default {
  name: 'v-image',
  props: {
    imageObj: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isEmpty() {
      return !this.images || this.images.length === 0;
    },
  },
  watch: {
    imageObj: {
      handler: function(val) {
        this.activeKey = 'nearImageFiles';
        this.images = val[this.activeKey];
      },
      deep: true,
    },
    current: function(val) {
      const image = this.images[val];
      const {
        filePath,
        referenceInfo: { info },
      } = image;
      let azimuth;
      let dimension;
      let longitude;
      if (info) {
        azimuth = info.azimuth;
        dimension = info.dimension;
        longitude = info.longitude;
      }
      this.fullPath = `${staticUrl}${filePath}`;
      this.$emit('file-path', {
        azimuth,
        position: [longitude, dimension],
      });
    },
  },
  data() {
    return {
      staticUrl,
      activeKey: 'nearImageFiles',
      images: this.imageObj['nearImageFiles'],
      fullPath: '',
      showImage: false,
      dialogVisible: false,
      current: undefined,
    };
  },
  methods: {
    handleImageClick(image) {
      const current = this.images.indexOf(image);
      if (this.current === current) {
        const {
          filePath,
          referenceInfo: { info },
        } = image;
        let azimuth;
        let dimension;
        let longitude;
        if (info) {
          azimuth = info.azimuth;
          dimension = info.dimension;
          longitude = info.longitude;
        }
        this.fullPath = `${staticUrl}${filePath}`;
        this.$emit('file-path', {
          azimuth,
          position: [longitude, dimension],
        });
      } else {
        this.current = current;
      }
    },
    handleChange(val) {
      this.fullPath = '';
      this.images = this.imageObj[val];
    },
    goPre() {
      if (this.current > 0) {
        this.current -= 1;
      } else {
        this.current = this.images.length - 1;
      }
    },
    goNext() {
      if (this.current < this.images.length - 1) {
        this.current += 1;
      } else {
        this.current = 0;
      }
    },
    showBigPicture() {
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
      this.fullPath = '';
    },
  },
};
</script>

<style lang="scss">
.image {
  .beChoose {
    box-shadow: 0px 0px 5px rgb(59, 58, 58);
    // border: 2px dashed #f56c6c;
    // padding: 2px;
  }
  .normal {
    // border: 2px solid #fff;
    // padding: 2px;
  }
  padding: 10px;
  overflow: auto;
  height: 560px;
  overflow: auto;
  box-sizing: border-box;
  position: relative;
  .preview {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      span {
        display: inline-block;
        margin-right: 10px;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
      }
    }
  }
  .no-image {
    height: calc(100% - 44px);
    position: relative;
    span {
      font-size: 18px;
      font-weight: bold;
      color: #909399;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .my-radio-group {
    margin: 0 0 10px 0;
    display: flex;
    justify-content: space-between;
    .show-big-picture {
      font-size: 14px;
      color: #409eff;
      cursor: pointer;
    }
    .el-radio-button__inner {
      color: #9aa3ae;
      border: none;
      font-weight: normal;
      padding: 10px 25px;
      border-radius: 45px;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      box-shadow: none;
      border-radius: 45px;
      // background-color: #5d7b9a;
      background-color: #0094ec;
      // border-color: #5d7b9a;
      border-color: #0094ec;
      color: #fff;
    }
  }
}
.my-carousel {
  .review-left {
    left: 40px;
  }
  .review-right {
    right: 40px;
  }
  .review-left,
  .review-right {
    position: fixed;
    top: 50%;
    font-size: 18px;
    color: #fff;
    background-color: #606266;
    opacity: 0.8;
    border-color: #fff;
  }
  .review-pic {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .image-slot {
      color: rgba(231, 221, 221, 0.8);
    }
  }
}
.pic-dialog {
  // display: flex;
  // align-items: center;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog {
    -webkit-box-shadow: none;
    box-shadow: none;
    background: none;
    width: 30%;
    .el-dialog__headerbtn {
      position: fixed;
      top: 40px;
      right: 40px;
      font-size: 35px;
      .el-dialog__close {
        color: rgba(245, 245, 245, 0.8);
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
