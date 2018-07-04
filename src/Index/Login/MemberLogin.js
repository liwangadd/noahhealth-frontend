import { LOADING_DELAY_TIME } from './../../App/PublicConstant.js';
import React from 'react';
import { Layout, Spin } from 'antd';
import VerticalLoginForm from './VerticalLoginForm.js';
import IndexHeader from './../IndexHeader.js';
import IndexFooter from './../IndexFooter.js';
const { Header, Content } = Layout;

class MemberLogin extends React.Component {
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

  handleLoading = (onoff) => this.setState({ loading: onoff })

  render() {

    return (

      <Spin spinning={this.state.loading} delay={LOADING_DELAY_TIME} tip='登录中'>
        <Layout>
          <IndexHeader />
          <Content className="index-content">
            <VerticalLoginForm handleLoading={this.handleLoading} roleType="member" />
          </Content>
          <IndexFooter />
        </Layout>
      </Spin>
    );
  }
}

export default MemberLogin;
