import './EmployeeManage.css'
import { SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, ROUTE } from './../../App/PublicConstant.js'
import React from 'react';
import { isRoleHasChildren } from './../../App/PublicMethod.js';
import { Tabs, Table, message, Popconfirm, BackTop, Button } from 'antd';
import EmployeeEditModal from './EmployeeEditModal.js';
import EmployeeAddModal from './EmployeeAddModal.js';
import EmployeeSearchForm from './EmployeeSearchForm.js';
import { Link } from 'react-router';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class EmployeeManage extends React.Component {

  state = {

    //职员表格相关
    employeeData: [],
    employeePager: { pageSize: PAGE_SIZE, total: 0 },
    archiveManagerData: [],
    adviseManagerData: [],
    adviseManagerEditModalSelectVisible: STYLE.NONE,
    archiveManagerEditModalSelectVisible: STYLE.NONE,

    employeeTableLoading: false,

    //职员编辑对话框
    employeeEditModalVisible: false,
    confirmEmployeeEditModalLoading: false,

    //职员添加对话框
    employeeAddBtnVisible: STYLE.BLOCK,
    employeeAddModalVisible: false,
    confirmEmployeeAddModalLoading: false,
    adviseManagerAddModalSelectVisible: STYLE.NONE,
    archiveManagerAddModalSelectVisible: STYLE.NONE,
  };

  //翻页
  changeEmployeePager = (pager) => this.handleSearchEmployeeList(pager.current)

  //查询所有职员
  handleSearchEmployeeList = (pageNow) => {

    this.refs.employeeSearchForm.validateFields((err, values) => {
      if (!err) {

        this.setState({ employeeTableLoading: true });

        

        $.ajax({
          url: SERVER + '/api/user/employee/list',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            name: values.name,
            memberNum: values.memberNum,
            role: values.role === "全部" ? "" : values.role,
            pageNow: pageNow,
            pageSize: PAGE_SIZE
          }),
          dataType: 'json',
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success: (result) => {

            
            if (result.code !== RESULT.SUCCESS) {
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

            this.setState({ employeeTableLoading: false });
          }
        });
      }
    });
  }

  //删除职员
  handleDeleteEmployee(record) {

    

    $.ajax({
      url: SERVER + '/api/user/' + record.id,
      type: 'DELETE',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        
        if (result.code === RESULT.SUCCESS) {

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

  //查询employeeId会员信息显示到对话框内
  requestEmployee = (employeeId) => {

    

    $.ajax({
      url: SERVER + '/api/user/' + employeeId,
      type: 'GET',
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        
        if (result.code === RESULT.SUCCESS) {

          let employee = result.content;

          if (this.refs.employeeEditForm == null) return;
          this.refs.employeeEditForm.setFieldsValue({
            name: employee.name,
            role: employee.role
          });

          //如果角色级别目前为档案部员工 or 顾问部员工 则显示出对应的上级选择器
          if (employee.role === ROLE.EMPLOYEE_ADVISER) this.refs.employeeEditForm.setFieldsValue({ adviseManager: employee.staffMgrId.toString() });
          else if (employee.role === ROLE.EMPLOYEE_ARCHIVER) this.refs.employeeEditForm.setFieldsValue({ archiveManager: employee.staffMgrId.toString() });
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
    switch (role) {
      case ROLE.EMPLOYEE_ARCHIVER: this.setState({ archiveManagerEditModalSelectVisible: STYLE.BLOCK, adviseManagerEditModalSelectVisible: STYLE.NONE }); break;
      case ROLE.EMPLOYEE_ADVISER: this.setState({ archiveManagerEditModalSelectVisible: STYLE.NONE, adviseManagerEditModalSelectVisible: STYLE.BLOCK }); break;
      default: this.setState({ archiveManagerEditModalSelectVisible: STYLE.NONE, adviseManagerEditModalSelectVisible: STYLE.NONE }); break;
    }
  }

  //更换角色（添加框）
  changeAddModalRole = (role) => {

    //根据 角色级别 决定是否显示 主管选择器
    switch (role) {
      case ROLE.EMPLOYEE_ARCHIVER: this.setState({ archiveManagerAddModalSelectVisible: STYLE.BLOCK, adviseManagerAddModalSelectVisible: STYLE.NONE }); break;
      case ROLE.EMPLOYEE_ADVISER: this.setState({ archiveManagerAddModalSelectVisible: STYLE.NONE, adviseManagerAddModalSelectVisible: STYLE.BLOCK }); break;
      default: this.setState({ archiveManagerAddModalSelectVisible: STYLE.NONE, adviseManagerAddModalSelectVisible: STYLE.NONE }); break;
    }
  }

  //获取所有档案部、顾问部主管填充 编辑框、添加框中的选择器
  requestArchiveManagerAndAdviseManager = () => {

    

    //档案部主管
    $.ajax({
      url: SERVER + '/api/user/manager/list',
      type: 'POST',
      // async: false,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ manager: ROLE.EMPLOYEE_ARCHIVE_MANAGER }),
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        
        if (result.code === RESULT.SUCCESS) {

          this.setState({ archiveManagerData: result.content }); //默认选上第一项

          if (this.refs.employeeEditForm == null) return;
          this.refs.employeeEditForm.setFieldsValue({ archiveManager: result.content[0].id.toString() });

          if (this.refs.employeeAddForm == null) return;
          this.refs.employeeAddForm.setFieldsValue({ archiveManager: result.content[0].id.toString() });
          return;
        } else {
          message.error(result.reason, 2);
          return;
        }
      }
    });

    //顾问部主管
    $.ajax({
      url: SERVER + '/api/user/manager/list',
      type: 'POST',
      // async: false,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ manager: ROLE.EMPLOYEE_ADVISE_MANAGER }),
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        
        if (result.code === RESULT.SUCCESS) {

          this.setState({ adviseManagerData: result.content }); //默认选上第一项

          if (this.refs.employeeEditForm == null) return;
          this.refs.employeeEditForm.setFieldsValue({ adviseManager: result.content[0].id.toString() });

          if (this.refs.employeeAddForm == null) return;
          this.refs.employeeAddForm.setFieldsValue({ adviseManager: result.content[0].id.toString() });
          return;
        } else {
          message.error(result.reason, 2);
          return;
        }
      }
    });
  }

  //打开编辑对话框
  showEmployeeEditModal = (record) => {

    this.setState({ employeeEditModalVisible: true });

    this.employeeId = record.id //保存当前正在编辑的职员用户名方便提交用
    this.requestEmployee(this.employeeId);
  }

  closeEmployeeEditModal = () => this.setState({ employeeEditModalVisible: false })

  confirmEmployeeEditModal = () => {

    //请求修改职员
    this.refs.employeeEditForm.validateFields((err, values) => {
      if (!err) {
        

        //根据角色传递staffMgrId
        let staffMgrId = null;
        if (values.role === ROLE.EMPLOYEE_ADVISER) staffMgrId = Number(values.adviseManager);
        else if (values.role === ROLE.EMPLOYEE_ARCHIVER) staffMgrId = Number(values.archiveManager);

        //显示加载圈
        this.setState({ confirmEmployeeEditModalLoading: true });

        $.ajax({
          url: SERVER + '/api/user',
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({ userId: this.employeeId, role: values.role, staffMgrId: staffMgrId }),
          dataType: 'json',
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success: (result) => {
            
            if (result.code === RESULT.SUCCESS) {

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
  showEmployeeAddModal = (record) => this.setState({ employeeAddModalVisible: true })

  closeEmployeeAddModal = () => this.setState({ employeeAddModalVisible: false })

  confirmEmployeeAddModal = () => {

    //请求修改职员
    this.refs.employeeAddForm.validateFields((err, values) => {
      if (!err) {
        

        //根据角色传递staffMgrId
        let staffMgrId = null;
        const role = sessionStorage.getItem(SESSION.ROLE);

        //先判断是管理员 or 主管在添加职员？
        if (role === ROLE.EMPLOYEE_ADMIN) {

          if (values.role === ROLE.EMPLOYEE_ADVISER) staffMgrId = Number(values.adviseManager);
          else if (values.role === ROLE.EMPLOYEE_ARCHIVER) staffMgrId = Number(values.archiveManager);

        } else if (role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ARCHIVE_MANAGER) {

          staffMgrId = Number(sessionStorage.getItem(SESSION.USER_ID));
        }

        //显示加载圈
        this.setState({ confirmEmployeeAddModalLoading: true });

        $.ajax({
          url: SERVER + '/api/user',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ name: values.name, phone: values.phone, role: values.role, staffMgrId: staffMgrId }),
          dataType: 'json',
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success: (result) => {
            
            if (result.code === RESULT.SUCCESS) {

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

    this.handleSearchEmployeeList(1);
    this.requestArchiveManagerAndAdviseManager(); //拉取所有档案主管、顾问主管到 职员修改对话框、职员添加对话框
  }

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    //employee表头//////////
    const employeeColumns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '级别',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: '所属主管',
      dataIndex: 'staffMgrName',
      key: 'staffMgrName',
      render: (staffMgrName) => staffMgrName === null ? '/' : staffMgrName
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          {
            isRoleHasChildren(record.role)
              ?
              <span>
                <Link to={ROUTE.EMPLOYEE_DETAIL.URL_PREFIX + "/" + ROUTE.EMPLOYEE_DETAIL.MENU_KEY + "/" + record.id + "/" + record.name + "/" + record.role}>查看</Link>
                <span className="ant-divider" />
              </span>
              :
              null
          }
          <a onClick={() => this.showEmployeeEditModal(record)}>修改</a>
          {
            role === ROLE.EMPLOYEE_ADMIN
              ?
              <span>
                <span className="ant-divider" />
                <Popconfirm title="您确定要删除该职员吗?" onConfirm={() => this.handleDeleteEmployee(record)}>
                  <a className='user-table-delete'>删除</a>
                </Popconfirm>
              </span>
              :
              null
          }
        </span>
      )
    }];

    return (
      <div>
        <BackTop visibilityHeight="200" />
        <Tabs defaultActiveKey={"1"}
          tabBarExtraContent={<Button type="primary" onClick={this.showEmployeeAddModal}>添加职员</Button>}>
          <TabPane tab="职员管理" key="1">
            <EmployeeSearchForm ref="employeeSearchForm" handleSearchEmployeeList={this.handleSearchEmployeeList} />
            <Table className='user-table' columns={employeeColumns} dataSource={this.state.employeeData} pagination={this.state.employeePager} onChange={this.changeEmployeePager} rowKey='id' loading={this.state.employeeTableLoading} />
          </TabPane>
        </Tabs>
        <EmployeeEditModal ref="employeeEditForm" visible={this.state.employeeEditModalVisible} confirmLoading={this.state.confirmEmployeeEditModalLoading} onCancel={this.closeEmployeeEditModal} onConfirm={this.confirmEmployeeEditModal} adviseManagerData={this.state.adviseManagerData} archiveManagerData={this.state.archiveManagerData} archiveManagerSelectVisible={this.state.archiveManagerEditModalSelectVisible} adviseManagerSelectVisible={this.state.adviseManagerEditModalSelectVisible} changeRole={this.changeEditModalRole} />
        <EmployeeAddModal ref="employeeAddForm" visible={this.state.employeeAddModalVisible} confirmLoading={this.state.confirmEmployeeAddModalLoading} onCancel={this.closeEmployeeAddModal} onConfirm={this.confirmEmployeeAddModal} adviseManagerData={this.state.adviseManagerData} archiveManagerData={this.state.archiveManagerData} archiveManagerSelectVisible={this.state.archiveManagerAddModalSelectVisible} adviseManagerSelectVisible={this.state.adviseManagerAddModalSelectVisible} changeRole={this.changeAddModalRole} />
      </div>
    );
  }
}

export default EmployeeManage;
