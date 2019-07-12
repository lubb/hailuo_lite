import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Input, Button  } from '@tarojs/components'
import { AtSteps,AtImagePicker } from 'taro-ui'
import bmap from "../../../common/js/bmap-wx.min";
import './arrive.scss'
import ajax from "../../../common/js/ajax";

export default class Arrive extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '重车到货'
  }

  constructor () {
    super(...arguments)
    this.state = {
      current: 0,
      steps:[
        {
          'title': '第一步',
        },
        {
          'title': '第二步',
        },
        {
          'title': '第三步',
        },
        {
          'title': '第四步',
        }
      ],
      files: [],
    }
  }

  onChanges (files) {
    this.setState({
      files:files
    })
  }

  onFail (mes) {
    console.log(mes)
  }
  onImageClick (index, file) {
    console.log(index, file)
  }

  componentWillMount () {
    var BMap = new bmap.BMapWX({
      ak: 'UKWEehRX37kF537PUAHXoBKGlSvqnqvl'
    });
    var fail = function (data) {
      console.log('1',data)
    };
    var success = function (data) {
      var locstr = data.wxMarkerData[0].address + data.wxMarkerData[0].desc + data.wxMarkerData[0].business;
      cosole.log(locstr);
    }
    BMap.regeocoding({
      fail: fail,
      success: success
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onChange (current) {
    this.setState({
      current
    })
  }

  uploadPic(){
    let file = this.state.files[0];
    Taro.uploadFile({
      url:'http://119.23.144.116:9600/upload',
      name:'file',
      filePath:file.url,
    }).then(res => {
      if (res.statusCode === 200) {
        this.addOrderPic(12077,2289426);
        debugger;
        let obj = JSON.parse(res.data);
        file.fingerprint = obj.files[0].code;
        this.setState({
          files: files
        })
      } else {

      }
    }).catch(res => {
      console.log(res);

    });
  }

  addOrderPic(carId,orderId){
    let token = Taro.getStorageSync('token');
    let data = 'carId='+carId+'&orderId='+orderId+'&phoneLat=11&phoneLon=22&phoneSendTime=2019-07-12 19:20:20&pic=87ABCD9DA8C64C10C90ADE90690FA686AED8F3D5&picGroup=1&picGroupOrder=1&picType=2';
    ajax.postToken("/api/order/addOrderPic",data,'application/x-www-form-urlencoded', token).then(r=>{
      console.log(r);
    });
  }

  render () {
    return (
      <View>
      <AtSteps
        items={this.state.steps}
        current={this.state.current}
        onChange={this.onChange.bind(this)}
      />
      <AtImagePicker
        length={5}
        files={this.state.files}
        onChange={this.onChanges.bind(this)}
        onFail={this.onFail.bind(this)}
        onImageClick={this.onImageClick.bind(this)}
        />
        <Button onClick={this.uploadPic}>下一步</Button>
      </View>
    )
  }
}
