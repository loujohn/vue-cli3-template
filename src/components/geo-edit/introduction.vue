<template>
  <div class="geo-edit-introduction" v-show="isDisplay">
    <p v-for="(tip, index) in introductions" :key="index">
      <span class="geo-title">{{ tip.title }}</span
      >:
      <span class="geo-content">{{ tip.content }}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'geo-edit-introduction',
  props: {
    isDisplay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      introductions: [
        {
          title: '上一步',
          content: '返回上一步操作',
        },
        {
          title: '下一步',
          content: '返回下一步操作',
        },
        {
          title: '重置',
          content: '将范围重置为初始范围',
        },
        {
          title: '自定义',
          content:
            '上传范围zip格式范围，将".shp",".shx",".dbf"与".prj"压缩成zip文件，坐标系为国家2000地理坐标系',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.geo-edit-introduction {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.5);
  width: 60%;
  border-top-left-radius: 3px;
  p {
    margin: 0;
    font-size: 14px;
    padding: 5px 8px;
  }
}
</style>
