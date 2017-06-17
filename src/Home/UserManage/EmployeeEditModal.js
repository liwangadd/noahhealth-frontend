import React from 'react';
import {ROLE} from './../../App/PublicConstant.js';
import { Form, Input, Select,Modal} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//用户编辑对话框的表单
class EmployeeEditModal_ extends React.Component {

  state = {
    archiveManagerSelectVisible: false,
    adviseManagerSelectVisible: false
  };

  //更换角色
  changeRole = (value) => {

    //根据 角色级别 决定是否显示 主管选择器
    switch(value) {
      case ROLE.EMPLOYEE_ARCHIVER:this.setState({archiveManagerSelectVisible : true});break;
      case ROLE.EMPLOYEE_ADVISER:this.setState({adviseManagerSelectVisible : true});break;
      default:this.setState({archiveManagerSelectVisible : false, adviseManagerSelectVisible : false});break;
    }
  }



  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};

    //生成顾问主管、档案主管的选择器
    const archiveManagerOptions = this.props.archiveManagerData.map((manager, index) => <Option value={manager.id} key={index}>{manager.name}</Option>);
    const adviseManagerOptions = this.props.adviseManagerData.map((manager, index) => <Option value={manager.id} key={index}>{manager.name}</Option>);


    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="修改职员信息" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name')(
            <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="角色级别">
            {getFieldDecorator('role', { rules: [{ required: true, message: '请输入姓名!' }]
            })(
              <Select onChange={this.changeRole}>
                <Option value={ROLE.EMPLOYEE_ADMIN}>{ROLE.EMPLOYEE_ADMIN}</Option>
                <Option value={ROLE.EMPLOYEE_FINANCER}>{ROLE.EMPLOYEE_FINANCER}</Option>
                <Option value={ROLE.EMPLOYEE_ARCHIVER}>{ROLE.EMPLOYEE_ARCHIVER}</Option>
                <Option value={ROLE.EMPLOYEE_ARCHIVE_MANAGER}>{ROLE.EMPLOYEE_ARCHIVE_MANAGER}</Option>
                <Option value={ROLE.EMPLOYEE_ADVISER}>{ROLE.EMPLOYEE_ADVISER}</Option>
                <Option value={ROLE.EMPLOYEE_ADVISE_MANAGER}>{ROLE.EMPLOYEE_ADVISE_MANAGER}</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属档案主管" style={{display: this.state.archiveManagerSelectVisible}}>
            {getFieldDecorator('archiveManager')(
              <Select>
                {archiveManagerOptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属顾问主管" style={{display: this.state.adviseManagerSelectVisible}}>
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
