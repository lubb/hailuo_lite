import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Input, Button  } from '@tarojs/components'
import { AtToast} from 'taro-ui'
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

  componentWillMount () { }

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

  submitLogin(){
    if (this.state.loginName === null || this.state.loginName === '' || this.state.loginName === undefined) {
      return Taro.showToast({title: '请输入账号', icon: 'none', duration: 1000})
    }else if(this.state.password === null || this.state.password === '' || this.state.password === undefined){
      return Taro.showToast({title: '请输入密码', icon: 'none', duration: 1000})
    }
    this.userLogin()
  }

  userLogin(){
    Taro.switchTab({url: '/pages/index/index'});
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
            <Input type='text' className='account__userName' onChange={this.userNameHandleChange.bind(this)} placeholder='请输入账号'/>
          </View>
          <View className='account__tag__password'>
            <Image className='account__icon__lock' src={code} />
            <Text className='account__text'>密码</Text>
          </View>
          <View className='account__input'>
            <Input type='password' className='account__password' onChange={this.passwordHandleChange.bind(this)} placeholder='请输入密码' />
          </View>
          <View className='account__log'>
            <Button className='account__myButton' onClick={this.submitLogin.bind(this)}>登录</Button>
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
