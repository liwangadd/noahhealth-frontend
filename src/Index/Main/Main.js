import './../Index.css';
import {LOADING_DELAY_TIME, ROUTE} from './../../App/PublicConstant.js';
import React from 'react';
import { Layout,Carousel, Spin, Menu, Button, Card, BackTop, Affix} from 'antd';
import {Link, browserHistory} from 'react-router';
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
          <BackTop visibilityHeight="200"/>
          <Layout>
            <Affix>
              <Header>
                <div className="index-header-logo" onClick={() => browserHistory.push(ROUTE.MAIN.URL)}/>
                <Menu
                   theme="dark"
                   mode="horizontal"
                   defaultSelectedKeys={['1']}
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
            <Content style={{minHeight:720}} >
              <Carousel autoplay>
                <div style={{height:500}}><img src='/LoginRegister/carousel_1.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                <div style={{height:500}}><img src='/LoginRegister/carousel_2.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                <div style={{height:500}}><img src='/LoginRegister/carousel_3.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                <div style={{height:500}}><img src='/LoginRegister/carousel_4.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
              </Carousel>

              <div style={{paddingLeft:80, paddingRight:80}}>
                <div className='introduce-text' style={{textAlign:'center'}}>
                  <h1>医海慈航为您提供什么?</h1>
                </div>
                <div style={{marginLeft:25}}>
                  <Card className='card' bodyStyle={{ padding: 0 }}>
                    <div className="custom-image">
                      <img alt="example" src="/Home/Welcome/user_card.svg" />
                    </div>
                    <div className="custom-card">
                      <h3>会员管理</h3>
                      <p>会员信息、角色级别、所属顾问</p>
                    </div>
                  </Card>
                  <Card className='card' bodyStyle={{ padding: 0 }}>
                    <div className="custom-image">
                      <img alt="example" src="/Home/Welcome/doctor_card.svg"/>
                    </div>
                    <div className="custom-card">
                      <h3>职员管理</h3>
                      <p>权限配置、所属主管</p>
                    </div>
                  </Card>
                  <Card className='card' bodyStyle={{ padding: 0 }}>
                    <div className="custom-image">
                      <img alt="example" src="/Home/Welcome/health_card.svg" />
                    </div>
                    <div className="custom-card">
                      <h3>健康管理</h3>
                      <p>健康摘要、就医方案</p>
                    </div>
                  </Card>
                  <Card className='card' bodyStyle={{ padding: 0 }}>
                    <div className="custom-image">
                      <img alt="example" src="/Home/Welcome/record_card.svg" />
                    </div>
                    <div className="custom-card">
                      <h3>原始数据管理</h3>
                      <p>用户扫描件</p>
                    </div>
                  </Card>
                  <Card className='card' bodyStyle={{ padding: 0 }}>
                    <div className="custom-image">
                      <img alt="example" src="/Home/Welcome/origindata_card.svg" />
                    </div>
                    <div className="custom-card">
                      <h3>化验/医技数据管理</h3>
                      <p>数据录入、数据导出</p>
                    </div>
                  </Card>
                  <Card className='card' bodyStyle={{ padding: 0 }}>
                    <div className="custom-image">
                      <img alt="example" src="/Home/Welcome/config_card.svg" />
                    </div>
                    <div className="custom-card">
                      <h3>系统管理</h3>
                      <p>维护检查项目、用户申请单</p>
                    </div>
                  </Card>
                </div>
              </div>
            </Content>
            <Header className='footer'>
              医海慈航 ©2017 Created by BUPT
            </Header>
          </Layout>
        </Spin>
    );
  }
}

export default Login;
