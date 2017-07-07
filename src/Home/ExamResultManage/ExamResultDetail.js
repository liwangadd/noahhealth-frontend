import './ExamResultManage.css';
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, FILE_SERVER, ROUTE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import ExamResultDetailAddModal from './ExamResultDetailAddModal.js';
import ExamResultDetailItem from './ExamResultDetailItem.js';
import React from 'react';
import {message, Button, BackTop, Modal, Breadcrumb, Timeline, Anchor} from 'antd';
import {Link} from 'react-router';
import $ from 'jquery';

class ExamResultDetail extends React.Component {

  state = {

    //执行情况
    examResultData: [],
    examResultTableLoading: false,
    examResultPager: {pageSize: PAGE_SIZE, total: 0},

    //添加检查记录对话框
    addModalVisible: false,
    confirmAddModalLoading: false,
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

    //删除
    deleteLoading: false,

    examResultId: -1,
    examResultSecondName: '',
    examResultDetailTableLoading: false,


    examResultDetailData: []
  };


  /**
  * 添加检查记录对话框
  **/
  showAddModal = () => this.setState({ addModalVisible: true})
  closeAddModal = () => this.setState({ addModalVisible: false})

  //确认录入检查记录信息
  confirmAddModal = () => {

    this.refs.addForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加一条检查记录', values);

        //显示加载圈
        this.setState({ confirmAddModalLoading: true });

        let secondId = values.type === '化验' ? values.secondCategoryParentOfAssayId[1] : values.secondCategoryParentOfTechId[1];
        $.ajax({
            url : SERVER + '/api/input',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({secondId: secondId,
                                   hospital: values.hospital,
                                   time: values.time,
                                   note: values.note}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {


                //关闭加载圈、对话框
                this.setState({ addModalVisible: false, confirmAddModalLoading: false});
                this.requestExamResultDetailOfMember(this.props.params.memberId);

                Modal.success({
                  title: '添加成功!',
                  content: '您可在页面最底端录入详细检查数据',
                });
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

  /**
  * 录入检查结果对话框
  **/

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

  //保存录入的检查结果
  saveInputDetail = (form, id) => {

    console.log('保存录入了的检查结果', id);

    form.validateFields((err, values) => {
      if(!err) {

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
            this.requestExamResultDetailOfMember(this.props.params.memberId);
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
            this.setState({ checkDetailModalVisible: false, passLoading: false });

            this.requestExamResultDetailOfMember(this.props.params.memberId);
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
            this.setState({ checkDetailModalVisible: false, unpassLoading: false});

            this.requestExamResultDetailOfMember(this.props.params.memberId);
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

                this.requestExamResultDetailOfMember(this.props.params.memberId);
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

  //获取memberId用户的所有检查记录
  requestExamResultDetailOfMember = (memberId) => {

    console.log('查询'+ memberId +'会员的所有检查记录');
    $.ajax({
        url : SERVER + '/api/input/list/' + memberId,
        type : 'POST',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

              this.setState({examResultDetailData: result.content});

            } else {
              message.error(result.reason, 2);
            }
        }
    });
  }

  componentDidMount = () => {

    //拉取该用户的已添加的所有检查记录
    this.requestExamResultDetailOfMember(this.props.params.memberId);

    //获取化验、医技亚类
    this.requestSecondCategoryParentData("化验");
    this.requestSecondCategoryParentData("医技");
  }


  render(){

    const role = sessionStorage.getItem(SESSION.ROLE);

    //拆分examResultDetailData
    //1.组装成卡片+表格条目
    //2.组装成锚点目录
    const {examResultDetailData} = this.state;
    const examResultDetailItems = examResultDetailData.map((detail, index) => <ExamResultDetailItem detail={detail}
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

    const examResultDetailAnchors = examResultDetailData.map((detail, index) => <Anchor.Link href={"#" + detail.id.toString()} key={index} title={detail.secondName + " " + formatDate(detail.time)}/>);

    return (
      <div>
        <BackTop visibilityHeight="200"/>
        <Breadcrumb separator=">" className="category-path" style={{marginBottom:40}}>
          <Breadcrumb.Item><Link to={ROUTE.EXAM_RESULT_MANAGE.URL_PREFIX + "/" + ROUTE.EXAM_RESULT_MANAGE.MENU_KEY}>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.params.memberName}</Breadcrumb.Item>
          {
            role === ROLE.EMPLOYEE_ARCHIVER || role === ROLE.EMPLOYEE_ADMIN
            ?
            <Breadcrumb.Item style={{float:'right'}}><Button type="primary" onClick={this.showAddModal}>添加检查记录</Button></Breadcrumb.Item>
            :
            null
          }
        </Breadcrumb>
        <ExamResultDetailAddModal ref="addForm" visible={this.state.addModalVisible} confirmLoading={this.state.confirmAddModalLoading} onCancel={this.closeAddModal} onConfirm={this.confirmAddModal} secondCategoryParentOfAssayData={this.state.secondCategoryParentOfAssayData} secondCategoryParentOfTechData={this.state.secondCategoryParentOfTechData}/>

        <Anchor className="exam-result-detail-anchor" offsetTop={10}>
          {examResultDetailAnchors}
        </Anchor>


        <Timeline pending={<h4>已到底部</h4>}>
          {examResultDetailItems}
        </Timeline>

        {/* <ExamResultInputModal ref="inputForm" visible={this.state.inputModalVisible} confirmLoading={this.state.confirmInputModalLoading} onCancel={this.closeInputModal} onConfirm={this.confirmInputModal} memberUnderEmployeeData={this.state.memberUnderEmployeeData} secondCategoryParentOfAssayData={this.state.secondCategoryParentOfAssayData} secondCategoryParentOfTechData={this.state.secondCategoryParentOfTechData}/>
        <ExamResultInputDetailModal ref="inputDetailForm" visible={this.state.inputDetailModalVisible} examResultDetailTableLoading={this.state.examResultDetailTableLoading} onSave={this.saveInputDetail} onSubmit={this.submitInputDetail} onCancel={this.closeInputDetailModal} saveLoading={this.state.saveLoading} submitLoading={this.state.submitLoading}  examResultId={this.state.examResultId} examResultSecondName={this.state.examResultSecondName} examResultDetailData={this.state.examResultDetailData} />
        <ExamResultCheckDetailModal visible={this.state.checkDetailModalVisible} examResultDetailTableLoading={this.state.examResultDetailTableLoading} onCancel={this.closeCheckDetailModal} passLoading={this.state.passLoading} unpassLoading={this.state.unpassLoading}  onPass={this.handlePassDetail} onUnpass={this.handleUnpassDetail} examResultId={this.state.examResultId} examResultSecondName={this.state.examResultSecondName} examResultDetailData={this.state.examResultDetailData} />
        <ExamResultWatchDetailModal visible={this.state.watchDetailModalVisible} downloadLoading={this.state.downloadLoading} examResultDetailTableLoading={this.state.examResultDetailTableLoading} onDownload={this.handleDownloadDetail} onCancel={this.closeWatchDetailModal} examResultDetailData={this.state.examResultDetailData} examResultSecondName={this.state.examResultSecondName}/> */}
      </div>
    );
  }
}

export default ExamResultDetail;
