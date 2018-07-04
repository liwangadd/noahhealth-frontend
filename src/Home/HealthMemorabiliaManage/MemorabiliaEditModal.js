import React from 'react';
import moment from 'moment';
import { DATE_FORMAT } from './../../App/PublicConstant.js';
import { formatDate } from './../../App/PublicUtil.js';
import { Form, Input, Select, Modal, DatePicker, Cascader, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class MemorabiliaEditModal_ extends React.Component {
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
                    <FormItem {...formItemLayout} label="标题">
                        {getFieldDecorator('title', { rules: [{ required: true, message: '请输入资料名称!' }] })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="健康大事记">
                        {getFieldDecorator('content', { rules: [{ required: true, message: '请选择资料类别!' }] })(
                            <Input type="textarea" rows={10} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="上传日期" hasFeedback={true}>
                        {getFieldDecorator('time', { rules: [{ required: true, message: '请选择上传日期!' }], initialValue: moment(new Date(), DATE_FORMAT) })(
                            <DatePicker style={{ width: '100%' }} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const MemorabiliaEditModal = Form.create()(MemorabiliaEditModal_);
export default MemorabiliaEditModal;