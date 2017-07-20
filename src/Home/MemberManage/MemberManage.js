import './MemberManage.css';
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, DATE_FORMAT} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import moment from 'moment';
import React from 'react';
import {Tabs, Table, message, Popconfirm, BackTop, Button} from 'antd';
import MemberEditModal from './MemberEditModal.js';
import MemberSearchForm from './MemberSearchForm.js';
import MemberAddModal from './MemberAddModal.js';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class MemberManage extends React.Component {

  state = {

    //会员相关
    memberData: [],
    memberPager: {pageSize: PAGE_SIZE, total: 0},
    adviserAndManagerData: [],

    memberTableLoading: false,
    memberEditModalVisible: false,
    confirmMemberLoading: false,

    //职员添加对话框
    memberAddModalVisible: false,
    confirmMemberAddModalLoading: false
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
            data : JSON.stringify({memberNum: values.memberNum,
                                   name : values.name,
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
                                                         adviserAndManager: [member.staffMgrName, Number(member.staffId)],
                                                         validTime: moment(formatDate(member.valid), DATE_FORMAT)});

                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
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
                if(this.refs.memberAddForm == null) return;
                this.refs.memberAddForm.setFieldsValue({staffId: adviseAndManagerData.length > 0 ? [adviseAndManagerData[0].value, adviseAndManagerData[0].children[0].value] : []});
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

  closeMemberEditModal = () => this.setState({ memberEditModalVisible: false })

  //确认更新信息
  confirmMemberEditModal = () => {

    //请求修改会员
    this.refs.memberEditForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改会员', values);

        //显示加载圈
        this.setState({ confirmMemberLoading: true });

        $.ajax({
            url : SERVER + '/api/user',
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({userId: this.memberId, role: values.role, staffId: values.adviserAndManager[1], valid: values.validTime}),
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


  /**
  * 添加会员对话框
  **/
  showMemberAddModal = (record) => this.setState({ memberAddModalVisible: true})

  closeMemberAddModal = () => this.setState({ memberAddModalVisible: false})

  confirmMemberAddModal = () => {

    //请求修改职员
    this.refs.memberAddForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加会员', values);

        //显示加载圈
        this.setState({ confirmMemberAddModalLoading: true });

        $.ajax({
            url : SERVER + '/api/user',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({name: values.name,
                                   phone: values.phone,
                                   role: values.role,
                                   staffId: values.staffId[1],
                                   valid: values.validYear * 12 + values.validMonth,
                                   memberNum: values.memberNum
                                   }),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchMemberList(this.state.memberPager.current);

                //关闭加载圈、对话框
                this.setState({
                  memberAddModalVisible: false,
                  confirmMemberAddModalLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmMemberAddModalLoading: false });
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
  }

  render(){


    //member表头//////////
    const memberColumns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '会员编号',
      dataIndex: 'memberNum',
      key: 'memberNum'
    }, {
      title: '级别',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: '所属顾问',
      dataIndex: 'staffName',
      key: 'staffName',
    }, {
      title: '所属顾问主管',
      dataIndex: 'staffMgrName',
      key: 'staffMgrName',
    }, {
      title: '有效日期',
      dataIndex: 'valid',
      key: 'valid',
      render: (valid) => formatDate(valid)
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showMemberEditModal(record)}>修改</a>
          {
            sessionStorage.getItem(SESSION.ROLE) === ROLE.EMPLOYEE_ADMIN
            ?
            <span>
              <span className="ant-divider" />
              <Popconfirm title="您确定要删除该会员吗?" onConfirm={() => this.handleDeleteMember(record)}>
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
          <BackTop visibilityHeight="200"/>
          <Tabs defaultActiveKey={"1"}
                tabBarExtraContent={<Button type="primary" onClick={this.showMemberAddModal}>添加会员</Button>}>
            <TabPane tab="会员管理" key="1">
              <MemberSearchForm ref="memberSearchForm" handleSearchMemberList={this.handleSearchMemberList}/>
              <Table className='user-table' columns={memberColumns} dataSource={this.state.memberData} pagination={this.state.memberPager} onChange={this.changeMemberPager} rowKey='id' loading={this.state.memberTableLoading}/>
            </TabPane>
          </Tabs>
          <MemberEditModal ref="memberEditForm" visible={this.state.memberEditModalVisible} confirmLoading={this.state.confirmMemberLoading} onCancel={this.closeMemberEditModal} onConfirm={this.confirmMemberEditModal} adviserAndManagerData={this.state.adviserAndManagerData} />
          <MemberAddModal ref="memberAddForm" visible={this.state.memberAddModalVisible} confirmLoading={this.state.confirmMemberAddModalLoading} onCancel={this.closeMemberAddModal} onConfirm={this.confirmMemberAddModal}  adviserAndManagerData={this.state.adviserAndManagerData}/>
        </div>
    );
  }
}

export default MemberManage;
