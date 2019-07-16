import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Input, Button  } from '@tarojs/components'
import './order.scss'
import ajax from "../../common/js/ajax";

export default class Order extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '订单列表',
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
  }

  constructor () {
    super(...arguments)
    this.state = {
      current:1,
      size:10,
      total:0,
      pages:1,
      emptyTxt:'',
      orderList:[
      ],
    }
  }

  componentWillMount () {
    this.getList(this.state.current);
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  detailOpen(item){
    let url = '/pages/order/detail?orderId='+item.id;
    Taro.navigateTo({url: url});
  }

  /**
   * 获取当前用户的车信息
   */
  getList(current){
    let token = Taro.getStorageSync('token');
    Taro.showLoading({
      title: '加载中',
    });
    ajax.postToken("/api/car/driverCar",'','application/x-www-form-urlencoded', token).then(r=>{
      let carInfo = r.data.bizContent;
      this.getOrderList(carInfo.id, token, current);
    });
  }

  /**
   * 获取一个月内的订单
   */
  getThreeMonthDay(){
    var date = new Date();
    date.setMonth(date.getMonth()-1);
    return (date.getFullYear()) + "-" +
      (date.getMonth() + 1) + "-" +
      (date.getDate());
  }

  /**
   * 获取订单列表
   * @param userId
   * @param token
   * @param current
   */
  getOrderList(userId, token, current){
    let date = this.getThreeMonthDay();
    let data ='';
    if(current == 1){
      data = 'status=1&carId='+userId+'&starTime='+date+'&current='+current+'&size=10';
    }else{
      data = 'status=1&carId='+userId+'&starTime='+date+'&current='+current+'&size=10&total='+this.state.total;
    }
    ajax.postToken("/api/order/carOrderList",data,'application/x-www-form-urlencoded', token).then(r=>{
      console.log(r);
      if(r && r.data.bizContent.records.length>0){
        if(current == 1){
          this.setState({
            pages:r.data.bizContent.pages,
            total:r.data.bizContent.total,
            current:current+1,
            orderList:r.data.bizContent.records
          })
        }else{
          this.setState({
            total:r.data.bizContent.total,
            current:current+1,
            orderList:this.state.orderList.concat(r.data.bizContent.records)
          })
        }
      }else{
        this.setState({
          emptyTxt:'没有已完成的订单'
        })
        Taro.showToast({title: '请重新加载', icon: 'none'})
      }
      Taro.hideLoading();
    });
  }

  /**
   * 下拉事件
   */
  onPullDownRefresh(e) {
    this.getList(1);
  }

  /**
   * 上拉事件监听
   * @param e
   */
  onReachBottom(e) {
    if(this.state.pages >= this.state.current){
      this.getList(this.state.current);
    }
  }

  render () {
    const { orderList,emptyTxt } = this.state;
    return (
      <View>
        {
          orderList.length > 0 ? (
            <View className='listWrap'>
              {
                orderList.map((item, index) => {
                  return (
                    <View className='order_sigle' onClick={this.detailOpen.bind(this, item)}>
                      <View className='order_one long_text'>客户名称：{item.agencyName}</View>
                      <View className='order_two'>
                        <View className='order_two_date'>出厂日期：{item.chuchangriqi}</View>
                        <View className='order_two_num'>{item.fahuoshuliang}顿</View>
                      </View>
                      <View className='order_three'>{item.baozhuangfangshi}</View>
                    </View>
                  )
                })
              }
            </View>
          ) : (
            <View className='noData'>
              <View className='noData__text'>
                <Text>{emptyTxt}</Text>
              </View>
            </View>
          )
        }
      </View>
    )
  }
}
