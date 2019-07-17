import Taro, { Component, Config } from '@tarojs/taro'
import {Button, Image, View} from '@tarojs/components'
import './detail.scss'
import ajax from "../../common/js/ajax";
import { AtSteps, AtIcon, AtButton} from 'taro-ui'
import hytApi from "../../config-server/hailuoApi";

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
      orderId:this.$router.params.orderId,
      defaultImg:require('./../../common/images/no_img.png'),
      order:{},
      isArr: true,
      isEmp: true,
      picGroup:1,
      picGroupOrderHeavy:1,
      picGroupOrderNull:1,
      optionOne:false,
      optionTwo:false,
      heavy:[{
        pic0:require('./../../common/images/no_img.png'),
        pic1:require('./../../common/images/no_img.png'),
        pic2:require('./../../common/images/no_img.png'),
        pic3:require('./../../common/images/no_img.png')
      }],
      empty:[{
        pic0:require('./../../common/images/no_img.png'),
        pic1:require('./../../common/images/no_img.png'),
        pic2:require('./../../common/images/no_img.png'),
        pic3:require('./../../common/images/no_img.png')
      }],
    }
  }

  componentWillMount () {
    this.getCurrentCarInfo();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  /**
   * 初始化方法
   */
  initData(){
    this.setState({
      listShow: true,
      defaultImg:require('./../../common/images/no_img.png'),
      order:{},
      isArr: true,
      isEmp: true,
      picGroup:1,
      picGroupOrderHeavy:1,
      picGroupOrderNull:1,
      optionOne:false,
      optionTwo:false,
      heavy:[{
        pic0:require('./../../common/images/no_img.png'),
        pic1:require('./../../common/images/no_img.png'),
        pic2:require('./../../common/images/no_img.png'),
        pic3:require('./../../common/images/no_img.png')
      }],
      empty:[{
        pic0:require('./../../common/images/no_img.png'),
        pic1:require('./../../common/images/no_img.png'),
        pic2:require('./../../common/images/no_img.png'),
        pic3:require('./../../common/images/no_img.png')
      }],
    });
  }

  /**
   * 获取当前用户的车信息
   */
  getCurrentCarInfo(){
    this.initData();
    let token = Taro.getStorageSync('token');
    Taro.showLoading({
      title: '加载中',
    });
    this.getOrderDetail(this.state.orderId, token);
  }

  /**
   * 获取运输中的订单信息
   * @param userId
   * @param token
   */
  getOrderDetail(orderId, token){
    let data = 'orderId='+orderId;
    ajax.postToken("/api/order/orderDetail",data,'application/x-www-form-urlencoded', token).then(r=>{
      console.log(r);
      this.setState({
        order:r.data.bizContent
      })
      this.getPic(r.data.bizContent.id, token);
      Taro.hideLoading();
    });
  }

  /**
   * 获取单号的图片信息
   */
  getPic(orderId, token){
    let data = 'orderId='+orderId;
    ajax.postToken("/api/order/listOrderPic",data,'application/x-www-form-urlencoded', token).then(r=>{
      let d = r.data.bizContent;
      if(d!=null && d.length>0){
        let flagHeavy = true;
        let numHeavy =0;
        let picGroupOrderHeavy =1;
        let flagNull = true;
        let numNull =0;
        let picGroupOrderNull =1;
        let arrayHeavy = [];
        let arrayNull = [];
        for(let i=0,len=d.length;i<len;i++){
          let pic = d[i];
          if(pic.picType == 2){
            //表示重车
            arrayHeavy.push(pic);
          }else if(pic.picType == 3){
            //表示空车
            arrayNull.push(pic);
          }
        }
        if(arrayHeavy && arrayHeavy.length>0){
          let h = this.genterData(arrayHeavy);
          flagHeavy = h.flag;
          numHeavy = h.num;
          picGroupOrderHeavy = h.picGroupOrder;
          this.setState({
            heavy:h.data,
            isArr:flagHeavy,
            picGroup:numHeavy,
            optionOne:false,
            picGroupOrderHeavy:picGroupOrderHeavy
          })
        }else{
          this.setState({
            isArr:false,
            optionOne:true,
          })
        }
        if(arrayNull && arrayNull.length>0){
          let n = this.genterData(arrayNull);
          flagNull = n.flag;
          numNull = n.num;
          picGroupOrderNull = n.picGroupOrder;
          if(numHeavy == numNull){
            this.setState({
              empty:n.data,
              optionTwo:false,
              isEmp:flagHeavy?(flagNull?true:false):true,
              picGroupOrderNull:picGroupOrderNull
            })
          }else{
            //需要加一组空的照片
            n.data.push({
              pic0:this.state.defaultImg,
              pic1:this.state.defaultImg,
              pic2:this.state.defaultImg,
              pic3:this.state.defaultImg
            })
            this.setState({
              optionTwo:false,
              empty:n.data,
              isEmp:flagHeavy?false:true,
              picGroupOrderNull:picGroupOrderNull
            })
          }
        }else{
          this.setState({
            optionTwo:true,
            isEmp:flagHeavy?false:true
          })
        }
      }else{
        this.setState({
          isArr:false,
          isEmp:true,
          optionOne:true,
          optionTwo:true,
        })
      }
    });
  }

  /**
   * 数据处理
   * @param list
   */
  genterData(list){
    let result ={};
    let result_=[];
    let flag_ = true;
    let dest = this.groupByPicGroup(list);
    let groupNum = dest.length;
    let picGroupOrder =0;
    if(dest && groupNum>0){
      dest.forEach(data=>{
        let list = data.data;
        let len = list.length;//data数组的长度
        picGroupOrder = len==4?1:len+1;
        if(len!=4){
          //表示只上传部分图片
          flag_ = false;
        }else{
          //表示全部都有图片
          flag_ = true;
        }
        let j = {};
        list.forEach(d=>{
          if(len ==1){
            if(d.picGroupOrder==1){
              j.pic0 = hytApi.hailuo_img_path+'/'+d.pic;
            }
            j.pic1 = this.state.defaultImg;
            j.pic2 = this.state.defaultImg;
            j.pic3 = this.state.defaultImg;
          }
          if(len ==2){
            if(d.picGroupOrder==1){
              j.pic0 = hytApi.hailuo_img_path+'/'+d.pic;
            }
            if(d.picGroupOrder==2){
              j.pic1 = hytApi.hailuo_img_path+'/'+d.pic;
            }
            j.pic2 = this.state.defaultImg;
            j.pic3 = this.state.defaultImg;
          }
          if(len ==3){
            if(d.picGroupOrder==1){
              j.pic0 = hytApi.hailuo_img_path+'/'+d.pic;
            }
            if(d.picGroupOrder==2){
              j.pic1 = hytApi.hailuo_img_path+'/'+d.pic;
            }
            if(d.picGroupOrder==3){
              j.pic2 = hytApi.hailuo_img_path+'/'+d.pic;
            }
            j.pic3 = this.state.defaultImg;
          }
          if(len ==4){
            if(d.picGroupOrder==1){
              j.pic0 = hytApi.hailuo_img_path+'/'+d.pic;
            }
            if(d.picGroupOrder==2){
              j.pic1 = hytApi.hailuo_img_path+'/'+d.pic;
            }
            if(d.picGroupOrder==3){
              j.pic2 = hytApi.hailuo_img_path+'/'+d.pic;
            }
            if(d.picGroupOrder==4){
              j.pic3 = hytApi.hailuo_img_path+'/'+d.pic;
            }
          }
        })
        result_.push(j);
        result.flag = flag_;
        result.data = result_;
        result.num = groupNum;
        result.picGroupOrder = picGroupOrder;
      })
    }
    return result;
  }

  /**
   * 将数据按照picGroup进行分组
   * [{picGroup:1,data:[{},{},{},{}]},{picGroup:2,data:[{},{},{},{}]}]
   * @param list
   */
  groupByPicGroup(list){
    let map = {},dest = [];
    for(let i = 0; i < list.length; i++){
      let ai = list[i];
      if(!map[ai.picGroup]){
        dest.push({
          picGroup: ai.picGroup,
          data: [ai]
        });
        map[ai.picGroup] = ai.picGroup;
      }else{
        for(let j = 0; j < dest.length; j++){
          let dj = dest[j];
          if(dj.picGroup == ai.picGroup){
            dj.data.push(ai)
            break;
          }
        }
      }
    }
    return dest;
  }

  /**
   * 图片预览功能
   * @param item
   */
  previewImage(item){
    console.log(item);
    //图片预览
    if(item !== '/common/images/no_img.png'){
      Taro.previewImage({
        current: item, // 当前显示图片的http链接
        urls: [item] // 需要预览的图片http链接列表
      })
    }
  }

  /**
   * 重车拍照
   */
  takePhoto(){
    console.log('state',this.state);
    Taro.navigateTo({url:'/pages/index/arrive/arrive?carId='+this.state.order.carId+'' +
        '&orderId='+this.state.order.id+'&picType=2&picGroupOrder='+this.state.picGroupOrderHeavy+'' +
        '&picGroup='+this.state.picGroup});

  }

  /**
   * 空车拍照
   */
  takePhotoEmp(){
    console.log('state',this.state);
    Taro.navigateTo({url:'/pages/index/leave/leave?carId='+this.state.order.carId+'' +
        '&orderId='+this.state.order.id+'&picType=3&picGroupOrder='+this.state.picGroupOrderNull+'' +
        '&picGroup='+this.state.picGroup});
  }

  render () {
    let{order,heavy,empty,optionOne,optionTwo}= this.state;
    return (
      <View className="container">
        <View className="zan-panel">
          <View className="zan-panel-title">订单信息</View>
          <View className="zan-cell">
            <View className="zan-cell__hd">客户名称</View>
            <View className="zan-field__input long_text">{order.agencyName}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">发货单号</View>
            <View className="zan-field__input">{order.fahuodanhao}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">产品名称</View>
            <View className="zan-field__input">{order.chanpinmingcheng}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">车辆牌照</View>
            <View className="zan-field__input">{order.carNumber}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">订单数量</View>
            <View className="zan-field__input">{order.fahuoshuliang}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">包装方式</View>
            <View className="zan-field__input">{order.baozhuangfangshi}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">出厂时间</View>
            <View className="zan-field__input">{order.chuchangriqi}</View>
          </View>
          <View className="zan-cell">
            <View className="zan-cell__hd">结束时间</View>
            <View className="zan-field__input">{order.endTime == null ? '运输中...': order.endTime}</View>
          </View>
          <View className="zan-panel-title">
            <View class='font__img'>到货图片</View>{optionOne?(<View className='btn__imgs'><Button onClick={this.takePhoto} size='mini'>拍照</Button></View>):('已拍照')}</View>
          {
            heavy.map((item, index) => {
              return (
                <View className="zan-cell-img">
                  <Image className='account__img' onClick={this.previewImage.bind(this,item.pic0)} src={item.pic0} />
                  <Image className='account__img' onClick={this.previewImage.bind(this,item.pic1)} src={item.pic1} />
                  <Image className='account__img' onClick={this.previewImage.bind(this,item.pic2)} src={item.pic2} />
                  <Image className='account__img' onClick={this.previewImage.bind(this,item.pic3)} src={item.pic3} />
                </View>
              )
            })
          }
          <View className="zan-panel-title">
            <View class='font__img'>空车图片</View>{optionTwo?(<View className='btn__imgs'><Button onClick={this.takePhotoEmp} size='mini'>拍照</Button></View>):('已拍照')}</View>
          {
            empty.map((item, index) => {
              return (
                <View className="zan-cell-img">
                  <Image className='account__img' onClick={this.previewImage.bind(this,item.pic0)} src={item.pic0} />
                  <Image className='account__img' onClick={this.previewImage.bind(this,item.pic1)} src={item.pic1} />
                  <Image className='account__img' onClick={this.previewImage.bind(this,item.pic2)} src={item.pic2} />
                  <Image className='account__img' onClick={this.previewImage.bind(this,item.pic3)} src={item.pic3} />
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
