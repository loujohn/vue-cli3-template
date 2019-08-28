<template>
  <div class="sj-review">
    <div class="left">
      <div class="map-container">
        <v-map :geojson="geojson" />
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
            <el-col :span="12" v-for="item in fieldList" :key="item.id">
              <span class="label">{{ item.fieldAlias }}:</span>
              <span class="content">{{ item.fieldValue }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="suggestion">
          <el-row>
            <el-col :span="4">
              <span class="label">审核意见:</span>
            </el-col>
            <el-col :span="18">
              <el-input type="textarea" :rows="4"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="people">
          <span>调查人员: 侯良月</span>
          <span>调查日期: 2019-07-15</span>
          <span>图斑状态: 已审核</span>
        </div>
        <div class="action">
          <div class="toggle">
            <span>上一条</span>
            <span>下一条</span>
          </div>
          <div class="operation">
            <span>审核:</span>
            <el-radio-group class="radio-group" v-model="form.isPass">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="0">不通过</el-radio>
            </el-radio-group>
            <el-button size="mini">提交</el-button>
          </div>
        </div>
      </div>
      <v-image v-if="activeTabIndex === 1" :images="imagesList" />
    </div>
  </div>
</template>

<script>
import vMap from 'components/map/map';
import vImage from 'components/image/image';
import imgTest from 'assets/images/sj/test.png';
export default {
  name: 'sj-inpect',
  components: {
    vMap,
    vImage,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      imgTest,
      tabs: [{ name: '文字' }, { name: '照片' }, { name: '视频' }],
      activeTabIndex: 0,
      form: {
        suggestion: '',
        isPass: 1,
      },
      fieldList: [],
      imagesList: [],
      geojson: '',
    };
  },
  watch: {
    data: {
      handler: function(val) {
        if (val) {
          if (!val.referenceInfo) return false;
          let {
            referenceInfo: { fieldsList, imageFiles },
          } = val;
          this.imagesList = imageFiles;
          fieldsList = fieldsList.map(e => {
            if (e.fieldName === 'centerPoint') {
              const { fieldValue } = e;
              return {
                ...e,
                fieldValue: JSON.parse(fieldValue).coordinates,
              };
            } else {
              return e;
            }
          });
          this.fieldList = fieldsList.filter(e => !e.isSpace);
          this.geojson = fieldsList.find(e => e.isSpace).fieldValue;
        }
      },
      immediate: true,
      deep: true,
    },
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
    .suggestion {
      padding: 30px 20px;
      height: 170px;
      box-sizing: border-box;
      .el-textarea__inner {
        background-color: #f8f8f8;
      }
    }
    .people {
      height: 50px;
      padding: 0 20px;
      background-color: #e8f2f2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .action {
      height: 80px;
      background-color: #0e67f2;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: $base-color;
      .toggle {
        span {
          cursor: pointer;
        }
        span:first-child {
          padding-right: 20px;
        }
      }
      .operation {
        .radio-group {
          padding: 0 15px;
          .el-radio {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
