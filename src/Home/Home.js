import './Home.css';
import {SESSION, ROUTE, ROLE, STYLE, COLOR} from './../App/PublicConstant.js';
import {clearSession} from './../App/PublicMethod.js'
import React from 'react';
import { Layout, Menu, Icon, Avatar, Dropdown, notification, Button, Tag} from 'antd';
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
      browserHistory.push(ROUTE.LOGIN.URL);
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
  initLayoutStyleByRole(role) {

    let layoutStyle;

    if(role === ROLE.EMPLOYEE_ADMIN) layoutStyle = this.getLayoutStyle(COLOR.RED, STYLE.BLOCK, STYLE.BLOCK);
    else if(role === ROLE.EMPLOYEE_FINANCER) layoutStyle = this.getLayoutStyle(COLOR.RED, STYLE.BLOCK, STYLE.NONE);
    else if(role === ROLE.EMPLOYEE_ARCHIVER) layoutStyle = this.getLayoutStyle(COLOR.PINK, STYLE.NONE, STYLE.NONE);
    else if(role === ROLE.EMPLOYEE_ARCHIVE_MANAGER) layoutStyle = this.getLayoutStyle(COLOR.PINK, STYLE.NONE, STYLE.NONE);
    else if(role === ROLE.EMPLOYEE_ADVISER) layoutStyle = this.getLayoutStyle(COLOR.ORANGE, STYLE.NONE, STYLE.NONE);
    else if(role === ROLE.EMPLOYEE_ADVISE_MANAGER) layoutStyle = this.getLayoutStyle(COLOR.ORANGE, STYLE.NONE, STYLE.NONE);
    else if(role === ROLE.MEMBER_1) layoutStyle = this.getLayoutStyle(COLOR.GREEN, STYLE.NONE, STYLE.NONE);
    else if(role=== ROLE.MEMBER_2) layoutStyle = this.getLayoutStyle(COLOR.CYAN, STYLE.NONE, STYLE.NONE);
    else layoutStyle = this.getLayoutStyle(COLOR.BLUE, STYLE.NONE, STYLE.NONE);

    this.setState({
      roleTagColor: layoutStyle.roleTagColor,
      userManageMenuItemDisplay: layoutStyle.userManageMenuItemDisplay,
      categoryManageMenuItemDisplay: layoutStyle.categoryManageMenuItemDisplay
    });
  }

  getLayoutStyle(roleTagColor,
                 userManageMenuItemDisplay,
                 categoryManageMenuItemDisplay) {

      let layoutStyle = {
        roleTagColor: roleTagColor,
        userManageMenuItemDisplay: userManageMenuItemDisplay,
        categoryManageMenuItemDisplay: categoryManageMenuItemDisplay
      };

      return layoutStyle;
  }


  handleMenuItemClick = (e) => {

    let targetUrl = ROUTE.HOME.URL;
    switch(e.key) {
      case '1': targetUrl = ROUTE.HOME.URL; break;
      case '2': targetUrl = ROUTE.HOME_USER_MANAGE.URL; break;
      case '3': targetUrl = ROUTE.HOME_FIRST_CATEGORY_MANAGE.URL_PREFIX + "/1"; break;
      default:;break;
    }

    //记录当前按下的菜单项索引
    sessionStorage.setItem(SESSION.MENUITEM_KEY, e.key);

    //跳转
    browserHistory.push(targetUrl);
  }

  //渲染前预处理界面
  componentWillMount() {

    //根据角色显示不同主色调、侧拉菜单选项
    this.initLayoutStyleByRole(sessionStorage.getItem(SESSION.ROLE));
  }




  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);
    const selectedKey = sessionStorage.getItem(SESSION.MENUITEM_KEY); //避免刷新失去菜单选项

    //悬停头像时的下拉菜单
    const userOperationDropdownMenu = (
        <Menu>
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
          <Menu theme="dark" mode="inline" selectedKeys={[selectedKey == null ? '1' : selectedKey]} onClick={this.handleMenuItemClick}>
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
              <span className="nav-text menu-item-font">检查项目管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 ,textAlign: 'center'}}>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} style={{float:'left'}}/>
            <Dropdown overlay={userOperationDropdownMenu} trigger={['click']}>
              <Avatar shape="square" size="large" src="/logo.png" className="avatar" />
            </Dropdown>
            <a className='name'>{sessionStorage.getItem(SESSION.NAME)}</a>
            <Tag color={this.state.roleTagColor} style={{marginLeft:7, float:'right', marginTop:21}}>{role}</Tag>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 840 }}>
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
