import './CategoryManage.css';
import {SERVER, ROUTE, SESSION, RESULT,ROLE} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Icon, Input, Button, message, Radio, Select, Cascader} from 'antd';
import $ from 'jquery';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;

//登录表单
class CategoryAddForm_ extends React.Component {

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 9 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 6 }}};
    const formItemLayoutWithOutLabel = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 20, offset: 9 }}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleLogin} className="add-form">
        <FormItem {...formItemLayout} label="检查类型">
          {getFieldDecorator('type', {rules: [{ required: true, message: '请选择检查类型!' }], initialValue: "化验"})(
          <Radio.Group onChange={this.handleFormLayoutChange}>
            <Radio.Button value="化验">化验</Radio.Button>
            <Radio.Button value="医技">医技</Radio.Button>
          </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="添加层级">
          {getFieldDecorator('level', {rules: [{ required: true, message: '请选择添加层级!' }], initialValue: "检查分类"})(
          <Radio.Group onChange={this.handleFormLayoutChange}>
            <Radio.Button value="检查分类">检查分类</Radio.Button>
            <Radio.Button value="检查亚类">检查亚类</Radio.Button>
            <Radio.Button value="检查项目">检查项目</Radio.Button>
          </Radio.Group>
          )}
        </FormItem>


        <FormItem {...formItemLayout} label="检查分类名称">
          {getFieldDecorator('firstCategoryName', {rules: [{ required: true, message: '请输入检查分类名称!' }]})(
          <Input />
          )}
        </FormItem>


        <FormItem {...formItemLayout} label="检查亚类名称">
          {getFieldDecorator('secondCategoryName', {rules: [{ required: true, message: '请输入检查亚类名称!' }]})(
          <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所属分类">
          {getFieldDecorator('firstCategoryParentId', {rules: [{ required: true, message: '请选择所属分类!' }]})(
            <Select>
              <Option value={ROLE.EMPLOYEE_ADMIN}>{ROLE.EMPLOYEE_ADMIN}</Option>
              <Option value={ROLE.EMPLOYEE_FINANCER}>{ROLE.EMPLOYEE_FINANCER}</Option>
              <Option value={ROLE.EMPLOYEE_ARCHIVER}>{ROLE.EMPLOYEE_ARCHIVER}</Option>
            </Select>
          )}
        </FormItem>


        <FormItem {...formItemLayout} label="检查项目名称">
          {getFieldDecorator('thirdCategoryName', {rules: [{ required: true, message: '请输入检查项目名称!' }]})(
          <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所属亚类">
          {getFieldDecorator('secondCategoryParentId', {rules: [{ required: true, message: '请选择所属亚类!' }]})(
            <Cascader options={[]} placeholder="" allowClear={false}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="系统分类">
          {getFieldDecorator('systemCategory', {rules: [{ required: true, message: '请选择系统分类!' }]})(
            <Select>
              <Option value={ROLE.EMPLOYEE_ADMIN}>{ROLE.EMPLOYEE_ADMIN}</Option>
              <Option value={ROLE.EMPLOYEE_FINANCER}>{ROLE.EMPLOYEE_FINANCER}</Option>
              <Option value={ROLE.EMPLOYEE_ARCHIVER}>{ROLE.EMPLOYEE_ARCHIVER}</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="参考值及单位">
          {getFieldDecorator('referenceValue', {rules: [{ required: true, message: '请输入参考值及单位!' }]})(
          <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="301医院">
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
