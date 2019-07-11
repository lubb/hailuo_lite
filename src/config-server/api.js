import hytApi from  '../config-server/hytApi';


const rootPath=hytApi.hyt_new_api_path
const apiObject = {
  //-----------------福利中心相关api----------------
  getCouponDetails:   rootPath+'/welfare/getMyCoupons',//获取我的优惠券详情
  getFlMangeList:  rootPath+'/welfare/getFlMangeList',//查看福利包列表
  getFlMangeInfo:  rootPath+'/welfare/getFlMangeInfo',//查看福利包详情
  getFlMange:  rootPath+'/welfare/receiveCoupons',//领取福利包
  useCoupons:  rootPath+'/welfare/clipCoupons',//使用优惠券
  overdueReminder:  rootPath+'/welfare/overdueReminder',//红点提醒
  //-----------------formId收集----------------
  saveFormId:  rootPath+'/wxPush/saveWxPush',//上传formId
}


export default apiObject;
