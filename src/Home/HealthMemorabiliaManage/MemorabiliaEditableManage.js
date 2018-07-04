import './MemorabiliaManage.css';
import { SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, DATE_FORMAT, ROUTE } from './../../App/PublicConstant.js';
import { formatDate } from './../../App/PublicUtil.js';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { Tabs, Table, message, Popconfirm, BackTop, Button } from 'antd';
import MemorabiliaEditModal from './MemorabiliaEditModal.js';
import MemorabiliaAddModel from './MemorabiliaAddModel.js';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class MemorabiliaEditableManage extends React.Component {

  state = {

    //会员相关
    memorabiliaData: [],
    memberPager: { pageSize: PAGE_SIZE, total: 0 },
    adviserAndManagerData: [],

    memberUnderEmployeeData: [],

    memberTableLoading: false,
    memorabiliaEditModalVisible: false,
    confirmMemorabiliaLoading: false,

    //职员添加对话框
    AddModalVisible: false,
    confirmAddModalLoading: false
  };

  //翻页
  changeMemorabiliaPager = (pager) => this.handleSearchMemorabiliaList(pager.current)

  handleSearchMemorabiliaList = (pageNow) => {
    this.setState({ memberTableLoading: true });
    $.ajax({
      url: SERVER + '/api/memorabilia/list',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        pageNow: pageNow,
        pageSize: PAGE_SIZE
      }),
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {
        console.log(result)

        if (result.code !== RESULT.SUCCESS) {
          message.error(result.reason, 2);
          return;
        }

        //更新页码
        const memberPager = this.state.memberPager;
        memberPager.total = result.content.rowTotal;
        memberPager.current = pageNow;

        //更新获取到的数据到状态中
        this.setState({
          memorabiliaData: result.content.data,
          memberPager
        });

        this.setState({ memberTableLoading: false });
      }
    });
  }

  //删除会员
  handleDeleteMemorabilia(record) {

    $.ajax({
      url: SERVER + '/api/memorabilia/' + record.id,
      type: 'DELETE',
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {
        if (result.code === RESULT.SUCCESS) {

          //删除后重查一遍
          this.handleSearchMemorabiliaList(1);

          message.success(result.reason, 2);
          return;
        } else {
          message.error(result.reason, 2);
          return;
        }
      }
    });
  }

  //打开编辑对话框
  showMemorabiliaEditModal = (record) => {

    this.setState({ memorabiliaEditModalVisible: true });

    this.memorabiliaId = record.id //保存当前正在编辑的会员用户名方便提交用
    this.refs.memorabiliaEditForm.setFieldsValue({
      userName: record.userName,
      memberNum: record.memberNum,
      title: record.title,
      content: record.content,
      time: moment(formatDate(record.uploadTime), 'YYYY-MM-DD')
    });
  }

  closeMemorabiliaEditModal = () => this.setState({ memorabiliaEditModalVisible: false })

  //确认更新信息
  confirmMemorabiliaEditModal = () => {

    //请求修改会员
    this.refs.memorabiliaEditForm.validateFields((err, values) => {
      if (!err) {


        //显示加载圈
        this.setState({ confirmMemorabiliaLoading: true });

        $.ajax({
          url: SERVER + '/api/memorabilia',
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({ memorabiliaId: this.memorabiliaId, title: values.title, content: values.content, time: formatDate(values.time) }),
          dataType: 'json',
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success: (result) => {

            if (result.code === RESULT.SUCCESS) {

              //重查刷新一遍
              this.handleSearchMemorabiliaList(this.state.memberPager.current);

              //关闭加载圈、对话框
              this.setState({
                memorabiliaEditModalVisible: false,
                confirmMemorabiliaLoading: false,
              });
              message.success(result.reason, 2);
            } else {

              //关闭加载圈
              this.setState({ confirmMemorabiliaLoading: false });
              message.error(result.reason, 2);
            }
          }
        });
      }
    });
  }


  /**
  * 添加健康大事记对话框
  **/
  showAddModal = () => this.setState({ addModalVisible: true })
  closeAddModal = () => this.setState({ addModalVisible: false })

  confirmAddModal = () => {

    this.refs.addModalForm.validateFields((err, values) => {
      if (!err) {


        //显示加载圈
        this.setState({ confirmAddModalLoading: true });

        $.ajax({
          url: SERVER + '/api/memorabilia',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            userId: Number(values.userId),
            title: values.title,
            content: values.content,
            time: formatDate(values.time),
          }),
          dataType: 'json',
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success: (result) => {

            if (result.code === RESULT.SUCCESS) {

              //重查刷新一遍
              this.handleSearchMemorabiliaList(this.state.memberPager.current);

              //关闭加载圈、对话框
              this.setState({
                addModalVisible: false,
                confirmAddModalLoading: false,
              });
              message.success(result.reason, 2);
            } else {

              //关闭加载圈
              this.setState({ confirmAddModalLoading: false });
              message.error(result.reason, 2);
            }
          }
        });
      }
    });
  }

  requestMembersUnderEmployee = () => {


    $.ajax({
      url: SERVER + '/api/user/member_under_employee',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ type: '电子资料库' }),
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {


        if (result.code !== RESULT.SUCCESS) {
          message.error(result.reason, 2);
          return;
        }

        //更新获取到的数据到状态中
        const memberUnderEmployeeData = result.content;
        this.setState({ memberUnderEmployeeData: memberUnderEmployeeData });
        if (this.refs.addModalForm == null) return;
        this.refs.addModalForm.setFieldsValue({
          userId: memberUnderEmployeeData.length > 0 ? memberUnderEmployeeData[0].id.toString() : '',
          memberNum: memberUnderEmployeeData.length > 0 ? memberUnderEmployeeData[0].memberNum : ''
        });
      }
    });
  }

  componentDidMount = () => {

    this.requestMembersUnderEmployee(); //拉取上传对话框中的会员信息(该employee旗下的)
    this.handleSearchMemorabiliaList(1); //拉取所有健康大事件信息
  }

  render() {
    let role = sessionStorage.getItem(SESSION.ROLE);
    //member表头//////////
    const memberColumns = [{
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: '5%'
    }, {
      title: '会员编号',
      dataIndex: 'memberNum',
      key: 'memberNum',
      width: '5%',
      render: (memberNum) => memberNum === null || memberNum === '' ? '/' : memberNum
    },{
      title: '标题',
      dataIndex: 'title',
      width: '20%',
      key: 'title'
    }, {
      title: '健康大事记',
      dataIndex: 'content',
      key: 'content',
      width: '40%'
    }, {
      title: '上传日期',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: '10%',
      render: (uploadTime) => formatDate(uploadTime)
    }, {
      title: '上传者',
      dataIndex: 'uploaderName',
      key: 'uploaderName',
      width: '10%',
    },{
      title: '操作',
      key: 'action',
      width: '20%',
      render: (record) => (
        <span>
          <a onClick={() => this.showMemorabiliaEditModal(record)}>修改</a>
          {
            sessionStorage.getItem(SESSION.ROLE) === ROLE.EMPLOYEE_ADMIN
              ?
              <span>
                <span className="ant-divider" />
                <Popconfirm title="您确定要删除该会员吗?" onConfirm={() => this.handleDeleteMemorabilia(record)}>
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
          tabBarExtraContent={role === ROLE.EMPLOYEE_ADMIN ? <Button type="primary" onClick={this.showAddModal}>添加健康大事记</Button> : null}>
          <TabPane tab="健康大事记" key="1">
            <Table className='user-table' columns={memberColumns} dataSource={this.state.memorabiliaData} pagination={this.state.memberPager} onChange={this.changeMemorabiliaPager}
              rowKey='id' loading={this.state.memberTableLoading} />
          </TabPane>
        </Tabs>
        <MemorabiliaEditModal ref="memorabiliaEditForm" visible={this.state.memorabiliaEditModalVisible} confirmLoading={this.state.confirmMemorabiliaLoading} onCancel={this.closeMemorabiliaEditModal}
          onConfirm={this.confirmMemorabiliaEditModal} />
        <MemorabiliaAddModel ref="addModalForm" visible={this.state.addModalVisible} confirmLoading={this.state.confirmAddModalLoading} onCancel={this.closeAddModal}
          onConfirm={this.confirmAddModal} memberUnderEmployeeData={this.state.memberUnderEmployeeData} />
      </div>
    );
  }
}

export default MemorabiliaEditableManage;
