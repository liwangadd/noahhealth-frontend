import React from 'react';
import {ROLE, SESSION} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Tag, Cascader} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//用户编辑对话框的表单
class MemberAddModal_ extends React.Component {

  render() {
    //'initialValue' : [this.props.adviserAndManagerData[0].value, this.props.adviserAndManagerData[0].children[0].value]
    const role = sessionStorage.getItem(SESSION.ROLE);

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 0}, sm: { span: 12 , offset: 7},}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="添加会员" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="姓名" hasFeedback={true}>
            {getFieldDecorator('name', { rules: [{ required: true, message: '请输入姓名' }]
            })(
            <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手机" hasFeedback={true}>
              {getFieldDecorator('phone', { rules: [{ required: true, message: '请输入手机号' },{pattern: REGEX.PHONE, message:'请输入合法手机号'}],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="角色级别" hasFeedback={true}>
            {getFieldDecorator('role', { rules: [{ required: true, message: '请选择角色'}], initialValue: ROLE.MEMBER_1})(
              <Select>
                <Option value={ROLE.MEMBER_1}>{ROLE.MEMBER_1}</Option>
                <Option value={ROLE.MEMBER_2}>{ROLE.MEMBER_2}</Option>
                <Option value={ROLE.MEMBER_3}>{ROLE.MEMBER_3}</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属顾问" hasFeedback={true}>
            {getFieldDecorator('adviserAndManager',{ rules: [{ required: true, message: '请选择所属顾问'}]})(
              <Cascader options={this.props.adviserAndManagerData} placeholder="" allowClear={false}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="会员编号" hasFeedback={true}>
            {getFieldDecorator('memberNum')(
            <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayoutWithoutLabel}>
            <Tag color="orange">默认初始密码为123456</Tag>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const MemberAddModal = Form.create()(MemberAddModal_);
export default MemberAddModal;
