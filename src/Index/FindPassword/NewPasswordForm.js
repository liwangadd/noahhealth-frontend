import {SERVER, ROUTE, SESSION, RESULT} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import React from 'react';
import {Form, Icon, Input, Button, message, Card, Steps} from 'antd';
import $ from 'jquery';
import { browserHistory, Link } from 'react-router';
const FormItem = Form.Item;



//登录表单
class ValidatePhoneForm_ extends React.Component {


  handleConfirmPassword = (rule, value, callback) => {

      let password = this.props.form.getFieldValue('newPassword');
      let confirmPassword = this.props.form.getFieldValue('confirmPassword');
      if(password !== undefined && confirmPassword !== undefined && password !== confirmPassword) {
          callback("两次密码输入不一致");
      }
      callback();
  }

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem {...formItemLayout} label="新密码" hasFeedback={true}>
            {getFieldDecorator('newPassword', {rules: [{ required: true, message: '请输入新密码' }, { validator: this.handleConfirmPassword}],
            })(
            <Input type="password"/>
            )}
        </FormItem>
        <FormItem {...formItemLayout} label="确认密码" hasFeedback={true}>
            {getFieldDecorator('confirmPassword', {rules: [{required: true, message: '请输入确认密码' }, {validator: this.handleConfirmPassword}],
            })(
            <Input type="password"/>
            )}
        </FormItem>
      </Form>
    );
  }
}
const ValidatePhoneForm = Form.create()(ValidatePhoneForm_);
export default ValidatePhoneForm;
