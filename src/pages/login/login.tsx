import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Input, Button  } from '@tarojs/components'
import { AtToast} from 'taro-ui'
import ajax from '../../common/js/ajax'
import './login.scss'

const INIT_STATE = {
  image: '',
  icon: '',
  text: '',
  status: '',
  duration: 30000,
  hasMask: false,
  isOpened: false,
}

export default class Login extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '登录'
  }

  constructor () {
    super(...arguments)
    this.state = {
      loginName : '',
      password: '',
      ...INIT_STATE,
      register:require('../../common/images/mainlogo.png'),
      telephone:require('../../common/images/img_telephone.png'),
      code:require('../../common/images/img_code.png'),
    }
  }

  componentWillMount () {
    //获取token值
    let token = Taro.getStorageSync('token');
    if(token === null || token ==='' || token === undefined){
      //表示没有登陆
    }else{
      //如果存在token 需要获取当前的用户信息 判断是否token是否过期
      ajax.postToken("/api/user/selectByUserInfo",'','application/x-www-form-urlencoded', token).then(r=>{
        console.log('userinfo:',r);
        if(r.data.bizContent == null){
          //如果过期  需要将token删除 并且重新登陆
          Taro.removeStorageSync('token');
        }else{
          //此时直接跳到首页去
          Taro.switchTab({url: '/pages/index/index'});
        }
      });
    }
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  userNameHandleChange(e){
    this.setState({loginName:e.detail.value},()=>{console.log(this.state.loginName)})
  }

  passwordHandleChange(e){
    this.setState({password:e.detail.value},()=>{console.log(this.state.password)})
  }

  submitLogin(e){
    console.log(e);
    if (this.state.loginName === null || this.state.loginName === '' || this.state.loginName === undefined) {
      return Taro.showToast({title: '请输入账号', icon: 'none', duration: 1000})
    }else if(this.state.password === null || this.state.password === '' || this.state.password === undefined){
      return Taro.showToast({title: '请输入密码', icon: 'none', duration: 1000})
    }
    this.userLogin()
  }

  userLogin(){
    let that =this;
    Taro.showLoading({
      title: '登录中',
    });
    let params = 'grant_type=user_token&loginName='+that.state.loginName+'&password='+that.state.password;
    ajax.postLogin("/oauth/token",params,'application/x-www-form-urlencoded').then(res=>{
      //此处需要做判断
      //1、判断res是否不存在账户 2、判断是否密码错误
      console.log(res);
      Taro.hideLoading();
      if(res.data.access_token!==undefined){
        Taro.setStorageSync('token', res.data.access_token);
        Taro.switchTab({url: '/pages/index/index'});
      }else{
        if(res.data.error_description==='password error'){
          Taro.showToast({title: '密码错误', icon: 'none'})
        }else{
          Taro.showToast({title: '不存在该账户', icon: 'none'})
        }
      }
    })

  }

  render () {
    let{register,telephone,code}= this.state
    return (
      <View className='account__page'>
        <View className='account__bg'>
          <Image className='account__img' src={register} />
        </View>
        <View className='account__content'>
          <View className='account__tag__tel'>
            <Image className='account__icon__tel' src={telephone} />
            <Text className='account__text'>账号</Text>
          </View>
          <View className='account__input'>
            <Input type='text' className='account__userName' onBlur={this.userNameHandleChange.bind(this)} placeholder='请输入账号'/>
          </View>
          <View className='account__tag__password'>
            <Image className='account__icon__lock' src={code} />
            <Text className='account__text'>密码</Text>
          </View>
          <View className='account__input'>
            <Input type='password' className='account__password' onBlur={this.passwordHandleChange.bind(this)} placeholder='请输入密码' />
          </View>
          <View className='account__log'>
            <Button className='account__myButton' openType='getUserInfo' onGetUserInfo={this.submitLogin.bind(this)}>登录</Button>
          </View>
        </View>

        <AtToast
          icon={this.state.icon}
          text={this.state.text}
          image={this.state.image}
          status={this.state.status}
          hasMask={this.state.hasMask}
          isOpened={this.state.isOpened}
          duration={this.state.duration}
          onClose={this.handleToastClose}
        />
      </View>
    )
  }
}
