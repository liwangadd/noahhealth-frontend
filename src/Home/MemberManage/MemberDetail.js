import './MemberManage.css';
import { SERVER, SESSION, RESULT, ROLE, FILE_SERVER, ROUTE, LOADING_DELAY_TIME, DATE_FORMAT, PAGE_SIZE, STYLE } from './../../App/PublicConstant.js';
import { formatDate } from './../../App/PublicUtil.js';
import { isEmployee, isAdviser } from './../../App/PublicMethod.js';
import ExamResultDetailItem from './../ExamResultManage/ExamResultDetailItem.js';
import HealthResultDetailItem from './../HealthResultManage/HealthResultDetailItem.js';
import React from 'react';
import MemberDetailOriginResultSearchForm from './MemberDetailOriginResultSearchForm.js';
import ExamResultOverviewSearchForm from './../ExamResultManage/ExamResultOverviewSearchForm.js';
import HealthResultDetailSearchForm from './../HealthResultManage/HealthResultDetailSearchForm.js';
import OriginResultWatchPictureModal from './../OriginResultManage/OriginResultWatchPictureModal.js';
import HealthResultDetailAddModal from './../HealthResultManage/HealthResultDetailAddModal.js';
import MemberInfoTable from './MemberInfoTable.js';
import { message, Button, BackTop, Breadcrumb, Timeline, Anchor, Alert, Spin, Tabs, Table, Tooltip, Card } from 'antd';
import { Link, browserHistory } from 'react-router';
import $ from 'jquery';

const TabPane = Tabs.TabPane;

class MemberDetail extends React.Component {

  state = {

    /*
    *电子资料库
    */
    originResultTableLoading: false,
    originResultData: [],
    originResultPager: { pageSize: PAGE_SIZE, total: 0 },
    watchPictureModalVisible: false, //查看扫描件对话框
    fileList: [],

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
    type: '化验',

    /*
    *健康摘要库
    */
    healthResultPageLoading: false,
    healthResultTypeData: [],
    healthResultDetailData: [],
    healthResultDetailItems: null,
    addHealthResultBtnVisible: STYLE.NONE,

    //添加健康摘要对话框
    addModalVisible: false,
    confirmAddModalLoading: false,

    //录入健康摘要
    saveLoading: false,
    submitLoading: false,

    //审核健康摘要
    passLoading: false,
    unpassLoading: false,

    //查看健康摘要
    downloadLoading: false,

    //删除
    deleteLoading: false,

    healthResultSecondName: '',
    healthResultDetailTableLoading: false,


    /*
    *会员健康信息
    */
    memberInfo: {},
    updateMemberInfoLoading: false

  };

  /**
  * 电子资料库
  */

