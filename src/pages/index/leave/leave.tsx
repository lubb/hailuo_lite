import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button  } from '@tarojs/components'
import { AtSteps, AtIcon, AtButton} from 'taro-ui'
import bmap from "../../../common/js/bmap-wx.min";
import './leave.scss'
import ajax from "../../../common/js/ajax";
import hytApi from "../../../config-server/hailuoApi";

export default class Leave extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '空车拍照'
  }

  constructor () {
    super(...arguments)
    this.state = {
      carId:this.$router.params.carId,
      orderId:this.$router.params.orderId,
      current: this.$router.params.picGroupOrder-1,
      picGroup:this.$router.params.picGroup,
      picGroupOrder:this.$router.params.picGroupOrder,
      picType:this.$router.params.picType,
      pic:'',
      code:'',
      loc:'',
      addIcon:require("./../../../common/images/photo.jpg"),
      steps:[
        {
          'title': '车头',
          'success': true
        },
        {
          'title': '车尾',
        },
        {
          'title': '货堆正面',
        },
        {
          'title': '货堆侧面',
        }
      ],
      files: [],
    }
  }

  componentWillMount () {
    var BMap = new bmap.BMapWX({
      ak: 'FOQuk3Q7RewniogGzcaVQOkmjTLAiAiQ'
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
    let  that = this;
    Taro.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res);
        let token = Taro.getStorageSync('token');
        console.log(that.state);
        let data = 'carId='+that.state.carId+'&orderId='+that.state.orderId+'&phoneLat='+res.latitude+'&phoneLon='+res.longitude+'&phoneSendTime='+that.getTimeFormat()+'&pic='+that.state.code+'&picGroup='+that.state.picGroup+'&picGroupOrder='+that.state.picGroupOrder+'&picType='+that.state.picType;
        console.log(data);
        Taro.showLoading({
          title: '加载中',
        });
        ajax.postToken("/api/order/addOrderPic",data,'application/x-www-form-urlencoded', token).then(r=>{
          Taro.hideLoading();
          if(r.data.bizContent == 1){
            if(that.state.current == 3){
              that.setState({
                current:0,
                pic:'',
                code:'',
                picGroupOrder:1
              })
              Taro.switchTab({url:'/pages/index/index'});
            }else{
              that.setState({
                current:that.state.current+1,
                pic:'',
                code:'',
                picGroupOrder:parseInt(that.state.picGroupOrder)+1
              })
            }
          }else{
            Taro.showToast({title: '保存图片失败，请重试', icon: 'none'})
          }
        });
      }
    })
  }

  getTimeFormat(){
    var now = new Date();
    var yy = now.getFullYear();      //年
    var mm = now.getMonth() + 1;     //月
    var dd = now.getDate();          //日
    var hh = now.getHours();         //时
    var ii = now.getMinutes();       //分
    var ss = now.getSeconds();       //秒
    var clock = yy + "-";
    if(mm < 10) clock += "0";
    clock += mm + "-";
    if(dd < 10) clock += "0";
    clock += dd + " ";
    if(hh < 10) clock += "0";
    clock += hh + ":";
    if (ii < 10) clock += '0';
    clock += ii + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return clock;     //获取当前日期
  }

  onImgClick() {
    let that = this;
    Taro.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
    }).then(res=>{
      let tempFilePaths = res.tempFilePaths
      console.log('tempFilePaths',tempFilePaths)
      Taro.showLoading({title: '加载中',})
      Taro.uploadFile({
        url:'http://119.23.144.116:9600/upload',
        filePath: tempFilePaths[0],
        name: 'file',
      }).then(rst=>{
        Taro.hideLoading()
        console.log('图片上传结果===>',rst)
        let obj = JSON.parse(rst.data);
        console.log(obj);
        that.setState({pic: hytApi.hailuo_img_path+'/'+obj.bizContent.code,code:obj.bizContent.code})
      }).catch(rst=>{
        Taro.hideLoading();
        console.log('图片上传失败===>',rst)
        Taro.showToast({
          title: '图片上传失败',
          image: require('../../../common/images/nonet@2x.png')
        })
      })
    }).catch(res=>{
      console.log('打开相册===>',res)
      Taro.hideLoading();
    })
  }

  render () {
    return (
      <View>
        <View className='img__position'>
          <View className='icon__pin'><AtIcon value='map-pin' size='20' color='#3d84e0'></AtIcon></View>
          <View className='loc_detail'>{this.state.loc}<View className='position__btn'>刷新位置</View></View>
        </View>
        <View className='img__step'>
          <AtSteps
            items={this.state.steps}
            current={this.state.current}
            onChange={this.onChange.bind(this)}
          />
        </View>
        {this.state.pic !==''? (<View className='img__title'>照片</View>):('')}
        {this.state.pic !== '' ? (<View className='img__choose'>
          <Image src={this.state.pic} className='img__choose__real'/>
        </View>):('')
        }
        <View className='img__title'>拍照</View>
        <View className='img__choose' onClick={this.onImgClick}>
          <View className='img__choose__border'>
              <Image src={this.state.addIcon} mode='widthFix' className='img__choose__icon'/>
          </View>
        </View>
        <View className='img_btn'>
          <Button className='img_btn_btn' type='primary' onClick={this.uploadPic}>下一步</Button>
        </View>
      </View>
    )
  }
}
