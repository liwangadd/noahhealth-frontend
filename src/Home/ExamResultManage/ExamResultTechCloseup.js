import './ExamResultManage.css';
import { SERVER, SESSION, RESULT, ROLE, FILE_SERVER, ROUTE, LOADING_DELAY_TIME } from './../../App/PublicConstant.js';
import { formatDate } from './../../App/PublicUtil.js';
import { isEmployee, isAdviser } from './../../App/PublicMethod.js';
import ExamTechResultDetailItem from './ExamTechResultDetailItem.js';
import ExamResultUploadPictureModal from './ExamResultUploadPictureModal'
import OriginResultWatchPictureModal from './../OriginResultManage/OriginResultWatchPictureModal'
import React from 'react';
import { browserHistory } from 'react-router';
import { message, Button, BackTop, Breadcrumb, Timeline, Anchor, Alert, Spin, Tabs } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';

const TabPane = Tabs.TabPane;

class ExamResultTechCloseup extends React.Component {

  state = {

    detail: null,

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

    uploadPictureModalVisible: false,
    watchPictureModalVisible: false,
    submitLoading: false,

    fileList: [],
    inputResultId: null,

    //正文 化验/医技 卡片/表格 内容
    examResultDetailOfAssayData: [],
    examResultDetailOfAssayItems: null,
    examResultDetailOfTechData: [],
    examResultDetailOfTechItems: null,
    secondCategoryParentOfAssayData: [],
    secondCategoryParentOfTechData: []
  };

  showUploadPictureModal = (inputResultId) => {

    this.setState({ uploadPictureModalVisible: true });
    this.requestUploadedPictures(inputResultId); //获取inputResultId已上传了的文件
  }

  closeUploadPictureModal = () => this.setState({ uploadPictureModalVisible: false })

  /**
  * 查看扫描件对话框
  **/
  showWatchPictureModal = (inputResultId) => {

    this.setState({ watchPictureModalVisible: true });
    this.requestUploadedPictures(inputResultId); //获取inputResultId已上传了的文件
  }

  closeWatchPictureModal = () => this.setState({ watchPictureModalVisible: false })

