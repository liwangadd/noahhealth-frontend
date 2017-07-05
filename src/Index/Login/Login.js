import {LOADING_DELAY_TIME, ROUTE} from './../../App/PublicConstant.js';
import React from 'react';
import { Layout, Spin, Menu, Button, Affix} from 'antd';
import {Link, browserHistory} from 'react-router';
import VerticalLoginForm from './VerticalLoginForm.js'
const { Header, Content} = Layout;

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

  handleLoading = (onoff) => {
    // e.preventDefault();
    this.setState({
      loading : onoff
    })
  }

  render() {

    return (

        <Spin spinning={this.state.loading} delay={LOADING_DELAY_TIME} tip='登录中'>
          <Layout style={{position:'relative', minHeight:'100%'}}>
            <Affix>
              <Header>
                <div className="index-header-logo" onClick={() => browserHistory.push(ROUTE.MAIN.URL)}/>
                <Menu
                   theme="dark"
                   mode="horizontal"
                   style={{ lineHeight: '64px' , float:'left'}}
                >
                  <Menu.Item key="1"><Link to={ROUTE.MAIN.URL}>首页</Link></Menu.Item>
                  <Menu.Item key="2">功能详情</Menu.Item>
                  <Menu.Item key="3">帮助</Menu.Item>
                </Menu>
                <div style={{ lineHeight: '64px' , float: 'right'}}>
                 <Button ghost style={{marginRight:10}} onClick={() => browserHistory.push(ROUTE.LOGIN.URL)}>登录</Button>
                 <Button ghost onClick={() => browserHistory.push(ROUTE.REGISTER.URL)}>注册</Button>
                </div>
              </Header>
            </Affix>
            <Content style={{paddingTop:80, paddingBottom:80}} >
                <VerticalLoginForm handleLoading={this.handleLoading}/>
            </Content>
            <Affix>
              <Header className='footer footer-affix'>
                医海慈航 ©2017 Created by BUPT
              </Header>
            </Affix>
          </Layout>
        </Spin>
    );
  }
}

export default Login;
