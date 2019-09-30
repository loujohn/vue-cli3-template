const mapUtil = {
  /**
   * @description
   * @author Zeng
   * @date 2019-09-30
   * @param {Object} map
   * @param {String} sourceId
   * @param {[String, Object]} geojson
   * @returns
   */
  addGeoSource(map, sourceId, geojson) {
    if (!map && !sourceId && !geojson) {
      return false;
    }
    if (typeof geojson === 'string') {
      geojson = JSON.parse(geojson);
    }
    if (geojson.hasOwnProperty('coordinates')) {
      geojson = {
        type: 'Feature',
        geometry: geojson,
      };
    }
    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson,
    });
  },

  /**
   * @description
   * @author Zeng
   * @date 2019-09-30
   * @param {Object} map
   * @param {String} id
   */
  addGeoLayer(map, { id, type, paint, layout, source }) {
    if (!map && !id && !type) {
      return false;
    }
    source = source
      ? source
      : {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        };
    map.addLayer({
      id,
      type,
      paint,
      source,
      layout,
    });
  },

  /**
   * @description
   * @author Zeng
   * @date 2019-09-30
   * @param {Object} map
   * @param {sourceId: String , data: [String, Object] } { sourceId, data }
   * @returns
   */
  setGeojson(map, { sourceId, data }) {
    if (!map && !sourceId && !data) {
      return false;
    }
    data =
      typeof data === 'string'
        ? { type: 'Feature', geometry: JSON.parse(data) }
        : data;
    map.getSource(sourceId) && map.getSource(sourceId).setData(data);
  },

  /**
   * @description
   * @author Zeng
   * @date 2019-09-30
   * @param {Object} map
   * @param {String} sourceId
   * @returns
   */
  clearGeojson(map, sourceId) {
    if (!map && !sourceId) {
      return false;
    }
    map.getSource(sourceId) &&
      map.getSource(sourceId).setData({
        type: 'FeatureCollection',
        data: [],
      });
  },

  /**
   * @description
   * @author Zeng
   * @date 2019-09-30
   * @param {Object} map
   * @param {String} sourceId
   * @returns
   */
  removeGeoSource(map, sourceId) {
    if (!map && !sourceId) {
      return false;
    }
    map.removeSource(sourceId);
  },

  /**
   * @description
   * @author Zeng
   * @date 2019-09-30
   * @param {Object} map
   * @param {String} layerId
   * @returns
   */
  removeGeoLayer(map, layerId) {
    if (!map && !layerId) {
      return false;
    }
    map.removeLayer(layerId);
  },

  /**
   * @description
   * @author Zeng
   * @date 2019-09-30
   * @param {Object} map
   * @param {*} { name, image }
   * @returns
   */
  addImage(map, { name, image }) {
    if (!map && !name && !image) {
      return false;
    }
    !map.hasImage(name) && map.addImage(name, image);
  },
  /**
   * @description
   * @author Zeng
   * @date 2019-09-30
   * @param {Object} map
   * @param {*} name
   * @returns
   */
  removeImage(map, name) {
    if (!map && !name) {
      return false;
    }
    map.hasImage(name) && map.removeImage(name);
  },
};

export { mapUtil };
