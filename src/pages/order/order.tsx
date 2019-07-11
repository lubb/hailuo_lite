import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Input, Button  } from '@tarojs/components'
import './order.scss'

export default class Order extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '订单列表'
  }

  constructor () {
    super(...arguments)
    this.state = {
      orderList:[
        {
          'name':'湖南海虎建材商贸有限公司',
          'date':'2019-07-10 12:27:41',
          'type':'散装',
          'num':31,
        },
        {
          'name':'湖南海虎建材商贸有限公司',
          'date':'2019-07-10 12:27:41',
          'type':'散装',
          'num':31,
        },
        {
          'name':'湖南海虎建材商贸有限公司',
          'date':'2019-07-10 12:27:41',
          'type':'散装',
          'num':31,
        }
      ],
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  detailOpen(item){
    let url = '/pages/order/detail';
    Taro.navigateTo({url: url});
  }

  render () {
    const { orderList } = this.state;
    return (
      <View>
        {
          orderList.length > 0 ? (
            <View className='listWrap'>
              {
                orderList.map((item, index) => {
                  return (
                    <View className='order_sigle' onClick={this.detailOpen.bind(this, item)}>
                      <View className='order_one'>客户名称：{item.name}</View>
                      <View className='order_two'>
                        <View className='order_two_date'>出厂日期：{item.date}</View>
                        <View className='order_two_num'>{item.num}顿</View>
                      </View>
                      <View className='order_three'>{item.type}</View>
                    </View>
                  )
                })
              }
            </View>
          ) : (
            <View className='noData'>
              <View className='noData__text'>
                <Text>好像什么都 没有</Text>
              </View>
            </View>
          )
        }
      </View>
    )
  }
}
