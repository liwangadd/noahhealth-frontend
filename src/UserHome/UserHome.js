import './../App/public.css';
import './UserHome.css';
import {SERVER, clearSession} from './../App/public.js';
import React from 'react';
import { Layout, Menu, Breadcrumb, Icon, message, Avatar, Dropdown, notification, Button} from 'antd';
import $ from 'jquery';
import {browserHistory, Link} from 'react-router'
const { Header, Content, Footer, Sider } = Layout;


class UserOperationDropdownMenu extends React.Component {
  render() {
    return (
      <Menu>
        <Menu.Item>
          <Link target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">编辑账户信息</Link>
        </Menu.Item>
        <Menu.Item>
          <Link target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">修改密码</Link>
        </Menu.Item>
        <Menu.Item>
          <Link target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">退出系统</Link>
        </Menu.Item>
      </Menu>
    );
  }
}

var close = () => {
  console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
}

class UserHome extends React.Component {
  state = {
      collapsed: false,
      mode: 'inline',
      phone: '',
      role: '',
      content: '北京邮电大学姚陈堃'
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  componentDidMount(){

    let token = sessionStorage.getItem('token');
    $.ajax({
        url : SERVER + '/api/member/1111',
        type : 'GET',
        beforeSend: (request) => request.setRequestHeader("token", token),
        dataType : 'json',
        success : (result) => {

            console.log(result);
            if(result.code != "SUCCESS") {
                message.error(result.reason, 2);
                browserHistory.push('/login');
                return;
            }

            //显示获取到的数据
            this.setState({
                phone: sessionStorage.getItem("phone"),
                role: sessionStorage.getItem("role"),
                content: JSON.stringify(result.content)
            });
        }
    });
  }



  handleLogout = (e) => {

    e.preventDefault();

    const key = `open${Date.now()}`;
    const btnClick = function () {

      clearSession();
      notification.close(key);
      browserHistory.push("/login");
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




  render() {

    //悬停头像时的下拉菜单
    const userOperationDropdownMenu = (
        <Menu>
          <Menu.Item>
            <Link target="_blank" rel="noopener noreferrer" href="#">编辑信息</Link>
          </Menu.Item>
          <Menu.Item>
            <Link target="_blank" rel="noopener noreferrer" href="#" onClick={this.handleLogout}>退出系统</Link>
          </Menu.Item>
        </Menu>);


    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" className="menu-item-font"/>
              <span className="nav-text menu-item-font">挂号诊断</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" className="menu-item-font"/>
              <span className="nav-text menu-item-font">病历查询</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" className="menu-item-font"/>
              <span className="nav-text menu-item-font">财务管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 ,textAlign: 'center'}}>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} style={{float:'left'}}/>
            <span style={{fontSize: '20px'}}>医海慈航</span>
            <Dropdown overlay={userOperationDropdownMenu}>
              <Avatar shape="square" size="large" src="logo.png" className="avatar" />
            </Dropdown>
            <Link className="phone" href="#">{this.state.phone}</Link>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 540 }}>
              <div style={{color:'red'}}>用户名={this.state.phone}</div>
              <div style={{color:'red'}}>角色={this.state.role}</div>
              <div>拉取member={this.state.content}</div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            医海慈航 ©2017 Created by BUPT
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default UserHome
