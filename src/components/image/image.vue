<template>
  <div class="image">
    <el-row :gutter="10">
      <el-col :span="8" v-for="image in images" :key="image.id">
        <el-image :src="`${staticUrl}${image.fileName}`"></el-image>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { staticUrl } from 'config';
export default {
  name: 'v-image',
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      staticUrl,
    };
  },
};
</script>

<style lang="scss"></style>
