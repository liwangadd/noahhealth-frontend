import { SERVER, ROUTE, SESSION, RESULT } from './../../App/PublicConstant.js';
import { REGEX } from './../../App/PublicRegex.js';
import React from 'react';
import { Form, Icon, Input, Button, message, Card, Steps } from 'antd';
import $ from 'jquery';
import { browserHistory, Link } from 'react-router';
const FormItem = Form.Item;


//验证手机号表单
class ValidatePhoneForm_ extends React.Component {

  state = {
    isSendSmsBtnDisabled: false,
    sendSmsBtnStr: '发送',
    countDown: 60,//倒计时
  }

  //请求发送验证码
  handleSendSms = () => {

    this.props.form.validateFields(['phone'], (err, values) => {

      if (!err) {
        $.ajax({
          url: SERVER + '/api/auth/send_sms',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ action: '找回密码', phone: values.phone }),
          dataType: 'json',
          success: (result) => {

            if (result.code === RESULT.SUCCESS) {

              message.success(result.reason, 2);
              this.timer = setInterval(() => {
                this.setState({
                  isSendSmsBtnDisabled: true,
                  sendSmsBtnStr: '重新发送 ' + (--this.state.countDown),
                });

                if (this.state.countDown === 0) {
                  this.setState({
                    isSendSmsBtnDisabled: false,
                    sendSmsBtnStr: '重新发送',
                    countDown: 60 //倒计时
                  });

                  //停止倒计时
                  clearInterval(this.timer);
                }
              }, 1000);
            } else {
              message.error(result.reason, 2);
            }
          },
          error: () => message.error("内部错误", 2)
        });
      }
    });
  }

  //组件销毁
  componentWillUnmount = () => clearInterval(this.timer)

  render() {

    const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 7 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 12 }, } };

    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem {...formItemLayout} label="手机" hasFeedback={true}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号' }, { pattern: REGEX.PHONE, message: '请输入合法手机号' }],
          })(
            <Input />
            )}
        </FormItem>
        <FormItem {...formItemLayout} label="验证码">
          {getFieldDecorator('inputCode', { rules: [{ required: true, message: '请输入验证码' }] })(
            <Input style={{ width: '37%' }} />
          )}
          <Button disabled={this.state.isSendSmsBtnDisabled} onClick={this.handleSendSms} className="sendsms-form-button">
            <span>{this.state.sendSmsBtnStr}</span>
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const ValidatePhoneForm = Form.create()(ValidatePhoneForm_);
export default ValidatePhoneForm;
