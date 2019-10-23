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
      }
    },

    handleRemove(file, fileList) {
      this.upload.success = false;
    },

    handleError(err, file, fileList) {},

    handleExceed(file, fileList) {
      this.$message({
        type: 'warning',
        message: '只允许传单个文件!',
      });
    },
    showUpload() {
      this.showUploadPopover = true;
      this.showPopover = false;
      this.draw && this.draw.deleteAll();
      this.isDrawing = false;
    },
    uploadCancel() {
      if (this.upload.success) {
        this.$confirm('是否保存当前范围', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
        })
          .then(async () => {
            const res = await this.save();
            if (res) {
              this.showUploadPopover = false;
              this.upload.success = false;
            }
          })
          .catch(() => {
            this.draw && this.draw.deleteAll();
            this.form.pcGeojson = '';
            this.showUploadPopover = false;
            this.upload.success = false;
          });
      } else {
        this.showUploadPopover = false;
      }
    },
    uploadClear() {
      this.draw && this.draw.deleteAll();
      this.form.pcGeojson = '';
      this.showUploadPopover = false;
      this.upload.success = false;
    },
  },
};
