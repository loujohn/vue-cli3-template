<template>
  <div class="dc-image">
    <div class="my-radio-group">
      <el-radio-group v-model="activeKey" @change="handleChange">
        <el-radio-button label="farImageFiles">远 景</el-radio-button>
        <el-radio-button label="nearImageFiles">近 景</el-radio-button>
        <el-radio-button label="otherImageFiles">其 它</el-radio-button>
      </el-radio-group>
    </div>
    <el-row :gutter="10" v-show="!isEmpty">
      <el-col :span="8" v-for="(image, index) in images" :key="index">
        <el-image
          fit="scale-down"
          :src="`${staticUrl}${image.filePath}`"
          @click="handleImageClick(image)"
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
        this.activeKey = 'farImageFiles';
        this.images = val[this.activeKey];
      },
      deep: true,
    },
  },
  data() {
    return {
      staticUrl,
      activeKey: 'farImageFiles',
      images: this.imageObj['farImageFiles'],
    };
  },
  methods: {
    handleImageClick(image) {
      const {
        filePath,
        referenceInfo: { info },
      } = image;
      let azimuth;
      if (info) {
        azimuth = info.azimuth;
      }
      const fullPath = `${staticUrl}${filePath}`;
      this.$emit('file-path', {
        fullPath,
        azimuth,
      });
    },
    handleChange(val) {
      this.images = this.imageObj[val];
    },
  },
};
</script>

<style lang="scss">
.dc-image {
  padding: 10px;
  overflow: auto;
  overflow: auto;
  box-sizing: border-box;
  height: 100%;
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
      background-color: #5d7b9a;
      border-color: #5d7b9a;
      color: #fff;
    }
  }
}
</style>
