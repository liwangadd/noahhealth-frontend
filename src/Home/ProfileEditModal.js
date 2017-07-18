import './Home.css';
import React from 'react';
import {SERVER, SESSION, FILE_SERVER, RESULT} from './../App/PublicConstant.js';
import {isMember} from './../App/PublicMethod.js';
import {formatDate} from './../App/PublicUtil.js';
import {REGEX} from './../App/PublicRegex.js';
import { Form, Input,Modal, Icon, Button, Upload, message, Tabs} from 'antd';
import $ from 'jquery';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

//用户编辑对话框的表单
class ProfileEditModal_ extends React.Component {

  state = {
    isSendSmsBtnDisabled: false,
    sendSmsBtnStr: '发送',
    countDown: 60 ,//倒计时
    imageUrl: FILE_SERVER + sessionStorage.getItem(SESSION.AVATAR),

    //加载圈
    submitProfileInfoLoading: false,
    submitPasswordChangeLoading: false,
    submitPhoneChangeLoading: false
  }


  getBase64 = (img, callback) => {

    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file) => {

    const isPic = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isPic) {
      message.error('只能上传后缀为jpg、jpeg和png的图片文件!', 2);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小必须小于2MB!', 2);
    }
    return isPic && isLt2M;
  }

  //上传状态改变
  handleChange = (info) => {

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
    }
  }

  //提交基本信息
  submitProfileInfo = (e) => {

    e.preventDefault();
    this.props.form.validateFields(['name'], (err, values) => {
      if (!err) {

        console.log('修改用户'+ sessionStorage.getItem(SESSION.USER_ID) +'基本信息', values);

        this.setState({submitProfileInfoLoading: true});
        $.ajax({
            url : SERVER + '/api/user/' + sessionStorage.getItem(SESSION.USER_ID),
            type : 'PUT',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({name: values.name}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //关闭加载圈、对话框
                this.setState({submitProfileInfoLoading: false});
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ submitProfileInfoLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  //提交密码更改
  submitPasswordChange = (e) => {

    e.preventDefault();
    this.props.form.validateFields(['oldPassword', 'newPassword', 'confirmPassword'], (err, values) => {
      if (!err) {
        console.log('修改用户'+ sessionStorage.getItem(SESSION.USER_ID) +'密码', values);

        this.setState({submitPasswordChangeLoading: true});
        $.ajax({
            url : SERVER + '/api/user/password/' + sessionStorage.getItem(SESSION.USER_ID),
            type : 'PUT',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({oldPassword: values.oldPassword, newPassword: values.newPassword}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //关闭加载圈、对话框
                this.setState({submitPasswordChangeLoading: false});
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ submitPasswordChangeLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }
  //两次输入的密码匹配
  handleConfirmPassword = (rule, value, callback) => {

      let password = this.props.form.getFieldValue('newPassword');
      let confirmPassword = this.props.form.getFieldValue('confirmPassword');
      if(password !== undefined && confirmPassword !== undefined && password !== confirmPassword) {
          callback("两次密码输入不一致");
      }
      callback();
  }

  //提交手机更改
  submitPhoneChange = (e) => {

    e.preventDefault();
    this.props.form.validateFields(['phone', 'inputCode'], (err, values) => {
      if (!err) {

        console.log('修改用户'+ sessionStorage.getItem(SESSION.USER_ID) +'手机号', values);

        this.setState({submitPhoneChangeLoading: true});
        $.ajax({
            url : SERVER + '/api/user/' + sessionStorage.getItem(SESSION.USER_ID),
            type : 'PUT',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({phone: values.phone, inputCode: values.inputCode}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //关闭加载圈、对话框
                this.setState({submitPhoneChangeLoading: false});
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ submitPhoneChangeLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  //请求发送验证码
  handleSendSms = (e) => {
      e.preventDefault();

      this.props.form.validateFields(['phone'], (err, values) => {

        if (!err) {
          $.ajax({
              url : SERVER + '/api/auth/send_sms',
              type : 'POST',
              contentType: 'application/json',
              data : JSON.stringify({action: '修改手机', phone : values.phone}),
              dataType : 'json',
              success : (result) => {

                if(result.code === RESULT.SUCCESS) {

                  message.success(result.reason, 2);
                  var timer = setInterval(() => {
                      this.setState({
                          isSendSmsBtnDisabled: true,
                          sendSmsBtnStr: '重新发送 ' + (--this.state.countDown),
                      });

                      if(this.state.countDown === 0) {
                          this.setState({
                              isSendSmsBtnDisabled: false,
                              sendSmsBtnStr: '重新发送',
                              countDown: 60 //倒计时
                          });

                          //停止倒计时
                          clearInterval(timer);
                      }
                  }, 1000);
                } else {

                  message.error(result.reason, 2);
                }
              },
              error : () => message.error("内部错误", 2)
            });
          }
      });
  }

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 0}, sm: { span: 12 , offset: 7},}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="个人资料" visible={this.props.visible} onCancel={this.props.onCancel} footer={null}>

        <Tabs defaultActiveKey="1" tabPosition="left">
          <TabPane tab={<span><Icon type="user" />基本信息</span>} key="1">
            <Form onSubmit={this.submitProfileInfo}>
              <FormItem {...formItemLayout} label="头像">
                <Upload
                  className="avatar-uploader"
                  name="file"
                  showUploadList={false}
                  data = {{id: sessionStorage.getItem(SESSION.USER_ID)}}
                  headers={{'TOKEN' : sessionStorage.getItem(SESSION.TOKEN)}}
                  action= {SERVER + "/api/user/avatar" }
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
                >
                  <img src={this.state.imageUrl} className="avatar" style={{backgroundColor: 'white'}} alt=""/>
                </Upload>
              </FormItem>
              <FormItem {...formItemLayout} label="姓名" hasFeedback={true}>
                {getFieldDecorator('name', {'initialValue': sessionStorage.getItem(SESSION.NAME), rules: [{ required: true, message: '请输入姓名' }]
                })(
                <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayoutWithoutLabel}>
                <Button type="primary" htmlType="submit" loading={this.state.submitProfileInfoLoading}>保存</Button>
              </FormItem>
            </Form>
          </TabPane>

          <TabPane tab={<span><Icon type="lock" />密码更改</span>} key="2">
            <Form onSubmit={this.submitPasswordChange}>
              <FormItem {...formItemLayout} label="旧密码" hasFeedback={true}>
                  {getFieldDecorator('oldPassword', {rules: [{ required: true, message: '请输入旧密码' }],
                  })(
                  <Input type="password"/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="新密码" hasFeedback={true}>
                  {getFieldDecorator('newPassword', {rules: [{ required: true, message: '请输入新密码' }, { validator: this.handleConfirmPassword}],
                  })(
                  <Input type="password"/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="确认密码" hasFeedback={true}>
                  {getFieldDecorator('confirmPassword', {rules: [{required: true, message: '请输入确认密码' }, {validator: this.handleConfirmPassword}],
                  })(
                  <Input type="password"/>
                  )}
              </FormItem>
              <FormItem {...formItemLayoutWithoutLabel}>
                <Button type="primary" htmlType="submit" loading={this.state.submitPasswordChangeLoading}>更改</Button>
              </FormItem>
            </Form>
          </TabPane>

          <TabPane tab={<span><Icon type="phone" />手机更换</span>} key="3">
            <Form onSubmit={this.submitPhoneChange}>
              <FormItem {...formItemLayout} label="手机" hasFeedback={true}>
                  {getFieldDecorator('phone', {rules: [{ required: true, message: '请输入手机号' },{pattern: REGEX.PHONE, message:'请输入合法手机号'}],
                  })(
                  <Input />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="验证码">
                  {getFieldDecorator('inputCode', { rules: [{ required: true, message: '请输入验证码' }]})(
                  <Input style={{width:'37%'}}/>
                  )}
                  <Button disabled={this.state.isSendSmsBtnDisabled} onClick={this.handleSendSms} className="sendsms-form-button">
                      <span>{this.state.sendSmsBtnStr}</span>
                  </Button>
              </FormItem>
              <FormItem {...formItemLayoutWithoutLabel}>
                <Button type="primary" htmlType="submit" loading={this.state.submitPhoneChangeLoading}>更换</Button>
              </FormItem>
            </Form>
          </TabPane>

          {
            isMember(sessionStorage.getItem(SESSION.ROLE))
            ?
            <TabPane tab={<span><Icon type="star-o" />会员信息</span>} key="4">
              <Form >
                  <FormItem {...formItemLayout} label="有效期至">
                    <span>{formatDate(this.props.userInfo.valid)}</span>
                  </FormItem>
              </Form>
            </TabPane>
            :
            null
          }
        </Tabs>
      </Modal>
    );
  }
}

const ProfileEditModal = Form.create()(ProfileEditModal_);
export default ProfileEditModal;
