import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Input, Button  } from '@tarojs/components'
import './device.scss'
import ajax from "../../common/js/ajax";

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
      timer:'',
      latitude:'29.580554551939038',
      longitude:'111.27982597122477',
      markers: [{
        id: 0,
        iconPath: require("./../../common/images/track.png"),
        latitude: '29.580554551939038',
        longitude: '111.27982597122477',
        title: '安徽中凯信息股份有限公司',
        callout: {
          content: '湘J68035' + '\n' + 'GPS状态：离线\n' + '载重：XX顿\n速度：0',
          display: 'ALWAYS',
          padding: 10
        }
      }]
    }
  }

  componentWillMount () {
   this.getCurrentCarInfo();
  }

  componentDidMount () { }

  componentWillUnmount () {
  }

  componentDidShow () {
    this.inter_data();
  }

  componentDidHide () {
    clearInterval(this.state.timer);
  }

  dataInit(carId, token){
    let data = 'carIds='+carId;
    ajax.postToken("/api/car/selectCurSites",data,'application/x-www-form-urlencoded', token).then(r=>{
      Taro.hideLoading();
      console.log(r);
      let d = r.data.bizContent;
      if(d && d.length>0){
        let d_ = d[0];
        this.setState({
          latitude: d_.lon,
          longitude:d_.lat,
          markers: [{
            id: 0,
            iconPath: require("./../../common/images/track.png"),
            latitude: d_.lon,
            longitude: d_.lat,
            title: '安徽中凯信息股份有限公司',
            callout: {
              content: d_.carNumber + '\n' + 'GPS状态：'+(d_.gpsType===1?'在线':'静止中')+'\n' + '载重：'+d_.weight+'顿\n速度：'+d_.speed,
              display: 'ALWAYS',
              padding: 10
            }
          }]
        })
      }

    });
  }

  /**
   * 获取当前用户的车信息
   */
  getCurrentCarInfo(){
    let token = Taro.getStorageSync('token');
    Taro.showLoading({
      title: '加载中',
    });
    ajax.postToken("/api/car/driverCar",'','application/x-www-form-urlencoded', token).then(r=>{
      let carInfo = r.data.bizContent;
      console.log('carInfo',carInfo);
      Taro.hideLoading();
      this.dataInit(carInfo.id, token);
    });
  }

  inter_data(){
    let that = this;
    let timer = setInterval(function () {
      that.getCurrentCarInfo();
    }, 10000);
    this.setState({
      timer:timer
    })
  }

  render () {
    const {latitude,longitude,markers} = this.state;
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
