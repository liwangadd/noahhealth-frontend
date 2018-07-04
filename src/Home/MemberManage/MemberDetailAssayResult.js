import './MemberManage.css';
import {SERVER, SESSION, RESULT, ROLE, FILE_SERVER, ROUTE, LOADING_DELAY_TIME, DATE_FORMAT, OVERVIEW_PAGE_SIZE, STYLE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import {isEmployee, isAdviser} from './../../App/PublicMethod.js';
import ExamResultDetailItem from './../ExamResultManage/ExamResultDetailItem.js';
import HealthResultDetailItem from './../HealthResultManage/HealthResultDetailItem.js';
import React from 'react';
import MemberDetailOriginResultSearchForm from './MemberDetailOriginResultSearchForm.js';
import ExamResultOverviewSearchForm from './../ExamResultManage/ExamResultOverviewSearchForm.js';
import ExamResultOverviewOfAssay from './../ExamResultManage/ExamResultOverviewOfAssay.js';
import HealthResultDetailSearchForm from './../HealthResultManage/HealthResultDetailSearchForm.js';
import OriginResultWatchPictureModal from './../OriginResultManage/OriginResultWatchPictureModal.js';
import HealthResultDetailAddModal from './../HealthResultManage/HealthResultDetailAddModal.js';
import MemberInfoTable from './MemberInfoTable.js';
import {message, Button, BackTop, Breadcrumb, Timeline, Anchor, Alert, Spin, Tabs, Table, Tooltip, Card} from 'antd';
import {Link, browserHistory} from 'react-router';
import $ from 'jquery';

const TabPane = Tabs.TabPane;

class MemberDetailAssayResult extends React.Component {

  state = {

    /*
    *辅检数据库
    */
    examResultPageLoading: true,

    secondCategoryParentOfAssayData: [],
    secondCategoryParentOfTechData: [],

    type: '化验',
    examResultOverviewOfAssayData: [],
    examResultOverviews:null

  };

  /* 化验/医技检查记录
  **
  */

  //获取memberId用户的所有检查记录~~~~~~~~~~~~~
  requestExamResultOfAssayData = (type, pageNow) => {

    this.refs.examResultOfAssaySearchForm.validateFields((err, values) => {
      if(!err) {

        

        this.setState({examResultPageLoading: true});
        $.ajax({
            url : SERVER + '/api/input/list_page/' + this.props.params.memberId,
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({type : type,
                                   secondId: values.secondId[1],
                                   beginTime: values.time !== undefined ? formatDate(values.time[0], DATE_FORMAT) : undefined,
                                   endTime: values.time !== undefined ? formatDate(values.time[1], DATE_FORMAT) : undefined,
                                   pageNow: pageNow,
                                   pageSize: OVERVIEW_PAGE_SIZE}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                
                if(result.code === RESULT.SUCCESS) {

                  const role = sessionStorage.getItem(SESSION.ROLE);
                  const examResultOverviews = result.content.length <= 0
                                              ?
                                                <Alert
                                                message="暂无相关检查记录"
                                                description=" "
                                                type="info"
                                                showIcon
                                                />
                                              :
                                              result.content.map((overview, index) => <ExamResultOverviewOfAssay
                                                                                                          overview={overview}
                                                                                                          type={type}
                                                                                                          tableIndex={index}
                                                                                                          key={index}
                                                                                                          changeExamResultOverviewOfAssayTablePager={this.changeExamResultOverviewOfAssayTablePager}
                                                                                                          onDownload={this.downloadOverview}
                                                                                                          downloadLoading={this.state.downloadLoading}/>);

                  this.setState({examResultOverviewOfAssayData: result.content,
                                 examResultOverviews: examResultOverviews,
                                 examResultPageLoading: false});

                } else {

                  message.error(result.reason, 2);
                  this.setState({examResultPageLoading: false});
                }
            }
        });
      }
    });
  }


  //获取memberId用户的所有检查记录~~~~~~~~~~~~~
  changeExamResultOverviewOfAssayTablePager = (type, secondId, pageNow, tableIndex) => {

      this.refs.examResultOfAssaySearchForm.validateFields((err, values) => {
        if(!err) {
        
        this.setState({examResultPageLoading: true});
        $.ajax({
            url : SERVER + '/api/input/list_page/' + this.props.params.memberId,
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({type : type,
                                   secondId: secondId,
                                   beginTime: values.time !== undefined ? formatDate(values.time[0], DATE_FORMAT) : undefined,
                                   endTime: values.time !== undefined ? formatDate(values.time[1], DATE_FORMAT) : undefined,
                                   pageNow: pageNow,
                                   pageSize: OVERVIEW_PAGE_SIZE}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                
                if(result.code === RESULT.SUCCESS) {


                  const {examResultOverviewOfAssayData, examResultOverviews} = this.state;

                  if(result.content.length <= 0) {
                    return;
                  }


                  examResultOverviewOfAssayData[tableIndex] = result.content[0];
                  const examResultOverview = <ExamResultOverviewOfAssay
                                                                    overview={result.content[0]}
                                                                    type={type}
                                                                    tableIndex={tableIndex}
                                                                    key={tableIndex}
                                                                    changeExamResultOverviewOfAssayTablePager={this.changeExamResultOverviewOfAssayTablePager}
                                                                    onDownload={this.downloadOverview} />;

                  examResultOverviews[tableIndex] = examResultOverview;

                  this.setState({examResultOverviewOfAssayData: examResultOverviewOfAssayData,
                                 examResultPageLoading: false});

                } else {

                  message.error(result.reason, 2);
                  this.setState({examResultPageLoading: false});
                }
            }
        });
      }
    });
  }

  //获取memberId用户的所有检查记录~~~~~~~~~~~~~
  downloadOverview = (type, secondId, tableIndex) => {

    this.refs.examResultOfAssaySearchForm.validateFields((err, values) => {
      if(!err) {
        
        $.ajax({
            url : SERVER + '/api/input/download/' + this.props.params.memberId,
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({type : type,
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


  //拉取系统中所有检查亚类
  requestSecondCategoryParentData = (type) => {

    
    $.ajax({
        url : SERVER + '/api/first/level',
        type : 'POST',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({type : type}),
        // async: false,
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            
            if(result.code === RESULT.SUCCESS) {

                //将后端返回的map整理成级联列表识别的数据结构
                let secondCategoryParentData = [];
                for(let firstCategory in result.content) {

                  //加入大类
                  let firstCategoryData = {value: firstCategory, label: firstCategory, children:[]};

                  //获取旗下所有亚类
                  let secondCategories = result.content[firstCategory];
                  for(let i = 0; i < secondCategories.length; i++) {
                    firstCategoryData.children.push({value: secondCategories[i].id, label: secondCategories[i].name});
                  }

                  secondCategoryParentData.push(firstCategoryData);
                }

                if(type === "化验") {
                  
                  this.setState({secondCategoryParentOfAssayData: secondCategoryParentData});
                } else {
                  this.setState({secondCategoryParentOfTechData: secondCategoryParentData});
                }
            } else {
                message.error(result.reason, 2);
            }
        }
    });
  }

  componentDidMount = () => {

    //拉取所有化验、医技类到搜索框
    this.requestSecondCategoryParentData('化验');
    this.requestExamResultOfAssayData('化验', 1);
  }

  render(){

    const role = sessionStorage.getItem(SESSION.ROLE);


    //拆分examResultDetailData
    //1.组装成卡片+表格条目
    //2.组装成锚点目录
    
    const examResultOverviewOfAssayAnchors = this.state.examResultOverviewOfAssayData.map((overview, index) => <Anchor.Link href={"#" + overview.secondId.toString()} key={index} title={overview.secondName} />);

    return (
      <Spin spinning={this.state.examResultPageLoading}>
        <BackTop visibilityHeight="200"/>
        {
          isEmployee(role)
          ?
          <Breadcrumb className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.MEMBER_MANAGE.URL_PREFIX + "/" + ROUTE.MEMBER_MANAGE.MENU_KEY}>健康档案</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={ROUTE.MEMBER_DETAIL.URL_PREFIX + "/" + ROUTE.MEMBER_DETAIL.MENU_KEY + "/" + this.props.params.memberId + "/" + this.props.params.memberName}>{this.props.params.memberName}</Link></Breadcrumb.Item>
            <Breadcrumb.Item>化验数据库</Breadcrumb.Item>
          </Breadcrumb>
          :
          <Breadcrumb className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.MEMBER_DETAIL.URL_PREFIX + "/" + ROUTE.MEMBER_DETAIL.MENU_KEY + "/" + this.props.params.memberId + "/" + this.props.params.memberName}>个人资料</Link></Breadcrumb.Item>
            <Breadcrumb.Item>化验数据库</Breadcrumb.Item>
          </Breadcrumb>
        }

        <Tabs defaultActiveKey="1">

          {
            role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN
            || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3
            ?
            <TabPane tab="化验数据库" key="1">
              <ExamResultOverviewSearchForm ref="examResultOfAssaySearchForm" type="化验" requestExamResultOfAssayOrTechData={this.requestExamResultOfAssayData} secondCategoryParentData={this.state.secondCategoryParentOfAssayData}/>
              <div className="exam-result-overview-info">
                <Anchor className="exam-result-overview-anchor">
                  {examResultOverviewOfAssayAnchors}
                </Anchor>
                <Timeline pending={this.state.examResultOverviewOfAssayData.length <= 0 ? null : <h4>已到底部</h4>}>
                  {this.state.examResultOverviews}
                </Timeline>
              </div>
            </TabPane>
            :
            null
          }
        </Tabs>

      </Spin>
    );
  }
}

export default MemberDetailAssayResult;
