import Taro, { Component, Config } from '@tarojs/taro'
import {Button, Image, View} from '@tarojs/components'
import './index.scss'

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
          <View className="zan-panel-title">到货图片</View>
          <View className="zan-cell-img">
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
          </View>
          <View className="zan-panel-title">空车图片</View>
          <View className="zan-cell-img">
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
            <Image className='account__img' src={info.pic0} />
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