  //查询某个会员的电子资料
  requestOriginResultOfMember = (pageNow) => {

    this.refs.originResultSearchForm.validateFields((err, values) => {
      if (!err) {

        this.setState({ originResultTableLoading: true });

        console.log('拉取第' + pageNow + "页原始数据-执行情况信息", values);

        $.ajax({
          url: SERVER + '/api/origin/list/' + this.props.params.memberId,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            userName: values.userName,
            memberNum: values.memberNum,
            uploaderName: values.uploaderName,
            checkerName: values.checkerName,
            status: values.status,
            beginTime: values.time !== undefined ? formatDate(values.time[0], DATE_FORMAT) : undefined,
            endTime: values.time !== undefined ? formatDate(values.time[1], DATE_FORMAT) : undefined,
            pageNow: pageNow,
            pageSize: PAGE_SIZE
          }),
          dataType: 'json',
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success: (result) => {

            console.log(result);
            if (result.code !== RESULT.SUCCESS) {
              this.setState({ originResultTableLoading: false });
              message.error(result.reason, 2);
              return;
            }

            //更新页码
            const originResultPager = this.state.originResultPager;
            originResultPager.total = result.content.rowTotal;
            originResultPager.current = pageNow;

            //更新获取到的数据到状态中
            this.setState({ originResultData: result.content.data, originResultTableLoading: false, originResultPager });
          }
        });
      }
    });
  }

  //翻页
  changeOriginResultPager = (pager) => this.requestOriginResultOfMember(pager.current)

  //拉取健康摘要类别级联数据
  requestHealthResultSecondType = () => {

    console.log('拉取健康摘要类别数据');
    $.ajax({
      url: SERVER + '/api/health_category/level',
      type: 'GET',
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        console.log(result);
        if (result.code !== RESULT.SUCCESS) {
          message.error(result.reason, 2);
          return;
        }

        //将后端返回的map整理成级联列表识别的数据结构
        let healthResultTypeData = [];
        for (let firstType in result.content) {

          //加入大类
          let firstTypeData = { value: result.content[firstType][0].id, label: firstType };
          healthResultTypeData.push(firstTypeData);
        }

        this.setState({ healthResultTypeData: healthResultTypeData });
        if (this.refs.healthResultAddForm == null) return;
        this.refs.healthResultAddForm.setFieldsValue({ secondId: healthResultTypeData.length > 0 ? healthResultTypeData[0].value.toString() : "-1" });
      }
    });
  }

  //查看扫描件对话框
  showWatchPictureModal = (originResultId) => {

    this.setState({ watchPictureModalVisible: true });
    this.requestUploadedPictures(originResultId); //获取originResultId已上传了的文件
  }

  closeWatchPictureModal = () => this.setState({ watchPictureModalVisible: false })

  requestUploadedPictures = (originResultId) => {

    console.log("拉取第" + originResultId + "号已上传了的所有文件");
    $.ajax({
      url: SERVER + '/api/origin/file/' + originResultId,
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
        this.setState({ fileList: fileList });
      }
    });
  }

  //保存录入的检查结果
  saveInputDetail = (form, id) => {

    console.log('保存录入了的检查结果', id);

    form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        //显示加载圈
        this.setState({ saveLoading: true });
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
              this.requestExamResultDetailOfMember(this.state.type);
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

    console.log('请求下载健康摘要', id);

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

          this.requestExamResultDetailOfMember(this.state.type);
          message.success(result.reason, 2);
          return;
        } else {
          this.setState({ deleteLoading: false });
          message.error(result.reason, 2);
          return;
        }
      }
    });
  }

  /* 化验/医技检查记录
  **
  */



  //获取memberId用户的所有检查记录~~~~~~~~~~~~~
  requestExamResultDetailOfMember = (type) => {

    let values = [];
    if (type === '化验') values = this.examResultOfAssaySearchForm.getFieldsValue();
    else if (type === '医技') {
      if (this.examResultOfTechSearchForm === undefined) return;
      values = this.examResultOfTechSearchForm.getFieldsValue();
    }

    console.log('查询' + this.props.params.memberId + '会员的所有' + type + '检查记录');
    $.ajax({
      url: SERVER + '/api/input/list/' + this.props.params.memberId,
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        type: type,
        secondId: values.secondId[1],
        normal: values.normal,
        beginTime: values.time !== undefined ? formatDate(values.time[0], DATE_FORMAT) : undefined,
        endTime: values.time !== undefined ? formatDate(values.time[1], DATE_FORMAT) : undefined
      }),
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        console.log(result);
        if (result.code === RESULT.SUCCESS) {

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


          if (type === '化验') {
            this.setState({
              examResultDetailOfAssayData: result.content,
              examResultDetailOfAssayItems: examResultDetailItems,
              examResultPageLoading: false
            });
          } else {
            this.setState({
              examResultDetailOfTechData: result.content,
              examResultDetailOfTechItems: examResultDetailItems,
              examResultPageLoading: false
            });
          }
        } else {

          message.error(result.reason, 2);
          this.setState({ examResultPageLoading: false });
        }
      }
    });
  }

  //拉取系统中所有检查亚类
  requestSecondCategoryParentData = (type) => {

    console.log('查询所有' + type + '检查亚类');
    $.ajax({
      url: SERVER + '/api/first/level',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ type: type }),
      // async: false,
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        console.log(result);
        if (result.code === RESULT.SUCCESS) {

          //将后端返回的map整理成级联列表识别的数据结构
          let secondCategoryParentData = [];
          for (let firstCategory in result.content) {

            //加入大类
            let firstCategoryData = { value: firstCategory, label: firstCategory, children: [] };

            //获取旗下所有亚类
            let secondCategories = result.content[firstCategory];
            for (let i = 0; i < secondCategories.length; i++) {
              firstCategoryData.children.push({ value: secondCategories[i].id, label: secondCategories[i].name });
            }

            secondCategoryParentData.push(firstCategoryData);
          }

          if (type === "化验") {
            console.log(secondCategoryParentData);
            this.setState({ secondCategoryParentOfAssayData: secondCategoryParentData });
          } else {
            this.setState({ secondCategoryParentOfTechData: secondCategoryParentData });
          }
        } else {
          message.error(result.reason, 2);
        }
      }
    });
  }


  /**
  *健康摘要库
  */


  //获取memberId用户的所有健康摘要~~~~~~~~~~~~~
  requestHealthResultDetailOfMember = () => {

    let values = this.healthResultSearchForm.getFieldsValue();

    console.log('查询' + this.props.params.memberId + '会员的所有健康摘要');
    $.ajax({
      url: SERVER + '/api/health/list/' + this.props.params.memberId,
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        status: values.status,
        secondId: Number(values.secondId),
        beginTime: values.time !== undefined ? formatDate(values.time[0], DATE_FORMAT) : undefined,
        endTime: values.time !== undefined ? formatDate(values.time[1], DATE_FORMAT) : undefined
      }),
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        console.log(result);
        if (result.code === RESULT.SUCCESS) {

          const role = sessionStorage.getItem(SESSION.ROLE);
          const healthResultDetailItems = result.content.length <= 0
            ?
            <Alert
              message="暂无相关健康摘要"
              description=" "
              type="info"
              showIcon
            />
            :
            result.content.map((detail, index) => <HealthResultDetailItem detail={detail}
              key={index}

              onSave={this.saveHealthDetail}
              saveLoading={this.state.saveLoading}

              onSubmit={this.submitHealthDetail}
              submitLoading={this.state.submitLoading}

              onPass={this.passHealthDetail}
              passLoading={this.state.passLoading}

              onUnpass={this.unpassHealthDetail}
              unpassLoading={this.state.unpassLoading}

              onDownload={this.downloadHealthDetail}
              downloadLoading={this.state.downloadLoading}

              onDelete={this.deleteHealthDetail}
              deleteLoading={this.state.deleteLoading} />);



          this.setState({
            healthResultDetailData: result.content,
            healthResultDetailItems: healthResultDetailItems,
            healthResultPageLoading: false
          });

        } else {

          message.error(result.reason, 2);
          this.setState({ healthResultPageLoading: false });
        }
      }
    });
  }



  /**
  * 添加健康摘要对话框
  **/
  showAddModal = () => this.setState({ addModalVisible: true })
  closeAddModal = () => this.setState({ addModalVisible: false })

  //确认录入健康摘要信息
  confirmAddModal = () => {

    this.refs.healthResultAddForm.validateFields((err, values) => {
      if (!err) {
        console.log('添加一条健康摘要', values);

        //显示加载圈
        this.setState({ confirmAddModalLoading: true });

        $.ajax({
          url: SERVER + '/api/health',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            userId: Number(this.props.params.memberId),
            secondId: Number(values.secondId),
            problemNew: values.problemNew,
            contentNew: values.contentNew
          }),
          dataType: 'json',
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success: (result) => {
            console.log(result);
            if (result.code === RESULT.SUCCESS) {


              //关闭加载圈、对话框
              this.setState({ addModalVisible: false, confirmAddModalLoading: false });
              this.requestHealthResultDetailOfMember();

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

  //保存录入的健康摘要
  saveHealthDetail = (form, id) => {

    console.log('保存录入了的健康摘要', id);
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        //显示加载圈
        this.setState({ saveLoading: true });
        $.ajax({
          url: SERVER + '/api/health/' + id,
          type: 'PUT',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({ problemNew: values.problemNew, contentNew: values.contentNew }),
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success: (result) => {
            console.log(result);
            if (result.code === RESULT.SUCCESS) {

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

  //提交录入的健康摘要（先请求保存、再请求改变状态）
  submitHealthDetail = (form, id) => {

    console.log('提交一份健康摘要,变为待审核', id);

    //先保存
    this.saveHealthDetail(form, id);

    //再提交
    this.setState({ submitLoading: true });
    $.ajax({
      url: SERVER + '/api/health/status/' + id,
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
          this.requestHealthResultDetailOfMember();
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
  * 审核健康摘要对话框
  **/
  passHealthDetail = (form, id) => {

    console.log('通过一份健康摘要,变为已通过', id);

    //显示加载圈
    this.setState({ passLoading: true });
    $.ajax({
      url: SERVER + '/api/health/status/' + id,
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

          this.requestHealthResultDetailOfMember();
          message.success(result.reason, 2);
        } else {

          //关闭加载圈
          this.setState({ passLoading: false });
          message.error(result.reason, 2);
        }
      }
    });
  }

  //不通过
  unpassHealthDetail = (id, unpassReason) => {

    console.log('不通过一份健康摘要,变为未通过', id);

    //显示加载圈
    this.setState({ unpassLoading: true });
    $.ajax({
      url: SERVER + '/api/health/status/' + id,
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

          this.requestHealthResultDetailOfMember();
          message.success(result.reason, 2);
        } else {

          //关闭加载圈
          this.setState({ unpassLoading: false });
          message.error(result.reason, 2);
        }
      }
    });
  }

  // //下载
  // downloadHealthDetail = (id) => {
  //
  //   console.log('请求下载健康摘要', id);
  //
  //   //显示加载圈
  //   this.setState({ downloadLoading: true });
  //   $.ajax({
  //       url : SERVER + '/api/health/download/' + id,
  //       type : 'GET',
  //       dataType : 'json',
  //       beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
  //       success : (result) => {
  //         console.log(result);
  //         if(result.code === RESULT.SUCCESS) {
  //
  //           //下载
  //           window.location.href = FILE_SERVER + result.content;
  //
  //           //关闭加载圈、对话框
  //           this.setState({downloadLoading: false});
  //           message.success(result.reason, 2);
  //         } else {
  //
  //           //关闭加载圈
  //           this.setState({ downloadLoading: false });
  //           message.error(result.reason, 2);
  //         }
  //       }
  //   });
  // }


  //删除
  deleteHealthDetail = (id) => {

    console.log('删除一条健康摘要', id);

    $.ajax({
      url: SERVER + '/api/health/' + id,
      type: 'DELETE',
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        console.log(result);
        if (result.code === RESULT.SUCCESS) {

          this.setState({ deleteLoading: false });

          this.requestHealthResultDetailOfMember();
          message.success(result.reason, 2);
          return;
        } else {
          this.setState({ deleteLoading: false });
          message.error(result.reason, 2);
          return;
        }
      }
    });
  }

  //第一次打开化验数据选项卡
  componentDidMountOfAssayDataTab = (form) => {

    if (form == null) return;
    this.examResultOfAssaySearchForm = form;
    this.requestExamResultDetailOfMember('化验');
  }


  //第一次打开医技数据选项卡
  componentDidMountOfTechDataTab = (form) => {

    if (form == null) return;
    this.examResultOfTechSearchForm = form;
    this.requestExamResultDetailOfMember('医技');
  }

  //第一次打开健康摘要选项卡
  componentDidMountOfHealthResultTab = (form) => {

    if (form == null) return;
    this.healthResultSearchForm = form;
    this.requestHealthResultDetailOfMember();  //拉取该用户的已添加的所有健康摘要
  }

  //获取memberId对应的健康信息
  requestMemberInfoData = () => {

    $.ajax({
      url: SERVER + '/api/user/' + this.props.params.memberId,
      type: 'GET',
      dataType: 'json',
      beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
      success: (result) => {

        console.log(result);
        if (result.code !== RESULT.SUCCESS) {
          message.error(result.reason, 2);
        }

        this.setState({ memberInfo: result.content });
      }
    });
  }

  //获取memberId对应的健康信息
  updateMemberInfoData = () => {

    this.refs.memberInfoForm.validateFields((err, values) => {
      if (!err) {
        console.log('更新会员的健康信息表', values);

        //显示加载圈
        this.setState({ updateMemberInfoLoading: true });
        $.ajax({
          url: SERVER + '/api/user/' + this.props.params.memberId,
          type: 'PUT',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({
            name: values.name,
            birth: values.birth,
            gender: values.gender,
            idCard: values.idCard,
            physicalCondition: values.physicalCondition,
            maritalStatus: values.maritalStatus,
            medicalCare: values.medicalCare,
            hospital: values.hospital,
            insurance: values.insurance,
            allergyDrug: values.allergyDrug,
            allergyOthers: values.allergyOthers
          }),
          beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
          success: (result) => {
            console.log(result);
            if (result.code === RESULT.SUCCESS) {

              //关闭加载圈、对话框
              this.setState({ updateMemberInfoLoading: false });
              message.success(result.reason, 2);
            } else {

              //关闭加载圈
              this.setState({ updateMemberInfoLoading: false });
              message.error(result.reason, 2);
            }
          }
        });
      }
    });
  }

  //点击跳转按钮跳转到详情页面
  handleClickJumpBtn = (page) => {

    const role = sessionStorage.getItem(SESSION.ROLE);

    if (role === ROLE.MEMBER_1
      && (page === ROUTE.MEMBER_DETAIL_HEALTH_RESULT
        || page === ROUTE.MEMBER_DETAIL_ASSAY_RESULT
        || page === ROUTE.MEMBER_DETAIL_TECH_RESULT)) {

      message.error('一级会员无法访问该项目', 2);
      return;
    }

    const targetUrl = page.URL_PREFIX + "/" + page.MENU_KEY + "/" + this.props.params.memberId + "/" + this.props.params.memberName;

    //跳转
    browserHistory.push(targetUrl);
  }



  componentDidMount = () => {

    //拉取该人的健康信息表数据
    this.requestMemberInfoData();
  }

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);


    //拆分examResultDetailData
    //1.组装成卡片+表格条目
    //2.组装成锚点目录
    const examResultDetailOfAssayAnchors = this.state.examResultDetailOfAssayData.map((detail, index) => <Anchor.Link href={"#" + detail.id.toString()} key={index} title={detail.secondName + " " + formatDate(detail.time)} />);
    const examResultDetailOfTechAnchors = this.state.examResultDetailOfTechData.map((detail, index) => <Anchor.Link href={"#" + detail.id.toString()} key={index} title={detail.secondName + " " + formatDate(detail.time)} />);
    const healthResultDetailAnchors = this.state.healthResultDetailData.map((detail, index) => <Anchor.Link href={"#" + detail.id.toString()} key={index} title={detail.secondName + " " + formatDate(detail.time)} />);

    return (
      <div>
        <BackTop visibilityHeight="200" />
        {
          isEmployee(role)
            ?
            <Breadcrumb className="category-path">
              <Breadcrumb.Item><Link to={ROUTE.MEMBER_MANAGE.URL_PREFIX + "/" + ROUTE.MEMBER_MANAGE.MENU_KEY}>会员管理</Link></Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.params.memberName}</Breadcrumb.Item>
            </Breadcrumb>
            :
            null
        }

        <div style={{ textAlign: 'center'}}>
          <h2 style={{ marginBottom: '15px', color: '#1DA57A' }}>健康详情入口</h2>
          <Card title="电子健康银行" className="card">
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_MENZHEN)}>门诊病历</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_ZHUYUAN)}>住院资料</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_TIJIAN)}>体检资料</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_YINGXIANG)}>门诊医技</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_YAKE)}>牙科资料</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_ZHONGYI)}>中医资料</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_XINLI)}>门诊化验</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_QITA)}>其他资料</Button>
          </Card>
          <Card title="健康大数据库" className="card" style={{ width: '20%' }}>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_HEALTH_RESULT)}>健康摘要库</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_ASSAY_RESULT)}>化验数据库</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.MEMBER_DETAIL_TECH_RESULT)}>医技数据库</Button>
          </Card>
          <Card title="健康长程管理" className="card" style={{ width: '28%' }}>
            <Button className="card-btn">健康管理方案</Button>
            <Button className="card-btn">健康问题记录</Button>
            <Button className="card-btn">专病监测表格</Button>
            <Button className="card-btn">调查评估量表</Button>
            <Button className="card-btn">私人定制体检</Button>
            <Button className="card-btn">年度健康总结</Button>
          </Card>
          <Card title="会员服务预约" className="card" style={{ width: '22%' }}>
            <Button className="card-btn" >体检服务预约单</Button>
            <Button className="card-btn">就医服务预约单</Button>
            <Button className="card-btn" >其他服务预约单</Button>
          </Card>
        </div>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <MemberInfoTable ref="memberInfoForm" memberInfo={this.state.memberInfo} updateMemberInfoLoading={this.state.updateMemberInfoLoading} onClick={this.updateMemberInfoData} />
        {/* <Tabs defaultActiveKey="1"  tabBarExtraContent={role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN ? <Button type="primary" onClick={this.showAddModal} style={{display: this.state.addHealthResultBtnVisible}}>添加健康摘要</Button> : null} onChange={this.handleMenuItemClick}>
          {
            role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN
            || role === ROLE.MEMBER_1 || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3
            ?
            <TabPane tab="电子资料" key="1">
              <MemberDetailOriginResultSearchForm ref="originResultSearchForm" requestOriginResultOfMember={this.requestOriginResultOfMember}/>
              <Table className='origin-result-table' columns={originResultColumns} dataSource={this.state.originResultData} rowKey='id' loading={this.state.originResultTableLoading} pagination={this.state.originResultPager} onChange={this.changeOriginResultPager}/>
            </TabPane>
            :
            null
          }

          {
            role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN
            || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3
            ?
            <TabPane tab="化验辅检数据" key="2">
              <ExamResultDetailSearchForm ref={this.componentDidMountOfAssayDataTab} type="化验" requestExamResultDetailOfMember={this.requestExamResultDetailOfMember} secondCategoryParentData={this.state.secondCategoryParentOfAssayData}/>
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

          {
            role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN
            || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3
            ?
            <TabPane tab="医技辅检数据" key="3">
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
            :
            null
          }

          {
            role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN
            || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3
            ?
            <TabPane tab="健康摘要" key="4">
              <HealthResultDetailSearchForm ref={this.componentDidMountOfHealthResultTab} healthResultTypeData={this.state.healthResultTypeData} requestHealthResultDetailOfMember={this.requestHealthResultDetailOfMember}/>
              <div className="health-result-detail-info">
                <Anchor className="health-result-detail-anchor">
                  {healthResultDetailAnchors}
                </Anchor>
                <Timeline pending={this.state.healthResultDetailData.length <= 0 ? null : <h4>已到底部</h4>}>
                  {this.state.healthResultDetailItems}
                </Timeline>
              </div>
            </TabPane>
            :
            null
          }
        </Tabs>
        <OriginResultWatchPictureModal visible={this.state.watchPictureModalVisible} onCancel={this.closeWatchPictureModal} fileList={this.state.fileList} />
        <HealthResultDetailAddModal ref="healthResultAddForm" visible={this.state.addModalVisible} confirmLoading={this.state.confirmAddModalLoading} onCancel={this.closeAddModal} onConfirm={this.confirmAddModal} healthResultTypeData={this.state.healthResultTypeData}/> */}
      </div>
    );
  }
}

export default MemberDetail;
