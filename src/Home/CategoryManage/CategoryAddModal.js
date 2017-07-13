import './CategoryManage.css';
import {STYLE} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Input, Radio, Select, Cascader, Modal} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//登录表单
class CategoryAddModal_ extends React.Component {

  state = {

    firstCategoryLevelVisible: STYLE.BLOCK,

    secondCategoryLevelVisible: STYLE.NONE,
    secondCategoryLevelOfAssayVisible: STYLE.NONE,
    secondCategoryLevelOfTechVisible: STYLE.NONE,

    thirdCategoryLevelVisible: STYLE.NONE,
    thirdCategoryLevelOfAssayVisible: STYLE.NONE,
    thirdCategoryLevelOfTechVisible: STYLE.NONE,
  }

  //根据 化验/医技  and 检查分类/检查亚类/检查项目 决定输入组件的显示/消失
  changeFormByTypeAndLevel = (type, level) => {
    switch(level) {
      case '检查分类':this.setState({firstCategoryLevelVisible: STYLE.BLOCK,
                                    secondCategoryLevelVisible: STYLE.NONE,
                                    secondCategoryLevelOfAssayVisible: STYLE.NONE,
                                    secondCategoryLevelOfTechVisible: STYLE.NONE,
                                    thirdCategoryLevelVisible: STYLE.NONE,
                                    thirdCategoryLevelOfAssayVisible: STYLE.NONE,
                                    thirdCategoryLevelOfTechVisible: STYLE.NONE});break;
      case '检查亚类':this.setState({firstCategoryLevelVisible: STYLE.NONE,
                                    secondCategoryLevelVisible: STYLE.BLOCK,
                                    secondCategoryLevelOfAssayVisible: type === "化验" ? STYLE.BLOCK : STYLE.NONE,
                                    secondCategoryLevelOfTechVisible: type === "医技" ? STYLE.BLOCK : STYLE.NONE,
                                    thirdCategoryLevelVisible: STYLE.NONE,
                                    thirdCategoryLevelOfAssayVisible: STYLE.NONE,
                                    thirdCategoryLevelOfTechVisible: STYLE.NONE});break;
      case '检查项目':this.setState({firstCategoryLevelVisible: STYLE.NONE,
                                    secondCategoryLevelVisible: STYLE.NONE,
                                    secondCategoryLevelOfAssayVisible: STYLE.NONE,
                                    secondCategoryLevelOfTechVisible: STYLE.NONE,
                                    thirdCategoryLevelVisible: STYLE.BLOCK,
                                    thirdCategoryLevelOfAssayVisible: type === "化验" ? STYLE.BLOCK : STYLE.NONE,
                                    thirdCategoryLevelOfTechVisible: type === "医技" ? STYLE.BLOCK : STYLE.NONE});break;
      default:;break;
    }
  }

  handleTypeChange = (e) => {

    let type = e.target.value;
    let level = this.props.form.getFieldValue("level");
    this.changeFormByTypeAndLevel(type, level);
  }


