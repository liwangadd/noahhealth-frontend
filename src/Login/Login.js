import {LOADING_DELAY_TIME} from './../App/PublicConstant.js';
import React from 'react';
import { Layout,Carousel, Spin} from 'antd';
import VerticalLoginForm from './VerticalLoginForm';
const { Header, Content, Sider} = Layout;

class Login extends React.Component {
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

  handleLoading = (onoff) => {
    // e.preventDefault();
    this.setState({
      loading : onoff
    })
  }

  render() {

    return (

        <Spin spinning={this.state.loading} delay={LOADING_DELAY_TIME} tip='登录中'>
          <Layout style={{background:'#fff'}}>
              <Header className='header'>
                医海慈航
              </Header>
              <Layout className='content' style={{background:'#fff'}}>
                  <Content style={{ margin: '50px 0px 50px 50px',padding:'50px 0px 50px 0px', width:'70%', minHeight:600}}>
                    <Carousel autoplay>
                      <div style={{height:400}}><img src='carousel_1.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                      <div style={{height:400}}><img src='carousel_2.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                      <div style={{height:400}}><img src='carousel_3.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                      <div style={{height:400}}><img src='carousel_4.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                     </Carousel>
                  </Content>
                  <Sider style={{margin: '50px 0px',padding:'50px 50px', minWidth:'30%', minHeight:540, backgroundColor:'#fff'}}>
                    <VerticalLoginForm handleLoading={this.handleLoading}/>
                  </Sider>
              </Layout>
              <Header className='footer'>
                医海慈航 ©2017 Created by BUPT
              </Header>
          </Layout>
        </Spin>
    );
  }
}

export default Login;
