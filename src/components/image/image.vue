<template>
  <div class="image">
    <el-radio-group v-model="activeKey" @change="handleChange">
      <el-radio label="farImageFiles">远景</el-radio>
      <el-radio label="nearImageFiles">近景</el-radio>
      <el-radio label="otherImageFiles">其它</el-radio>
    </el-radio-group>
    <el-row :gutter="10" v-show="!isEmpty">
      <el-col :span="8" v-for="image in images" :key="image.fileName">
        <el-image
          fit="fill"
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
      images: this.imageObj[this.activeKey],
    };
  },
  methods: {
    handleImageClick(image) {
      const { filePath } = image;
      const fullPath = `${staticUrl}${filePath}`;
      this.$emit('file-path', fullPath);
    },
    handleChange(val) {
      this.images = this.imageObj[val];
    },
  },
};
</script>

<style lang="scss">
.image {
  padding: 10px;
  overflow: auto;
  height: 470px;
  overflow: auto;
  box-sizing: border-box;
  .no-image {
    height: calc(100% - 18px);
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
}
</style>
