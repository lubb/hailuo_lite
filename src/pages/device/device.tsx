import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Input, Button  } from '@tarojs/components'
import './device.scss'

export default class Device extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '设备状态'
  }

  constructor () {
    super(...arguments)
    this.state = {
      latitude:'29.580554551939038',
      longitude:'111.27982597122477',
      zzMsg:'获取中...',
      sbztMsg:'获取中...',
      markers: [{
        id: 0,
        iconPath: require("./../../common/images/track.png"),
        latitude: 29.580554551939038,
        longitude: '111.27982597122477',
        title: '安徽中凯信息股份有限公司',
        callout: {
          content: '湘J68035' + '\n' + 'GPS状态：离线\n' + '载重传感：载重正常',
          display: 'ALWAYS',
          padding: 10
        }
      }]
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const {latitude,longitude,markers,sbztMsg,zzMsg} = this.state;
    return (
      <View className="page-body">
        <View className="page-section page-section-gap">
          <map
            style="width: 100%; height: 100vh;"
            show-compass="true"
            latitude={latitude}
            longitude={longitude}
            markers={markers}
          >
          </map>
        </View>
      </View>
    )
  }
}
