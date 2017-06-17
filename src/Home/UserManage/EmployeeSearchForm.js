import React from 'react';
import {ROLE} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class EmployeeSearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.handleSearchEmployeeList(1);
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('name')(
                <Input placeholder="姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('phone')(
                <Input placeholder="手机"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('role', {
                initialValue: '全部'
              })(
                <Select>
                  <Option value={ROLE.EMPLOYEE_ADMIN}>{ROLE.EMPLOYEE_ADMIN}</Option>
                  <Option value={ROLE.EMPLOYEE_FINANCER}>{ROLE.EMPLOYEE_FINANCER}</Option>
                  <Option value={ROLE.EMPLOYEE_ARCHIVER}>{ROLE.EMPLOYEE_ARCHIVER}</Option>
                  <Option value={ROLE.EMPLOYEE_ARCHIVE_MANAGER}>{ROLE.EMPLOYEE_ARCHIVE_MANAGER}</Option>
                  <Option value={ROLE.EMPLOYEE_ADVISER}>{ROLE.EMPLOYEE_ADVISER}</Option>
                  <Option value={ROLE.EMPLOYEE_ADVISE_MANAGER}>{ROLE.EMPLOYEE_ADVISE_MANAGER}</Option>
                  <Option value="">全部</Option>
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
const EmployeeSearchForm = Form.create()(EmployeeSearchForm_);
export default EmployeeSearchForm;
