import url from 'api/config';
export default {
  data() {
    return {
      showUploadPopover: false,
      upload: {
        url: url.mapPreview,
        headers: {
          'X-Token': sessionStorage.getItem('token'),
        },
        success: false,
      },
    };
  },
  methods: {
    handleSuccess(response, file, fileList) {
      if (response.code === 200 && response.message === 'ok') {
        this.upload.success = true;
        const {
          data: { geojson, fourPoint },
        } = response;
        this.handleEdit(geojson);
        this.map.fitBounds(fourPoint, {
          padding: 200,
        });
        this.$message({
          type: 'success',
          message: '上传成功',
        });
      }
    },

    handleRemove(file, fileList) {
      this.upload.success = false;
      this.form.pcGeojson = '';
      this.draw && this.draw.deleteAll();
    },

    handleError(err, file, fileList) {},

    handleExceed(file, fileList) {
      this.$message({
        type: 'warning',
        message: '只允许传单个文件!',
      });
    },
    showUpload() {
      this.draw && this.draw.deleteAll();
      this.showUploadPopover = true;
      this.showPopover = false;
      this.isDrawing = false;
      this.recordIndex = 0;
      this.drawRecord = [];
    },
    handleProgress(file) {
      // let fileType = file.type;
      // if (fileType !== 'application/zip' && fileType !== 'application/x-rar') {
      //   this.$message({
      //     message: '上传文件只能为压缩包',
      //     type: 'error',
      //   });
      //   return false;
      // } else {
      //   return true;
      // }
    },
  },
};
