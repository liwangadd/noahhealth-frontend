import './UserManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE} from './../../App/PublicConstant.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, BackTop, Button} from 'antd';
import MemberEditModal from './MemberEditModal.js';
import EmployeeEditModal from './EmployeeEditModal.js';
import EmployeeAddModal from './EmployeeAddModal.js';
import MemberSearchForm from './MemberSearchForm.js';
import EmployeeSearchForm from './EmployeeSearchForm.js';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class UserManage extends React.Component {

  state = {

    //会员相关
    memberData: [],
    memberPager: {pageSize: PAGE_SIZE, total: 0},
    adviserAndManagerData: [],

    memberTableLoading: false,
    memberEditModalVisible: false,
    confirmMemberLoading: false,

    //职员表格相关
    employeeData: [],
    employeePager: {pageSize: PAGE_SIZE, total: 0},
    archiveManagerData: [],
    adviseManagerData:  [],
    adviseManagerEditModalSelectVisible: STYLE.NONE,
    archiveManagerEditModalSelectVisible: STYLE.NONE,

    employeeTableLoading: false,

    //职员编辑对话框
    employeeEditModalVisible: false,
    confirmEmployeeEditModalLoading: false,

    //职员添加对话框
    employeeAddModalVisible: false,
    confirmEmployeeAddModalLoading: false,
    adviseManagerAddModalSelectVisible: STYLE.NONE,
    archiveManagerAddModalSelectVisible: STYLE.NONE,
  };

  //翻页
  changeMemberPager = (pager) =>  this.handleSearchMemberList(pager.current)

  handleSearchMemberList = (pageNow) => {

    this.refs.memberSearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ memberTableLoading: true});

        console.log('拉取第'+ pageNow + "页会员信息", values);

        $.ajax({
            url : SERVER + '/api/user/member/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({name : values.name,
                                   phone : values.phone,
                                   role : values.role === "全部" ? "" : values.role,
                                   pageNow: pageNow,
                                   pageSize: PAGE_SIZE}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code !== RESULT.SUCCESS) {
                    message.error(result.reason, 2);
                    return;
                }

                //更新页码
                const memberPager = this.state.memberPager;
                memberPager.total = result.content.rowTotal;
                memberPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  memberData: result.content.data,
                  memberPager
                });

                this.setState({ memberTableLoading: false});
            }
        });
      }
    });
  }

  //翻页
  changeEmployeePager = (pager) => this.handleSearchEmployeeList(pager.current)

  //查询所有职员
  handleSearchEmployeeList = (pageNow) => {

    this.refs.employeeSearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ employeeTableLoading: true});

        console.log('拉取第'+ pageNow + "页职员信息", values);

        $.ajax({
            url : SERVER + '/api/user/employee/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({name : values.name,
                                   phone : values.phone,
                                   role : values.role === "全部" ? "" : values.role,
                                   pageNow: pageNow,
                                   pageSize: PAGE_SIZE}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code !== RESULT.SUCCESS) {
                    message.error(result.reason, 2);
                    return;
                }

                //更新页码
                const employeePager = this.state.employeePager;
                employeePager.total = result.content.rowTotal;
                employeePager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  employeeData: result.content.data,
                  employeePager
                });

                this.setState({ employeeTableLoading: false});
            }
        });
      }
    });
  }

  //删除会员
  handleDeleteMember(record) {

    console.log('删除会员', record);

    $.ajax({
        url : SERVER + '/api/user/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.handleSearchMemberList(1);

                message.success(result.reason, 2);
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //删除职员
  handleDeleteEmployee(record) {

    console.log('删除职员', record);

    $.ajax({
        url : SERVER + '/api/user/' + record.id,
        type : 'DELETE',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.handleSearchEmployeeList(1);
                message.success(result.reason, 2);
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

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

                let member = result.content;

                if(this.refs.memberEditForm == null) return;
                this.refs.memberEditForm.setFieldsValue({name: member.name,
                                                    role: member.role,
                                                    adviserAndManager: [member.staffMgrId, Number(member.staffId)]});

                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //查询employeeId会员信息显示到对话框内
  requestEmployee = (employeeId) => {

    console.log('查询职员', employeeId);

    $.ajax({
        url : SERVER + '/api/user/' + employeeId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                let employee = result.content;

                if(this.refs.employeeEditForm == null) return;
                this.refs.employeeEditForm.setFieldsValue({name: employee.name,
                                                      role: employee.role});

                //如果角色级别目前为档案部员工 or 顾问部员工 则显示出对应的上级选择器
                if(employee.role === ROLE.EMPLOYEE_ADVISER) this.refs.employeeEditForm.setFieldsValue({adviseManager: employee.staffMgrId});
                else if(employee.role === ROLE.EMPLOYEE_ARCHIVER) this.refs.employeeEditForm.setFieldsValue({archiveManager: employee.staffMgrId});
                this.changeEditModalRole(employee.role);

                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //更换角色(编辑框)
  changeEditModalRole = (role) => {

    //根据 角色级别 决定是否显示 主管选择器
    switch(role) {
      case ROLE.EMPLOYEE_ARCHIVER:this.setState({archiveManagerEditModalSelectVisible : STYLE.BLOCK, adviseManagerEditModalSelectVisible : STYLE.NONE});break;
      case ROLE.EMPLOYEE_ADVISER:this.setState({archiveManagerEditModalSelectVisible : STYLE.NONE, adviseManagerEditModalSelectVisible : STYLE.BLOCK});break;
      default:this.setState({archiveManagerEditModalSelectVisible : STYLE.NONE, adviseManagerEditModalSelectVisible : STYLE.NONE});break;
    }
  }

  //更换角色（添加框）
  changeAddModalRole = (role) => {

    //根据 角色级别 决定是否显示 主管选择器
    switch(role) {
      case ROLE.EMPLOYEE_ARCHIVER:this.setState({archiveManagerAddModalSelectVisible : STYLE.BLOCK, adviseManagerAddModalSelectVisible : STYLE.NONE});break;
      case ROLE.EMPLOYEE_ADVISER:this.setState({archiveManagerAddModalSelectVisible : STYLE.NONE, adviseManagerAddModalSelectVisible : STYLE.BLOCK});break;
      default:this.setState({archiveManagerAddModalSelectVisible : STYLE.NONE, adviseManagerAddModalSelectVisible : STYLE.NONE});break;
    }
  }


  //获取所有顾问、顾问主管填充选择器
  requestAdviserAndAdviseManager = () => {

    console.log('查询所有顾问员工与顾问主管');

    $.ajax({
        url : SERVER + '/api/user/advise/list',
        type : 'GET',
        // async: false,
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //将后端返回的map整理成顾问主管级联列表识别的数据结构
                let adviseAndManagerData = [];
                for(let adviseManager in result.content) {

                  //加入顾问主管
                  let managerData = {value: adviseManager, label: adviseManager + "(主管)", children:[]};

                  //获取旗下所有顾问员工
                  let advisers = result.content[adviseManager];
                  for(let i = 0; i < advisers.length; i++) {
                    managerData.children.push({value: advisers[i].id, label: advisers[i].name + "(员工)"});
                  }

                  adviseAndManagerData.push(managerData);
                }

                //通知对话框更新表单的级联选择器
                this.setState({ adviserAndManagerData: adviseAndManagerData });

                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //获取所有档案部、顾问部主管填充 编辑框、添加框中的选择器
  requestArchiveManagerAndAdviseManager = () => {

    console.log('查询所有档案主管与顾问主管');

    //档案部主管
    $.ajax({
        url : SERVER + '/api/user/manager/list',
        type : 'POST',
        // async: false,
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({manager : ROLE.EMPLOYEE_ARCHIVE_MANAGER}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                this.setState({ archiveManagerData: result.content }); //默认选上第一项

                if(this.refs.employeeEditForm == null) return;
                this.refs.employeeEditForm.setFieldsValue({archiveManager: result.content[0].id.toString()});

                if(this.refs.employeeAddForm == null) return;
                this.refs.employeeAddForm.setFieldsValue({archiveManager: result.content[0].id.toString()});
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });

    //顾问部主管
    $.ajax({
        url : SERVER + '/api/user/manager/list',
        type : 'POST',
        // async: false,
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({manager : ROLE.EMPLOYEE_ADVISE_MANAGER}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                this.setState({ adviseManagerData: result.content }); //默认选上第一项

                if(this.refs.employeeEditForm == null) return;
                this.refs.employeeEditForm.setFieldsValue({adviseManager: result.content[0].id.toString()});

                if(this.refs.employeeAddForm == null) return;
                this.refs.employeeAddForm.setFieldsValue({adviseManager: result.content[0].id.toString()});
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //打开编辑对话框
  showMemberEditModal = (record) => {

    this.setState({memberEditModalVisible: true});

    this.memberId = record.id //保存当前正在编辑的会员用户名方便提交用
    this.requestMember(this.memberId);
  }
  showEmployeeEditModal = (record) => {

    this.setState({ employeeEditModalVisible: true});

    this.employeeId = record.id //保存当前正在编辑的职员用户名方便提交用
    this.requestEmployee(this.employeeId);
  }

  closeMemberEditModal = () => this.setState({ memberEditModalVisible: false })
  closeEmployeeEditModal = () => this.setState({ employeeEditModalVisible: false})

  //确认更新信息
  confirmMemberEditModal = () => {

    //请求修改会员
    this.refs.memberEditForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改会员', values);

        //显示加载圈
        this.setState({ confirmMemberLoading: true });

        $.ajax({
            url : SERVER + '/api/user/' + this.memberId,
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({role: values.role, staffId: values.adviserAndManager[1]}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchMemberList(this.state.memberPager.current);

                //关闭加载圈、对话框
                this.setState({
                  memberEditModalVisible: false,
                  confirmMemberLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmMemberLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  confirmEmployeeEditModal = () => {

    //请求修改职员
    this.refs.employeeEditForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改职员', values);

        //根据角色传递staffMgrId
        let staffMgrId = null;
        if(values.role === ROLE.EMPLOYEE_ADVISER) staffMgrId = Number(values.adviseManager);
        else if(values.role === ROLE.EMPLOYEE_ARCHIVER) staffMgrId = Number(values.archiveManager);

        //显示加载圈
        this.setState({ confirmEmployeeEditModalLoading: true });

        $.ajax({
            url : SERVER + '/api/user/' + this.employeeId,
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({role: values.role, staffMgrId: staffMgrId}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchEmployeeList(this.state.employeePager.current);

                //关闭加载圈、对话框
                this.setState({
                  employeeEditModalVisible: false,
                  confirmEmployeeEditModalLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmEmployeeEditModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  /**
  * 添加职员对话框
  **/
  showEmployeeAddModal = (record) => this.setState({ employeeAddModalVisible: true})

  closeEmployeeAddModal = () => this.setState({ employeeAddModalVisible: false})

  confirmEmployeeAddModal = () => {

    //请求修改职员
    this.refs.employeeAddForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加职员', values);

        //根据角色传递staffMgrId
        let staffMgrId = null;
        if(values.role === ROLE.EMPLOYEE_ADVISER) staffMgrId = Number(values.adviseManager);
        else if(values.role === ROLE.EMPLOYEE_ARCHIVER) staffMgrId = Number(values.archiveManager);

        //显示加载圈
        this.setState({ confirmEmployeeAddModalLoading: true });

        $.ajax({
            url : SERVER + '/api/user',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({name: values.name, phone: values.phone, role: values.role, staffMgrId: staffMgrId}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchEmployeeList(this.state.employeePager.current);

                //关闭加载圈、对话框
                this.setState({
                  employeeAddModalVisible: false,
                  confirmEmployeeAddModalLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmEmployeeAddModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }




  componentDidMount = () => {

    this.handleSearchMemberList(1);

    this.requestAdviserAndAdviseManager(); //拉取所有顾问、顾问主管到 会员修改对话框
    this.requestArchiveManagerAndAdviseManager(); //拉取所有档案主管、顾问主管到 职员修改对话框、职员添加对话框
  }

  //打开职员管理选项卡
  componentDidMountOfEmployeeTab = (form) => {

    if(form == null) return;
    this.refs.employeeSearchForm = form;
    this.handleSearchEmployeeList(1);
  }


  render(){

    //member表头//////////
    const memberColumns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    }, {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '级别',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: '所属顾问',
      dataIndex: 'staffId',
      key: 'staffId',
    }, {
      title: '所属顾问主管',
      dataIndex: 'staffMgrId',
      key: 'staffMgrId',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showMemberEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="请问您确定要删除该会员吗?" onConfirm={() => this.handleDeleteMember(record)} okText="是" cancelText="取消">
            <a className='user-table-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];

    //employee表头//////////
    const employeeColumns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    }, {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '级别',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: '所属主管',
      dataIndex: 'staffMgrId',
      key: 'staffMgrId',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showEmployeeEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="请问您确定要删除该职员吗?" onConfirm={() => this.handleDeleteEmployee(record)} okText="是" cancelText="取消">
            <a className='user-table-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];

    return (
        <div>
          <BackTop visibilityHeight="200"/>
          <Tabs defaultActiveKey="1" tabBarExtraContent={<Button type="primary" onClick={this.showEmployeeAddModal}>添加职员</Button>}>
            <TabPane tab="会员管理" key="1">
              <MemberSearchForm ref="memberSearchForm" handleSearchMemberList={this.handleSearchMemberList}/>
              <Table className='user-table' columns={memberColumns} dataSource={this.state.memberData} pagination={this.state.memberPager} onChange={this.changeMemberPager} rowKey='id' loading={this.state.memberTableLoading}/>
            </TabPane>
            <TabPane tab="职员管理" key="2">
              <EmployeeSearchForm ref={this.componentDidMountOfEmployeeTab} handleSearchEmployeeList={this.handleSearchEmployeeList}/>
              <Table className='user-table' columns={employeeColumns} dataSource={this.state.employeeData} pagination={this.state.employeePager} onChange={this.changeEmployeePager} rowKey='id' loading={this.state.employeeTableLoading}/>
            </TabPane>
          </Tabs>
          <MemberEditModal ref="memberEditForm" visible={this.state.memberEditModalVisible} confirmLoading={this.state.confirmMemberLoading} onCancel={this.closeMemberEditModal} onConfirm={this.confirmMemberEditModal} adviserAndManagerData={this.state.adviserAndManagerData} />
          <EmployeeEditModal ref="employeeEditForm" visible={this.state.employeeEditModalVisible} confirmLoading={this.state.confirmEmployeeEditModalLoading} onCancel={this.closeEmployeeEditModal} onConfirm={this.confirmEmployeeEditModal} adviseManagerData={this.state.adviseManagerData} archiveManagerData={this.state.archiveManagerData} archiveManagerSelectVisible={this.state.archiveManagerEditModalSelectVisible} adviseManagerSelectVisible={this.state.adviseManagerEditModalSelectVisible} changeRole={this.changeEditModalRole}/>
          <EmployeeAddModal ref="employeeAddForm" visible={this.state.employeeAddModalVisible} confirmLoading={this.state.confirmEmployeeAddModalLoading} onCancel={this.closeEmployeeAddModal} onConfirm={this.confirmEmployeeAddModal} adviseManagerData={this.state.adviseManagerData} archiveManagerData={this.state.archiveManagerData} archiveManagerSelectVisible={this.state.archiveManagerAddModalSelectVisible} adviseManagerSelectVisible={this.state.adviseManagerAddModalSelectVisible} changeRole={this.changeAddModalRole}/>
        </div>
    );
  }
}

export default UserManage;
