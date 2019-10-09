import turf from 'turf';
import d2c from 'd2c';
import { locationRed, direction } from '../configs/icon.config';

export default {
  data() {
    return {
      map: null,
      geojson: '',
      marker: null,
    };
  },
  methods: {
    handleMapLoad(e) {
      const map = e.target;
      this.map = map;
      window.$map = map;
      this.addGeoLayer(map);
      this.addSymbolLayer(map);
      if (this.geojson) {
        const bbox = turf.bbox(JSON.parse(this.geojson));
        this.map.fitBounds(bbox, { padding: 200 });
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
    addMarker(geojson) {
      this.marker && this.marker.remove();
      const {
        geometry: { coordinates },
      } = geojson;
      this.marker = new d2c.Marker(locationRed)
        .setLngLat(coordinates)
        .addTo(this.map);
    },
    addSymbolLayer(map) {
      map.addImage('icon-direction', direction);
      map.addSource('geo-symbol', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
      map.addLayer({
        id: 'direction-symbol',
        type: 'symbol',
        source: 'geo-symbol',
        layout: {
          'icon-image': 'icon-direction',
          visibility: 'none',
        },
      });
      if (this.geojson) {
        const geojson = JSON.parse(this.geojson);
        const center = turf.center(geojson);
        this.addMarker(center);
        map.getSource('geo-symbol').setData(center);
      }
    },
    setGeojson(map, sourceId, geojson) {
      map &&
        map.getSource(sourceId) &&
        map.getSource(sourceId).setData(geojson);
    },
  },
  // beforeDestroy() {
  //   this.map.hasImage('icon-location') && this.map.removeImage('icon-location');
  //   this.map.getLayer('location-symbol') &&
  //     this.map.removeLayer('location-symbol');
  //   this.map.getLayer('geo-line') && this.map.removeLayer('geo-line');
  //   this.map.getLayer('geo-fill') && this.map.removeLayer('geo-fill');
  //   this.map.getSource('geo-source') && this.map.removeSource('geo-source');
  // },
};
