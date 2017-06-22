import './CategoryManage.css';
import {SERVER, ROUTE, SESSION, RESULT,ROLE, STYLE} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Icon, Input, Button, message, Radio, Select, Cascader} from 'antd';
import $ from 'jquery';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;

//登录表单
class CategoryAddForm_ extends React.Component {

  state = {

    //选择器数据
    firstCategoryParentOfAssayData: [],
    secondCategoryParentOfAssayData: [],
    firstCategoryParentOfTechData: [],
    secondCategoryParentOfTechData: [],

    firstCategoryLevelVisible: STYLE.BLOCK,

    secondCategoryLevelVisible: STYLE.NONE,
    secondCategoryLevelOfAssayVisible: STYLE.NONE,
    secondCategoryLevelOfTechVisible: STYLE.NONE,

    thirdCategoryLevelVisible: STYLE.NONE,
    thirdCategoryLevelOfAssayVisible: STYLE.NONE,
    thirdCategoryLevelOfTechVisible: STYLE.NONE
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

  //拉取系统中所有检查分类、所有亚类 并设置初始值
  componentDidMount = () => {

    let firstCategoryParentOfAssayData = this.requestFirstCategoryParentData("化验");
    let secondCategoryParentOfAssayData = this.requestSecondCategoryParentData("化验");
    let firstCategoryParentOfTechData = this.requestFirstCategoryParentData("医技");
    let secondCategoryParentOfTechData = this.requestSecondCategoryParentData("医技");

    this.setState({
      firstCategoryParentOfAssayData: firstCategoryParentOfAssayData,
      secondCategoryParentOfAssayData: secondCategoryParentOfAssayData,
      firstCategoryParentOfTechData: firstCategoryParentOfTechData,
      secondCategoryParentOfTechData: secondCategoryParentOfTechData
    });

    //默认选中第一项
    this.props.form.setFieldsValue({
      firstCategoryParentOfAssayId: firstCategoryParentOfAssayData.length > 0 ? firstCategoryParentOfAssayData[0].id.toString() : '',
      firstCategoryParentOfTechId: firstCategoryParentOfTechData.length > 0 ? firstCategoryParentOfTechData[0].id.toString() : '',
      secondCategoryParentOfAssayId: secondCategoryParentOfAssayData.length > 0 ? [secondCategoryParentOfAssayData[0].value, secondCategoryParentOfAssayData[0].children[0].value] : [],
      secondCategoryParentOfTechId: secondCategoryParentOfTechData.length > 0 ? [secondCategoryParentOfTechData[0].value, secondCategoryParentOfTechData[0].children[0].value] : []
    });
  }

  //拉取系统中所有检查分类
  requestFirstCategoryParentData = (type) => {

    let data = [];
    console.log('查询所有'+ type +'检查分类');
    $.ajax({
        url : SERVER + '/api/first/' + type + '/list',
        type : 'GET',
        dataType : 'json',
        async: false,
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {
                data = result.content;
            } else {
                message.error(result.reason, 2);
            }
        }
    });

    return data;
  }

  //拉取系统中所有检查亚类
  requestSecondCategoryParentData = (type) => {

    let data = [];
    console.log('查询所有'+ type +'检查亚类');
    $.ajax({
        url : SERVER + '/api/first/level',
        type : 'POST',
        contentType: 'application/json',
        dataType : 'json',
        async: false,
        data : JSON.stringify({type : type}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {
                data = result.content;


                //将后端返回的map整理成级联列表识别的数据结构
                let secondCategoryParentData = [];
                for(let firstCategory in result.content) {

                  //加入大类
                  let firstCategoryData = {value: firstCategory, label: firstCategory, children:[]};

                  //获取旗下所有亚类
                  let secondCategories = result.content[firstCategory];
                  for(let i = 0; i < secondCategories.length; i++) {
                    firstCategoryData.children.push({value: secondCategories[i].id, label: secondCategories[i].name});
                  }

                  secondCategoryParentData.push(firstCategoryData);
                }

                data = secondCategoryParentData;
            } else {
                message.error(result.reason, 2);
            }
        }
    });

    return data;
  }

  //添加
  handleAddCategory = (e) => {

    e.preventDefault();

    let level = this.props.form.getFieldValue('level');
    switch(level){
      case '检查分类':this.requestFirstCategory();break;
      case '检查亚类':this.requestSecondCategory();break;
      case '检查项目':this.requestThirdCategory();break;
      default:;break;
    }
  }

