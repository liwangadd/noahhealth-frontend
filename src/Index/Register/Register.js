import { LOADING_DELAY_TIME } from './../../App/PublicConstant.js';
import React from 'react';
import { Layout, Spin } from 'antd';
import VerticalRegisterForm from './VerticalRegisterForm.js';
import IndexHeader from './../IndexHeader.js';
import IndexFooter from './../IndexFooter.js';
const { Header, Content } = Layout;

class Register extends React.Component {
  state = {
    collapsed: false,
    mode: 'inline',
    loading: false
  };
  onCollapse = (collapsed) => {
    
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }

  handleLoading = (onoff, e) => {
    e.preventDefault();
    this.setState({
      loading: onoff
    })
  }

  render() {

    return (

      <Spin spinning={this.state.loading} delay={LOADING_DELAY_TIME} tip='注册中'>
        <Layout>
          <IndexHeader />
          <Content className="index-content">
            <VerticalRegisterForm handleLoading={this.handleLoading} />
          </Content>
          <IndexFooter />
        </Layout>
      </Spin>
    );
  }
}

export default Register;
