import './Login.css';
import {SERVER} from './../App/PublicConstant.js';
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
                if(result.code === "SUCCESS") {

                    //保存状态信息
                    sessionStorage.setItem("token", result.content.token);
                    sessionStorage.setItem("phone", result.content.phone);
                    sessionStorage.setItem("role", result.content.role);
                    sessionStorage.setItem("expiredTime", result.content.duration);

                    message.success(result.reason, 2);
                    browserHistory.push('/user_home');
                    return;
                } else {

                    this.props.handleLoading(false); //关闭进度条
                    message.error(result.reason, 2);
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
      browserHistory.push('/register');
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
