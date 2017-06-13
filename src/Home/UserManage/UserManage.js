import './UserManage.css'
import {SERVER, SESSION, RESULT, URL, PAGE_SIZE} from './../../App/PublicConstant.js'
import React from 'react';
import {Tabs, Table, Pagination, message} from 'antd';
import MemberSearchForm from './MemberSearchForm';
import EmployeeSearchForm from './EmployeeSearchForm';
import $ from 'jquery';
const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}

class UserManage extends React.Component {

  state = {

    //会员表格相关
    memberQuery: {name: "", phone: "", role: "全部"},
    memberData: [],
    memberPager: {pageSize: PAGE_SIZE},

    //职员表格相关
    employeeData: [],
    employeePager: {pageSize: PAGE_SIZE}
  };


  changeMemberQuery = (values) => {
    this.setState({
      memberQuery: values
    })
  }

  changeMemberTable = (pager) => {

      let pageNow = pager.current;
      this.setState({
        memberPager: pager
      })

      //拉取第pageNow页数据
      this.handleSearchMemeberList(pageNow, this.state.memberQuery);
  }

  handleSearchMemeberList = (pageNow, values) => {

    let token = sessionStorage.getItem(SESSION.TOKEN);
    $.ajax({
        url : SERVER + '/api/user/member/list',
        type : 'POST',
        contentType: 'application/json',
        data : JSON.stringify({name : values.name,
                               phone : values.phone,
                               role : values.role == "全部" ? "" : values.role,
                               pageNow: pageNow,
                               pageSize: PAGE_SIZE}),
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, token),
        success : (result) => {

            console.log(result);
            if(result.code !== RESULT.SUCCESS) {
                message.error(result.reason, 2);
                return;
            }

            //更新页码
            let pager = {
                total: result.content.rowTotal
            }

            //更新获取到的数据到状态中
            this.setState({
              memberData: result.content.data,
              memberPager: pager
            });
        }
    });
  }

  handleSearchEmpolyeeList = (pageNow, values) => {
    alert(1);
  }


  componentDidMount() {
    //拉取第一页所有会员信息
    this.handleSearchMemeberList(1, this.state.memberQuery);

    //拉取第一页所有职员信息

  }

  render(){

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="#">{text}</a>,
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
      dataIndex: 'adviser',
      key: 'adviser',
    }, {
      title: '所属顾问主管',
      dataIndex: 'adviser_manager',
      key: 'adviserManager',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a href="#">修改</a>
          <span className="ant-divider" />
          <a href="#" className='user-table-delete'>删除</a>
        </span>
      )
    }];

    return (
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="会员管理" key="1">
            <MemberSearchForm handleSearchMemeberList={this.handleSearchMemeberList} changeMemberQuery={this.changeMemberQuery}/>
            <Table className='user-table' columns={columns} dataSource={this.state.memberData} pagination={this.state.memberPager} onChange={this.changeMemberTable} rowKey='id'/>
          </TabPane>
          <TabPane tab="职员管理" key="2">
            <EmployeeSearchForm handleSearchEmployeeList={this.handleSearchEmpolyeeList}/>
            <Table className='user-table' columns={columns} dataSource={this.state.employeeData} pagination={false} rowKey='id'/>
          </TabPane>
        </Tabs>
    );
  }
}

export default UserManage;
