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

    const formItemLayoutOfType = {labelCol: { xs: { span: 24 }, sm: { span: 4 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 10 }}};
    const formItemLayoutOfContent = {labelCol: { xs: { span: 24 }, sm: { span: 4 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 19 }}};

    const { getFieldDecorator } = this.props.form;
    return (
        <Modal title="添加健康摘要" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
          <Form className="add-form">

            <FormItem {...formItemLayoutOfType} label="摘要类别" style={{display: this.state.secondCategoryOfAssayVisible}} hasFeedback={true}>
              {getFieldDecorator('secondId', {rules: [{ required: true, message: '请选择摘要类别!' }]})(
                <Cascader options={this.props.healthResultSecondTypeData} placeholder="" allowClear={false}/>
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
