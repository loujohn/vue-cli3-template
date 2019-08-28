import common from 'api/common';
import { d2c } from 'd2c';
import turf from 'turf';
import iconLocation from 'assets/images/sj/location.png';
const img = new Image();
img.src = iconLocation;
img.style.height = '20px';
img.style.width = '20px';
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
      marker: null,
    };
  },
  watch: {
    geojson(val) {
      if (val) {
        const geojson = JSON.parse(val);
        this.map.getSource('geo-source').setData(geojson);
        const bbox = turf.bbox(geojson);
        this.map.fitBounds(bbox);
        const point = turf.center(geojson);
        this.map.getSource('geo-symbol').setData(point);
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
        this.addSymbol();
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
    addSymbol() {
      let data;
      if (this.geojson) {
        const center = turf.center(JSON.parse(this.geojson));
        data = center;
      } else {
        data = {
          type: 'FeatureCollection',
          features: [],
        };
      }
      !this.map.hasImage('location') && this.map.addImage('location', img);
      !this.map.getSource('geo-symbol') &&
        this.map.addSource('geo-symbol', {
          type: 'geojson',
          data,
        });
      !this.map.getLayer('location-symbol') &&
        this.map.addLayer({
          id: 'location-symbol',
          type: 'symbol',
          source: 'geo-symbol',
          layout: {
            'icon-image': 'location',
            'icon-size': 0.15,
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
