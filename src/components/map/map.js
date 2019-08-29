import common from 'api/common';
import { d2c } from 'd2c';
export default {
  name: 'v-map',
  props: {
    container: {
      type: [String, Object],
      default: '',
    },
  },
  data() {
    return {
      id: `map-${new Date().getTime()}`,
      D2c: d2c || window.d2c,
      marker: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      const config = await common.getMapConfig();
      const {
        bearing,
        center,
        glyphs,
        layers,
        pitch,
        sources,
        sprite,
        version,
        zoom,
      } = config;
      const options = {
        container: this.container || this.id,
        zoom,
        center,
        bearing,
        pitch,
        attributionControl: false,
        style: {
          version,
          glyphs,
          sprite,
          sources,
          layers,
        },
      };
      this.map = new this.D2c.map(options);
      this.map.on('load', () => {
        const control = new this.D2c.NavigationControl({
          showCompass: false,
        });
        this.map.addControl(control, 'bottom-left');
        this.$emit('load', this.map);
      });
    },
  },
  render(h) {
    return h('div', {
      attrs: {
        id: this.id,
      },
      style: {
        height: '100%',
      },
    });
  },
};
