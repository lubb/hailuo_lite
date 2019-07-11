import Taro, { Component, Config } from '@tarojs/taro'
import {Button, Image, View} from '@tarojs/components'
import './index.scss'
import ajax from "../../common/js/ajax";

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
      order:{

      },
      pic:{
        pic0:require('./../../common/images/no_img.png')
      }
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
       debugger
       Taro.hideLoading();
     });
  }

  getThreeMonthDay(){
    var date = new Date();
    date.setMonth(date.getMonth()-2);
    return (date.getFullYear()) + "-" +
      (date.getMonth() + 1) + "-" +
      (date.getDate());
  }

  render () {
    let{order,pic}= this.state;
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
            <View className="zan-cell__hd">出厂编号</View>
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
            <View className="zan-field__input">{order.endTime}</View>
          </View>
          <View className="zan-panel-title">到货图片</View>
          <View className="zan-cell-img">
            <Image className='account__img' src={pic.pic0} />
            <Image className='account__img' src={pic.pic0} />
            <Image className='account__img' src={pic.pic0} />
            <Image className='account__img' src={pic.pic0} />
          </View>
          <View className="zan-panel-title">空车图片</View>
          <View className="zan-cell-img">
            <Image className='account__img' src={pic.pic0} />
            <Image className='account__img' src={pic.pic0} />
            <Image className='account__img' src={pic.pic0} />
            <Image className='account__img' src={pic.pic0} />
          </View>
          <View className="zan-panel-title">拍照上传</View>
          <View className="zan-cell-btn">
            <Button className='account__myButton' type='primary'>重车到货</Button>
          </View>
          <View className="zan-cell-btn">
            <button className='account__myButton' type='primary'>空车拍照</button>
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
