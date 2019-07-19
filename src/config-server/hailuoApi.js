/**
 * 服务器配置信息
 * @type {string}
 */


/**
 * 测试环境
 */
const UrlConstantsUat = {
  hailuo_api_path: 'https://auth.hailuo.ah-zk.com',
  hailuo_service_path: 'https://api.hailuo.ah-zk.com',
  hailuo_img_path:'http://img.hailuo.ah-zk.com',
  hailuo_img_upload:'https://fs.hailuo.ah-zk.com/upload',
  appId: 'wx55d3f914106096d8',
}


/**
 * 生产环境
 */
const UrlConstantsProd = {
  hailuo_api_path: 'http://119.23.144.116:9700',
  hailuo_service_path: 'http://119.23.144.116:9720',
  hailuo_img_path:'http://119.23.144.116:9610',
  hailuo_img_upload:'http://119.23.144.116:9600/upload',
  appId: 'wx55d3f914106096d8',
}


/**
 * 环境切换 修改 export default UrlConstantsProd 导出对应的环境
 */

export default UrlConstantsUat;
