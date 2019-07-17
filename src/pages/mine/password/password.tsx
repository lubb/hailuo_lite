import Taro, { Component, Config } from '@tarojs/taro'
import {Button, Input, View} from '@tarojs/components'
import { AtInput, AtIcon, AtButton} from 'taro-ui'
import './password.scss'

export default class Password extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '修改密码'
  }

  constructor () {
    super(...arguments)
    this.state = {
      password:'',
      password2:'',
    }
  }

  componentWillMount () {
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleChange1(value){
    this.setState({
      password:value
    })
    return value;
  }

  handleChange2(value){
    this.setState({
      password2:value
    })
    return value;
  }

  updatePassword(){
    console.log(this.state);
    if(this.state.password === ''){
      Taro.showToast({title: '新密码不能为空', icon: 'none'})
      return
    }
    if(this.state.password2 === ''){
      Taro.showToast({title: '确认密码不能为空', icon: 'none'})
      return
    }
    if(this.state.password === this.state.password2){

    }else{
      Taro.showToast({title: '新密码和确认密码不同', icon: 'none'})
      return
    }
  }

  render () {
    return (
      <View className="container">
        <AtInput
          name='password'
          title='新密码'
          type='text'
          placeholder='请输入新密码'
          onChange={this.handleChange1.bind(this)}
        />
        <AtInput
          name='password2'
          title='确认密码'
          type='text'
          placeholder='请输入确认密码'
          onChange={this.handleChange2.bind(this)}
        />
        <Button className='account__myButton' type='primary' onClick={this.updatePassword.bind(this)}>确认修改</Button>
      </View>
    )
  }
}
