import {LOADING_DELAY_TIME} from './../App/PublicConstant.js';
import React from 'react';
import { Layout,Carousel, Spin} from 'antd';
import VerticalRegisterForm from './VerticalRegisterForm';
const { Header, Content, Sider} = Layout;

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

  handleLoading = (onoff, e) => {
    e.preventDefault();
    this.setState({
      loading : onoff
    })
  }

  render() {

    return (
        <Spin spinning={this.state.loading} delay={LOADING_DELAY_TIME} tip='注册中'>
          <Layout style={{background:'#fff'}}>
              <Header className='header'>
                医海慈航
              </Header>
              <Layout className='content' style={{background:'#fff'}}>
                  <Content style={{ margin: '50px 0px 50px 50px',padding:'50px 0px 50px 0px', width:'70%', minHeight:720}}>
                    <Carousel autoplay>
                        <div style={{height:400}}><img src='/LoginRegister/carousel_1.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                        <div style={{height:400}}><img src='/LoginRegister/carousel_2.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                        <div style={{height:400}}><img src='/LoginRegister/carousel_3.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                        <div style={{height:400}}><img src='/LoginRegister/carousel_4.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                     </Carousel>
                  </Content>
                  <Sider style={{margin: '50px 0px',padding:'50px 50px', minWidth:'30%', minHeight:540, backgroundColor:'#fff'}}>
                      <VerticalRegisterForm  handleLoading={this.handleLoading}/>
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

export default Register;
