import './HealthResultManage.css';
import {STYLE} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Input, Radio, Cascader, Modal, DatePicker, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//添加原始资料表单
class HealthResultDetailAddModal_ extends React.Component {

  render() {

    const formItemLayoutOfType = {labelCol: { xs: { span: 24 }, sm: { span: 4 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 10 }}};
    const formItemLayoutOfContent = {labelCol: { xs: { span: 24 }, sm: { span: 4 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 19 }}};

    const { getFieldDecorator } = this.props.form;
    return (
        <Modal title="添加健康摘要" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
          <Form className="add-form">

            <FormItem {...formItemLayoutOfType} label="摘要类别" hasFeedback={true}>
              {getFieldDecorator('secondId', {rules: [{ required: true, message: '请选择摘要类别!' }], initialValue: '基本信息'})(
                // <Cascader options={this.props.healthResultSecondTypeData} placeholder="" allowClear={false}/>
                <Select>
                  <Option value="基本信息">基本信息</Option>
                  <Option value="心血管系统">心血管系统</Option>
                  <Option value="呼吸系统">呼吸系统</Option>
                  <Option value="消化系统">消化系统</Option>
                  <Option value="血液系统">血液系统</Option>
                  <Option value="内分泌系统">内分泌系统</Option>
                  <Option value="风湿免疫">风湿免疫</Option>
                  <Option value="神经系统">神经系统</Option>
                  <Option value="运动系统">运动系统</Option>
                  <Option value="神经系统">神经系统</Option>
                  <Option value="泌尿系统">泌尿系统</Option>
                  <Option value="生殖系统">生殖系统</Option>
                  <Option value="营养代谢">营养代谢</Option>
                  <Option value="肿瘤疾病">肿瘤疾病</Option>
                  <Option value="眼科疾病">眼科疾病</Option>
                  <Option value="耳鼻咽喉">耳鼻咽喉</Option>
                  <Option value="口腔颌面">口腔颌面</Option>
                  <Option value="皮肤疾病">皮肤疾病</Option>
                  <Option value="精神心理">精神心理</Option>
                  <Option value="其他">其他</Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayoutOfContent} label="摘要问题" >
              {getFieldDecorator('problemNew')(
                <Input type="textarea" rows={5} />
              )}
            </FormItem>

            <FormItem {...formItemLayoutOfContent} label="摘要内容" >
              {getFieldDecorator('contentNew')(
                <Input type="textarea" rows={10} />
              )}
            </FormItem>
          </Form>
        </Modal>
    );
  }
}

const HealthResultDetailAddModal = Form.create()(HealthResultDetailAddModal_);
export default HealthResultDetailAddModal;
