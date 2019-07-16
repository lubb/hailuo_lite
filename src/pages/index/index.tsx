import Taro, { Component, Config } from '@tarojs/taro'
import {Button, Image, View} from '@tarojs/components'
import './index.scss'
import ajax from "../../common/js/ajax";
import hytApi from "../../config-server/hailuoApi";

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
      defaultImg:require('./../../common/images/no_img.png'),
      order:{},
      isArr: true,
      isEmp: true,
      picGroup:1,
      picGroupOrderHeavy:1,
      picGroupOrderNull:1,
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
    //首先获取当前用户的车俩信息
    this.getCurrentCarInfo();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
    this.getCurrentCarInfo();
  }

  componentDidHide () { }

  /**
   * 获取当前用户的车信息
   */
  getCurrentCarInfo(){
    let token = Taro.getStorageSync('token');
    Taro.showLoading({
      title: '加载中',
    });
    ajax.postToken("/api/car/driverCar",'','application/x-www-form-urlencoded', token).then(r=>{
      console.log(r);
      let carInfo = r.data.bizContent;
      Taro.setStorageSync('carInfo', carInfo);
      this.getCarIngInfo(carInfo.id, token);
    });
  }

  /**
   * 获取运输中的订单信息
   * @param userId
   * @param token
   */
  getCarIngInfo(userId, token){
    let date = this.getThreeMonthDay();
    let data = 'status=0&carId='+userId+'&starTime='+date;
     ajax.postToken("/api/order/carOrderList",data,'application/x-www-form-urlencoded', token).then(r=>{
       console.log(r);
       if(r){
         this.setState({
           order:r.data.bizContent.records[0]
         })
       }
       this.getPic(r.data.bizContent.records[0].id, token);
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
            picGroupOrderHeavy:picGroupOrderHeavy
          })
        }else{
          this.setState({
            isArr:false
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
              empty:n.data,
              isEmp:flagHeavy?false:true,
              picGroupOrderNull:picGroupOrderNull
            })
          }
        }else{
          this.setState({
            isEmp:flagHeavy?false:true
          })
        }
      }else{
        this.setState({
          isArr:false,
          isEmp:true,
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
   * 获取一个月内的订单
   */
  getThreeMonthDay(){
    var date = new Date();
    date.setMonth(date.getMonth()-1);
    return (date.getFullYear()) + "-" +
      (date.getMonth() + 1) + "-" +
      (date.getDate());
  }

  takePhoto(){
    console.log('state',this.state);
    Taro.navigateTo({url:'/pages/index/arrive/arrive?carId='+this.state.order.carId+'' +
        '&orderId='+this.state.order.id+'&picType=2&picGroupOrder='+this.state.picGroupOrderHeavy+'' +
        '&picGroup='+this.state.picGroup});
  }

  takePhotoEmp(){
    console.log('state',this.state);
    Taro.navigateTo({url:'/pages/index/leave/leave?carId='+this.state.order.carId+'' +
        '&orderId='+this.state.order.id+'&picType=3&picGroupOrder='+this.state.picGroupOrderNull+'' +
        '&picGroup='+this.state.picGroup});
  }

  upInfo(){
    console.log('state2',this.state);
    this.state.heavy.push({
      pic0:this.state.defaultImg,
      pic1:this.state.defaultImg,
      pic2:this.state.defaultImg,
      pic3:this.state.defaultImg
    })
    this.state.empty.push({
      pic0:this.state.defaultImg,
      pic1:this.state.defaultImg,
      pic2:this.state.defaultImg,
      pic3:this.state.defaultImg
    })
    this.setState({
      heavy:this.state.heavy,
      empty:this.state.empty,
      isArr:false,
      isEmp: true,
      picGroup:this.state.picGroup+1
    })
  }

  render () {
    let{order,heavy,empty,isArr,isEmp}= this.state;
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
          <View className="zan-panel-title">到货图片</View>
          {
            heavy.map((item, index) => {
              return (
                <View className="zan-cell-img">
                  <Image className='account__img' src={item.pic0} />
                  <Image className='account__img' src={item.pic1} />
                  <Image className='account__img' src={item.pic2} />
                  <Image className='account__img' src={item.pic3} />
              </View>
              )
            })
          }
          <View className="zan-panel-title">空车图片</View>
          {
            empty.map((item, index) => {
              return (
                <View className="zan-cell-img">
                  <Image className='account__img' src={item.pic0} />
                  <Image className='account__img' src={item.pic1} />
                  <Image className='account__img' src={item.pic2} />
                  <Image className='account__img' src={item.pic3} />
                </View>
              )
            })
          }
          <View className="zan-panel-title">拍照上传</View>
          <View className="zan-cell-btn">
            <Button className='account__myButton' onClick={this.takePhoto} disabled={isArr} type='primary'>重车到货</Button>
          </View>
          <View className="zan-cell-btn">
            <Button className='account__myButton' onClick={this.takePhotoEmp} disabled={isEmp} type='primary'>空车拍照</Button>
          </View>
          <View className="zan-cell-btn">
            <Button className='account__myButton' onClick={this.upInfo}  disabled={!(isArr && isEmp)} type='primary'>多点卸载</Button>
          </View>
          <View className="zan-cell-btn">
            <button className='account__myButton' type='default'>订单完成</button>
          </View>
        </View>
      </View>

    )
  }
}
