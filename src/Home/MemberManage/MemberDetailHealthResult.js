import './MemberManage.css';
import {SERVER, SESSION, RESULT, ROLE, FILE_SERVER, ROUTE, LOADING_DELAY_TIME, DATE_FORMAT, OVERVIEW_PAGE_SIZE, STYLE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import {isEmployee, isAdviser} from './../../App/PublicMethod.js';
import ExamResultDetailItem from './../ExamResultManage/ExamResultDetailItem.js';
import HealthResultDetailItem from './../HealthResultManage/HealthResultDetailItem.js';
import React from 'react';
import MemberDetailOriginResultSearchForm from './MemberDetailOriginResultSearchForm.js';
import ExamResultOverviewSearchForm from './../ExamResultManage/ExamResultOverviewSearchForm.js';
import HealthResultDetailSearchForm from './../HealthResultManage/HealthResultDetailSearchForm.js';
import OriginResultWatchPictureModal from './../OriginResultManage/OriginResultWatchPictureModal.js';
import HealthResultDetailAddModal from './../HealthResultManage/HealthResultDetailAddModal.js';
import MemberInfoTable from './MemberInfoTable.js';
import {message, Button, BackTop, Breadcrumb, Timeline, Anchor, Alert, Spin, Tabs, Table, Tooltip, Card} from 'antd';
import {Link, browserHistory} from 'react-router';
import $ from 'jquery';

const TabPane = Tabs.TabPane;

class MemberDetailHealthResult extends React.Component {

  state = {

    /*
    *健康摘要库
    */
    tableLoading: false,
    overviewData: [],
    healthResultTypeData: []
  };


  //获取memberId用户的所有健康摘要信息
  requestOverviewOfHealthData = () => {

    this.refs.healthResultDetailSearchForm.validateFields((err, values) => {
      if(!err) {

        

        this.setState({tableLoading: true});
        $.ajax({
            url : SERVER + '/api/health/list/' + this.props.params.memberId,
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({status: values.status,
                                   secondId: Number(values.secondId),
                                   beginTime: values.time !== undefined ? formatDate(values.time[0], DATE_FORMAT) : undefined,
                                   endTime: values.time !== undefined ? formatDate(values.time[1], DATE_FORMAT) : undefined}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                
                if(result.code === RESULT.SUCCESS) {

                  this.setState({overviewData: result.content,
                                 tableLoading: false});

                } else {

                  message.error(result.reason, 2);
                  this.setState({tableLoading: false});
                }
            }
        });
      }
    });
  }

  //获取memberId用户的所有检查记录~~~~~~~~~~~~~
  downloadOverview = (secondId) => {

    this.refs.healthResultDetailSearchForm.validateFields((err, values) => {
        if(!err) {

        
        $.ajax({
            url : SERVER + '/api/health/download/' + this.props.params.memberId,
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({status: values.status,
                                   secondId: secondId,
                                   beginTime: values.time !== undefined ? formatDate(values.time[0], DATE_FORMAT) : undefined,
                                   endTime: values.time !== undefined ? formatDate(values.time[1], DATE_FORMAT) : undefined}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                
                if(result.code === RESULT.SUCCESS) {

                  //下载导出的文件
                  window.location.href = FILE_SERVER + result.content;

                } else {

                  message.error(result.reason, 2);
                }
            }
        });
      }
    });
  }

  //拉取健康摘要类别级联数据
  requestHealthResultSecondType = () => {

    
    $.ajax({
        url : SERVER + '/api/health_category/level',
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            
            if(result.code !== RESULT.SUCCESS) {
                message.error(result.reason, 2);
                return;
            }

            //将后端返回的map整理成级联列表识别的数据结构
            let healthResultTypeData = [];
            for(let firstType in result.content) {

              //加入大类
              let firstTypeData = {value: result.content[firstType][0].id, label: firstType};
              healthResultTypeData.push(firstTypeData);
            }

            this.setState({healthResultTypeData: healthResultTypeData});
            if(this.refs.healthResultAddForm == null) return;
            this.refs.healthResultAddForm.setFieldsValue({secondId: healthResultTypeData.length > 0 ? healthResultTypeData[0].value.toString() : "-1" });
        }
    });
  }

  componentDidMount = () => {

    //拉取健康摘要类别、memberId的所有健康摘要数据
    this.requestHealthResultSecondType();
    this.requestOverviewOfHealthData();
  }

  render(){

    const role = sessionStorage.getItem(SESSION.ROLE);


    const overviewColumns = [{
      title: '摘要分类',
      dataIndex: 'secondName',
      key: 'secondName'
    },{
      title: '健康问题',
      dataIndex: 'problem',
      key: 'problem',
      width: '20%'
    },{
      title: '健康摘要',
      dataIndex: 'content',
      key: 'content',
      width: '60%'
    },{
      title: '操作',
      key: 'action',
      render: (record) => <a onClick={() => this.downloadOverview(record.secondId)}>下载</a>
    }];



    return (
      <div>
        <BackTop visibilityHeight="200"/>
        {
          isEmployee(role)
          ?
          <Breadcrumb className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.MEMBER_MANAGE.URL_PREFIX + "/" + ROUTE.MEMBER_MANAGE.MENU_KEY}>会员管理</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={ROUTE.MEMBER_DETAIL.URL_PREFIX + "/" + ROUTE.MEMBER_DETAIL.MENU_KEY + "/" + this.props.params.memberId + "/" + this.props.params.memberName}>{this.props.params.memberName}</Link></Breadcrumb.Item>
            <Breadcrumb.Item>健康摘要库</Breadcrumb.Item>
          </Breadcrumb>
          :
          <Breadcrumb className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.MEMBER_DETAIL.URL_PREFIX + "/" + ROUTE.MEMBER_DETAIL.MENU_KEY + "/" + this.props.params.memberId + "/" + this.props.params.memberName}>个人资料</Link></Breadcrumb.Item>
            <Breadcrumb.Item>健康摘要库</Breadcrumb.Item>
          </Breadcrumb>
        }

        <Tabs defaultActiveKey="1">

          {
            role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN
            || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3
            ?
            <TabPane tab="健康摘要库" key="1">
              <HealthResultDetailSearchForm ref="healthResultDetailSearchForm" requestOverviewOfHealthData={this.requestOverviewOfHealthData} healthResultTypeData={this.state.healthResultTypeData} requestHealthResultDetailOfMember={this.requestOverviewOfHealthData}/>
              <Table columns={overviewColumns} dataSource={this.state.overviewData} 
                loading={this.state.tableLoading} size="small" rowKey='id' style={{marginTop: 20}}/>
            </TabPane>
            :
            null
          }
        </Tabs>

      </div>
    );
  }
}

export default MemberDetailHealthResult;
