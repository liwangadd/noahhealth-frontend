// import './OriginResultManage.css';
// import {STYLE, SESSION, SERVER} from './../../App/PublicConstant.js';
// import React from 'react';
// import {Form, Input, Radio, Select, Cascader, Modal, DatePicker, message, Upload, Button, Icon} from 'antd';
// const FormItem = Form.Item;
// const Option = Select.Option;
//
// //添加原始资料表单
// class OriginResultUploadModal_ extends React.Component {
//
//   state = {
//
//     secondCategoryOfAssayVisible: STYLE.BLOCK,
//     secondCategoryOfTechVisible: STYLE.NONE,
//   }
//
//
//   handleTypeChange = (e) => {
//
//     let type = e.target.value;
//     if(type === '化验') this.setState({secondCategoryOfAssayVisible: STYLE.BLOCK, secondCategoryOfTechVisible: STYLE.NONE});
//     else this.setState({secondCategoryOfAssayVisible: STYLE.NONE, secondCategoryOfTechVisible: STYLE.BLOCK});
//   }
//   //
//   // //上传状态变化
//   //
//   // changeUploadStatus = (info) => {
//   //   if (info.file.status !== 'uploading') {
//   //     console.log(info.file, info.fileList);
//   //   }
//   //   if (info.file.status === 'done') {
//   //     message.success(`${info.file.name} 上传成功`);
//   //   } else if (info.file.status === 'error') {
//   //     message.error(`${info.file.name} 上传失败.`);
//   //   }
//   // }
//
//
//   render() {
//
//     const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 8 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 }}};
//     const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 12}, sm: { span: 12 , offset: 8}}};
//
//     // const records = [{id: 9, userName: '呵呵3'},{id: 13, userName: '阿堃'},{id: 17, userName: '呵呵2'},{id: 15, userName: '皮卡丘'}]
//     const memberNameOptions = this.props.memberUnderEmployeeData.map((member, index) => <Option value={member.id.toString()} key={index}>{member.name}</Option>);
//
//
//     const { getFieldDecorator } = this.props.form;
//     return (
//         <Modal title="添加原始资料" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
//           <Form className="add-form">
//
//             <FormItem {...formItemLayout} label="会员姓名">
//               {getFieldDecorator('userId', {rules: [{ required: true, message: '请输入会员姓名!' }]})(
//                 <Select showSearch placeholder="" optionFilterProp="children"  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
//                   {memberNameOptions}
//                 </Select>
//               )}
//             </FormItem>
//
//
//             <FormItem {...formItemLayout} label="检查类型">
//               {getFieldDecorator('type', {rules: [{ required: true, message: '请选择检查类型!' }], initialValue: "化验"})(
//               <Radio.Group onChange={this.handleTypeChange}>
//                 <Radio.Button value="化验">化验</Radio.Button>
//                 <Radio.Button value="医技">医技</Radio.Button>
//               </Radio.Group>
//               )}
//             </FormItem>
//
//             <FormItem {...formItemLayout} label="检查亚类" style={{display: this.state.secondCategoryOfAssayVisible}}>
//               {getFieldDecorator('secondCategoryParentOfAssayId', {rules: [{ required: true, message: '请选择检查亚类!' }]})(
//                 <Cascader options={this.props.secondCategoryParentOfAssayData} placeholder="" allowClear={false}/>
//               )}
//             </FormItem>
//
//             <FormItem {...formItemLayout} label="检查亚类" style={{display: this.state.secondCategoryOfTechVisible}}>
//               {getFieldDecorator('secondCategoryParentOfTechId', {rules: [{ required: true, message: '请选择检查亚类!' }]})(
//                 <Cascader options={this.props.secondCategoryParentOfTechData} placeholder="" allowClear={false}/>
//               )}
//             </FormItem>
//
//             <FormItem {...formItemLayout} label="日期">
//               {getFieldDecorator('time', {rules: [{ required: true, message: '请选择日期!' }]})(
//                 <DatePicker />
//               )}
//             </FormItem>
//           </Form>
//         </Modal>
//     );
//   }
// }
//
// const OriginResultUploadModal = Form.create()(OriginResultUploadModal_);
// export default OriginResultUploadModal;
