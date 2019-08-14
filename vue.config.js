module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.externals(['d2c', 'config', 'turf']);
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    config.resolve.alias
      .set('assets', 'src/assets/')
      .set('components', 'src/components/')
      .set('views', 'src/views')
      .set('api', 'src/api')
      .set('utils', 'src/utils/');
  },
};
