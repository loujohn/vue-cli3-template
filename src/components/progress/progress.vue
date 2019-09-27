<template>
  <div class="progress">
    <div class="outer" :style="{ height }">
      <div
        class="inner"
        :class="progressClass"
        :style="{ width: innerWidth }"
      ></div>
    </div>
    <span class="text">{{ percent }}%</span>
  </div>
</template>

<script>
export default {
  name: 'v-progress',
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    height: {
      type: String,
      default: '10px',
    },
  },
  computed: {
    innerWidth() {
      return `${this.percent}%`;
    },
    progressClass() {
      let step;
      if (this.percent >= 0 && this.percent < 40) {
        step = 'step1';
      } else if (this.percent >= 40 && this.percent < 60) {
        step = 'step2';
      } else if (this.percent >= 60 && this.percent < 100) {
        step = 'step3';
      } else if (this.percent === 100) {
        step = 'step4';
      }
      return step;
    },
  },
};
</script>

<style lang="scss">
.progress {
  display: flex;
  align-items: center;
  .outer {
    background-color: #f3f3f3;
    width: 80%;
    border-radius: 50px;
    .inner {
      height: 100%;
      border-radius: 50px;
    }
  }
  .text {
    padding-left: 5px;
  }
  .step1 {
    background-color: #ff5654;
  }
  .step2 {
    background-color: #fbb751;
  }
  .step3 {
    background-color: #0094ec;
  }
  .step4 {
    background-color: #00c988;
  }
}
</style>
