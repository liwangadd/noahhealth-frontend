import './ExamResultManage.css';
import {SERVER, SESSION, RESULT, PAGE_SIZE, FILE_SERVER, ROUTE} from './../../App/PublicConstant.js';
import ExamResultSearchForm from './ExamResultSearchForm.js';
import React from 'react';
import {Tabs, Table, message, BackTop, Modal} from 'antd';
import {Link} from 'react-router';
import $ from 'jquery';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class ExamResultManage extends React.Component {

  state = {

    //执行情况
    examResultData: [],
    examResultTableLoading: false,
    examResultPager: {pageSize: PAGE_SIZE, total: 0},

    //添加检查记录对话框
    inputModalVisible: false,
    confirmInputModalLoading: false,
    memberUnderEmployeeData: [],

    //录入检查结果对话框
    inputDetailModalVisible: false,
    saveLoading: false,
    submitLoading: false,

    //审核检查结果对话框
    checkDetailModalVisible: false,
    passLoading: false,
    unpassLoading: false,

    //查看检查结果对话框
    watchDetailModalVisible: false,
    downloadLoading: false,

    examResultId: -1,
    examResultSecondName: '',
    examResultDetailData: [],
    examResultDetailTableLoading: false,
  };


  /**
  * 执行情况表格
  **/

  //查表
  handleSearchExamResultList = (pageNow) => {

    this.refs.searchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ examResultTableLoading: true});

        console.log('拉取第'+ pageNow + "页化验/医技目录", values);

        $.ajax({
            url : SERVER + '/api/input/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({userName : values.userName,
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
                const examResultPager = this.state.examResultPager;
                examResultPager.total = result.content.rowTotal;
                examResultPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  examResultTableLoading: false,
                  examResultData: result.content.data,
                  examResultPager
                });
            }
        });
      }
    });
  }

  //翻页
  changeExamResultPager = (pager) =>  this.handleSearchExamResultList(pager.current)



  /**
  * 添加检查记录对话框
  **/
  showInputModal = () => this.setState({ inputModalVisible: true})
  closeInputModal = () => this.setState({ inputModalVisible: false})

  //确认录入检查记录信息
  confirmInputModal = () => {

    this.refs.inputForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加一条检查记录', values);

        //显示加载圈
        this.setState({ confirmInputModalLoading: true });

        let secondId = values.type === '化验' ? values.secondCategoryParentOfAssayId[1] : values.secondCategoryParentOfTechId[1];
        $.ajax({
            url : SERVER + '/api/input',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({userId: Number(values.userId),
                                   secondId: secondId,
                                   hospital: values.hospital,
                                   time: values.time,
                                   note: values.note}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                this.handleSearchExamResultList(this.state.examResultPager.current); //更新表格数据

                //关闭加载圈、对话框
                this.setState({ inputModalVisible: false, confirmInputModalLoading: false});

                //询问是否弹出上传对话框继续上传检查结果
                let examResultId = result.content.resultInputId;
                let secondName = result.content.secondName;
                confirm({title: '添加成功! 是否继续录入检查结果?',
                         onOk: () => this.showInputDetailModal(examResultId, secondName)});

              } else {

                //关闭加载圈
                this.setState({ confirmInputModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  /**
  * 录入检查结果对话框
  **/

  showInputDetailModal = (examResultId, secondName) => {

    this.setState({inputDetailModalVisible: true});
    //this.requestThirdCategoryData(secondId, 1);
    this.requestInputedDetails(examResultId, secondName); //获取examResultId对应的已有记录
  }

  requestInputedDetails = (examResultId, secondName) => {

    console.log("拉取第" + examResultId + "号已录入了的检查结果");

    this.setState({ examResultDetailTableLoading: true});
    $.ajax({
        url : SERVER + '/api/input/' + examResultId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

          console.log(result);
          if(result.code !== RESULT.SUCCESS) {
            message.error(result.reason, 2);
            return;
          }

          //更新状态
          this.setState({examResultDetailTableLoading: false,
                         examResultId: examResultId,
                         examResultSecondName: secondName,
                         examResultDetailData: result.content});
        }
    });
  }



  //提交录入的检查结果（先请求保存、再请求改变状态）
  submitInputDetail = () => {

      console.log('提交一份检查结果,变为待审核', this.state.examResultId);

      //先保存
      this.saveInputDetail();

      //再提交
      this.setState({ submitLoading: true });
      $.ajax({
          url : SERVER + '/api/input/status/' + this.state.examResultId,
          type : 'PUT',
          contentType: 'application/json',
          dataType : 'json',
          data : JSON.stringify({status: '待审核'}),
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success : (result) => {
            console.log(result);
            if(result.code === RESULT.SUCCESS) {

              this.handleSearchExamResultList(this.state.examResultPager.current);

              //关闭加载圈、对话框
              this.setState({ inputDetailModalVisible: false, submitLoading: false});
              message.success(result.reason, 2);
            } else {

              //关闭加载圈
              this.setState({ submitLoading: false });
              message.error(result.reason, 2);
            }
          }
      });
  }

  closeInputDetailModal = () => this.setState({inputDetailModalVisible: false})


  /**
  * 审核检查结果对话框
  **/
  showCheckDetailModal = (examResultId, secondName) => {

    this.setState({checkDetailModalVisible: true});
    this.requestInputedDetails(examResultId, secondName); //获取examResultId已上传了的文件
  }

  handlePassDetail = () => {

    console.log('通过一份检查结果,变为已通过', this.state.examResultId);

    //显示加载圈
    this.setState({ passLoading: true });
    $.ajax({
        url : SERVER + '/api/input/status/' + this.state.examResultId,
        type : 'PUT',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({status: '已通过'}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {
          console.log(result);
          if(result.code === RESULT.SUCCESS) {

            this.handleSearchExamResultList(this.state.examResultPager.current);

            //关闭加载圈、对话框
            this.setState({ checkDetailModalVisible: false, passLoading: false });
            message.success(result.reason, 2);
          } else {

            //关闭加载圈
            this.setState({ passLoading: false });
            message.error(result.reason, 2);
          }
        }
    });
  }

  handleUnpassDetail = (unpassReason) => {

    console.log('不通过一份检查结果,变为未通过', this.state.examResultId);

    //显示加载圈
    this.setState({ unpassLoading: true });
    $.ajax({
        url : SERVER + '/api/input/status/' + this.state.examResultId,
        type : 'PUT',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({status: '未通过', reason: unpassReason}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {
          console.log(result);
          if(result.code === RESULT.SUCCESS) {

            this.handleSearchExamResultList(this.state.examResultPager.current);

            //关闭加载圈、对话框
            this.setState({ checkDetailModalVisible: false, unpassLoading: false});
            message.success(result.reason, 2);
          } else {

            //关闭加载圈
            this.setState({ unpassLoading: false });
            message.error(result.reason, 2);
          }
        }
    });
  }

  closeCheckDetailModal = () => this.setState({checkDetailModalVisible: false})



  /**
  * 查看检查结果对话框
  **/
  showWatchDetailModal = (examResultId, secondName) => {

    this.setState({watchDetailModalVisible: true});
    this.requestInputedDetails(examResultId, secondName); //获取examResultId已上传了的文件
  }

  closeWatchDetailModal = () => this.setState({watchDetailModalVisible: false})

  //下载
  handleDownloadDetail = () => {

    console.log('请求下载检查结果', this.state.examResultId);

    //显示加载圈
    this.setState({ downloadLoading: true });
    $.ajax({
        url : SERVER + '/api/input/download/' + this.state.examResultId,
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

  requestMembersUnderEmployee = () => {

      console.log('拉取'+ sessionStorage.getItem(SESSION.NAME) +'旗下的所有会员信息');
      $.ajax({
          url : SERVER + '/api/origin/member_under_employee',
          type : 'GET',
          dataType : 'json',
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success : (result) => {

              console.log(result);
              if(result.code !== RESULT.SUCCESS) {
                  message.error(result.reason, 2);
                  return;
              }

              //更新获取到的数据到状态中
              const memberUnderEmployeeData = result.content;
              this.setState({ memberUnderEmployeeData: memberUnderEmployeeData});
              if(this.refs.inputForm == null) return;
              this.refs.inputForm.setFieldsValue({userId: memberUnderEmployeeData.length > 0 ? memberUnderEmployeeData[0].id.toString() : ''});
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

                  this.setState({secondCategoryParentOfAssayData: secondCategoryParentData});

                  if(this.refs.inputForm == null) return;
                  this.refs.inputForm.setFieldsValue({secondCategoryParentOfAssayId: secondCategoryParentData.length > 0 ? [secondCategoryParentData[0].value, secondCategoryParentData[0].children[0].value] : []});

                } else {

                  this.setState({secondCategoryParentOfTechData: secondCategoryParentData});

                  if(this.refs.inputForm == null) return;
                  this.refs.inputForm.setFieldsValue({secondCategoryParentOfTechId: secondCategoryParentData.length > 0 ? [secondCategoryParentData[0].value, secondCategoryParentData[0].children[0].value] : []});
                }
            } else {
                message.error(result.reason, 2);
            }
        }
    });
  }

  componentDidMount = () => {

    this.handleSearchExamResultList(1);

    this.requestSecondCategoryParentData("化验");
    this.requestSecondCategoryParentData("医技");

    //拉取上传对话框中的会员信息(该employee旗下的)
    this.requestMembersUnderEmployee();
  }


  render(){

    const examResultColumns = [{
      title: '会员姓名',
      dataIndex: 'name',
      key: 'name'
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
          <TabPane tab="化验/医技数据" key="1">
            <ExamResultSearchForm ref="searchForm" handleSearchExamResultList={this.handleSearchExamResultList}/>
            <Table className='exam-result-table' columns={examResultColumns} dataSource={this.state.examResultData} rowKey='id' loading={this.state.examResultTableLoading} pagination={this.state.examResultPager} onChange={this.changeExamResultPager}/>
          </TabPane>
        </Tabs>
        {/* <ExamResultInputModal ref="inputForm" visible={this.state.inputModalVisible} confirmLoading={this.state.confirmInputModalLoading} onCancel={this.closeInputModal} onConfirm={this.confirmInputModal} memberUnderEmployeeData={this.state.memberUnderEmployeeData} secondCategoryParentOfAssayData={this.state.secondCategoryParentOfAssayData} secondCategoryParentOfTechData={this.state.secondCategoryParentOfTechData}/>
        <ExamResultInputDetailModal ref="inputDetailForm" visible={this.state.inputDetailModalVisible} examResultDetailTableLoading={this.state.examResultDetailTableLoading} onSave={this.saveInputDetail} onSubmit={this.submitInputDetail} onCancel={this.closeInputDetailModal} saveLoading={this.state.saveLoading} submitLoading={this.state.submitLoading}  examResultId={this.state.examResultId} examResultSecondName={this.state.examResultSecondName} examResultDetailData={this.state.examResultDetailData} />
        <ExamResultCheckDetailModal visible={this.state.checkDetailModalVisible} examResultDetailTableLoading={this.state.examResultDetailTableLoading} onCancel={this.closeCheckDetailModal} passLoading={this.state.passLoading} unpassLoading={this.state.unpassLoading}  onPass={this.handlePassDetail} onUnpass={this.handleUnpassDetail} examResultId={this.state.examResultId} examResultSecondName={this.state.examResultSecondName} examResultDetailData={this.state.examResultDetailData} />
        <ExamResultWatchDetailModal visible={this.state.watchDetailModalVisible} downloadLoading={this.state.downloadLoading} examResultDetailTableLoading={this.state.examResultDetailTableLoading} onDownload={this.handleDownloadDetail} onCancel={this.closeWatchDetailModal} examResultDetailData={this.state.examResultDetailData} examResultSecondName={this.state.examResultSecondName}/> */}
      </div>
    );
  }
}

export default ExamResultManage;
