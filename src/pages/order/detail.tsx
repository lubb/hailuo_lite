import Taro, { Component, Config } from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import './detail.scss'

export default class Detail extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '订单详情'
  }

  constructor () {
    super(...arguments)
    this.state = {
      info:{
        pic0:require('./../../common/images/no_img.png')
      }
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    let{info}= this.state.info;
    return (
      <View className="container">
        <View className="zan-panel">
          <View className="zan-panel-title">订单信息</View>
          <View className="zan-cell">
            <View className="zan-cell__hd">客户名称</View>
            <View className="zan-field__input">湖南海虎建材商贸有限公司</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">发货单号</View>
            <View className="zan-field__input">2834506</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">出厂编号</View>
            <View className="zan-field__input">IDP4Q90250</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">车辆牌照</View>
            <View className="zan-field__input">湘J68035</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">订单数量</View>
            <View className="zan-field__input">31</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">包装方式</View>
            <View className="zan-field__input">散装</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">出厂时间</View>
            <View className="zan-field__input">2019-07-10 12:27</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">结束时间</View>
            <View className="zan-field__input">2019-07-10 12:29</View>
          </View>
          <View className="zan-panel-title">重车拍照</View>
          <View className="zan-cell-img">
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
          </View>
          <View className="zan-panel-title">空车拍照</View>
          <View className="zan-cell-img">
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
          </View>
        </View>
      </View>

    )
  }
}
