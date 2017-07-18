import React from 'react';
import {ROLE, SESSION} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Tag} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//用户编辑对话框的表单
class EmployeeAddModal_ extends React.Component {

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);


    //角色级别选择器
    let roleData = [];
    if(role === ROLE.EMPLOYEE_ADMIN)  roleData = [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_FINANCER, ROLE.EMPLOYEE_ARCHIVE_MANAGER, ROLE.EMPLOYEE_ARCHIVER, ROLE.EMPLOYEE_ADVISE_MANAGER, ROLE.EMPLOYEE_ADVISER];
    else if(role === ROLE.EMPLOYEE_ADVISE_MANAGER) {roleData = [ROLE.EMPLOYEE_ADVISER];}
    else if(role === ROLE.EMPLOYEE_ARCHIVE_MANAGER) {roleData = [ROLE.EMPLOYEE_ARCHIVER];}
    const roleOptions = roleData.map((roleName, index) => <Option value={roleName} key={index}>{roleName}</Option>);


    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 0}, sm: { span: 12 , offset: 7},}};

    //生成顾问主管、档案主管的选择器
    const {archiveManagerData, adviseManagerData} = this.props;
    const archiveManagerOptions = archiveManagerData.map((manager, index) => <Option value={manager.id.toString()} key={index}>{manager.name}</Option>);
    const adviseManagerOptions = adviseManagerData.map((manager, index) => <Option value={manager.id.toString()} key={index}>{manager.name}</Option>);

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="添加职员" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
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
          <FormItem {...formItemLayout} label="角色级别">
            {getFieldDecorator('role', {initialValue: roleData[0]})(
              <Select onChange={(role) => this.props.changeRole(role)}>
                {roleOptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属档案主管" style={{display: this.props.archiveManagerSelectVisible}}>
            {getFieldDecorator('archiveManager')(
              <Select>
                {archiveManagerOptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属顾问主管" style={{display: this.props.adviseManagerSelectVisible}}>
            {getFieldDecorator('adviseManager')(
              <Select>
                {adviseManagerOptions}
              </Select>
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

const EmployeeAddModal = Form.create()(EmployeeAddModal_);
export default EmployeeAddModal;
