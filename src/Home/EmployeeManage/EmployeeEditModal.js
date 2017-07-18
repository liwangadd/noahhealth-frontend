import React from 'react';
import {ROLE, SESSION} from './../../App/PublicConstant.js';
import { Form, Input, Select,Modal} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//用户编辑对话框的表单
class EmployeeEditModal_ extends React.Component {

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);


    //角色级别选择器
    let roleData = [];
    if(role === ROLE.EMPLOYEE_ADMIN)  roleData = [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_FINANCER, ROLE.EMPLOYEE_ARCHIVE_MANAGER, ROLE.EMPLOYEE_ARCHIVER, ROLE.EMPLOYEE_ADVISE_MANAGER, ROLE.EMPLOYEE_ADVISER];
    else if(role === ROLE.EMPLOYEE_ADVISE_MANAGER) {roleData = [ROLE.EMPLOYEE_ADVISER];}
    else if(role === ROLE.EMPLOYEE_ARCHIVE_MANAGER) {roleData = [ROLE.EMPLOYEE_ARCHIVER];}
    const roleOptions = roleData.map((roleName, index) => <Option value={roleName} key={index}>{roleName}</Option>);


    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};

    //生成顾问主管、档案主管的选择器
    const {archiveManagerData, adviseManagerData} = this.props;
    const archiveManagerOptions = archiveManagerData.map((manager, index) => <Option value={manager.id.toString()} key={index}>{manager.name}</Option>);
    const adviseManagerOptions = adviseManagerData.map((manager, index) => <Option value={manager.id.toString()} key={index}>{manager.name}</Option>);

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="修改职员信息" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name')(
            <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="角色级别" hasFeedback={true}>
            {getFieldDecorator('role')(
              <Select onChange={(role) => this.props.changeRole(role)}>
                {roleOptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属档案主管" style={{display: this.props.archiveManagerSelectVisible}} hasFeedback={true}>
            {getFieldDecorator('archiveManager')(
              <Select>
                {archiveManagerOptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属顾问主管" style={{display: this.props.adviseManagerSelectVisible}} hasFeedback={true}>
            {getFieldDecorator('adviseManager')(
              <Select>
                {adviseManagerOptions}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const EmployeeEditModal = Form.create()(EmployeeEditModal_);
export default EmployeeEditModal;
