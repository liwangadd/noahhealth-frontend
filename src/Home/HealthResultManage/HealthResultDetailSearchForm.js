import React from 'react';
import {ROLE, SESSION, STYLE} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select, DatePicker, Cascader} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class HealthResultDetailSearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.requestHealthResultDetailOfMember();
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.requestHealthResultDetailOfMember();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    //在检查亚类尾部加上全部/全部 secondId = -1
    // const allType = {value: '全部分类', label: '全部分类', children:[{value: -1, label: '全部亚类'}]};
    // let healthResultSecondTypeData = this.props.healthResultSecondTypeData.slice(); //复制数组对象
    // healthResultSecondTypeData.unshift(allType);
    const healthResultTypeOptions = this.props.healthResultTypeData.map((type, index) => <Option value={type.value.toString()} key={index}>{type.label}</Option>);


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
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('secondId',{initialValue: "-1"})(
                // <Cascader options={healthResultSecondTypeData} placeholder="" allowClear={false}/>
                <Select>
                  <Option value="-1" key={-1}>全部</Option>
                  {healthResultTypeOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
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
const HealthResultDetailSearchForm = Form.create()(HealthResultDetailSearchForm_);
export default HealthResultDetailSearchForm;
