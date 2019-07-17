import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './about.scss'

export default class About extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '关于我们'
  }

  constructor () {
    super(...arguments)
    this.state = {
      carNumber:'',
    }
  }

  componentWillMount () {
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className="container">
        安徽中凯信息股份有限公司
      </View>
    )
  }
}
