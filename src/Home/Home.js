import './Home.css';
import { SESSION, ROUTE, ROLE, STYLE, COLOR, FILE_SERVER, SERVER, RESULT } from './../App/PublicConstant.js';
import { clearSession, isEmployee, isMember } from './../App/PublicMethod.js';
import React from 'react';
import { Layout, Menu, Icon, Avatar, notification, Button, Tag, message } from 'antd';
import { browserHistory } from 'react-router';
import ProfileEditModal from './ProfileEditModal.js';
import $ from 'jquery';
import MenuItem from 'antd/lib/menu/MenuItem';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

var close = () => {

}

class Home extends React.Component {
  state = {
    collapsed: false,
    mode: 'inline',

    //个人资料编辑框
    profileEditModalVisible: false,
    userInfo: { valid: 0 }

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
    if (role === ROLE.EMPLOYEE_ADMIN) layoutStyle = this.getLayoutStyle(COLOR.RED, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK);
    else if (role === ROLE.EMPLOYEE_FINANCER) layoutStyle = this.getLayoutStyle(COLOR.RED, STYLE.NONE, STYLE.BLOCK, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK);
    else if (role === ROLE.EMPLOYEE_ARCHIVER) layoutStyle = this.getLayoutStyle(COLOR.PINK, STYLE.BLOCK, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK, STYLE.NONE, STYLE.NONE);
    else if (role === ROLE.EMPLOYEE_ARCHIVE_MANAGER) layoutStyle = this.getLayoutStyle(COLOR.PINK, STYLE.BLOCK, STYLE.NONE, STYLE.BLOCK, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK, STYLE.BLOCK);
    else if (role === ROLE.EMPLOYEE_ADVISER) layoutStyle = this.getLayoutStyle(COLOR.ORANGE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE);
    else if (role === ROLE.EMPLOYEE_ADVISE_MANAGER) layoutStyle = this.getLayoutStyle(COLOR.ORANGE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE);
    else if (role === ROLE.MEMBER_1) layoutStyle = this.getLayoutStyle(COLOR.GREEN, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE);
    else if (role === ROLE.MEMBER_2) layoutStyle = this.getLayoutStyle(COLOR.CYAN, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE);
    else if (role === ROLE.MEMBER_3) layoutStyle = this.getLayoutStyle(COLOR.BLUE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE);
    else layoutStyle = this.getLayoutStyle(COLOR.BLUE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE);

    return layoutStyle;
  }

  getLayoutStyle(roleTagColor,
    welcomeMenuItemDisplay,
    financeManageMenuItemDisplay,
    employeeManageMenuItemDisplay,
    memberManageMenuItemDisplay,
    documentBankMenuItemDisplay,
    healthDatabaseMenuItemDisplay,
    healthLongtermManageMenuItemDisplay,
    memberServiceSubscribeMenuItemDisplay) {

    let layoutStyle = {
      roleTagColor: roleTagColor,
      welcomeMenuItemDisplay: welcomeMenuItemDisplay,
      financeManageMenuItemDisplay: financeManageMenuItemDisplay,
      employeeManageMenuItemDisplay: employeeManageMenuItemDisplay,
      memberManageMenuItemDisplay: memberManageMenuItemDisplay,
      documentBankMenuItemDisplay: documentBankMenuItemDisplay,
      healthDatabaseMenuItemDisplay: healthDatabaseMenuItemDisplay,
      healthLongtermManageMenuItemDisplay: healthLongtermManageMenuItemDisplay,
      memberServiceSubscribeMenuItemDisplay: memberServiceSubscribeMenuItemDisplay
    };

    return layoutStyle;
  }


