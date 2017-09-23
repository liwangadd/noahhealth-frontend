import './ExamResultManage.css';
import {STYLE, DATE_FORMAT} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import moment from 'moment';
import React from 'react';
import {Form, Input, Radio, Cascader, Modal, DatePicker, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//添加原始资料表单
class ExamResultDetailAddModal_ extends React.Component {

  state = {
    secondCategoryOfAssayVisible: STYLE.BLOCK,
    secondCategoryOfTechVisible: STYLE.NONE
  }

  handleTypeChange = (e) => {

    let type = e.target.value;
    if(type === '化验') this.setState({secondCategoryOfAssayVisible: STYLE.BLOCK, secondCategoryOfTechVisible: STYLE.NONE});
    else this.setState({secondCategoryOfAssayVisible: STYLE.NONE, secondCategoryOfTechVisible: STYLE.BLOCK});
  }

  onMemberChange = (memberId) => {

    for(let i = 0; i < this.props.memberUnderEmployeeData.length; i++) {
      if(this.props.memberUnderEmployeeData[i].id.toString() === memberId) {
        this.props.form.setFieldsValue({memberNum: this.props.memberUnderEmployeeData[i].memberNum});
        return;
      }
    }
  }


  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 }}};
    const memberNameOptions = this.props.memberUnderEmployeeData.map((member, index) => <Option value={member.id.toString()} key={index}>{member.name}</Option>);

    const { getFieldDecorator } = this.props.form;
    return (
        <Modal title="添加检查记录" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
          <Form className="add-form">

            <FormItem {...formItemLayout} label="会员姓名" hasFeedback={true}>
              {getFieldDecorator('userId', {rules: [{ required: true, message: '请输入会员姓名!' }]})(
                <Select showSearch placeholder="" onChange={this.onMemberChange} optionFilterProp="children"  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  {memberNameOptions}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="会员编号">
              {getFieldDecorator('memberNum')(
                <Input disabled/>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="资料名称">
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
              {getFieldDecorator('time', {rules: [{ required: true, message: '请选择检查日期!' }], initialValue:  moment(new Date(), DATE_FORMAT)})(
                <DatePicker style={{width: '100%'}}/>
              )}
            </FormItem>

            {/* <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('note')(
                <Input />
              )}
            </FormItem> */}
          </Form>
        </Modal>
    );
  }
}

const ExamResultDetailAddModal = Form.create()(ExamResultDetailAddModal_);
export default ExamResultDetailAddModal;
