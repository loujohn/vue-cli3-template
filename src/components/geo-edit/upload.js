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
    async uploadSave() {
      if (!this.upload.success) {
        this.$message({
          type: 'error',
          message: '请添加范围',
        });
        return false;
      }
      const res = await this.save();
      if (res) {
        this.uploadClear();
      }
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
              this.uploadClear();
            }
          })
          .catch(() => {
            this.uploadClear();
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
      this.$refs['upload'].clearFiles();
      this.$emit('finish-upload');
    },
  },
};
