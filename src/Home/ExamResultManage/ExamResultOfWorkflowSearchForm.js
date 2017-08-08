import React from 'react';
import {ROLE, SESSION, STYLE} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select, DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class ExamResultOfWorkflowSearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.handleSearchExamResultOfWorkflowList(1);
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleSearchExamResultOfWorkflowList(1);
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {

    //根据当前用户的角色决定是否显示所有筛选项
    const role = sessionStorage.getItem(SESSION.ROLE);
    const uploaderFilterVisible = role === ROLE.EMPLOYEE_ARCHIVER ? STYLE.NONE : STYLE.BLOCK;
    const checkerFilterVisible = role !== ROLE.EMPLOYEE_ADMIN ? STYLE.NONE : STYLE.BLOCK;

    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSearch}
      >
        <Row gutter={20}>
          <Col span={role === ROLE.EMPLOYEE_ADMIN ? 5 : 5}>
            <FormItem>
              {getFieldDecorator('time')(
                <RangePicker style={{width:'100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={role === ROLE.EMPLOYEE_ADMIN ? 4 : 5}>
            <FormItem>
              {getFieldDecorator('memberNum')(
                <Input placeholder="会员编号" />
              )}
            </FormItem>
          </Col>
          <Col span={role === ROLE.EMPLOYEE_ADMIN ? 4 : 5}>
            <FormItem>
              {getFieldDecorator('userName')(
                <Input placeholder="会员姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={role === ROLE.EMPLOYEE_ADMIN ? 4 : 5} style={{display: uploaderFilterVisible}}>
            <FormItem>
              {getFieldDecorator('uploaderName')(
                <Input placeholder="上传者"/>
              )}
            </FormItem>
          </Col>
          <Col span={4} style={{display: checkerFilterVisible}}>
            <FormItem>
              {getFieldDecorator('checkerName')(
                <Input placeholder="审核者"/>
              )}
            </FormItem>
          </Col>
          <Col span={role === ROLE.EMPLOYEE_ADMIN ? 3 : 4}>
            <FormItem>
              {getFieldDecorator('status', { initialValue: ''
              })(
                <Select>
                  <Option value="">全部</Option>
                  <Option value="录入中">录入中</Option>
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
const ExamResultOfWorkflowSearchForm = Form.create()(ExamResultOfWorkflowSearchForm_);
export default ExamResultOfWorkflowSearchForm;
