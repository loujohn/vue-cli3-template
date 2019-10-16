import mapUtil from 'utils/map.util';
import { locationRed, direction } from '../configs/icon.config';

export default {
  methods: {
    initGeoLayers(map, { sourceId, fill, line }) {
      mapUtil.initGeoSource(map, sourceId);
      mapUtil.addLayer(map, sourceId, fill);
      mapUtil.addLayer(map, sourceId, line);
    },
    initSymbolLayer(map, { sourceId, iconName, symbol }, image = direction) {
      mapUtil.addImage(map, iconName, image);
      mapUtil.initGeoSource(map, sourceId);
      mapUtil.addLayer(map, sourceId, {
        ...symbol,
        layout: {
          'icon-image': iconName,
          'icon-size': 0.15,
          visibility: 'none',
        },
      });
    },
    initCircleLayer(map, { sourceId, circle }) {
      mapUtil.initGeoSource(map, sourceId);
      mapUtil.addLayer(map, sourceId, circle);
    },
    initLineLayer(map, { sourceId, line }) {
      mapUtil.initGeoSource(map, sourceId);
      mapUtil.addLayer(map, sourceId, line);
    },
    setGeojson(map, { sourceId }, geojson) {
      const data = mapUtil.transferGeojson(geojson);
      mapUtil.setGeojson(map, sourceId, data);
    },
    clearGeojson(map, { sourceId }) {
      mapUtil.clearGeojson(map, sourceId);
    },
    addMarker(map, marker, { image = locationRed, center }) {
      return mapUtil.addMarker(map, marker, { image, center });
    },
    getCenter(geojson) {
      return mapUtil.getCenter(geojson);
    },
    getBbox(geojson) {
      return mapUtil.getBbox(geojson);
    },
    getPointFeatures(geojson) {
      return mapUtil.getPointFeatures(geojson);
    },
  },
};
