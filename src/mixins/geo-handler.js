import turf from 'turf';
import iconLocation from 'assets/images/sj/location.png';
const img = new Image();
img.src = iconLocation;
img.style.height = '20px';
img.style.width = '20px';

export default {
  data() {
    return {
      map: null,
      geojson: '',
    };
  },
  methods: {
    handleMapLoad(e) {
      const map = e.target;
      this.map = map;
      this.addGeoLayer(map);
      this.addSymbolLayer(map);

      if (this.geojson) {
        const bbox = turf.bbox(JSON.parse(this.geojson));
        this.map.fitBounds(bbox);
      }
    },
    addGeoLayer(map) {
      map.addSource('geo-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
      map.addLayer({
        id: 'geo-fill',
        type: 'fill',
        source: 'geo-source',
        paint: {
          'fill-opacity': 0.3,
        },
      });
      this.map.addLayer({
        id: 'geo-line',
        type: 'line',
        source: 'geo-source',
        paint: {
          'line-color': '#c08f01',
          'line-width': 2,
        },
      });

      if (this.geojson) {
        const geojson = JSON.parse(this.geojson);
        map.getSource('geo-source').setData({
          type: 'Feature',
          geometry: geojson,
        });
      }
    },
    addSymbolLayer(map) {
      map.addImage('icon-location', img);
      map.addSource('geo-symbol', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
      map.addLayer({
        id: 'location-symbol',
        type: 'symbol',
        source: 'geo-symbol',
        layout: {
          'icon-image': 'icon-location',
          'icon-size': 0.15,
        },
      });
      if (this.geojson) {
        const geojson = JSON.parse(this.geojson);
        const center = turf.center(geojson);
        map.getSource('geo-symbol').setData(center);
      }
    },
    setGeojson(map, sourceId, geojson) {
      map &&
        map.getSource(sourceId) &&
        map.getSource(sourceId).setData(geojson);
    },
  },
  beforeDestroy() {
    this.map.hasImage('icon-location') && this.map.removeImage('icon-location');
    this.map.getLayer('location-symbol') &&
      this.map.removeLayer('location-symbol');
    this.map.getLayer('geo-line') && this.map.removeLayer('geo-line');
    this.map.getLayer('geo-fill') && this.map.removeLayer('geo-fill');
    this.map.getSource('geo-source') && this.map.removeSource('geo-source');
  },
};
