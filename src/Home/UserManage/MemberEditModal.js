import React from 'react';
import {ROLE} from './../../App/PublicConstant.js';
import { Form, Input, Select,Modal, Cascader} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//用户编辑对话框的表单
class MemberEditModal_ extends React.Component {

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};


    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="修改会员信息" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name')(
            <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="角色级别">
            {getFieldDecorator('role', { rules: [{ required: true, message: '请输入姓名!' }]
            })(
              <Select>
                <Option value={ROLE.MEMBER_1}>{ROLE.MEMBER_1}</Option>
                <Option value={ROLE.MEMBER_2}>{ROLE.MEMBER_2}</Option>
                <Option value={ROLE.MEMBER_3}>{ROLE.MEMBER_3}</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属顾问">
            {getFieldDecorator('adviserAndManager')(
              <Cascader options={this.props.adviserAndManagerData} placeholder="" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
const MemberEditModal = Form.create()(MemberEditModal_);
export default MemberEditModal;
