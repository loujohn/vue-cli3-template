import turf from 'turf';
import d2c from 'd2c';
const mapUtil = {
  initGeoSource(map, sourceId) {
    const data = {
      type: 'FeatureCollection',
      features: [],
    };
    try {
      map.addSource(sourceId, {
        type: 'geojson',
        data,
      });
    } catch (error) {
      console.error('init-geo-source', error);
    }
  },
  addLayer(map, sourceId, { id, type, paint = {}, layout = {} }) {
    try {
      map.addLayer({
        id,
        type,
        source: sourceId,
        paint,
        layout,
      });
    } catch (error) {
      console.error('add-geo-layer', error);
    }
  },
  setGeojson(map, sourceId, data) {
    const source = map.getSource(sourceId);
    if (source) {
      source.setData(data);
    }
  },
  clearGeojson(map, sourceId) {
    this.setGeojson(map, sourceId, {
      type: 'FeatureCollection',
      features: [],
    });
  },
  addMarker(map, marker, { image, center }) {
    marker && marker.remove();
    const {
      geometry: { coordinates },
    } = center;
    marker = new d2c.Marker(image).setLngLat(coordinates).addTo(map);
    return marker;
  },
  sourceAdded(map, sourceId) {
    return map.getSource(sourceId);
  },
  addImage(map, name, image) {
    if (!this.imageAdded(map, name)) {
      map.addImage(name, image);
    }
  },
  imageAdded(map, name) {
    return map.hasImage(name);
  },
  getCenter(geojson) {
    geojson = this.transferGeojson(geojson);
    return turf.center(geojson);
  },
  getBbox(geojson) {
    geojson = this.transferGeojson(geojson);
    return turf.bbox(geojson);
  },
  transferGeojson(geojson) {
    geojson = typeof geojson === 'string' ? JSON.parse(geojson) : geojson;
    if (geojson.hasOwnProperty('coordinates')) {
      geojson = {
        type: 'Feature',
        geometry: geojson,
      };
    }
    return geojson;
  },
};

export default mapUtil;
