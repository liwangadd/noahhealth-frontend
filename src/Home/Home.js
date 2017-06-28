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
      layoutStyle: {}

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

    if(role === ROLE.EMPLOYEE_ADMIN) layoutStyle = this.getLayoutStyle(COLOR.RED, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK);
    else if(role === ROLE.EMPLOYEE_FINANCER) layoutStyle = this.getLayoutStyle(COLOR.RED, STYLE.BLOCK, STYLE.NONE, STYLE.NONE);
    else if(role === ROLE.EMPLOYEE_ARCHIVER) layoutStyle = this.getLayoutStyle(COLOR.PINK, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK);
    else if(role === ROLE.EMPLOYEE_ARCHIVE_MANAGER) layoutStyle = this.getLayoutStyle(COLOR.PINK, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK);
    else if(role === ROLE.EMPLOYEE_ADVISER) layoutStyle = this.getLayoutStyle(COLOR.ORANGE, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK);
    else if(role === ROLE.EMPLOYEE_ADVISE_MANAGER) layoutStyle = this.getLayoutStyle(COLOR.ORANGE, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK);
    else if(role === ROLE.MEMBER_1) layoutStyle = this.getLayoutStyle(COLOR.GREEN, STYLE.NONE, STYLE.NONE, STYLE.NONE);
    else if(role=== ROLE.MEMBER_2) layoutStyle = this.getLayoutStyle(COLOR.CYAN, STYLE.NONE, STYLE.NONE, STYLE.NONE);
    else layoutStyle = this.getLayoutStyle(COLOR.BLUE, STYLE.NONE, STYLE.NONE, STYLE.NONE);

    this.setState({layoutStyle: layoutStyle});
  }

  getLayoutStyle(roleTagColor,
                 userManageMenuItemDisplay,
                 categoryManageMenuItemDisplay,
                 originResultMenuItemDisplay) {

      let layoutStyle = {
        roleTagColor: roleTagColor,
        userManageMenuItemDisplay: userManageMenuItemDisplay,
        categoryManageMenuItemDisplay: categoryManageMenuItemDisplay,
        originResultMenuItemDisplay: originResultMenuItemDisplay
      };

      return layoutStyle;
  }


  handleMenuItemClick = (e) => {

    let targetUrl = ROUTE.WELCOME.URL_PREFIX + "/" + ROUTE.WELCOME.MENU_KEY;
    switch(e.key) {
      case ROUTE.WELCOME.MENU_KEY: targetUrl = ROUTE.WELCOME.URL_PREFIX + "/" + ROUTE.WELCOME.MENU_KEY; break;
      case ROUTE.USER_MANAGE.MENU_KEY: targetUrl = ROUTE.USER_MANAGE.URL_PREFIX + "/" + ROUTE.USER_MANAGE.MENU_KEY; break;
      case ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY: targetUrl = ROUTE.FIRST_CATEGORY_MANAGE.URL_PREFIX + "/" + ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY + "/1"; break;
      case ROUTE.ORIGIN_RESULT_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_MANAGE.MENU_KEY; break;
      default:;break;
    }

    //跳转
    browserHistory.push(targetUrl);
  }

  //渲染前预处理界面
  componentWillMount = () => this.initLayoutStyleByRole(sessionStorage.getItem(SESSION.ROLE))




  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

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
          <Menu theme="dark" mode="inline" selectedKeys={[this.props.params.menuKey]} onClick={this.handleMenuItemClick}>
            <Menu.Item key={ROUTE.WELCOME.MENU_KEY}>
              <Icon type="home" className="menu-item-font"/>
              <span className="nav-text menu-item-font">首页</span>
            </Menu.Item>
            <Menu.Item key={ROUTE.USER_MANAGE.MENU_KEY} style={{display: this.state.layoutStyle.userManageMenuItemDisplay}}>
              <Icon type="team" className="menu-item-font"/>
              <span className="nav-text menu-item-font">用户管理</span>
            </Menu.Item>
            <Menu.Item key={ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY} style={{display: this.state.layoutStyle.categoryManageMenuItemDisplay}}>
              <Icon type="medicine-box" className="menu-item-font"/>
              <span className="nav-text menu-item-font">检查项目管理</span>
            </Menu.Item>
            <Menu.Item key={ROUTE.ORIGIN_RESULT_MANAGE.MENU_KEY} style={{display: this.state.layoutStyle.originResultMenuItemDisplay}}>
              <Icon type="medicine-box" className="menu-item-font"/>
              <span className="nav-text menu-item-font">原始资料管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 ,textAlign: 'center'}}>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle}/>
            <Dropdown overlay={userOperationDropdownMenu} trigger={['click']}>
              <Avatar shape="square" size="large" src="/logo.png" className="avatar" style={{backgroundColor: 'white'}}/>
            </Dropdown>
            <a className='name'>{sessionStorage.getItem(SESSION.NAME)}</a>
            <Tag color={this.state.layoutStyle.roleTagColor} style={{marginLeft:7, float:'right', marginTop:21}}>{role}</Tag>
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
