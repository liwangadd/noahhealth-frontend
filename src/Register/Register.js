import './../App/public.css';
import {SERVER, REGEX, LOADING_DELAY_TIME} from './../App/public.js';
import React from 'react';
import { Layout,Carousel,Form, Icon, Input, Button, Checkbox, message, Spin} from 'antd';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import VerticalRegisterForm from './VerticalRegisterForm';
const { Header, Content, Sider, Footer} = Layout;
const FormItem = Form.Item;

class Register extends React.Component {
  state = {
    collapsed: false,
    mode: 'inline',
    loading: false
  };
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleLoading = (onoff, e) => {
    e.preventDefault();
    this.setState({
      loading : onoff
    })
  }

  render() {

    return (
        <Spin spinning={this.state.loading} delay={LOADING_DELAY_TIME} tip='注册中'>
          <Layout>
              <Header style={{ color: 'white', fontSize:'20px'}}>
                医海慈航
              </Header>
              <Layout style={{backgroundColor:'#fff'}}>
                  <Content style={{ margin: '50px 0px 50px 50px',padding:'50px 0px 50px 0px', width:'70%', minHeight:600}}>
                    <Carousel autoplay>
                        <div style={{height:400}}><img src='1.jpg' style={{width:'100%', height:'100%'}}/></div>
                        <div style={{height:400}}><img src='2.jpg' style={{width:'100%', height:'100%'}}/></div>
                        <div style={{height:400}}><img src='3.jpg' style={{width:'100%', height:'100%'}}/></div>
                     </Carousel>
                  </Content>
                  <Sider style={{margin: '50px 0px',padding:'50px 50px', minWidth:'30%', minHeight:540, backgroundColor:'#fff'}}>
                      <VerticalRegisterForm  handleLoading={this.handleLoading}/>
                  </Sider>
              </Layout>
              <Header style={{ textAlign: 'center', color: 'white'}}>
                医海慈航 ©2017 Created by BUPT
              </Header>
          </Layout>
        </Spin>
    );
  }
}

export default Register;
