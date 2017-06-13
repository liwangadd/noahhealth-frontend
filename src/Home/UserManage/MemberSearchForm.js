import React from 'react';
import {SERVER, ROLE, SESSION, RESULT, URL, PAGE_SIZE} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Icon, Select} from 'antd';
import $ from 'jquery';
const FormItem = Form.Item;
const Option = Select.Option;

class MemberSearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('表单值', values);
      this.props.handleSearchMemeberList(1, values);
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  onValuesChange
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
                  <Option value={ROLE.MEMBER_1}>{ROLE.MEMBER_1}</Option>
                  <Option value={ROLE.MEMBER_2}>{ROLE.MEMBER_2}</Option>
                  <Option value={ROLE.MEMBER_3}>{ROLE.MEMBER_3}</Option>
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
const MemberSearchForm = Form.create({onValuesChange: (props, values) => props.changeMemberQuery(values)})(MemberSearchForm_);
export default MemberSearchForm;
