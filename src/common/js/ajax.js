import Taro from '@tarojs/taro'
import hytApi from "../../config-server/hailuoApi";
import { HTTP_STATUS } from "./constance";

export default {

  /**
   *
   * @param params
   * @param method
   * @param fullUrl false
   * @return {*}
   */
  baseOptions(params, method = 'GET') {
    let { url, data, authorization } = params;
    url = hytApi.hailuo_api_path + url;
    let contentType = 'application/x-www-form-urlencoded';
    contentType = params.contentType || contentType;
    authorization = params.authorization || '';
    const option = {
      isShowLoading: false,
      loadingText: '正在加载',
      url: url,
      data: data,
      method: method,
      header: {'content-type': contentType, Authorization:authorization},
      success(res) {
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return Taro.showToast({title: '请求资源不存在', image: require('../../common/images/nonet@2x.png')});
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return Taro.showToast({title: '服务端通信失败', image: require('../../common/images/nonet@2x.png')});
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return Taro.showToast({title: '没有权限访问', image: require('../../common/images/nonet@2x.png')});
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data;
        }
      },
      error(e) {
        Taro.showToast({title: '请求接口出现问题', image: require('../../common/images/nonet@2x.png')});
      }
    };
    return Taro.request(option);
  },

  /**
   * 登陆专用
   * @param params
   * @param method
   * @param fullUrl false
   * @return {*}
   */
  baseOptionsLogin(params, method = 'GET') {
    let { url, data } = params;
    url = hytApi.hailuo_api_path + url;
    let contentType = 'application/x-www-form-urlencoded';
    contentType = params.contentType || contentType;
    const option = {
      isShowLoading: false,
      loadingText: '正在加载',
      url: url,
      data: data,
      method: method,
      header: {'content-type': contentType, 'cache-control':'no-cache', 'Authorization':'Basic aGFpbHVvOmhhaWx1bw=='},
      success(res) {
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return Taro.showToast({title: '请求资源不存在', image: require('../../common/images/nonet@2x.png')});
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return Taro.showToast({title: '服务端通信失败', image: require('../../common/images/nonet@2x.png')});
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return Taro.showToast({title: '没有权限访问', image: require('../../common/images/nonet@2x.png')});
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data;
        }
      },
      error(e) {
        Taro.showToast({title: '请求接口出现问题', image: require('../../common/images/nonet@2x.png')});
      }
    };
    return Taro.request(option);
  },

  get(url, data = '') {
    let option = { url, data };
    return this.baseOptions(option);
  },

  post: function (url, data, contentType) {
    let params = { url, data, contentType };
    return this.baseOptions(params, 'POST');
  },

  postLogin(url, data, contentType){
    let params = { url, data, contentType };
    return this.baseOptionsLogin(params, 'POST');
  }

}
