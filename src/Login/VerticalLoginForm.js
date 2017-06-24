import './Login.css';
import {SERVER, ROUTE, SESSION, RESULT} from './../App/PublicConstant.js';
import React from 'react';
import {Form, Icon, Input, Button, message} from 'antd';
import $ from 'jquery';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;


//登录表单
class VerticalLoginForm_ extends React.Component {

  handleLogin = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('表单值: ', values);

        //在这里用正则验证输入合法性!!
        $.ajax({
            url : SERVER + '/api/auth/login',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({phone : values.phone, password : values.password}),
            dataType : 'json',
            success : (result) => {
                console.log(result);
                if(result.code === RESULT.SUCCESS) {

                    //保存状态信息
                    sessionStorage.setItem(SESSION.TOKEN, result.content.token);
                    sessionStorage.setItem(SESSION.USER_ID, result.content.id);
                    sessionStorage.setItem(SESSION.PHONE, result.content.phone);
                    sessionStorage.setItem(SESSION.ROLE, result.content.role);
                    sessionStorage.setItem(SESSION.NAME, result.content.name);
                    sessionStorage.setItem(SESSION.EXPIRED_TIME, result.content.duration);

                    //跳转
                    browserHistory.push(ROUTE.HOME.URL_PREFIX + "/" + ROUTE.HOME.MENU_KEY);
                    message.success(result.reason, 2);
                    return;
                } else {

                    this.props.handleLoading(false); //关闭进度条
                    message.error(result.reason, 2);
                    return;
                }
            },
            error : () => {

              this.props.handleLoading(false); //关闭进度条
              message.error("连接服务器失败", 2);
            }
        });

        //打开加载条
        this.props.handleLoading(true);
      }
    });
  }

  handleRegister = (e) => {
      e.preventDefault();
      browserHistory.push(ROUTE.REGISTER.URL);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleLogin} className="login-form">
        <FormItem>
            {getFieldDecorator('phone', { rules: [{ required: true, message: '请输入用户名!' }],
            })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
            )}
        </FormItem>
        <FormItem>
            {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
            })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
            )}
        </FormItem>
        <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{width:'100%'}}>
                登&nbsp;&nbsp;录
            </Button>
            <a href="" onClick={this.handleRegister} style={{float:'right'}}>注册</a>
        </FormItem>
      </Form>
    );
  }
}
const VerticalLoginForm = Form.create()(VerticalLoginForm_);
export default VerticalLoginForm;