  //层级选择变化(输入框动态显示、消失)
  handleLevelChange = (e) => {

    let type = this.props.form.getFieldValue("type");
    let level = e.target.value;
    this.changeFormByTypeAndLevel(type, level);
  }


  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 15 }}};

    //生成所属分类下拉列表、所属亚类级联选择器
    const firstCategoryOfAssayOptions = this.props.firstCategoryParentOfAssayData.map((firstCategory, index) => <Option value={firstCategory.id.toString()} key={index}>{firstCategory.name}</Option>);
    const firstCategoryOfTechOptions = this.props.firstCategoryParentOfTechData.map((firstCategory, index) => <Option value={firstCategory.id.toString()} key={index}>{firstCategory.name}</Option>);


    const { getFieldDecorator } = this.props.form;
    return (
        <Modal title="添加检查项目" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
          <Form className="add-form">
            <FormItem {...formItemLayout} label="检查类型">
              {getFieldDecorator('type', {rules: [{ required: true, message: '请选择检查类型!' }], initialValue: "化验"})(
              <Radio.Group onChange={this.handleTypeChange}>
                <Radio.Button value="化验">化验</Radio.Button>
                <Radio.Button value="医技">医技</Radio.Button>
              </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="添加层级">
              {getFieldDecorator('level', {rules: [{ required: true, message: '请选择添加层级!' }], initialValue: "检查分类"})(
              <Radio.Group onChange={this.handleLevelChange}>
                <Radio.Button value="检查分类">检查分类</Radio.Button>
                <Radio.Button value="检查亚类">检查亚类</Radio.Button>
                <Radio.Button value="检查项目">检查项目</Radio.Button>
              </Radio.Group>
              )}
            </FormItem>


            <FormItem {...formItemLayout} label="检查分类名称" style={{display: this.state.firstCategoryLevelVisible}} hasFeedback={true}>
              {getFieldDecorator('firstCategoryName', {rules: [{ required: true, message: '请输入检查分类名称!' }]})(
              <Input />
              )}
            </FormItem>


            <FormItem {...formItemLayout} label="检查亚类名称" style={{display: this.state.secondCategoryLevelVisible}} hasFeedback={true}>
              {getFieldDecorator('secondCategoryName', {rules: [{ required: true, message: '请输入检查亚类名称!' }]})(
              <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属分类" style={{display: this.state.secondCategoryLevelOfAssayVisible}} hasFeedback={true}>
              {getFieldDecorator('firstCategoryParentOfAssayId', {rules: [{ required: true, message: '请选择所属分类!' }]})(
                <Select>
                  {firstCategoryOfAssayOptions}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属分类" style={{display: this.state.secondCategoryLevelOfTechVisible}} hasFeedback={true}>
              {getFieldDecorator('firstCategoryParentOfTechId', {rules: [{ required: true, message: '请选择所属分类!' }]})(
                <Select>
                  {firstCategoryOfTechOptions}
                </Select>
              )}
            </FormItem>


            <FormItem {...formItemLayout} label="检查项目名称" style={{display: this.state.thirdCategoryLevelVisible}} hasFeedback={true}>
              {getFieldDecorator('thirdCategoryName', {rules: [{ required: true, message: '请输入检查项目名称!' }]})(
              <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属亚类" style={{display: this.state.thirdCategoryLevelOfAssayVisible}} hasFeedback={true}>
              {getFieldDecorator('secondCategoryParentOfAssayId', {rules: [{ required: true, message: '请选择所属亚类!' }]})(
                <Cascader options={this.props.secondCategoryParentOfAssayData} placeholder="" allowClear={false}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属亚类" style={{display: this.state.thirdCategoryLevelOfTechVisible}} hasFeedback={true}>
              {getFieldDecorator('secondCategoryParentOfTechId', {rules: [{ required: true, message: '请选择所属亚类!' }]})(
                <Cascader options={this.props.secondCategoryParentOfTechData} placeholder="" allowClear={false}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="英文缩写" style={{display: this.state.thirdCategoryLevelVisible}} hasFeedback={true}>
              {getFieldDecorator('abbreviation', {rules: [{ required: true, message: '请输入英文缩写!' }]})(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="系统分类" style={{display: this.state.thirdCategoryLevelVisible}} hasFeedback={true}>
              {getFieldDecorator('systemCategory', {rules: [{ required: true, message: '请输入系统分类!' }]})(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="参考值及单位" style={{display: this.state.thirdCategoryLevelVisible}} hasFeedback={true}>
              {getFieldDecorator('referenceValue', {rules: [{ required: true, message: '请输入参考值及单位!' }]})(
              <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="301医院" style={{display: this.state.thirdCategoryLevelVisible}}>
              {getFieldDecorator('hospital')(
              <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
    );
  }
}

const CategoryAddModal = Form.create()(CategoryAddModal_);
export default CategoryAddModal;
