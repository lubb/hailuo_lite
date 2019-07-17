import Taro, { Component, Config } from '@tarojs/taro'
import {Button, View} from '@tarojs/components'
import { AtSteps, AtIcon, AtButton} from 'taro-ui'
import './mine.scss'
import ajax from "../../common/js/ajax";

export default class Mine extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '设置'
  }

  constructor () {
    super(...arguments)
    this.state = {
      carNumber:'',
      date:'',
      color:false,
    }
  }

  componentWillMount () {
    this.getCar();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  /**
   * 获取当前用户的车信息
   */
  getCar(){
    let token = Taro.getStorageSync('token');
    Taro.showLoading({
      title: '加载中',
    });
    ajax.postToken("/api/car/driverCar",'','application/x-www-form-urlencoded', token).then(r=>{
      let carInfo = r.data.bizContent;
      var date1 = new Date(carInfo.platformEndDate.replace(/-/g, "/"));
      let now = new Date();
      let color = false;
      var days = (date1.getTime()-now.getTime()) / (1000 * 60 * 60 * 24);
      if(days > 31){
        color=true;
      }
      Taro.hideLoading();
      this.setState({
        carNumber:carInfo.carNumber,
        date:carInfo.platformEndDate,
        color:color
      })
    });
  }

  passwordUpdate(){
    Taro.navigateTo({url:'/pages/mine/password/password'});
  }

  message(){
    Taro.navigateTo({url:'/pages/mine/message/message'});
  }

  openSetting(){
    Taro.openSetting();
  }

  aboutUs(){
    Taro.navigateTo({url:'/pages/mine/about/about'});
  }

  telPhone(){
    Taro.makePhoneCall({
      phoneNumber: '400-628-9998' //仅为示例，并非真实的电话号码
    })
  }

  logout(){
    Taro.clearStorageSync();
    Taro.navigateTo({url:'/pages/login/login'});
  }

  render () {
    return (
      <View className="container">
        <View className="zan-panel2" style='margin-bottom:10px;border-bottom: 1px solid gainsboro;'>
            <View className="zan-cell__bd1">车牌号:{this.state.carNumber}</View>
            <View className="zan-cell__ft1" style={this.state.color?'color:black;':'color:red;'}>(到期时间:{this.state.date})</View>
        </View>
        <View className="zan-panel" style='margin-bottom:10px;border-bottom: 1px solid gainsboro;'>
          <View className="zan-cell zan-cell--access" onClick={this.message}>
            <AtIcon value='message' size='15' color='#38f'></AtIcon>
            <View className="zan-cell__bd">我的消息</View>
            <View className="zan-cell__ft"></View>
          </View>
          <View className="zan-cell zan-cell--access" onClick={this.passwordUpdate}>
            <AtIcon value='settings' size='15' color='#38f'></AtIcon>
            <View className="zan-cell__bd">修改密码</View>
            <View className="zan-cell__ft"></View>
          </View>
          <View className="zan-cell zan-cell--access" onClick={this.openSetting}>
            <AtIcon value='map-pin' size='15' color='#38f'></AtIcon>
            <View className="zan-cell__bd">授权位置</View>
            <View className="zan-cell__ft"></View>
          </View>
          <View className="zan-cell zan-cell--access" onClick={this.aboutUs}>
            <AtIcon value='heart-2' size='15' color='#38f'></AtIcon>
            <View className="zan-cell__bd">关于我们</View>
            <View className="zan-cell__ft"></View>
          </View>
          <Button className="zan-cell2 zan-cell--access" openType='contact'>
            <AtIcon value='user' size='15' color='#38f'></AtIcon>
            <View className="zan-cell__bd">在线客服</View>
            <View className="zan-cell__ft"></View>
          </Button>
          <View className="zan-cell zan-cell--access" onClick={this.telPhone} style='border-top: 0'>
            <AtIcon value='phone' size='15' color='#38f'></AtIcon>
            <View className="zan-cell__bd">服务电话：</View>
            <View className="zan-cell__ft">400-628-9998</View>
          </View>
        </View>
        <View className="zan-panel" style='border-bottom: 1px solid gainsboro;'>
          <View className="zan-cell3">
            <View onClick={this.logout} className="zan-cell__bd2 zan-c-red zan-center">退出登录</View>
          </View>
        </View>
      </View>
    )
  }
}
