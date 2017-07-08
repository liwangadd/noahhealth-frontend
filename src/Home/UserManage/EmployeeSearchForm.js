import React from 'react';
import {ROLE, SESSION} from './../../App/PublicConstant.js';
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

    const role = sessionStorage.getItem(SESSION.ROLE);

    //角色级别选择器
    let roleData = [];
    if(role === ROLE.EMPLOYEE_ADMIN) roleData = [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_FINANCER, ROLE.EMPLOYEE_ARCHIVE_MANAGER, ROLE.EMPLOYEE_ARCHIVER, ROLE.EMPLOYEE_ADVISE_MANAGER, ROLE.EMPLOYEE_ADVISER];
    const roleOptions = roleData.map((roleName, index) => <Option value={roleName} key={index}>{roleName}</Option>);


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
                  {roleOptions}
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
