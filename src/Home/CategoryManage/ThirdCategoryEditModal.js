import React from 'react';
import { Form, Input,Modal} from 'antd';
const FormItem = Form.Item;

//用户编辑对话框的表单
class ThirdCategoryEditModal_ extends React.Component {

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="修改信息" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form>
          <FormItem {...formItemLayout} label="名称" hasFeedback={true}>
            {getFieldDecorator('name', {rules: [{ required: true, message: '请输入名称!' }]})(
            <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="英文缩写" hasFeedback={true}>
            {getFieldDecorator('enShort', {rules: [{ required: true, message: '请输入英文缩写!' }]})(
            <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="参考值及单位" hasFeedback={true}>
            {getFieldDecorator('referenceValue', {rules: [{ required: true, message: '请输入参考值及单位!' }]})(
            <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const ThirdCategoryEditModal = Form.create()(ThirdCategoryEditModal_);
export default ThirdCategoryEditModal;