  handleMenuItemClick = (e) => {

    const role = sessionStorage.getItem(SESSION.ROLE);
    const memberId = sessionStorage.getItem(SESSION.USER_ID);
    const memberName = sessionStorage.getItem(SESSION.NAME);
    let targetUrl = ROUTE.WELCOME.URL_PREFIX + "/" + ROUTE.WELCOME.MENU_KEY;
    switch (e.key) {
      case ROUTE.WELCOME.MENU_KEY: targetUrl = ROUTE.WELCOME.URL_PREFIX + "/" + ROUTE.WELCOME.MENU_KEY; break;

      case ROUTE.FINANCE_MANAGE.MENU_KEY: targetUrl = ROUTE.FINANCE_MANAGE.URL_PREFIX + "/" + ROUTE.FINANCE_MANAGE.MENU_KEY; break;

      case ROUTE.EMPLOYEE_MANAGE.MENU_KEY: targetUrl = ROUTE.EMPLOYEE_MANAGE.URL_PREFIX + "/" + ROUTE.EMPLOYEE_MANAGE.MENU_KEY; break;
      case ROUTE.MEMBER_MANAGE.MENU_KEY: targetUrl = isEmployee(role) ? ROUTE.MEMBER_MANAGE.URL_PREFIX + "/" + ROUTE.MEMBER_MANAGE.MENU_KEY : ROUTE.MEMBER_DETAIL.URL_PREFIX + "/" + ROUTE.MEMBER_DETAIL.MENU_KEY + "/" + memberId + "/" + memberName; break;

      case ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY: targetUrl = ROUTE.FIRST_CATEGORY_MANAGE.URL_PREFIX + "/" + ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY + "/1"; break;

      case ROUTE.ORIGIN_RESULT_MENZHEN_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_MENZHEN_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_MENZHEN_MANAGE.MENU_KEY; break;
      case ROUTE.ORIGIN_RESULT_ZHUYUAN_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_ZHUYUAN_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_ZHUYUAN_MANAGE.MENU_KEY; break;
      case ROUTE.ORIGIN_RESULT_TIJIAN_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_TIJIAN_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_TIJIAN_MANAGE.MENU_KEY; break;
      case ROUTE.ORIGIN_RESULT_YINGXIANG_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_YINGXIANG_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_YINGXIANG_MANAGE.MENU_KEY; break;
      case ROUTE.ORIGIN_RESULT_YAKE_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_YAKE_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_YAKE_MANAGE.MENU_KEY; break;
      case ROUTE.ORIGIN_RESULT_ZHONGYI_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_ZHONGYI_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_ZHONGYI_MANAGE.MENU_KEY; break;
      case ROUTE.ORIGIN_RESULT_XINLI_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_XINLI_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_XINLI_MANAGE.MENU_KEY; break;
      case ROUTE.ORIGIN_RESULT_QITA_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_QITA_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_QITA_MANAGE.MENU_KEY; break;
      // 新电子健康银行访问URL
      case ROUTE.ORIGIN_RESULT_NEW_MANAGE.MENU_KEY: targetUrl = ROUTE.ORIGIN_RESULT_NEW_MANAGE.URL_PREFIX + "/" + ROUTE.ORIGIN_RESULT_NEW_MANAGE.MENU_KEY; break;

      case ROUTE.EXAM_RESULT_ASSAY_MANAGE.MENU_KEY: targetUrl = ROUTE.EXAM_RESULT_ASSAY_MANAGE.URL_PREFIX + "/" + ROUTE.EXAM_RESULT_ASSAY_MANAGE.MENU_KEY; break;
      case ROUTE.EXAM_RESULT_TECH_MANAGE.MENU_KEY: targetUrl = ROUTE.EXAM_RESULT_TECH_MANAGE.URL_PREFIX + "/" + ROUTE.EXAM_RESULT_TECH_MANAGE.MENU_KEY; break;

      case ROUTE.HEALTH_RESULT_MANAGE.MENU_KEY: targetUrl = ROUTE.HEALTH_RESULT_MANAGE.URL_PREFIX + "/" + ROUTE.HEALTH_RESULT_MANAGE.MENU_KEY; break;

      case ROUTE.MEMORABILIA_MANAGE.MENU_KEY: targetUrl = ROUTE.MEMORABILIA_MANAGE.URL_PREFIX + "/" + ROUTE.MEMORABILIA_MANAGE.MENU_KEY; break;
      case ROUTE.MEMORABILIA_EDITABLE_MANAGE.MENU_KEY: targetUrl = ROUTE.MEMORABILIA_EDITABLE_MANAGE.URL_PREFIX + "/" + ROUTE.MEMORABILIA_EDITABLE_MANAGE.MENU_KEY; break;
      default: ; break;
    }

    //跳转
    browserHistory.push(targetUrl);
  }

  /**
  * 弹出编辑个人信息对话框
  */
  showProfileEditModal = () => {

    this.setState({ profileEditModalVisible: true });
    this.requestMember(sessionStorage.getItem(SESSION.USER_ID));
  }

  closeProfileEditModal = () => this.setState({ profileEditModalVisible: false })

