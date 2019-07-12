import Taro, { Component, Config } from '@tarojs/taro'
import {Button, Image, View} from '@tarojs/components'
import './index.scss'
import ajax from "../../common/js/ajax";
import hytApi from "../../config-server/hailuoApi";

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '运输中订单'
  }

  constructor () {
    super(...arguments)
    this.state = {
      order:{},
      isArr: false,
      isEmp: false,
      heavy:[{
        pic0:require('./../../common/images/no_img.png'),
        pic1:require('./../../common/images/no_img.png'),
        pic2:require('./../../common/images/no_img.png'),
        pic3:require('./../../common/images/no_img.png')
      }],
      empty:[{
        pic0:require('./../../common/images/no_img.png'),
        pic1:require('./../../common/images/no_img.png'),
        pic2:require('./../../common/images/no_img.png'),
        pic3:require('./../../common/images/no_img.png')
      }],
    }
  }

  componentWillMount () {
    //首先获取当前用户的车俩信息
    this.getCurrentCarInfo();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  /**
   * 获取当前用户的车信息
   */
  getCurrentCarInfo(){
    let token = Taro.getStorageSync('token');
    Taro.showLoading({
      title: '加载中',
    });
    ajax.postToken("/api/car/driverCar",'','application/x-www-form-urlencoded', token).then(r=>{
      console.log(r);
      let carInfo = r.data.bizContent;
      Taro.setStorageSync('carInfo', carInfo);
      this.getCarIngInfo(carInfo.id, token);
    });
  }

  /**
   * 获取运输中的订单信息
   * @param userId
   * @param token
   */
  getCarIngInfo(userId, token){
    let date = this.getThreeMonthDay();
    let data = 'status=0&carId='+userId+'&starTime='+date;
     ajax.postToken("/api/order/carOrderList",data,'application/x-www-form-urlencoded', token).then(r=>{
       console.log(r);
       if(r){
         this.setState({
           order:r.data.bizContent.records[0]
         })
       }
       this.getPic(r.data.bizContent.records[0].id, token);
       Taro.hideLoading();
     });
  }

  //获取单号的图片信息
  getPic(orderId, token){
    debugger;
    let data = 'orderId='+orderId;
    ajax.postToken("/api/order/listOrderPic",data,'application/x-www-form-urlencoded', token).then(r=>{
      console.log(r);
      let d = r.data.bizContent;
      if(d!=null && d.length>0){
        let h =[];
        let n =[];
        let arrayHeavy = [];
        let arrayNull = [];
        for(let i=0,len=d.length;i<len;i++){
           let pic = d[i];
           if(pic.picType == 2){
             //表示重车
             arrayHeavy.push(pic);
           }else if(pic.picType == 3){
             //表示空车
             arrayNull.push(pic);
           }
        }
        console.log(arrayHeavy);
        console.log(arrayNull);
        if(arrayHeavy && arrayHeavy.length>0){
          h = this.genterData(arrayHeavy);
          this.setState({
            heavy:h
          })
        }
        if(arrayNull && arrayNull.length>0){
          n = this.genterData(arrayNull);
          this.setState({
            empty:n
          })
        }
      }
    });
  }

  genterData(arrayHeavy){
    var map = {},
        dest = [],
        result=[];
    for(var i = 0; i < arrayHeavy.length; i++){
      var ai = arrayHeavy[i];
      if(!map[ai.picGroup]){
        dest.push({
          picGroup: ai.picGroup,
          data: [ai]
        });
        map[ai.picGroup] = ai.picGroup;
      }else{
        for(var j = 0; j < dest.length; j++){
          var dj = dest[j];
          if(dj.picGroup == ai.picGroup){
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    dest.forEach(data=>{
      let j = {};
      let list = data.data;
      let len = list.length;
      list.forEach(d=>{
        if(len ==1){
          if(d.picGroupOrder==1){
            j.pic0 = hytApi.hailuo_img_path+'/'+d.pic;
          }
          j.pic1 = require('./../../common/images/no_img.png');
          j.pic2 = require('./../../common/images/no_img.png');
          j.pic3 = require('./../../common/images/no_img.png');
        }
        if(len ==2){
          if(d.picGroupOrder==1){
            j.pic0 = hytApi.hailuo_img_path+'/'+d.pic;
          }
          if(d.picGroupOrder==2){
            j.pic1 = hytApi.hailuo_img_path+'/'+d.pic;
          }
          j.pic2 = require('./../../common/images/no_img.png');
          j.pic3 = require('./../../common/images/no_img.png');
        }
        if(len ==3){
          if(d.picGroupOrder==1){
            j.pic0 = hytApi.hailuo_img_path+'/'+d.pic;
          }
          if(d.picGroupOrder==2){
            j.pic1 = hytApi.hailuo_img_path+'/'+d.pic;
          }
          if(d.picGroupOrder==3){
            j.pic2 = hytApi.hailuo_img_path+'/'+d.pic;
          }
          j.pic3 = require('./../../common/images/no_img.png');
        }
        if(len ==4){
          if(d.picGroupOrder==1){
            j.pic0 = hytApi.hailuo_img_path+'/'+d.pic;
          }
          if(d.picGroupOrder==2){
            j.pic1 = hytApi.hailuo_img_path+'/'+d.pic;
          }
          if(d.picGroupOrder==3){
            j.pic2 = hytApi.hailuo_img_path+'/'+d.pic;
          }
          if(d.picGroupOrder==4){
            j.pic3 = hytApi.hailuo_img_path+'/'+d.pic;
          }
        }


        if(d.picGroupOrder==3){
          j.pic2 = hytApi.hailuo_img_path+'/'+d.pic;
        }
        if(d.picGroupOrder==4){
          j.pic3 = hytApi.hailuo_img_path+'/'+d.pic;
        }
      })
      result.push(j);
    })
    return result;
  }

  /**
   * 获取两个月内的订单
   */
  getThreeMonthDay(){
    var date = new Date();
    date.setMonth(date.getMonth()-1);
    return (date.getFullYear()) + "-" +
      (date.getMonth() + 1) + "-" +
      (date.getDate());
  }

  takePhoto(){
    Taro.navigateTo({url: '/pages/index/arrive/arrive'})
  }

  render () {
    let{order,heavy,empty,isArr,isEmp}= this.state;
    return (
      <View className="container">
        <View className="zan-panel">
          <View className="zan-panel-title">订单信息</View>
          <View className="zan-cell">
            <View className="zan-cell__hd">客户名称</View>
            <View className="zan-field__input">{order.agencyName}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">发货单号</View>
            <View className="zan-field__input">{order.fahuodanhao}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">产品名称</View>
            <View className="zan-field__input">{order.chanpinmingcheng}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">车辆牌照</View>
            <View className="zan-field__input">{order.carNumber}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">订单数量</View>
            <View className="zan-field__input">{order.fahuoshuliang}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">包装方式</View>
            <View className="zan-field__input">{order.baozhuangfangshi}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">出厂时间</View>
            <View className="zan-field__input">{order.chuchangriqi}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">结束时间</View>
            <View className="zan-field__input">{order.endTime == null ? '运输中...': order.endTime}</View>
          </View>
          <View className="zan-panel-title">到货图片</View>
          {
            heavy.map((item, index) => {
              return (
                <View className="zan-cell-img">
                  <Image className='account__img' src={item.pic0} />
                  <Image className='account__img' src={item.pic1} />
                  <Image className='account__img' src={item.pic2} />
                  <Image className='account__img' src={item.pic3} />
              </View>
              )
            })
          }
          <View className="zan-panel-title">空车图片</View>
          {
            empty.map((item, index) => {
              return (
                <View className="zan-cell-img">
                  <Image className='account__img' src={item.pic0} />
                  <Image className='account__img' src={item.pic1} />
                  <Image className='account__img' src={item.pic2} />
                  <Image className='account__img' src={item.pic3} />
                </View>
              )
            })
          }
          <View className="zan-panel-title">拍照上传</View>
          <View className="zan-cell-btn">
            <Button className='account__myButton' onClick={this.takePhoto} disabled={isArr} type='primary'>重车到货</Button>
          </View>
          <View className="zan-cell-btn">
            <button className='account__myButton' disabled={isEmp} type='primary'>空车拍照</button>
          </View>
          <View className="zan-cell-btn">
            <button className='account__myButton' type='primary'>多点卸载</button>
          </View>
          <View className="zan-cell-btn">
            <button className='account__myButton' type='default'>订单完成</button>
          </View>
        </View>
      </View>

    )
  }
}
