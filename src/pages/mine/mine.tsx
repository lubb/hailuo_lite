import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './mine.scss'

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
      realName:'11',
      area:'22',
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  logout(){
    Taro.clearStorageSync();
    Taro.navigateTo({url:'/pages/login/login'});
  }

  render () {
    const {realName,area} = this.state;
    return (
      <View className="container">
        <View className="zan-panel">
          <View className="zan-cell">
            <View className="zan-cell__bd">
              <View className="zan-cell__text">车牌号码:
                <text decode="true" calss="car_no">{realName}</text>
              </View>
              <View className="zan-cell__desc">{area}</View>
            </View>
            <View className="zan-cell__ft">{area}</View>
          </View>
        </View>
        <View className="zan-panel" catchtap='goLogin' hidden='true'>
          <View className="zan-cell">
            <View className="zan-cell__bd">
              <View className="zan-cell__text">登录</View>
              <View className="zan-cell__desc">登录以进行后续的操作</View>
            </View>
            <View className="zan-cell__ft">点击登录</View>
          </View>
        </View>

        <View className="zan-panel">
          <View className="zan-cell zan-cell--access" catchtap='goMessage'>
            <View className="zan-cell__icon zan-icon zan-icon-chat" style="color:#38f;"></View>
            <View className="zan-cell__bd">我的消息</View>
            <View className="zan-cell__ft"></View>
          </View>
          <View className="zan-cell zan-cell--access" catchtap='changePass'>
            <View className="zan-cell__icon zan-icon zan-icon-debit-pay" style="color:#38f;"></View>
            <View className="zan-cell__bd">修改密码</View>
            <View className="zan-cell__ft"></View>
          </View>
          <View className="zan-cell zan-cell zan-cell--access" bindtap="openSetting">
            <View className="zan-cell__icon zan-icon zan-icon-location" style="color:#38f;"></View>
            <View className="zan-cell__bd">授权位置</View>
            <View className="zan-cell__ft"></View>
          </View>
          <View className="zan-cell zan-cell">
            <View className="zan-cell__icon zan-icon zan-icon-like" style="color:#38f;"></View>
            <View className="zan-cell__bd">关于我们</View>
            <View className="zan-cell__ft"></View>
          </View>
          <View className="zan-cell zan-cell  zan-cell--access">
            <View className="zan-cell__icon zan-icon zan-icon-contact" style="color:#38f;"></View>
            <View className='zan-cell__bd'>
              <button plain="true" className="btn-contact" open-type="contact" bindcontact="handleContact">在线客服</button>
            </View>
            <View className="zan-cell__ft"></View>
          </View>
          <View className="zan-cell zan-cell" bindtap='telephone'>
            <View className="zan-cell__icon zan-icon zan-icon-phone" style="color:#38f;"></View>
            <View className="zan-cell__bd">服务电话：400-628-9998</View>
            <View className="zan-cell__ft"></View>
          </View>
        </View>
        <View className="zan-panel">
          <View className="zan-cell">
            <View onClick={this.logout} className="zan-cell__bd zan-c-red zan-center">退出登录</View>
          </View>
        </View>
      </View>
    )
  }
}
