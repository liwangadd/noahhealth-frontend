import './Home.css';
import {SERVER,SESSION, URL, ROLE} from './../App/PublicConstant.js';
import {clearSession} from './../App/PublicMethod.js'
import React from 'react';
import { Layout, Menu, Icon, Avatar, Dropdown, notification, Button, Tag} from 'antd';
import $ from 'jquery';
import {browserHistory, Link} from 'react-router'
const { Header, Content, Footer, Sider} = Layout;

var close = () => {
  console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
}

class Home extends React.Component {
  state = {
      collapsed: false,
      mode: 'inline',

      //界面
      roleTagColor: 'green',
      userManageMenuItemDisplay: 'block'
      //数据

  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleLogout = (e) => {

    e.preventDefault();

    const key = `open${Date.now()}`;
    const btnClick = function () {

      clearSession();
      notification.close(key);
      browserHistory.push(URL.LOGIN);
    };
    const btn = (
      <Button type="primary" size="small" onClick={btnClick}>
        确定
      </Button>
    );
    notification.open({
      message: '您确定要退出系统吗?',
      btn,
      key,
      onClose: close,
    });
  }

  //根据角色决定布局
  initLayoutByRole(role) {

    let roleTagColor,
        userManageMenuItemDisplay,
        categoryManageMenuItemDisplay;

    if(role === ROLE.EMPLOYEE_ADMIN) {
      roleTagColor = 'red';
      userManageMenuItemDisplay = 'block';
      categoryManageMenuItemDisplay = 'block';
    } else if(role === ROLE.EMPLOYEE_FINANCER) {
      roleTagColor = 'red';
      userManageMenuItemDisplay = 'block';
      categoryManageMenuItemDisplay = 'none';
    } else if(role === ROLE.EMPLOYEE_ARCHIVER) {
      roleTagColor = 'pink';
      userManageMenuItemDisplay = 'none';
      categoryManageMenuItemDisplay = 'none';
    } else if(role === ROLE.EMPLOYEE_ARCHIVE_MANAGER) {
      roleTagColor = 'pink';
      userManageMenuItemDisplay = 'none';
      categoryManageMenuItemDisplay = 'none';
    } else if(role === ROLE.EMPLOYEE_ADVISER) {
      roleTagColor = 'orange';
      userManageMenuItemDisplay = 'none';
      categoryManageMenuItemDisplay = 'none';
    } else if(role === ROLE.EMPLOYEE_ADVISE_MANAGER) {
      roleTagColor = 'orange';
      userManageMenuItemDisplay = 'none';
      categoryManageMenuItemDisplay = 'none';
    } else if(role === ROLE.MEMBER_1) {
      roleTagColor = 'green';
      userManageMenuItemDisplay = 'none';
      categoryManageMenuItemDisplay = 'none';
    } else if(role=== ROLE.MEMBER_2) {
      roleTagColor = 'cyan';
      userManageMenuItemDisplay = 'none';
      categoryManageMenuItemDisplay = 'none';
    } else {
      roleTagColor = 'blue';
      userManageMenuItemDisplay = 'none';
      categoryManageMenuItemDisplay = 'none';
    }

    this.setState({
      roleTagColor: roleTagColor,
      userManageMenuItemDisplay: userManageMenuItemDisplay,
      categoryManageMenuItemDisplay: categoryManageMenuItemDisplay
    });

  }

  handleMenuItemClick = (e) => {

    let targetUrl = URL.HOME;
    switch(e.key) {
      case '1': targetUrl = URL.HOME; break;
      case '2': targetUrl = URL.HOME_USER_MANAGE; break;
      case '3': targetUrl = URL.HOME_CATEGORY_MANAGE; break;
      default: break;
    }

    //跳转
    browserHistory.push(targetUrl);
  }

  //渲染前预处理界面
  componentWillMount() {

    //根据角色显示不同主色调、侧拉菜单选项
    this.initLayoutByRole(sessionStorage.getItem(SESSION.ROLE));
  }




  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    //悬停头像时的下拉菜单
    const userOperationDropdownMenu = (
        <Menu>
          <Menu.Item>
            <Tag color={this.state.roleTagColor} style={{marginLeft:7}}>{role}</Tag>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <Link target="_blank" rel="noopener noreferrer" href="#">编辑信息</Link>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <Link target="_blank" rel="noopener noreferrer" href="#" onClick={this.handleLogout}>退出系统</Link>
          </Menu.Item>
        </Menu>);


    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}>
          <div className="logo"/>
          <Menu theme="dark" mode="inline" onClick={this.handleMenuItemClick}>
            <Menu.Item key="1">
              <Icon type="home" className="menu-item-font"/>
              <span className="nav-text menu-item-font">首页</span>
            </Menu.Item>
            <Menu.Item key="2" style={{display: this.state.userManageMenuItemDisplay}}>
              <Icon type="team" className="menu-item-font"/>
              <span className="nav-text menu-item-font">用户管理</span>
            </Menu.Item>
            <Menu.Item key="3" style={{display: this.state.categoryManageMenuItemDisplay}}>
              <Icon type="medicine-box" className="menu-item-font"/>
              <span className="nav-text menu-item-font">病类管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 ,textAlign: 'center'}}>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} style={{float:'left'}}/>
            <span style={{fontSize: '20px'}}>医海慈航</span>
            <Dropdown overlay={userOperationDropdownMenu}>
              <Avatar shape="square" size="large" src="/logo.png" className="avatar" />
            </Dropdown>
            <a href='#' className='name'>{sessionStorage.getItem(SESSION.NAME)}</a>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 540 }}>
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            医海慈航 ©2017 Created by BUPT
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Home
