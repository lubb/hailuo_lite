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
      userName : '',
      password: '',
      ...INIT_STATE,
      sessionKey:'',
      register:require('../../../common/images/mainlogo.png'),
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    let{register}= this.state
    return (
      <View className='account__page'>
        <View className='account__bg'>
          <Image className='account__img' src={register} />
        </View>
        <View className='account__content'>
          <View className='account__tag__tel'>
            <Text className='account__text'>手机号</Text>
            <Input type='text' className='account__userName' onChange={this.userNameHandleChange.bind(this)} placeholder='请输入手机号' maxLength='11' />
          </View>
          <View className='account__tag__password'>
            <Text className='account__text'>密码</Text>
            <Input type='password' className='account__password' onChange={this.passwordHandleChange.bind(this)} placeholder='请输入密码' />
          </View>
          <View className='account__log'>
            <Button className='account__myButton' openType='getUserInfo' onGetUserInfo={this.getUserInfoCallBack.bind(this)}>登录</Button>
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
