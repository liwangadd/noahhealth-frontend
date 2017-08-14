import React from 'react';
import {ROLE} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class MemberSearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.handleSearchMemberList(1);
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleSearchMemberList(1);
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
        <Row gutter={20}>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('memberNum')(
                <Input placeholder="会员编号" />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('name')(
                <Input placeholder="姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('role', {
                initialValue: '全部'
              })(
                <Select>
                  <Option value="">全部</Option>
                  <Option value={ROLE.MEMBER_1}>{ROLE.MEMBER_1}</Option>
                  <Option value={ROLE.MEMBER_2}>{ROLE.MEMBER_2}</Option>
                  <Option value={ROLE.MEMBER_3}>{ROLE.MEMBER_3}</Option>
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

const MemberSearchForm = Form.create()(MemberSearchForm_);
export default MemberSearchForm;
