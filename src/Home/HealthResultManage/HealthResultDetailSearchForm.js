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
    const allType = {value: '全部分类', label: '全部分类', children:[{value: -1, label: '全部亚类'}]};
    let healthResultSecondTypeData = this.props.healthResultSecondTypeData.slice(); //复制数组对象
    healthResultSecondTypeData.unshift(allType);

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
              {getFieldDecorator('secondId', {initialValue: '基本信息'})(
                // <Cascader options={healthResultSecondTypeData} placeholder="" allowClear={false}/>
                <Select>
                  <Option value="基本信息">基本信息</Option>
                  <Option value="心血管系统">心血管系统</Option>
                  <Option value="呼吸系统">呼吸系统</Option>
                  <Option value="消化系统">消化系统</Option>
                  <Option value="血液系统">血液系统</Option>
                  <Option value="内分泌系统">内分泌系统</Option>
                  <Option value="风湿免疫">风湿免疫</Option>
                  <Option value="神经系统">神经系统</Option>
                  <Option value="运动系统">运动系统</Option>
                  <Option value="神经系统">神经系统</Option>
                  <Option value="泌尿系统">泌尿系统</Option>
                  <Option value="生殖系统">生殖系统</Option>
                  <Option value="营养代谢">营养代谢</Option>
                  <Option value="肿瘤疾病">肿瘤疾病</Option>
                  <Option value="眼科疾病">眼科疾病</Option>
                  <Option value="耳鼻咽喉">耳鼻咽喉</Option>
                  <Option value="口腔颌面">口腔颌面</Option>
                  <Option value="皮肤疾病">皮肤疾病</Option>
                  <Option value="精神心理">精神心理</Option>
                  <Option value="其他">其他</Option>
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
