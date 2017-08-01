import './HealthResultManage.css';
import {STYLE} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Input, Radio, Cascader, Modal, DatePicker} from 'antd';
const FormItem = Form.Item;

//添加原始资料表单
class HealthResultDetailAddModal_ extends React.Component {

  state = {
    secondCategoryOfAssayVisible: STYLE.BLOCK,
    secondCategoryOfTechVisible: STYLE.NONE
  }

  handleTypeChange = (e) => {

    let type = e.target.value;
    if(type === '化验') this.setState({secondCategoryOfAssayVisible: STYLE.BLOCK, secondCategoryOfTechVisible: STYLE.NONE});
    else this.setState({secondCategoryOfAssayVisible: STYLE.NONE, secondCategoryOfTechVisible: STYLE.BLOCK});
  }


  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 }}};

    const { getFieldDecorator } = this.props.form;
    return (
        <Modal title="添加检查记录" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
          <Form className="add-form">

            <FormItem {...formItemLayout} label="检查类型">
              {getFieldDecorator('type', {rules: [{ required: true, message: '请选择检查类型!' }], initialValue: "化验"})(
              <Radio.Group onChange={this.handleTypeChange}>
                <Radio.Button value="化验">化验</Radio.Button>
                <Radio.Button value="医技">医技</Radio.Button>
              </Radio.Group>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="检查亚类" style={{display: this.state.secondCategoryOfAssayVisible}} hasFeedback={true}>
              {getFieldDecorator('secondCategoryParentOfAssayId', {rules: [{ required: true, message: '请选择检查亚类!' }]})(
                <Cascader options={this.props.secondCategoryParentOfAssayData} placeholder="" allowClear={false}/>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="检查亚类" style={{display: this.state.secondCategoryOfTechVisible}} hasFeedback={true}>
              {getFieldDecorator('secondCategoryParentOfTechId', {rules: [{ required: true, message: '请选择检查亚类!' }]})(
                <Cascader options={this.props.secondCategoryParentOfTechData} placeholder="" allowClear={false}/>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="检查医院" hasFeedback={true}>
              {getFieldDecorator('hospital', {rules: [{ required: true, message: '请输入检查医院!' }], initialValue: "301医院"})(
                <Input />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="检查日期" hasFeedback={true}>
              {getFieldDecorator('time', {rules: [{ required: true, message: '请选择检查日期!' }]})(
                <DatePicker style={{width: '100%'}}/>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('note')(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
    );
  }
}

const HealthResultDetailAddModal = Form.create()(HealthResultDetailAddModal_);
export default HealthResultDetailAddModal;
