export default {
  name: 'vindow',
  data() {
    return {
      window: {
        height: window.screen.height,
        width: window.screen.width,
      },
    };
  },
  created() {
    this.setResize();
    window.addEventListener('resize', this.setResize);
  },
  methods: {
    setResize() {
      this.$set(this.window, 'height', document.documentElement.clientHeight);
      this.$set(this.window, 'width', document.documentElement.clientWidth);
    },
  },
};
