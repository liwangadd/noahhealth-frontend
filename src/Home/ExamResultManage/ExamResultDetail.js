import './ExamResultManage.css';
import {SERVER, SESSION, RESULT, ROLE, FILE_SERVER, ROUTE, LOADING_DELAY_TIME} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import {isEmployee, isAdviser} from './../../App/PublicMethod.js';
import ExamResultDetailItem from './ExamResultDetailItem.js';
import ExamResultDetailSearchForm from './ExamResultDetailSearchForm.js';
import React from 'react';
import {message, Button, BackTop, Breadcrumb, Timeline, Anchor, Alert, Spin, Tabs} from 'antd';
import {Link} from 'react-router';
import $ from 'jquery';

const TabPane = Tabs.TabPane;

class ExamResultDetail extends React.Component {

  state = {

    pageLoading: true,

    //录入检查结果
    saveLoading: false,
    submitLoading: false,

    //审核检查结果
    passLoading: false,
    unpassLoading: false,

    //查看检查结果
    downloadLoading: false,

    //删除
    deleteLoading: false,

    examResultSecondName: '',
    examResultDetailTableLoading: false,

    //正文 化验/医技 卡片/表格 内容
    examResultDetailOfAssayData: [],
    examResultDetailOfAssayItems: null,
    examResultDetailOfTechData: [],
    examResultDetailOfTechItems: null,
    secondCategoryParentOfAssayData: [],
    secondCategoryParentOfTechData: [],
    type: '化验'
  };

