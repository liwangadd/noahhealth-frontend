import {LOADING_DELAY_TIME, ROUTE} from './../../App/PublicConstant.js';
import React from 'react';
import {Link, browserHistory} from 'react-router';
import { Layout, Spin, Affix, Menu, Button} from 'antd';
import VerticalRegisterForm from './VerticalRegisterForm.js';
import IndexHeader from './../IndexHeader.js';
const { Header, Content} = Layout;

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
          <Layout>
            <IndexHeader />
            <Content className="index-register-content">
              <VerticalRegisterForm  handleLoading={this.handleLoading}/>
            </Content>
            <Header className='footer footer-affix'>
              医海慈航 ©2017 Created by BUPT
            </Header>
          </Layout>
        </Spin>
    );
  }
}

export default Register;
