import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import './app.scss'
import ajax from "./common/js/ajax";

require("taro-ui/dist/weapp/css/index.css")

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/login/login',
      'pages/mine/mine',
      'pages/device/device',
      'pages/order/order',
      'pages/order/detail',
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/index/index',
          text: '运输中',
          iconPath: './common/images/trans.png',
          selectedIconPath: './common/images/trans-tap.png',
        },
        {
          pagePath: 'pages/order/order',
          text: '订单',
          iconPath: './common/images/order.png',
          selectedIconPath: './common/images/order-tap.png'
        },
        {
          pagePath: 'pages/device/device',
          text: '设备状态',
          iconPath: './common/images/device.png',
          selectedIconPath: './common/images/device-tap.png'
        },
        {
          pagePath: 'pages/mine/mine',
          text: '我的',
          iconPath: './common/images/mine.png',
          selectedIconPath: './common/images/mine-tap.png'
        }
      ],
      color: '#757575',
      selectedColor: '#3d84e0',
      backgroundColor: '#fff',
      borderStyle: 'black',
    },
    navigateToMiniProgramAppIdList: ['wx55d3f914106096d8'],
    // 小程序接口权限相关设置
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于城市效果展示'
      }
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