  requestUploadedPictures = (inputResultId) => {

    console.log("拉取第" + inputResultId + "号已上传了的所有文件");
    $.ajax({
      url: SERVER + '/api/input/file/' + inputResultId,
      type: 'GET',
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        console.log(result);
        if (result.code !== RESULT.SUCCESS) {
          message.error(result.reason, 2);
          return;
        }

        //将文件包装成可被上传控件识别的格式
        let fileList = result.content;
        fileList = fileList.map((file, index) => {
          file.uid = index;
          file.status = 'done';
          file.url = FILE_SERVER + file.url;

          return file;
        });

        //更新状态
        this.setState({ fileList: fileList, inputResultId: inputResultId });
      }
    });
  }

  //上传文件时的动作响应
  handleUploadPictureChange = (info) => {

    //显示成功 失败消息提示
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    console.log(info);
    if (info.file.status === 'done') {

      if (info.file.response.code === RESULT.SUCCESS) {
        message.success(`${info.file.name} 上传成功`);
      } else {
        message.error(info.file.response.reason);
      }
    } else if (info.file.status === 'error') {

      message.error(`${info.file.name} 上传失败.`);
    } else if (info.file.status === 'removed') {

      //请求删除文件
      if (info.file.url) {
        const fileName = info.file.url.split('/')[4];
        this.requestDeletePicture(this.state.inputResultId, fileName);
      }
    }

    //为上传成功的文件设置超链接
    let fileList = info.fileList;
    fileList = fileList.map((file) => {

      let result = file.response;
      if (result && result.code === RESULT.SUCCESS) {
        file.url = FILE_SERVER + file.response.content;
      }

      return file;
    });

    //通知上传图片对话框更新已有文件列表
    this.setState({ fileList: fileList });
  }

  //删除上传好的图片（档案部员工）
  requestDeletePicture = (inputResultId, fileName) => {

    console.log('删除' + inputResultId + '号原始数据记录的扫描件-', fileName);

    $.ajax({
      url: SERVER + '/api/input/file/' + inputResultId,
      type: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ fileName: fileName }),
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        console.log(result);
        if (result.code === RESULT.SUCCESS) {

          message.success(result.reason, 2);
          return;
        } else {
          message.error(result.reason, 2);
          return;
        }
      }
    });
  }

  //保存录入的检查结果
  saveInputDetail = (form, id, note) => {

    console.log('保存录入了的检查结果', id);

    form.validateFields((err, values) => {
      if (!err) {
        //显示加载圈l
        this.setState({ saveLoading: true });
        values['note'] = note
        $.ajax({
          url: SERVER + '/api/detail',
          type: 'PUT',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(values),
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success: (result) => {
            console.log(result);
            if (result.code === RESULT.SUCCESS) {

              //重新查一遍
              this.requestExamResultDetailById();
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
  submitInputDetail = (form, id, note) => {

    console.log('提交一份检查结果,变为待审核', id);

    //先保存
    this.saveInputDetail(form, id, note);

    //再提交
    this.setState({ submitLoading: true });
    $.ajax({
      url: SERVER + '/api/input/status/' + id,
      type: 'PUT',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ status: '待审核' }),
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {
        console.log(result);
        if (result.code === RESULT.SUCCESS) {

          //关闭加载圈、对话框
          this.setState({ submitLoading: false });

          //重新查一遍
          this.requestExamResultDetailById();
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

  passInputDetail = (form, id, note) => {

    console.log('通过一份检查结果,变为已通过', id);

    // 先保存
    this.saveInputDetail(form, id, note);
    //显示加载圈
    this.setState({ passLoading: true });
    $.ajax({
      url: SERVER + '/api/input/status/' + id,
      type: 'PUT',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ status: '已通过' }),
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {
        console.log(result);
        if (result.code === RESULT.SUCCESS) {

          //关闭加载圈、对话框
          this.setState({ passLoading: false });

          this.requestExamResultDetailById();
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
      url: SERVER + '/api/input/status/' + id,
      type: 'PUT',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ status: '未通过', reason: unpassReason }),
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {
        console.log(result);
        if (result.code === RESULT.SUCCESS) {

          //关闭加载圈、对话框
          this.setState({ unpassLoading: false });

          this.requestExamResultDetailById();
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
      url: SERVER + '/api/input/download/' + id,
      type: 'GET',
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {
        console.log(result);
        if (result.code === RESULT.SUCCESS) {

          //下载
          window.location.href = FILE_SERVER + result.content;

          //关闭加载圈、对话框
          this.setState({ downloadLoading: false });
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
      url: SERVER + '/api/input/' + id,
      type: 'DELETE',
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        console.log(result);
        if (result.code === RESULT.SUCCESS) {

          this.setState({ deleteLoading: false });
          message.success(result.reason, 2);

          //返回首页
          browserHistory.push(ROUTE.EXAM_RESULT_MANAGE.URL_PREFIX + "/" + ROUTE.EXAM_RESULT_MANAGE.MENU_KEY);
          return;
        } else {
          this.setState({ deleteLoading: false });
          message.error(result.reason, 2);
          return;
        }
      }
    });
  }

  //获取memberId用户的所有检查记录~~~~~~~~~~~~~
  requestExamResultDetailById = () => {


    console.log('查询' + this.props.params.detailId + '检查记录');
    $.ajax({
      url: SERVER + '/api/input/' + this.props.params.detailId,
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        console.log(result);
        if (result.code === RESULT.SUCCESS) {

          this.setState({ detail: result.content, pageLoading: false });
        } else {

          message.error(result.reason, 2);
          this.setState({ pageLoading: false });
        }
      }
    });
  }


  componentDidMount = () => {

    this.requestExamResultDetailById();
  }


  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);
    return (
      <Spin spinning={this.state.pageLoading} delay={LOADING_DELAY_TIME} tip='加载中'>
        <BackTop visibilityHeight="200" />
        <Breadcrumb className="category-path">
          <Breadcrumb.Item><Link to={ROUTE.EXAM_RESULT_TECH_MANAGE.URL_PREFIX + "/" + ROUTE.EXAM_RESULT_TECH_MANAGE.MENU_KEY}>医技数据库</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.params.memberName}</Breadcrumb.Item>
        </Breadcrumb>
        {
          this.state.detail !== null
            ?
            <ExamTechResultDetailItem detail={this.state.detail}
              type={this.state.detail.type}

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
              deleteLoading={this.state.deleteLoading}

              onUpload={this.showUploadPictureModal}
              cancleUpload={this.closeUploadPictureModal}
              onWatch={this.showWatchPictureModal}
              cancleWatch={this.closeWatchPictureModal} />
            :
            null
        }
        <ExamResultUploadPictureModal visible={this.state.uploadPictureModalVisible} onCancel={this.closeUploadPictureModal} submitLoading={this.state.submitLoading} onSubmit={this.handleSubmitPicture} fileList={this.state.fileList} inputResultId={this.state.inputResultId} onChange={this.handleUploadPictureChange} />
        <OriginResultWatchPictureModal visible={this.state.watchPictureModalVisible} onCancel={this.closeWatchPictureModal} fileList={this.state.fileList} />
      </Spin>
    );
  }
}

export default ExamResultTechCloseup;
