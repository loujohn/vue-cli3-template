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

const surveyUserGeo = {
  sourceId: 'survey-user-source',
  fill: {
    id: 'survey-user-fill',
    type: 'fill',
    paint: {
      'fill-opacity': 0.7,
    },
  },
  line: {
    id: 'survey-user-line',
    type: 'line',
    paint: {
      'line-width': 2,
      'line-color': [
        'case',
        ['==', ['get', 'surveyStage'], 1],
        '#e6a23c',
        ['==', ['get', 'surveyStage'], 2],
        '#409eff',
        ['==', ['get', 'surveyStage'], 3],
        '#f56c6c',
        ['==', ['get', 'surveyStage'], 4],
        '#67c23a',
        '#909399',
      ],
    },
  },
};

const surverUserTrace = {
  sourceId: 'survey-user-trace-source',
  line: {
    id: 'survey-user-trace-line',
    type: 'line',
    paint: {
      'line-width': 2,
      'line-color': 'red',
    },
  },
};

const surveyUserCircle = {
  sourceId: 'survey-user-circle-source',
  circle: {
    id: 'survey-user-circle',
    type: 'circle',
    paint: {
      'circle-radius': {
        base: 5,
        stops: [[12, 7], [22, 100]],
      },
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
      'circle-color': [
        'case',
        ['==', ['get', 'surveyStage'], 1],
        '#e6a23c',
        ['==', ['get', 'surveyStage'], 2],
        '#409eff',
        ['==', ['get', 'surveyStage'], 3],
        '#f56c6c',
        ['==', ['get', 'surveyStage'], 4],
        '#67c23a',
        '#909399',
      ],
    },
  },
};

export {
  originGeo,
  pcGeo,
  appGeo,
  directionGeo,
  surveyUserGeo,
  surveyUserCircle,
  surverUserTrace,
};
