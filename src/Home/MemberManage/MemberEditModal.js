import React from 'react';
import { ROLE } from './../../App/PublicConstant.js';
import { SESSION } from './../../App/PublicConstant.js';
import { REGEX } from './../../App/PublicRegex.js';
import { Form, Input, Select, Modal, Cascader, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//用户编辑对话框的表单
class MemberEditModal_ extends React.Component {

  render() {

    const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 7 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 12 }, } };


    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="修改会员信息" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name')(
              sessionStorage.getItem(SESSION.ROLE) == ROLE.EMPLOYEE_ADMIN ?
                <Input />
                :
                <Input disabled />
            )}
          </FormItem>
          {
            sessionStorage.getItem(SESSION.ROLE) == ROLE.EMPLOYEE_ADMIN ?
              <FormItem {...formItemLayout} label="手机号码">
                {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入手机号' }, { pattern: REGEX.PHONE, message: '请输入合法手机号' }],
                        })(
                  <Input />
                )}
              </FormItem>
              :
              null
          }
          <FormItem {...formItemLayout} label="角色级别" hasFeedback={true}>
            {getFieldDecorator('role', { rules: [{ required: true, message: '请选择角色级别!' }] })(
              <Select>
                <Option value={ROLE.MEMBER_1}>{ROLE.MEMBER_1}</Option>
                <Option value={ROLE.MEMBER_2}>{ROLE.MEMBER_2}</Option>
                <Option value={ROLE.MEMBER_3}>{ROLE.MEMBER_3}</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属顾问" hasFeedback={true}>
            {getFieldDecorator('adviserAndManager', { rules: [{ required: true, message: '请选择所属顾问!' }] })(
              <Cascader options={this.props.adviserAndManagerData} placeholder="" allowClear={false} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="有效日期" hasFeedback={true}>
            {getFieldDecorator('validTime', { rules: [{ required: true, message: '请选择有效日期!' }] })(
              <DatePicker style={{ width: '100%' }} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
const MemberEditModal = Form.create()(MemberEditModal_);
export default MemberEditModal;