  //查询memberId会员信息显示到对话框内
  requestMember = (memberId) => {



    $.ajax({
      url: SERVER + '/api/user/' + memberId,
      type: 'GET',
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {


        if (result.code === RESULT.SUCCESS) {

          this.setState({ userInfo: result.content });
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
          <div className="logo" />
          <Menu theme="dark" mode="inline" selectedKeys={[this.props.params.menuKey]} onClick={this.handleMenuItemClick}>
            <Menu.Item key={ROUTE.WELCOME.MENU_KEY} style={{ display: layoutStyle.welcomeMenuItemDisplay }}>
              <Icon type="home" className="menu-item-font" />
              <span className="nav-text menu-item-font">首页</span>
            </Menu.Item>

            <SubMenu key="member_manage" title={<span className="menu-item-font"><Icon type="team" /><span>{isMember(role) ? "个人资料" : "会员管理"}</span></span>}
              style={{ display: layoutStyle.memberManageMenuItemDisplay }} >
              <Menu.Item key={ROUTE.MEMBER_MANAGE.MENU_KEY} >
                <span className="menu-item-font">健康档案</span>
              </Menu.Item>
              <Menu.Item key={ROUTE.MEMORABILIA_MANAGE.MENU_KEY} >
                <span className="menu-item-font">健康大事记</span>
              </Menu.Item>
              <Menu.Item key="100" >
                <span className="menu-item-font">资料上传</span>
              </Menu.Item>
              <Menu.Item key="101" >
                <span className="menu-item-font">服务预约</span>
              </Menu.Item>
              <Menu.Item key="102" >
                <span className="menu-item-font">意见反馈</span>
              </Menu.Item>
              <Menu.Item key="{ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY}" >
                <span className="menu-item-font">账户管理</span>
              </Menu.Item>
            </SubMenu>

            {layoutStyle.documentBankMenuItemDisplay === STYLE.BLOCK || layoutStyle.healthDatabaseMenuItemDisplay === STYLE.BLOCK || layoutStyle.healthLongtermManageMenuItemDisplay === STYLE.BLOCK ?
              <SubMenu key="record_input" title={<span className="menu-item-font"><Icon type="file" /><span>档案录审</span></span>}>
                {
                  layoutStyle.documentBankMenuItemDisplay === STYLE.BLOCK
                    ?
                    <Menu.Item key={ROUTE.ORIGIN_RESULT_NEW_MANAGE.MENU_KEY} style={{ display: layoutStyle.documentBankMenuItemDisplay }}>
                      <span className="nav-text menu-item-font">电子健康银行</span>
                    </Menu.Item>
                    :
                    null
                }
                {
                  layoutStyle.documentBankMenuItemDisplay === STYLE.BLOCK
                    ?
                    <Menu.Item key={ROUTE.MEMORABILIA_EDITABLE_MANAGE.MENU_KEY} >
                      <span className="menu-item-font">健康大事记</span>
                    </Menu.Item>
                    :
                    null
                }
                {
                  layoutStyle.healthDatabaseMenuItemDisplay === STYLE.BLOCK
                    ?
                    <SubMenu key="health_store" title={<span className="menu-item-font"><span>健康大数据库</span></span>} >
                      <Menu.Item key={ROUTE.HEALTH_RESULT_MANAGE.MENU_KEY} >
                        <span className="menu-item-font">健康摘要库</span>
                      </Menu.Item>
                      <Menu.Item key={ROUTE.EXAM_RESULT_ASSAY_MANAGE.MENU_KEY} >
                        <span className="menu-item-font">化验数据库</span>
                      </Menu.Item>
                      <Menu.Item key={ROUTE.EXAM_RESULT_TECH_MANAGE.MENU_KEY} >
                        <span className="menu-item-font">医技数据库</span>
                      </Menu.Item>
                    </SubMenu>
                    :
                    null
                }
                {
                  layoutStyle.healthLongtermManageMenuItemDisplay === STYLE.BLOCK
                    ?
                    <SubMenu key="health_manage" title={<span className="menu-item-font"><span>健康长程管理</span></span>}>
                      <Menu.Item key="88">
                        <span className="menu-item-font">健康管理方案</span>
                      </Menu.Item>
                      <Menu.Item key="99">
                        <span className="menu-item-font">健康问题记录</span>
                      </Menu.Item>
                      <Menu.Item key="00">
                        <span className="menu-item-font">专病监测表格</span>
                      </Menu.Item>
                      <Menu.Item key="23">
                        <span className="menu-item-font">调查评估量表</span>
                      </Menu.Item>
                      <Menu.Item key="235555">
                        <span className="menu-item-font">私人定制体检</span>
                      </Menu.Item>
                      <Menu.Item key="2355551">
                        <span className="menu-item-font">年度健康总结</span>
                      </Menu.Item>
                    </SubMenu>
                    :
                    null
                }
              </SubMenu>
              :
              null
            }

            <Menu.Item key={ROUTE.EMPLOYEE_MANAGE.MENU_KEY} style={{ display: layoutStyle.employeeManageMenuItemDisplay }}>
              <Icon type="team" className="menu-item-font" />
              <span className="nav-text menu-item-font">职员管理</span>
            </Menu.Item>

            {
              layoutStyle.healthDatabaseMenuItemDisplay === STYLE.BLOCK
                ?
                <SubMenu key="system_manage" title={<span className="menu-item-font"><Icon type="medicine-box" /><span>系统管理</span></span>}>
                  <Menu.Item key={ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY} >
                    <span className="menu-item-font">检查项目管理</span>
                  </Menu.Item>
                </SubMenu>
                : null
            }
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, textAlign: 'center' }}>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
            <Icon type="logout" className="logout-icon" onClick={this.handleLogout} />
            <Avatar size="large" src={FILE_SERVER + sessionStorage.getItem(SESSION.AVATAR)} className="avatar-header" style={{ backgroundColor: 'white' }} onClick={this.showProfileEditModal} />
            <ProfileEditModal ref="profileEditForm" visible={this.state.profileEditModalVisible} onCancel={this.closeProfileEditModal} userInfo={this.state.userInfo} />
            <a className='name' onClick={this.showProfileEditModal}>{sessionStorage.getItem(SESSION.NAME)}</a>
            <Tag color={layoutStyle.roleTagColor} style={{ marginLeft: 7, float: 'right', marginTop: 21 }}>{role}</Tag>
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
