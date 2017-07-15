import React from 'react';
import {ROLE, SESSION, STYLE} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select, DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class OriginResultSearchForm_ extends React.Component {
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

    //根据当前用户的角色决定是否显示所有筛选项
    const role = sessionStorage.getItem(SESSION.ROLE);
    const otherFilterVisible = (role === ROLE.MEMBER_1 || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3) ? STYLE.NONE : STYLE.BLOCK;
    const uploaderFilterVisible = (role === ROLE.MEMBER_1 || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3 || role === ROLE.EMPLOYEE_ARCHIVER || role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER) ? STYLE.NONE : STYLE.BLOCK;
    const checkerFilterVisible = role !== ROLE.EMPLOYEE_ADMIN ? STYLE.NONE : STYLE.BLOCK;

    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSearch}
      >
        <Row gutter={20}>
          <Col span={role === ROLE.EMPLOYEE_ADMIN ? 5 : 6}>
            <FormItem>
              {getFieldDecorator('time')(
                <RangePicker style={{width:'100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={role === ROLE.EMPLOYEE_ADMIN ? 5 : 6} style={{display: otherFilterVisible}}>
            <FormItem>
              {getFieldDecorator('userName')(
                <Input placeholder="会员姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={role === ROLE.EMPLOYEE_ADMIN ? 5 : 6} style={{display: uploaderFilterVisible}}>
            <FormItem>
              {getFieldDecorator('uploaderName')(
                <Input placeholder="上传者"/>
              )}
            </FormItem>
          </Col>
          <Col span={5} style={{display: checkerFilterVisible}}>
            <FormItem>
              {getFieldDecorator('checkerName')(
                <Input placeholder="审核者"/>
              )}
            </FormItem>
          </Col>
          <Col span={role === ROLE.EMPLOYEE_ADMIN ? 4 : 6} style={{display: otherFilterVisible}}>
            <FormItem>
              {getFieldDecorator('status', { initialValue: ''
              })(
                <Select>
                  <Option value="">全部</Option>
                  <Option value="上传中">上传中</Option>
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
const OriginResultSearchForm = Form.create()(OriginResultSearchForm_);
export default OriginResultSearchForm;
