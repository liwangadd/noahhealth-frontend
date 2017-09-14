import './Home.css';
import {SESSION, ROUTE, ROLE, STYLE, COLOR, FILE_SERVER, SERVER, RESULT} from './../App/PublicConstant.js';
import {clearSession, isEmployee} from './../App/PublicMethod.js';
import React from 'react';
import { Layout, Menu, Icon, Avatar, notification, Button, Tag, message} from 'antd';
import {browserHistory} from 'react-router';
import ProfileEditModal from './ProfileEditModal.js';
import $ from 'jquery';
const { Header, Content, Footer, Sider} = Layout;
const { SubMenu } = Menu;

var close = () => {
  console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
}

class Home extends React.Component {
  state = {
      collapsed: false,
      mode: 'inline',

      //个人资料编辑框
      profileEditModalVisible: false,
      userInfo: {valid: 0}

  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleLogout = (e) => {

    e.preventDefault();

    const role = sessionStorage.getItem(SESSION.ROLE);
    isEmployee(role) ? browserHistory.push(ROUTE.EMPLOYEE_LOGIN.URL) : browserHistory.push(ROUTE.MEMBER_LOGIN.URL);

    // const key = `open${Date.now()}`;
    // const btnClick = function () {
    //
    //   clearSession();
    //   notification.close(key);
    //   browserHistory.push(ROUTE.MAIN.URL);
    // };
    // const btn = (
    //   <Button type="primary" size="small" onClick={btnClick}>
    //     确定
    //   </Button>
    // );
    //
    // notification.open({
    //   message: '您确定要退出系统吗?',
    //   btn,
    //   key,
    //   onClose: close,
    // });
  }

  //根据角色决定布局
  initLayoutStyleByRole(role) {

    let layoutStyle;

    //主色调、用户管理、检查项目、原始资料、化验/医技数据、健康管理
    if(role === ROLE.EMPLOYEE_ADMIN) layoutStyle = this.getLayoutStyle(COLOR.RED, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.NONE);
    else if(role === ROLE.EMPLOYEE_FINANCER) layoutStyle = this.getLayoutStyle(COLOR.RED, STYLE.BLOCK, STYLE.NONE, STYLE.BLOCK, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE);
    else if(role === ROLE.EMPLOYEE_ARCHIVER) layoutStyle = this.getLayoutStyle(COLOR.PINK, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK, STYLE.NONE);
    else if(role === ROLE.EMPLOYEE_ARCHIVE_MANAGER) layoutStyle = this.getLayoutStyle(COLOR.PINK, STYLE.NONE, STYLE.BLOCK, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.NONE);
    else if(role === ROLE.EMPLOYEE_ADVISER) layoutStyle = this.getLayoutStyle(COLOR.ORANGE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE);
    else if(role === ROLE.EMPLOYEE_ADVISE_MANAGER) layoutStyle = this.getLayoutStyle(COLOR.ORANGE, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.NONE, STYLE.NONE, STYLE.NONE);
    else if(role === ROLE.MEMBER_1) layoutStyle = this.getLayoutStyle(COLOR.GREEN, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK);
    else if(role === ROLE.MEMBER_2) layoutStyle = this.getLayoutStyle(COLOR.CYAN, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK);
    else if(role === ROLE.MEMBER_3) layoutStyle = this.getLayoutStyle(COLOR.BLUE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK);
    else layoutStyle = this.getLayoutStyle(COLOR.BLUE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE);

    return layoutStyle;
  }

  getLayoutStyle(roleTagColor,
                 financeManageMenuItemDisplay,
                 employeeManageMenuItemDisplay,
                 memberManageMenuItemDisplay,
                 categoryManageMenuItemDisplay,
                 originResultMenuItemDisplay,
                 examResultMenuItemDisplay,
                 memberDetailPrivateMenuItemDisplay) {

      let layoutStyle = {
        roleTagColor: roleTagColor,
        financeManageMenuItemDisplay: financeManageMenuItemDisplay,
        employeeManageMenuItemDisplay: employeeManageMenuItemDisplay,
        memberManageMenuItemDisplay: memberManageMenuItemDisplay,
        categoryManageMenuItemDisplay: categoryManageMenuItemDisplay,
        originResultMenuItemDisplay: originResultMenuItemDisplay,
        examResultMenuItemDisplay: examResultMenuItemDisplay,
        memberDetailPrivateMenuItemDisplay: memberDetailPrivateMenuItemDisplay
      };

      return layoutStyle;
  }


  handleMenuItemClick = (e) => {

    const role = sessionStorage.getItem(SESSION.ROLE);
    const memberId = sessionStorage.getItem(SESSION.USER_ID);
    const memberName = sessionStorage.getItem(SESSION.NAME);
    let targetUrl = ROUTE.WELCOME.URL_PREFIX + "/" + ROUTE.WELCOME.MENU_KEY;
    switch(e.key) {
      case ROUTE.WELCOME.MENU_KEY: targetUrl = ROUTE.WELCOME.URL_PREFIX + "/" + ROUTE.WELCOME.MENU_KEY; break;
      case ROUTE.FINANCE_MANAGE.MENU_KEY: targetUrl = ROUTE.FINANCE_MANAGE.URL_PREFIX + "/" + ROUTE.FINANCE_MANAGE.MENU_KEY; break;
      case ROUTE.EMPLOYEE_MANAGE.MENU_KEY: targetUrl = ROUTE.EMPLOYEE_MANAGE.URL_PREFIX + "/" + ROUTE.EMPLOYEE_MANAGE.MENU_KEY; break;
      case ROUTE.MEMBER_MANAGE.MENU_KEY: targetUrl = ROUTE.MEMBER_MANAGE.URL_PREFIX + "/" + ROUTE.MEMBER_MANAGE.MENU_KEY; break;
      case ROUTE.MEMBER_DETAIL_PRIVATE.MENU_KEY: targetUrl = ROUTE.MEMBER_DETAIL_PRIVATE.URL_PREFIX + "/" + ROUTE.MEMBER_DETAIL_PRIVATE.MENU_KEY + "/" + memberId + "/" + memberName; break;
      case ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY: targetUrl = ROUTE.FIRST_CATEGORY_MANAGE.URL_PREFIX + "/" + ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY + "/1"; break;
      case ROUTE.ORIGIN_RESULT_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_MANAGE.MENU_KEY; break;
      case ROUTE.EXAM_RESULT_MANAGE.MENU_KEY: targetUrl = isEmployee(role) ? (ROUTE.EXAM_RESULT_MANAGE.URL_PREFIX + "/" + ROUTE.EXAM_RESULT_MANAGE.MENU_KEY) : (ROUTE.EXAM_RESULT_DETAIL.URL_PREFIX + "/" + ROUTE.EXAM_RESULT_DETAIL.MENU_KEY + "/" + memberId + "/" + memberName);break;
      case ROUTE.HEALTH_RESULT_MANAGE.MENU_KEY: targetUrl = isEmployee(role) ? (ROUTE.HEALTH_RESULT_MANAGE.URL_PREFIX + "/" + ROUTE.HEALTH_RESULT_MANAGE.MENU_KEY) : (ROUTE.HEALTH_RESULT_DETAIL.URL_PREFIX + "/" + ROUTE.HEALTH_RESULT_DETAIL.MENU_KEY + "/" + memberId + "/" + memberName);break;
      default:;break;
    }

    //跳转
    browserHistory.push(targetUrl);
  }

  /**
  * 弹出编辑个人信息对话框
  */
  showProfileEditModal = () => {

    this.setState({profileEditModalVisible: true});
    this.requestMember(sessionStorage.getItem(SESSION.USER_ID));
  }

  closeProfileEditModal = () => this.setState({profileEditModalVisible: false})

  //查询memberId会员信息显示到对话框内
  requestMember = (memberId) => {

    console.log('查询会员', memberId);

    $.ajax({
        url : SERVER + '/api/user/' + memberId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                this.setState({userInfo: result.content});
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);
    const layoutStyle = this.initLayoutStyleByRole(role);

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
            {/* <Menu.Item key={ROUTE.FINANCE_MANAGE.MENU_KEY} style={{display: layoutStyle.financeManageMenuItemDisplay}}>
              <Icon type="pay-circle-o" className="menu-item-font"/>
              <span className="nav-text menu-item-font">财务管理</span>
            </Menu.Item> */}
            <Menu.Item key={ROUTE.EMPLOYEE_MANAGE.MENU_KEY} style={{display: layoutStyle.employeeManageMenuItemDisplay}}>
              <Icon type="team" className="menu-item-font"/>
              <span className="nav-text menu-item-font">职员管理</span>
            </Menu.Item>
            <Menu.Item key={ROUTE.MEMBER_MANAGE.MENU_KEY} style={{display: layoutStyle.memberManageMenuItemDisplay}}>
              <Icon type="team" className="menu-item-font"/>
              <span className="nav-text menu-item-font">会员管理</span>
            </Menu.Item>

            <SubMenu key="health_bank" title={<span className="menu-item-font"><Icon type="file" />电子健康银行</span>}>
              <Menu.Item key={ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY} style={{display: layoutStyle.categoryManageMenuItemDisplay}}>
                <span className="menu-item-font">检查项目</span>
              </Menu.Item>
              <Menu.Item key={ROUTE.ORIGIN_RESULT_MANAGE.MENU_KEY} style={{display: layoutStyle.originResultMenuItemDisplay}}>
                <span className="nav-text menu-item-font">电子资料</span>
              </Menu.Item>
              {/* <Menu.Item key="11">
                <span className="menu-item-font">门诊资料</span>
              </Menu.Item>
              <Menu.Item key="22">
                <span className="menu-item-font">住院资料</span>
              </Menu.Item>
              <Menu.Item key="33">
                <span className="menu-item-font">体检资料</span>
              </Menu.Item>
              <Menu.Item key="44">
                <span className="menu-item-font">牙科资料</span>
              </Menu.Item>
              <Menu.Item key="55">
                <span className="menu-item-font">中医资料</span>
              </Menu.Item>
              <Menu.Item key="55">
                <span className="menu-item-font">影音资料</span>
              </Menu.Item> */}
            </SubMenu>

            <SubMenu key="health_store" title={<span className="menu-item-font"><Icon type="medicine-box" />健康大数据库</span>}>
              <Menu.Item key="66">
                <span className="menu-item-font">健康信息表</span>
              </Menu.Item>
              <Menu.Item key="77">
                <span className="menu-item-font">健康摘要库</span>
              </Menu.Item>
              <Menu.Item key={ROUTE.EXAM_RESULT_MANAGE.MENU_KEY} style={{display: layoutStyle.examResultMenuItemDisplay}}>
                <span className="nav-text menu-item-font">辅检数据库</span>
              </Menu.Item>
            </SubMenu>

            <SubMenu key="health_manage" title={<span className="menu-item-font"><Icon type="eye-o" />健康长程管理</span>}>
              <Menu.Item key="88">
                <span className="menu-item-font">健康管理方案</span>
              </Menu.Item>
              <Menu.Item key="99">
                <span className="menu-item-font">健康记录</span>
              </Menu.Item>
              <Menu.Item key="00">
                <span className="menu-item-font">各种记录表格</span>
              </Menu.Item>
              <Menu.Item key="23">
                <span className="menu-item-font">年度总结</span>
              </Menu.Item>
            </SubMenu>


            <Menu.Item key={ROUTE.MEMBER_DETAIL_PRIVATE.MENU_KEY} style={{display: layoutStyle.memberDetailPrivateMenuItemDisplay}}>
              <Icon type="team" className="menu-item-font"/>
              <span className="nav-text menu-item-font">个人资料</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 ,textAlign: 'center'}}>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle}/>
            <Icon type="logout" className="logout-icon" onClick={this.handleLogout}/>
            <Avatar size="large" src={FILE_SERVER + sessionStorage.getItem(SESSION.AVATAR)} className="avatar-header" style={{backgroundColor: 'white'}} onClick={this.showProfileEditModal}/>
            <ProfileEditModal ref="profileEditForm" visible={this.state.profileEditModalVisible} onCancel={this.closeProfileEditModal} userInfo={this.state.userInfo}/>
            <a className='name' onClick={this.showProfileEditModal}>{sessionStorage.getItem(SESSION.NAME)}</a>
            <Tag color={layoutStyle.roleTagColor} style={{marginLeft:7, float:'right', marginTop:21}}>{role}</Tag>

          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 800 }}>
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            诺亚健康 ©2017 Created by BUPT
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Home
