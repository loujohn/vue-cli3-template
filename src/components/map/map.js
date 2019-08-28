import common from 'api/common';
import { d2c } from 'd2c';
import turf from 'turf';
export default {
  name: 'v-map',
  props: {
    container: {
      type: [String, Object],
      default: '',
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
    };
  },
  watch: {
    geojson(val) {
      console.log(val);
      if (val) {
        const geojson = JSON.parse(val);
        console.log(geojson);
        this.map.getSource('geo-source').setData(geojson);
        const bbox = turf.bbox(geojson);
        console.log(bbox);
        this.map.fitBounds(bbox);
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
        zoom,
      } = config;
      const options = {
        container: this.container || this.id,
        zoom,
        center,
        bearing,
        pitch,
        style: {
          version,
          glyphs,
          sprite,
          sources,
          layers,
        },
      };
      this.map = new this.D2c.Map(options);
      this.map.on('load', () => {
        const control = new this.D2c.NavigationControl({
          showCompass: false,
        });
        this.map.addControl(control, 'bottom-left');
        this.addGeoLayer();
      });
    },
    addGeoLayer() {
      let data;
      if (this.geojson) {
        const geojson = JSON.parse(this.geojson);
        data = {
          type: 'Feature',
          geometry: geojson,
        };
        const bbox = turf.bbox(geojson);
        this.map.fitBounds(bbox);
      } else {
        data = {
          type: 'FeatureCollection',
          features: [],
        };
      }
      !this.map.getSource('geo-source') &&
        this.map.addSource('geo-source', {
          type: 'geojson',
          data,
        });
      !this.map.getLayer('geo-line') &&
        this.map.addLayer({
          id: 'geo-line',
          type: 'line',
          source: 'geo-source',
          paint: {
            'line-color': '#bc8300',
            'line-width': 2,
          },
        });
      !this.map.getLayer('geo-fill') &&
        this.map.addLayer({
          id: 'geo-fill',
          type: 'fill',
          source: 'geo-source',
          paint: {
            'fill-opacity': 0.3,
          },
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
