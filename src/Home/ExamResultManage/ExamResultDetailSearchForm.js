import React from 'react';
import {ROLE, SESSION, STYLE} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select, DatePicker, Cascader} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class ExamResultDetailSearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.handleSearchOriginResultList(1);
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleSearchOriginResultList(1);
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {

    //在检查亚类尾部加上全部/全部 secondId = -1
    const allCategory = {value: '全部分类', label: '全部分类', children:[{value: -1, label: '全部亚类'}]};
    let secondCategoryParentData = this.props.secondCategoryParentData.slice(); //复制数组对象
    secondCategoryParentData.unshift(allCategory);

    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('time')(
                <RangePicker style={{width:'100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('secondId', {initialValue: ['全部分类', -1]})(
                <Cascader options={secondCategoryParentData} placeholder="" allowClear={false}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('status', { initialValue: ''
              })(
                <Select>
                  <Option value="">全部</Option>
                  <Option value="录入中">上传中</Option>
                  <Option value="待审核">待审核</Option>
                  <Option value="未通过">未通过</Option>
                  <Option value="已通过">已通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>清空</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

//当值改变时回调上层修改表单域的值
const ExamResultDetailSearchForm = Form.create()(ExamResultDetailSearchForm_);
export default ExamResultDetailSearchForm;
