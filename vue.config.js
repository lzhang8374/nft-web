var proEnv = require('./config/pro.env'); // 生产环境
var uatEnv = require('./config/test.env'); // 测试环境
var devEnv = require('./config/dev.env'); // 本地环境

const devProxy = ['/api'];
const env = process.env.NODE_ENV;

let target = '';
// 默认是本地环境
if (env === 'production') { // 生产环境
  target = proEnv.hosturl;
} else if (env === 'test') { // 测试环境
  target = uatEnv.hosturl;
} else { // 本地环境
  target = devEnv.hosturl;
}

module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port: 8080, // 端口号ß
    // host: 'localhost',
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    proxy: {
      '/nft-api': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/nft-api': ''
        }
      }
    }
  },
};