  //保存录入的检查结果
  saveInputDetail = (form, id) => {

    console.log('保存录入了的检查结果', id);

    form.validateFields((err, values) => {
      if(!err) {
        console.log(values);
        //显示加载圈
        this.setState({ saveLoading: true });
        $.ajax({
            url : SERVER + '/api/detail',
            type : 'PUT',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify(values),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                message.success(result.reason, 2);
              } else {

                message.error(result.reason, 2);
              }

              //关闭加载圈
              this.setState({ saveLoading: false });
            }
        });
      }
    });
  }

  //提交录入的检查结果（先请求保存、再请求改变状态）
  submitInputDetail = (form, id) => {

    console.log('提交一份检查结果,变为待审核', id);

    //先保存
    this.saveInputDetail(form, id);

    //再提交
    this.setState({ submitLoading: true });
    $.ajax({
        url : SERVER + '/api/input/status/' + id,
        type : 'PUT',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({status: '待审核'}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {
          console.log(result);
          if(result.code === RESULT.SUCCESS) {

            //关闭加载圈、对话框
            this.setState({ submitLoading: false});

            //重新查一遍
            this.requestExamResultDetailOfMember(this.state.type);
            message.success(result.reason, 2);
          } else {

            //关闭加载圈
            this.setState({ submitLoading: false });
            message.error(result.reason, 2);
          }
        }
    });
  }

  /**
  * 审核检查结果对话框
  **/

  passInputDetail = (form, id) => {

    console.log('通过一份检查结果,变为已通过', id);

    //显示加载圈
    this.setState({ passLoading: true });
    $.ajax({
        url : SERVER + '/api/input/status/' + id,
        type : 'PUT',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({status: '已通过'}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {
          console.log(result);
          if(result.code === RESULT.SUCCESS) {

            //关闭加载圈、对话框
            this.setState({ passLoading: false });

            this.requestExamResultDetailOfMember(this.state.type);
            message.success(result.reason, 2);
          } else {

            //关闭加载圈
            this.setState({ passLoading: false });
            message.error(result.reason, 2);
          }
        }
    });
  }

  unpassInputDetail = (id, unpassReason) => {

    console.log('不通过一份检查结果,变为未通过', id);

    //显示加载圈
    this.setState({ unpassLoading: true });
    $.ajax({
        url : SERVER + '/api/input/status/' + id,
        type : 'PUT',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({status: '未通过', reason: unpassReason}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {
          console.log(result);
          if(result.code === RESULT.SUCCESS) {

            //关闭加载圈、对话框
            this.setState({ unpassLoading: false});

            this.requestExamResultDetailOfMember(this.state.type);
            message.success(result.reason, 2);
          } else {

            //关闭加载圈
            this.setState({ unpassLoading: false });
            message.error(result.reason, 2);
          }
        }
    });
  }

  //下载
  downloadInputDetail = (id) => {

    console.log('请求下载检查结果', id);

    //显示加载圈
    this.setState({ downloadLoading: true });
    $.ajax({
        url : SERVER + '/api/input/download/' + id,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {
          console.log(result);
          if(result.code === RESULT.SUCCESS) {

            //下载
            window.location.href = FILE_SERVER + result.content;

            //关闭加载圈、对话框
            this.setState({downloadLoading: false});
            message.success(result.reason, 2);
          } else {

            //关闭加载圈
            this.setState({ downloadLoading: false });
            message.error(result.reason, 2);
          }
        }
    });
  }


  //删除
  deleteInputDetail = (id) => {

    console.log('删除一条检查记录', id);

    $.ajax({
        url : SERVER + '/api/input/' + id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                this.setState({deleteLoading: false});

                this.requestExamResultDetailOfMember(this.state.type);
                message.success(result.reason, 2);
                return;
            } else {
                this.setState({deleteLoading: false});
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //获取memberId用户的所有检查记录~~~~~~~~~~~~~
  requestExamResultDetailOfMember = (type) => {

    let values = [];
    console.log(this.refs.assaySearchForm);
    if(type === '化验') values = this.refs.assaySearchForm.getFieldsValue();
    else if(type === '医技') {
      if(this.techSearchForm === undefined) return;
      values = this.techSearchForm.getFieldsValue();
    }

    console.log('查询' + this.props.params.memberId + '会员的所有' + type + '检查记录');
    $.ajax({
        url : SERVER + '/api/input/list/' + this.props.params.memberId,
        type : 'POST',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({type : type,
                               secondId: values.secondId[1],
                               status: values.status,
                               beginTime: values.time !== undefined ? values.time[0] : undefined,
                               endTime: values.time !== undefined ? values.time[1] : undefined}),
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
                                              type="warning"
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
                               pageLoading: false});
              } else {
                this.setState({examResultDetailOfTechData: result.content,
                               examResultDetailOfTechItems: examResultDetailItems,
                               pageLoading: false});
              }
            } else {

              message.error(result.reason, 2);
              this.setState({pageLoading: false});
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

                  if(this.refs.addForm == null) return;
                  this.refs.addForm.setFieldsValue({secondCategoryParentOfAssayId: secondCategoryParentData.length > 0 ? [secondCategoryParentData[0].value, secondCategoryParentData[0].children[0].value] : []});

                } else {

                  this.setState({secondCategoryParentOfTechData: secondCategoryParentData});

                  if(this.refs.addForm == null) return;
                  this.refs.addForm.setFieldsValue({secondCategoryParentOfTechId: secondCategoryParentData.length > 0 ? [secondCategoryParentData[0].value, secondCategoryParentData[0].children[0].value] : []});
                }
            } else {
                message.error(result.reason, 2);
            }
        }
    });
  }

  //切换选项卡
  handleMenuItemClick = (activeKey) => {

    switch(activeKey) {
      case "1":this.state.type = '化验';break;
      case "2":this.state.type = '医技';break;
      default:;break;
    }
  }


  //打开医技数据选项卡
  componentDidMountOfTechDataTab = (form) => {

    if(form == null) return;
    this.techSearchForm = form;
    this.requestExamResultDetailOfMember('医技');
  }

  componentDidMount = () => {

      //拉取该用户的已添加的所有检查记录
      this.requestExamResultDetailOfMember(this.state.type);

      //拉取所有化验、医技类到搜索框
      this.requestSecondCategoryParentData('化验');
      this.requestSecondCategoryParentData('医技');
  }


  render(){

    const role = sessionStorage.getItem(SESSION.ROLE);

    //拆分examResultDetailData
    //1.组装成卡片+表格条目
    //2.组装成锚点目录
    const examResultDetailOfAssayAnchors = this.state.examResultDetailOfAssayData.map((detail, index) => <Anchor.Link href={"#" + detail.id.toString()} key={index} title={detail.secondName + " " + formatDate(detail.time)}/>);
    const examResultDetailOfTechAnchors = this.state.examResultDetailOfTechData.map((detail, index) => <Anchor.Link href={"#" + detail.id.toString()} key={index} title={detail.secondName + " " + formatDate(detail.time)}/>);

    return (
      <Spin spinning={this.state.pageLoading} delay={LOADING_DELAY_TIME} tip='加载中'>
        <BackTop visibilityHeight="200"/>
        {
          isEmployee(role)
          ?
          <Breadcrumb separator=">" className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.EXAM_RESULT_MANAGE.URL_PREFIX + "/" + ROUTE.EXAM_RESULT_MANAGE.MENU_KEY}>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.params.memberName}</Breadcrumb.Item>
          </Breadcrumb>
          :
          null
        }

        <Tabs defaultActiveKey={"1"}  onChange={this.handleMenuItemClick}>
          <TabPane tab="化验数据" key="1">
            <ExamResultDetailSearchForm ref="assaySearchForm" type="化验" requestExamResultDetailOfMember={this.requestExamResultDetailOfMember} secondCategoryParentData={this.state.secondCategoryParentOfAssayData}/>
            <div className="exam-result-detail-info">
              <Anchor className="exam-result-detail-anchor">
                {examResultDetailOfAssayAnchors}
              </Anchor>
              <Timeline pending={this.state.examResultDetailOfAssayData.length <= 0 ? null : <h4>已到底部</h4>}>
                {this.state.examResultDetailOfAssayItems}
              </Timeline>
            </div>
          </TabPane>
          <TabPane tab="医技数据" key="2">
            <ExamResultDetailSearchForm ref={this.componentDidMountOfTechDataTab} type="医技" requestExamResultDetailOfMember={this.requestExamResultDetailOfMember} secondCategoryParentData={this.state.secondCategoryParentOfTechData}/>
            <div className="exam-result-detail-info">
              <Anchor className="exam-result-detail-anchor">
                {examResultDetailOfTechAnchors}
              </Anchor>
              <Timeline pending={this.state.examResultDetailOfTechData.length <= 0 ? null : <h4>已到底部</h4>}>
                {this.state.examResultDetailOfTechItems}
              </Timeline>
            </div>
          </TabPane>
        </Tabs>
      </Spin>
    );
  }
}

export default ExamResultDetail;
