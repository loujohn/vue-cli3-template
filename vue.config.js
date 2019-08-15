const path = require('path');

const resolve = folder => path.resolve(__dirname, folder);

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [resolve('./src/assets/style/variable.scss')],
    });
}

module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.externals(['d2c', 'config', 'turf']);
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    config.resolve.alias
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('api', resolve('src/api'))
      .set('utils', resolve('src/utils'));

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type =>
      addStyleResource(config.module.rule('scss').oneOf(type)),
    );
  },
};
