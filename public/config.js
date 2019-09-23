var common = 'http://192.168.11.160:8083';
// var common = 'http://172.16.4.195:8083';
// var common = 'http://172.16.3.239:8083';//何鹏
window.config = {
  title: '矿山资源调查系统',
  baseMapUrl:
    'http://zhsq.digitalcq.com/D2CJsonV2/zhsqdt/ZHSQDT_IMAGE_New.json',
  baseUrl: common + '/dc-core/',
  staticUrl: common + '/dc-core/static',
};
if (!parseInt(window.location.host)) {
  window.config.ksxf = 'http://zrzy.cqdlzx.com/dc-score';
}
