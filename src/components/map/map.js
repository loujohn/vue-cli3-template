import common from 'api/common';
import d2c from 'd2c';
import turf from 'turf';
export default {
  name: 'v-map',
  props: {
    container: {
      type: [String, Object],
      default: '',
    },
    containerHeight: {
      type: String,
      default: '600px',
    },
    geojson: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      id: `map-${new Date().getTime()}`,
      D2c: d2c || window.d2c,
      map: null,
    };
  },
  watch: {
    containerHeight: function(val) {
      if (val) {
        this.map && this.map.resize();
        if (this.geojson) {
          const bbox = turf.bbox(JSON.parse(this.geojson));
          this.map.fitBounds(bbox);
        }
      }
    },
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
      } = config;
      const options = {
        container: this.container || this.id,
        zoom: 7,
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
      this.map.once('load', this.handleLoad);
    },
    handleLoad(e) {
      this.$emit('load', e);
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
