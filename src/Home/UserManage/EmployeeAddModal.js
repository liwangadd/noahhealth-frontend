import React from 'react';
import {ROLE} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//用户编辑对话框的表单
class EmployeeAddModal_ extends React.Component {

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};

    //生成顾问主管、档案主管的选择器
    const {archiveManagerData, adviseManagerData} = this.props;
    const archiveManagerOptions = archiveManagerData.map((manager, index) => <Option value={manager.id.toString()} key={index}>{manager.name}</Option>);
    const adviseManagerOptions = adviseManagerData.map((manager, index) => <Option value={manager.id.toString()} key={index}>{manager.name}</Option>);

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="添加职员" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name', { rules: [{ required: true, message: '请输入姓名' }]
            })(
            <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手机">
              {getFieldDecorator('phone', { rules: [{ required: true, message: '请输入手机号' },{pattern: REGEX.PHONE, message:'请输入合法手机号'}],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="角色级别">
            {getFieldDecorator('role', {initialValue: ROLE.EMPLOYEE_ADMIN})(
              <Select onChange={(role) => this.props.changeRole(role)}>
                <Option value={ROLE.EMPLOYEE_ADMIN}>{ROLE.EMPLOYEE_ADMIN}</Option>
                <Option value={ROLE.EMPLOYEE_FINANCER}>{ROLE.EMPLOYEE_FINANCER}</Option>
                <Option value={ROLE.EMPLOYEE_ARCHIVER}>{ROLE.EMPLOYEE_ARCHIVER}</Option>
                <Option value={ROLE.EMPLOYEE_ARCHIVE_MANAGER}>{ROLE.EMPLOYEE_ARCHIVE_MANAGER}</Option>
                <Option value={ROLE.EMPLOYEE_ADVISER}>{ROLE.EMPLOYEE_ADVISER}</Option>
                <Option value={ROLE.EMPLOYEE_ADVISE_MANAGER}>{ROLE.EMPLOYEE_ADVISE_MANAGER}</Option>
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
        </Form>
      </Modal>
    );
  }
}

const EmployeeAddModal = Form.create()(EmployeeAddModal_);
export default EmployeeAddModal;
