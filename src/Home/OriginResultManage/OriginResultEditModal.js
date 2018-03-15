import './OriginResultManage.css';
import React from 'react';
import moment from 'moment';
import { DATE_FORMAT } from './../../App/PublicConstant.js';
import { formatDate } from './../../App/PublicUtil.js';
import { Form, Input, Select, Modal, DatePicker, Cascader, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class OriginResultEditModal_ extends React.Component {
    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 7 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 12 } } };
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal title="修改原始资料" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
                <Form className='add-form'>
                    <FormItem {...formItemLayout} label="会员姓名">
                        {getFieldDecorator('userName')(
                            <Input disabled />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="会员编号">
                        {getFieldDecorator('memberNum')(
                            <Input disabled />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="资料名称">
                        {getFieldDecorator('note', { rules: [{ required: true, message: '请输入资料名称!' }] })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="是否异常">
                        {getFieldDecorator('normal', { rules: [{ required: true, message: '请选择是否异常' }] })(
                            <Radio.Group>
                                <Radio.Button value="正常">正常</Radio.Button>
                                <Radio.Button value="异常">异常</Radio.Button>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="检查医院">
                        {getFieldDecorator('hospital', { rules: [{ required: true, message: '请输入检查医院名称！' }] })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="检查日期" hasFeedback={true}>
                        {getFieldDecorator('time', { rules: [{ required: true, message: '请选择检查日期!' }], initialValue: moment(new Date(), DATE_FORMAT) })(
                            <DatePicker style={{ width: '100%' }} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const OriginResultEditModal = Form.create()(OriginResultEditModal_);
export default OriginResultEditModal;