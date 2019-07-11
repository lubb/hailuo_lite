/**
 * 服务器配置信息
 * @type {string}
 */


/**
 * 测试环境
 */
const UrlConstantsUat = {
  hailuo_api_path: 'https://uat.hengtech.com.cn/mall/api',
  appId: 'wx55d3f914106096d8',
}


/**
 * 生产环境
 */
const UrlConstantsProd = {
  hailuo_api_path: 'https://pms.polywuye.com/mall/api',
  appId: 'wx55d3f914106096d8',
}


/**
 * 环境切换 修改 export default UrlConstantsProd 导出对应的环境
 */

export default UrlConstantsUat;
