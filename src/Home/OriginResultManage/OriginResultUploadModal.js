import './OriginResultManage.css';
import React from 'react';
import {Form, Input, Select, Modal, DatePicker, Cascader} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//添加原始资料表单
class OriginResultUploadModal_ extends React.Component {

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 }}};
    const memberNameOptions = this.props.memberUnderEmployeeData.map((member, index) => <Option value={member.id.toString()} key={index}>{member.name}</Option>);


    const { getFieldDecorator } = this.props.form;
    return (
        <Modal title="上传原始资料" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
          <Form className="add-form">

            <FormItem {...formItemLayout} label="会员姓名" hasFeedback={true}>
              {getFieldDecorator('userId', {rules: [{ required: true, message: '请输入会员姓名!' }]})(
                <Select showSearch placeholder="" optionFilterProp="children"  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  {memberNameOptions}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="资料名称">
              {getFieldDecorator('note', {rules: [{ required: true, message: '请输入资料名称!' }]})(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="资料类别">
              {getFieldDecorator('secondId', {rules: [{ required: true, message: '请选择资料类别!' }]})(
                <Cascader options={this.props.originResultSecondTypeData} placeholder="" allowClear={false}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="检查医院">
              {getFieldDecorator('hospital', {rules: [{ required: true, message: '请输入检查医院名称!' }]})(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="检查日期" hasFeedback={true}>
              {getFieldDecorator('time', {rules: [{ required: true, message: '请选择检查日期!' }]})(
                <DatePicker style={{width: '100%'}}/>
              )}
            </FormItem>
          </Form>
        </Modal>
    );
  }
}

const OriginResultUploadModal = Form.create()(OriginResultUploadModal_);
export default OriginResultUploadModal;
