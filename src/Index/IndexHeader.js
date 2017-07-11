import {ROUTE} from './../App/PublicConstant.js';
import React from 'react';
import {Link, browserHistory} from 'react-router';
import { Layout, Affix, Menu, Button} from 'antd';
const {Header} = Layout;

class IndexHeader extends React.Component{

  render() {
    return (
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
           <Button ghost style={{marginRight:10}} onClick={() => browserHistory.push(ROUTE.EMPLOYEE_LOGIN.URL)}>职员登录</Button>
           <Button ghost style={{marginRight:10}} onClick={() => browserHistory.push(ROUTE.MEMBER_LOGIN.URL)}>会员登录</Button>
           <Button ghost onClick={() => browserHistory.push(ROUTE.REGISTER.URL)}>会员注册</Button>
          </div>
        </Header>
      </Affix>)
  }
}

export default IndexHeader;
