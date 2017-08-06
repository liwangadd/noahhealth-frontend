import './ExamResultManage.css';
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROUTE, ROLE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import ExamResultOfMemberSearchForm from './ExamResultOfMemberSearchForm.js';
import ExamResultOfWorkflowSearchForm from './ExamResultOfWorkflowSearchForm.js';
import React from 'react';
import {Tabs, Table, message, BackTop, Tooltip, Popconfirm} from 'antd';
import {Link} from 'react-router';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class ExamResultManage extends React.Component {

  state = {

    //用户表（顾问部）
    examResultOfMemberData: [],
    examResultOfMemberTableLoading: false,
    examResultOfMemberPager: {pageSize: PAGE_SIZE, total: 0},

    //工作流表（档案部）
    examResultOfWorkflowData: [],
    examResultOfWorkflowTableLoading: false,
    examResultOfWorkflowPager: {pageSize: PAGE_SIZE, total: 0}
  };

  //查用户表（顾问、顾问主管）
  handleSearchExamResultOfMemberList = (pageNow) => {

    this.refs.memberSearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ examResultOfMemberTableLoading: true});

        console.log('拉取第'+ pageNow + "页化验/医技目录", values);

        $.ajax({
            url : SERVER + '/api/input/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({userName : values.userName,
                                   memberNum: values.memberNum,
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
                const examResultOfMemberPager = this.state.examResultOfMemberPager;
                examResultOfMemberPager.total = result.content.rowTotal;
                examResultOfMemberPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  examResultOfMemberTableLoading: false,
                  examResultOfMemberData: result.content.data,
                  examResultOfMemberPager
                });
            }
        });
      }
    });
  }

  //翻页
  changeExamResultOfMemberPager = (pager) =>  this.handleSearchExamResultOfMemberList(pager.current)


  //查工作流（档案部）
  handleSearchExamResultOfWorkflowList = (pageNow) => {

    this.refs.workflowSearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ examResultOfWorkflowTableLoading: true});

        console.log('拉取第'+ pageNow + "页化验/医技目录", values);

        $.ajax({
            url : SERVER + '/api/input/list_by_arc',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({userName : values.userName,
                                   memberNum: values.memberNum,
                                   uploaderName : values.uploaderName,
                                   checkerName: values.checkerName,
                                   status: values.status,
                                   beginTime: values.time !== undefined ? values.time[0] : undefined,
                                   endTime: values.time !== undefined ? values.time[1] : undefined,
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
                const examResultOfWorkflowPager = this.state.examResultOfWorkflowPager;
                examResultOfWorkflowPager.total = result.content.rowTotal;
                examResultOfWorkflowPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  examResultOfWorkflowTableLoading: false,
                  examResultOfWorkflowData: result.content.data,
                  examResultOfWorkflowPager
                });
            }
        });
      }
    });
  }

  //翻页
  changeExamResultOfWorkflowPager = (pager) =>  this.handleSearchExamResultOfWorkflowList(pager.current)

  componentDidMount = () => {

    const role = sessionStorage.getItem(SESSION.ROLE);
    if(role === ROLE.EMPLOYEE_ARCHIVE_MANAGER ||  role === ROLE.EMPLOYEE_ARCHIVER) {
      this.handleSearchExamResultOfWorkflowList(1);
    }
    else if(role === ROLE.EMPLOYEE_ADVISE_MANAGER ||  role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADMIN)
      this.handleSearchExamResultOfMemberList(1);

  }

  render(){


    const role = sessionStorage.getItem(SESSION.ROLE);

    const examResultOfWorkflowColumns = [{
      title: '会员姓名',
      dataIndex: 'userName',
      key: 'userName'
    },{
      title: '会员编号',
      dataIndex: 'memberNum',
      key: 'memberNum'
    },{
      title: '检查亚类',
      dataIndex: 'secondName',
      key: 'secondName'
    },{
      title: '检查医院',
      dataIndex: 'hospital',
      key: 'hospital'
    },{
      title: '检查日期',
      dataIndex: 'time',
      key: 'time',
      render: (time) => formatDate(time)
    },{
      title: '上传者',
      dataIndex: 'uploaderName',
      key: 'uploaderName'
    },{
      title: '上传日期',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      render: (uploadTime) => formatDate(uploadTime)
    },{
      title: '审核者',
      dataIndex: 'checkerName',
      key: 'checkerName'
    }, {
      title: '执行状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {

        if(status === '未通过')
          return <Tooltip title={record.reason}><span className="unpass">未通过</span></Tooltip>;
        else if(status === '已通过')
          return <span className="pass">已通过</span>;
        else
          return status;
      }
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a href="#">查看</a>
          {
            role === ROLE.EMPLOYEE_ADMIN
            ?
            <div>
              <span className="ant-divider"/>
              <Popconfirm title="您确定要删除该条检查记录吗?" onConfirm={() => this.handleDeleteOriginResult(record.id)}>
                <a className='operation-delete'>删除</a>
              </Popconfirm>
            </div>
            :
            null
          }
        </span>
      )
    }];



    const examResultOfMemberColumns = [{
      title: '会员姓名',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '会员编号',
      dataIndex: 'memberNum',
      key: 'memberNum'
    },{
      title: '所属顾问',
      dataIndex: 'staffName',
      key: 'staffName'
    },{
      title: '所属顾问主管',
      dataIndex: 'staffMgrName',
      key: 'staffMgrName'
    },{
      title: '级别',
      dataIndex: 'role',
      key: 'role'
    },{
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <Link to={ROUTE.EXAM_RESULT_DETAIL.URL_PREFIX + "/" + ROUTE.EXAM_RESULT_DETAIL.MENU_KEY + "/" + record.id + "/" + record.name}>查看详情</Link>
        </span>
      )
    }];

    return (
      <div>
        <BackTop visibilityHeight="200"/>
        <Tabs defaultActiveKey={"1"}>
          <TabPane tab="辅检数据库" key="1">
            {
              role === ROLE.EMPLOYEE_ARCHIVE_MANAGER ||  role === ROLE.EMPLOYEE_ARCHIVER
              ?
              <div>
                <ExamResultOfWorkflowSearchForm ref="workflowSearchForm" handleSearchExamResultOfWorkflowList={this.handleSearchExamResultOfWorkflowList}/>
                <Table className='exam-result-table' columns={examResultOfWorkflowColumns} dataSource={this.state.examResultOfWorkflowData} rowKey='id' loading={this.state.examResultOfWorkflowTableLoading} pagination={this.state.examResultOfWorkflowPager} onChange={this.changeExamResultOfWorkflowPager}/>
              </div>
              :
              null
            }
            {
              role === ROLE.EMPLOYEE_ADVISE_MANAGER ||  role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADMIN
              ?
              <div>
                <ExamResultOfMemberSearchForm ref="memberSearchForm" handleSearchExamResultOfMemberList={this.handleSearchExamResultOfMemberList}/>
                <Table className='exam-result-table' columns={examResultOfMemberColumns} dataSource={this.state.examResultOfMemberData} rowKey='id' loading={this.state.examResultOfMemberTableLoading} pagination={this.state.examResultOfMemberPager} onChange={this.changeExamResultOfMemberPager}/>
              </div>
              :
              null
            }
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ExamResultManage;