  //添加检查分类
  requestFirstCategory = () => {

    this.props.form.validateFields(['type', 'firstCategoryName'], (err, values) => {
      if (!err) {
        console.log('添加'+ values.type + '检查分类' + values.firstCategoryName);
        $.ajax({
            url : SERVER + '/api/first',
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({type : values.type, name: values.firstCategoryName}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code === RESULT.SUCCESS) {

                  this.props.refreshFirstCategoryData(values.type);
                  message.success(result.reason, 2);
                } else {

                  message.error(result.reason, 2);
                }
            }
        });
      }
    });
  }

  //添加检查亚类
  requestSecondCategory = () => {

    this.props.form.validateFields(['type', 'firstCategoryParentOfAssayId', 'firstCategoryParentOfTechId', 'secondCategoryName'], (err, values) => {
      if (!err) {
        console.log('添加'+ values.type + '检查亚类' + values.secondCategoryName);

        let firstId = values.type === '化验' ? Number(values.firstCategoryParentOfAssayId) : Number(values.firstCategoryParentOfTechId);
        $.ajax({
            url : SERVER + '/api/second',
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({firstId : firstId, name: values.secondCategoryName}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code === RESULT.SUCCESS) {

                  message.success(result.reason, 2);
                } else {
                    message.error(result.reason, 2);
                }
            }
        });
      }
    });
  }

  //添加检查项目
  requestThirdCategory = () => {

    this.props.form.validateFields(['type', 'secondCategoryParentOfAssayId', 'secondCategoryParentOfTechId', 'thirdCategoryName', 'systemCategory', 'referenceValue', 'hospital'], (err, values) => {
      if (!err) {
        console.log('添加'+ values.type + '检查项目' + values.thirdCategoryName);

        let secondId = values.type === '化验' ? values.secondCategoryParentOfAssayId[1] : values.secondCategoryParentOfTechId[1];
        $.ajax({
            url : SERVER + '/api/third',
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({secondId : secondId, name: values.thirdCategoryName, systemCategory: values.systemCategory, referenceValue: values.referenceValue, hospital: values.hospital}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code === RESULT.SUCCESS) {

                  message.success(result.reason, 2);
                } else {
                    message.error(result.reason, 2);
                }
            }
        });
      }
    });
  }


  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 9 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 6 }}};
    const formItemLayoutWithOutLabel = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 20, offset: 9 }}};

    //生成所属分类下拉列表、所属亚类级联选择器
    const firstCategoryOfAssayOptions = this.state.firstCategoryParentOfAssayData.map((firstCategory, index) => <Option value={firstCategory.id.toString()} key={index}>{firstCategory.name}</Option>);
    const firstCategoryOfTechOptions = this.state.firstCategoryParentOfTechData.map((firstCategory, index) => <Option value={firstCategory.id.toString()} key={index}>{firstCategory.name}</Option>);


    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleAddCategory} className="add-form">
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


        <FormItem {...formItemLayout} label="检查分类名称" style={{display: this.state.firstCategoryLevelVisible}}>
          {getFieldDecorator('firstCategoryName', {rules: [{ required: true, message: '请输入检查分类名称!' }]})(
          <Input />
          )}
        </FormItem>


        <FormItem {...formItemLayout} label="检查亚类名称" style={{display: this.state.secondCategoryLevelVisible}}>
          {getFieldDecorator('secondCategoryName', {rules: [{ required: true, message: '请输入检查亚类名称!' }]})(
          <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所属分类" style={{display: this.state.secondCategoryLevelOfAssayVisible}}>
          {getFieldDecorator('firstCategoryParentOfAssayId', {rules: [{ required: true, message: '请选择所属分类!' }]})(
            <Select>
              {firstCategoryOfAssayOptions}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所属分类" style={{display: this.state.secondCategoryLevelOfTechVisible}}>
          {getFieldDecorator('firstCategoryParentOfTechId', {rules: [{ required: true, message: '请选择所属分类!' }]})(
            <Select>
              {firstCategoryOfTechOptions}
            </Select>
          )}
        </FormItem>


        <FormItem {...formItemLayout} label="检查项目名称" style={{display: this.state.thirdCategoryLevelVisible}}>
          {getFieldDecorator('thirdCategoryName', {rules: [{ required: true, message: '请输入检查项目名称!' }]})(
          <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所属亚类" style={{display: this.state.thirdCategoryLevelOfAssayVisible}}>
          {getFieldDecorator('secondCategoryParentOfAssayId', {rules: [{ required: true, message: '请选择所属亚类!' }]})(
            <Cascader options={this.state.secondCategoryParentOfAssayData} placeholder="" allowClear={false}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所属亚类" style={{display: this.state.thirdCategoryLevelOfTechVisible}}>
          {getFieldDecorator('secondCategoryParentOfTechId', {rules: [{ required: true, message: '请选择所属亚类!' }]})(
            <Cascader options={this.state.secondCategoryParentOfTechData} placeholder="" allowClear={false}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="系统分类" style={{display: this.state.thirdCategoryLevelVisible}}>
          {getFieldDecorator('systemCategory', {rules: [{ required: true, message: '请输入系统分类!' }]})(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="参考值及单位" style={{display: this.state.thirdCategoryLevelVisible}}>
          {getFieldDecorator('referenceValue', {rules: [{ required: true, message: '请输入参考值及单位!' }]})(
          <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="301医院" style={{display: this.state.thirdCategoryLevelVisible}}>
          {getFieldDecorator('hospital')(
          <Input />
          )}
        </FormItem>

        <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">
                添加
            </Button>
        </FormItem>
      </Form>
    );
  }
}

const CategoryAddForm = Form.create()(CategoryAddForm_);
export default CategoryAddForm;
