const originGeo = {
  sourceId: 'origin-source',
  fill: {
    id: 'origin-fill',
    type: 'fill',
    paint: {
      'fill-opacity': 0.3,
    },
  },
  line: {
    id: 'origin-line',
    type: 'line',
    paint: {
      'line-color': '#c08f01',
      'line-width': 2,
    },
  },
};

const pcGeo = {
  sourceId: 'pc-source',
  fill: {
    id: 'pc-fill',
    type: 'fill',
    paint: {
      'fill-opacity': 0.3,
    },
  },
  line: {
    id: 'pc-line',
    type: 'line',
    paint: {
      'line-width': 2,
      'line-color': '#409EFF',
    },
  },
};

const appGeo = {
  sourceId: 'app-source',
  fill: {
    id: 'app-fill',
    type: 'fill',
    paint: {
      'fill-opacity': 0.3,
    },
  },
  line: {
    id: 'app-line',
    type: 'line',
    paint: {
      'line-width': 2,
      'line-color': '#F56C6C',
    },
  },
};

const directionGeo = {
  sourceId: 'location-source',
  iconName: 'icon-direction',
  symbol: {
    id: 'location-symbol',
    type: 'symbol',
  },
};

export { originGeo, pcGeo, appGeo, directionGeo };
