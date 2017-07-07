import React from 'react';
import {ROLE, SESSION, STYLE} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button} from 'antd';
const FormItem = Form.Item;

class ExamResultSearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.handleSearchExamResultList(1);
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {

    //根据当前用户的角色决定是否显示所有筛选项
    const role = sessionStorage.getItem(SESSION.ROLE);
    const filtersVisible = (role === ROLE.MEMBER_1 || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3) ? STYLE.NONE : STYLE.BLOCK;

    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>
          <Col span={6} style={{display: filtersVisible}}>
            <FormItem>
              {getFieldDecorator('userName')(
                <Input placeholder="会员姓名" />
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
const ExamResultSearchForm = Form.create()(ExamResultSearchForm_);
export default ExamResultSearchForm;
