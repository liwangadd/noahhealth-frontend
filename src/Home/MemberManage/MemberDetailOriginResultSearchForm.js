import React from 'react';
import {ROLE, SESSION, STYLE} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select, DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class MemberDetailOriginResultSearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.requestOriginResultOfMember(1);
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.requestOriginResultOfMember(1);
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
              {getFieldDecorator('time')(
                <RangePicker style={{width:'100%'}}/>
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
const MemberDetailOriginResultSearchForm = Form.create()(MemberDetailOriginResultSearchForm_);
export default MemberDetailOriginResultSearchForm;
