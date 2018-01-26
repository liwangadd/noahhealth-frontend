import { SERVER, ROUTE, SESSION, RESULT } from './../../App/PublicConstant.js';
import { isAdviser, isMember } from './../../App/PublicMethod.js';
import React from 'react';
import { Form, Icon, Input, Button, message, Card } from 'antd';
import $ from 'jquery';
import { browserHistory, Link } from 'react-router';
const FormItem = Form.Item;


//登录表单
class VerticalLoginForm_ extends React.Component {

  handleLogin = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('表单值: ', values);

        //在这里用正则验证输入合法性!!
        //const authUrl = this.props.roleType === "member" ? '/api/auth/login' : '/api/auth/login';
        $.ajax({
          url: SERVER + '/api/auth/' + this.props.roleType + '/login',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ phone: values.phone, password: values.password }),
          dataType: 'json',
          success: (result) => {
            console.log(result);
            if (result.code === RESULT.SUCCESS) {

              //保存状态信息
              sessionStorage.setItem(SESSION.TOKEN, result.content.token);
              sessionStorage.setItem(SESSION.USER_ID, result.content.id);
              sessionStorage.setItem(SESSION.USERNAME, result.content.username);
              sessionStorage.setItem(SESSION.ROLE, result.content.role);
              sessionStorage.setItem(SESSION.NAME, result.content.name);
              sessionStorage.setItem(SESSION.AVATAR, result.content.avatar);
              sessionStorage.setItem(SESSION.EXPIRED_TIME, result.content.duration);

              //跳转
              if (isAdviser(result.content.role)) {
                browserHistory.push(ROUTE.MEMBER_MANAGE.URL_PREFIX + "/" + ROUTE.MEMBER_MANAGE.MENU_KEY);
              } else if (isMember(result.content.role)) {
                browserHistory.push(ROUTE.MEMBER_DETAIL.URL_PREFIX + "/" + ROUTE.MEMBER_DETAIL.MENU_KEY + "/" + result.content.id + "/" + result.content.name);
              } else {
                browserHistory.push(ROUTE.HOME.URL_PREFIX + "/" + ROUTE.HOME.MENU_KEY);
              }

              message.success(result.reason, 2);
              return;
            } else {

              this.props.handleLoading(false); //关闭进度条
              message.error(result.reason, 2);
              return;
            }
          },
          error: () => {

            this.props.handleLoading(false); //关闭进度条
            message.error("连接服务器失败", 2);
          }
        });

        //打开加载条
        this.props.handleLoading(true);
      }
    });
  }

  render() {

    const formItemLayoutWithoutLabel = { wrapperCol: { xs: { span: 24, offset: 12 }, sm: { span: 18, offset: 3 }, } };

    const { getFieldDecorator } = this.props.form;
    return (
      <Card className="index-card" bodyStyle={{ padding: 0 }} >

        <div className="index-card-welcome">
          <span>{this.props.roleType === "member" ? "会员登录" : "职员登录"}</span>
        </div>
        <Form onSubmit={this.handleLogin} className="login-form">
          <FormItem {...formItemLayoutWithoutLabel} hasFeedback={true}>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
              )}
          </FormItem>
          <FormItem {...formItemLayoutWithoutLabel} hasFeedback={true} style={{ marginBottom: 10 }}>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
              )}

            <Link to={ROUTE.FIND_PASSWORD.URL_PREFIX + "/" + this.props.roleType} className="find-password-text">忘记密码?</Link>
          </FormItem>
          <FormItem {...formItemLayoutWithoutLabel}>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
              登&nbsp;&nbsp;录
              </Button>
            {
              this.props.roleType === "member"
                ?
                <Link to={ROUTE.REGISTER.URL} style={{ float: 'right' }}>注册</Link>
                :
                null
            }
          </FormItem>
        </Form>
      </Card>
    );
  }
}
const VerticalLoginForm = Form.create()(VerticalLoginForm_);
export default VerticalLoginForm;
