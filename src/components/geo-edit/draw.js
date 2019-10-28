import d2c from 'd2c';
export default {
  data() {
    return {
      draw: null,
      mode: 'simple_select',
      featureId: 'geo-edit-id',
      D2c: d2c || window.d2c,
      drawRecord: [],
      recordIndex: 0,
    };
  },
  methods: {
    handleEdit(geojson) {
      if (this.drawRecord.length === 0) {
        this.drawRecord.push(geojson);
      }
      this.draw && this.draw.deleteAll();
      if (geojson) {
        this.form.pcGeojson = geojson;
        geojson = JSON.parse(geojson);
        const feature = {
          id: this.featureId,
          type: 'Feature',
          properties: {},
          geometry: geojson,
        };
        this.draw.add(feature);
        this.draw.changeMode('direct_select', {
          featureId: this.featureId,
        });
      }
    },
    restore() {
      if (this.isDrawing) {
        if (this.originGeojson) {
          this.handleEdit(this.originGeojson);
          this.drawRecord = [this.originGeojson];
          this.recordIndex = 0;
        }
      }
    },
    bindEvent() {
      this.map.doubleClickZoom.disable();
      this.map.on('draw.create', this.handleDraw);
      this.map.on('draw.update', this.handleDraw);
      this.map.on('draw.modechange', this.handleMode);
    },
    next() {
      this.recordIndex++;
      if (this.recordIndex >= this.drawRecord.length) {
        this.recordIndex = this.drawRecord.length - 1;
      }
      this.handleEdit(this.drawRecord[this.recordIndex]);
    },
    prev() {
      this.recordIndex--;
      if (this.recordIndex < 0) {
        this.recordIndex = 0;
      }
      this.handleEdit(this.drawRecord[this.recordIndex]);
    },
    initDraw() {
      if (this.map.draw) {
        this.draw = this.map.draw();
      } else {
        this.draw = new this.D2c.draw({
          displayControlsDefault: false,
        });
        this.map.addControl(this.draw);
      }
      this.bindEvent();
    },
    handleDraw() {
      const data = this.draw.getAll();
      const { features } = data;
      if (features.length === 0) {
        return false;
      }
      const feature = features[0];
      let { geometry } = feature;
      geometry = JSON.stringify(geometry);
      if (this.drawRecord.length === this.recordIndex + 1) {
        this.drawRecord.push(geometry);
      } else {
        this.drawRecord.splice(
          this.recordIndex,
          this.drawRecord.length - this.recordIndex,
          geometry,
        );
      }
      this.recordIndex++;
      this.form.pcGeojson = geometry;
    },
    clearDraw() {
      this.draw && this.draw.deleteAll();
    },
    handleMode(e) {
      if (e.mode !== this.mode) {
        this.draw.changeMode(this.mode);
      }
    },
    offEvent() {
      this.map.off('draw.create', this.handleDraw);
      this.map.off('draw.update', this.handleDraw);
      this.map.off('draw.changeMode', this.handleMode);
    },
    destroy() {
      this.offEvent();
      this.draw.changeMode('simple_select');
    },
  },
};
