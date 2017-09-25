import './MemberManage.css';
import {SERVER, SESSION, RESULT, ROLE, FILE_SERVER, ROUTE, LOADING_DELAY_TIME, DATE_FORMAT, PAGE_SIZE, STYLE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import {isEmployee, isAdviser} from './../../App/PublicMethod.js';
import ExamResultDetailItem from './../ExamResultManage/ExamResultDetailItem.js';
import HealthResultDetailItem from './../HealthResultManage/HealthResultDetailItem.js';
import React from 'react';
import MemberDetailOriginResultSearchForm from './MemberDetailOriginResultSearchForm.js';
import ExamResultDetailSearchForm from './../ExamResultManage/ExamResultDetailSearchForm.js';
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
    examResultPageLoading: false,
    examResultDetailOfAssayData: [],
    examResultDetailOfAssayItems: null,
    examResultDetailOfTechData: [],
    examResultDetailOfTechItems: null,
    secondCategoryParentOfAssayData: [],
    secondCategoryParentOfTechData: [],
    examResultSecondName: '',
    examResultDetailTableLoading: false,
    type: '化验'
  };

  /* 化验/医技检查记录
  **
  */

  //获取memberId用户的所有检查记录~~~~~~~~~~~~~
  requestExamResultDetailOfMember = (type) => {

    let values = [];
    if(type === '化验') values = this.examResultOfAssaySearchForm.getFieldsValue();
    else if(type === '医技') {
      if(this.examResultOfTechSearchForm === undefined) return;
      values = this.examResultOfTechSearchForm.getFieldsValue();
    }

    console.log('查询' + this.props.params.memberId + '会员的所有' + type + '检查记录');
    $.ajax({
        url : SERVER + '/api/input/list/' + this.props.params.memberId,
        type : 'POST',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({type : type,
                               secondId: values.secondId[1],
                               normal: values.normal,
                               beginTime: values.time !== undefined ? formatDate(values.time[0], DATE_FORMAT) : undefined,
                               endTime: values.time !== undefined ? formatDate(values.time[1], DATE_FORMAT) : undefined}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

              const role = sessionStorage.getItem(SESSION.ROLE);
              const examResultDetailItems = result.content.length <= 0
                                            ?
                                              <Alert
                                              message="暂无相关检查记录"
                                              description=" "
                                              type="info"
                                              showIcon
                                              />
                                            :
                                            result.content.map((detail, index) => <ExamResultDetailItem detail={detail}
                                                                                                        type={type}
                                                                                                        key={index}

                                                                                                        onSave={this.saveInputDetail}
                                                                                                        saveLoading={this.state.saveLoading}

                                                                                                        onSubmit={this.submitInputDetail}
                                                                                                        submitLoading={this.state.submitLoading}

                                                                                                        onPass={this.passInputDetail}
                                                                                                        passLoading={this.state.passLoading}

                                                                                                        onUnpass={this.unpassInputDetail}
                                                                                                        unpassLoading={this.state.unpassLoading}

                                                                                                        onDownload={this.downloadInputDetail}
                                                                                                        downloadLoading={this.state.downloadLoading}

                                                                                                        onDelete={this.deleteInputDetail}
                                                                                                        deleteLoading={this.state.deleteLoading} />);


              if(type === '化验') {
                this.setState({examResultDetailOfAssayData: result.content,
                               examResultDetailOfAssayItems: examResultDetailItems,
                               examResultPageLoading: false});
              } else {
                this.setState({examResultDetailOfTechData: result.content,
                               examResultDetailOfTechItems: examResultDetailItems,
                               examResultPageLoading: false});
              }
            } else {

              message.error(result.reason, 2);
              this.setState({examResultPageLoading: false});
            }
        }
    });
  }

  //拉取系统中所有检查亚类
  requestSecondCategoryParentData = (type) => {

    console.log('查询所有'+ type +'检查亚类');
    $.ajax({
        url : SERVER + '/api/first/level',
        type : 'POST',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({type : type}),
        // async: false,
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
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
                  console.log(secondCategoryParentData);
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
  }

  render(){

    const role = sessionStorage.getItem(SESSION.ROLE);


    //拆分examResultDetailData
    //1.组装成卡片+表格条目
    //2.组装成锚点目录
    const examResultDetailOfAssayAnchors = this.state.examResultDetailOfAssayData.map((detail, index) => <Anchor.Link href={"#" + detail.id.toString()} key={index} title={detail.secondName + " " + formatDate(detail.time)}/>);

    return (
      <div>
        <BackTop visibilityHeight="200"/>
        {
          isEmployee(role)
          ?
          <Breadcrumb separator=">" className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.MEMBER_MANAGE.URL_PREFIX + "/" + ROUTE.MEMBER_MANAGE.MENU_KEY}>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={ROUTE.MEMBER_DETAIL.URL_PREFIX + "/" + ROUTE.MEMBER_DETAIL.MENU_KEY + "/" + this.props.params.memberId + "/" + this.props.params.memberName}>{this.props.params.memberName}</Link></Breadcrumb.Item>
            <Breadcrumb.Item>化验数据库</Breadcrumb.Item>
          </Breadcrumb>
          :
          null
        }


        <Tabs defaultActiveKey="1"  tabBarExtraContent={role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN ? <Button type="primary" onClick={this.showAddModal} style={{display: this.state.addHealthResultBtnVisible}}>添加检查记录</Button> : null} onChange={this.handleMenuItemClick}>

          {
            role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN
            || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3
            ?
            <TabPane tab="化验数据库" key="1">
              <ExamResultDetailSearchForm ref="examResultOfAssaySearchForm" type="化验" requestExamResultDetailOfMember={this.requestExamResultDetailOfMember} secondCategoryParentData={this.state.secondCategoryParentOfAssayData}/>
              <div className="exam-result-detail-info">
                <Anchor className="exam-result-detail-anchor">
                  {examResultDetailOfAssayAnchors}
                </Anchor>
                <Timeline pending={this.state.examResultDetailOfAssayData.length <= 0 ? null : <h4>已到底部</h4>}>
                  {this.state.examResultDetailOfAssayItems}
                </Timeline>
              </div>
            </TabPane>
            :
            null
          }
        </Tabs>

      </div>
    );
  }
}

export default MemberDetailAssayResult;
