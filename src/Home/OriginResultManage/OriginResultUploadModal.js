import './OriginResultManage.css';
import {STYLE, SESSION, SERVER} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Input, Radio, Select, Cascader, Modal, DatePicker, message, Upload, Button, Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//登录表单
class OriginResultUploadModal_ extends React.Component {

  state = {

    secondCategoryOfAssayVisible: STYLE.BLOCK,
    secondCategoryOfTechVisible: STYLE.NONE,
  }


  handleTypeChange = (e) => {

    let type = e.target.value;
    if(type === '化验') this.setState({secondCategoryOfAssayVisible: STYLE.BLOCK, secondCategoryOfTechVisible: STYLE.NONE});
    else this.setState({secondCategoryOfAssayVisible: STYLE.NONE, secondCategoryOfTechVisible: STYLE.BLOCK});
  }

  //上传状态变化

  changeUploadStatus = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }
  }


  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 8 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 }}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 12}, sm: { span: 12 , offset: 8}}};

    const { getFieldDecorator } = this.props.form;
    return (
        <Modal title="上传原始资料" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
          <Form className="add-form">

            <FormItem {...formItemLayout} label="会员姓名">
              {getFieldDecorator('memberName', {rules: [{ required: true, message: '请输入会员姓名!' }]})(
              <Input />
              )}
            </FormItem>


            <FormItem {...formItemLayout} label="检查类型">
              {getFieldDecorator('type', {rules: [{ required: true, message: '请选择检查类型!' }], initialValue: "化验"})(
              <Radio.Group onChange={this.handleTypeChange}>
                <Radio.Button value="化验">化验</Radio.Button>
                <Radio.Button value="医技">医技</Radio.Button>
              </Radio.Group>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="检查亚类" style={{display: this.state.secondCategoryOfAssayVisible}}>
              {getFieldDecorator('secondCategoryParentOfAssayId', {rules: [{ required: true, message: '请选择检查亚类!' }]})(
                <Cascader options={this.props.secondCategoryParentOfAssayData} placeholder="" allowClear={false}/>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="检查亚类" style={{display: this.state.secondCategoryOfTechVisible}}>
              {getFieldDecorator('secondCategoryParentOfTechId', {rules: [{ required: true, message: '请选择检查亚类!' }]})(
                <Cascader options={this.props.secondCategoryParentOfTechData} placeholder="" allowClear={false}/>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="日期">
              {getFieldDecorator('time', {rules: [{ required: true, message: '请选择日期!' }]})(
                <DatePicker />
              )}
            </FormItem>

            {/* <FormItem {...formItemLayoutWithoutLabel}>
              <Upload name="file" action= {SERVER + "/api/origin/upload" } headers={{ 'TOKEN' : sessionStorage.getItem(SESSION.TOKEN)}} multiple={true} onChange={this.changeUploadStatus}>
                <Button>
                  <Icon type="upload" /> 上传扫描件
                </Button>
              </Upload>
            </FormItem> */}
          </Form>
        </Modal>
    );
  }
}

const OriginResultUploadModal = Form.create()(OriginResultUploadModal_);
export default OriginResultUploadModal;
