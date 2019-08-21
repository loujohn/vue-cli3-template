<template>
  <div class="sj-review">
    <div class="left">
      <div class="map-container">
        <v-map />
        <span class="title">空间查看</span>
      </div>
      <div class="img-container">
        <img :src="imgTest" alt="test" />
        <span class="title">影像截图</span>
      </div>
    </div>
    <div class="right">
      <div class="head">
        <div class="tabs">
          <span
            class="tab"
            v-for="(tab, index) in tabs"
            :key="tab.name"
            :class="{ active: index === activeTabIndex }"
            @click="setActiveTabIndex(index)"
            >{{ tab.name }}</span
          >
        </div>
        <span class="close" @click="close()">
          <i class="el-icon-close"></i>
        </span>
      </div>
      <div class="review-box" v-show="activeTabIndex === 0">
        <div class="base-info">
          <el-row :gutter="10">
            <el-col :span="12">
              <span class="label">矿山名称:</span>
              <span class="content">重庆赤松建材有限公司</span>
            </el-col>
            <el-col :span="12">
              <span class="label">矿山类型:</span>
              <span class="content">关闭矿山</span>
            </el-col>
            <el-col :span="12">
              <span class="label">所在行政区划:</span>
              <span class="content">北碚区</span>
            </el-col>
            <el-col :span="12">
              <span class="label">损毁面积(公顷):</span>
              <span class="content">5.2</span>
            </el-col>
            <el-col :span="12">
              <span class="label">中心点X坐标:</span>
              <span class="content">369328.3</span>
            </el-col>
            <el-col :span="12">
              <span class="label">中心点Y坐标:</span>
              <span class="content">37837285.2</span>
            </el-col>
            <el-col :span="12">
              <span class="label">治理阶段:</span>
              <span class="content">关闭未治理</span>
            </el-col>
            <el-col :span="12">
              <span class="label">土地权属:</span>
              <span class="content">水江镇大龙村</span>
            </el-col>
          </el-row>
        </div>
        <div class="review"></div>
        <div class="people"></div>
        <div class="action"></div>
      </div>
    </div>
  </div>
</template>

<script>
import vMap from 'components/map/map';
import imgTest from 'assets/images/sj/test.png';
export default {
  name: 'sj-inpect',
  components: {
    vMap,
  },
  data() {
    return {
      imgTest,
      tabs: [{ name: '文字' }, { name: '照片' }, { name: '视频' }],
      activeTabIndex: 0,
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    setActiveTabIndex(index) {
      this.activeTabIndex = index;
    },
  },
};
</script>

<style lang="scss">
.sj-review {
  display: flex;
  .left,
  .right {
    width: 50%;
    flex-shrink: 0;
  }
  .map-container,
  .img-container {
    height: 300px;
    position: relative;
    .title {
      font-size: $font-xs;
      display: block;
      background-color: rgba(255, 255, 255, 0.8);
      padding: 5px 8px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .map-container {
    border-bottom: 1px solid $base-color;
    box-sizing: border-box;
  }
  .img-container {
    img {
      height: 100%;
      width: 100%;
    }
  }
  .right {
    .head {
      padding: 0 20px;
      height: 50px;
      background-color: #f1f1f1;
      line-height: 50px;
      position: relative;
      .close {
        cursor: pointer;
        font-size: $font-lg;
        position: absolute;
        right: 10px;
      }
      .tabs {
        height: 100%;
        display: flex;
        span {
          display: flex;
          height: 100%;
          margin-right: 30px;
          box-sizing: border-box;
          cursor: pointer;
        }
        span.active {
          color: #0e67f2;
          border-bottom: 3px solid #0e67f2;
        }
      }
    }
    .base-info {
      padding: 30px 20px;
      color: #000;
      height: 250px;
      box-sizing: border-box;
      border-bottom: 1px solid #e6e6e6;
      .label,
      .content {
        display: inline-block;
        padding-bottom: 25px;
      }
      .label {
        width: 110px;
        text-align: left;
      }
    }
    .review {
      height: 170px;
      box-sizing: border-box;
    }
    .people {
      height: 50px;
      background-color: #e8f2f2;
    }
    .action {
      height: 80px;
      background-color: #0e67f2;
    }
  }
}
</style>
