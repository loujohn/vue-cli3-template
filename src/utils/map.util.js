class MapUtil {
  constructor(map) {
    this.map = map;
  }
  addGeoSource(sourceId, geojson) {
    let data;
    if (!geojson) {
      data = {
        type: 'FeatureCollection',
        features: [],
      };
    } else if (typeof geojson === 'string') {
      geojson = JSON.parse(geojson);
    }
    this.map.addSource(sourceId, {
      type: 'geojson',
      data,
    });
  }

  removeGeoSource(sourceId) {
    this.map.getSource(sourceId) && this.map.removeSource(sourceId);
  }

  addGeoLayer(layerId, { type, source, paint, layout }) {
    this.map.addLayer({
      id: layerId,
      type,
      source,
      paint,
      layout,
    });
  }

  removeGeoLayer(layerId) {
    this.map.getLayer(layerId) && this.map.removeLayer(layerId);
  }

  addImage(name, image) {
    !this.map.hasImage(name) && this.map.addImage(name, image);
  }

  removeImage(name) {
    this.map.hasImage(name) && this.map.removeImage(name);
  }

  setGeojson(sourceId, geojson) {
    this.map.getSource(sourceId) &&
      this.map.getSource(sourceId).setData(geojson);
  }
}

export default MapUtil;
