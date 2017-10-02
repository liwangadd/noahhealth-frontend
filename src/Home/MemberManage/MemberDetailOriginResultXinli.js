import './MemberManage.css';
import {SERVER, SESSION, RESULT, ROLE, FILE_SERVER, ROUTE, LOADING_DELAY_TIME, DATE_FORMAT, PAGE_SIZE, STYLE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import {isEmployee, isAdviser} from './../../App/PublicMethod.js';
import ExamResultDetailItem from './../ExamResultManage/ExamResultDetailItem.js';
import HealthResultDetailItem from './../HealthResultManage/HealthResultDetailItem.js';
import React from 'react';
import MemberDetailOriginResultSearchForm from './MemberDetailOriginResultSearchForm.js';
import ExamResultOverviewSearchForm from './../ExamResultManage/ExamResultOverviewSearchForm.js';
import ExamResultOverviewOfTech from './../ExamResultManage/ExamResultOverviewOfTech.js';
import HealthResultDetailSearchForm from './../HealthResultManage/HealthResultDetailSearchForm.js';
import OriginResultWatchPictureModal from './../OriginResultManage/OriginResultWatchPictureModal.js';
import HealthResultDetailAddModal from './../HealthResultManage/HealthResultDetailAddModal.js';
import MemberInfoTable from './MemberInfoTable.js';
import {message, Button, BackTop, Breadcrumb, Timeline, Anchor, Alert, Spin, Tabs, Table, Tooltip, Card} from 'antd';
import {Link, browserHistory} from 'react-router';
import $ from 'jquery';

const TabPane = Tabs.TabPane;

class MemberDetailOriginResultXinli extends React.Component {

  state = {

    /*
    *电子资料库
    */
    typeName: '心理资料',
    secondId: -1,
    originResultTypeData: [],

    originResultTableLoading: false,
    originResultData: [],
    originResultPager: {pageSize: PAGE_SIZE, total: 0},
    watchPictureModalVisible: false, //查看扫描件对话框
    fileList: [],

  };

  findSecondIdByTypeName = (originResultTypeData) => {

    for(let i = 0; i < originResultTypeData.length; i++) {

      if(originResultTypeData[i].label === this.state.typeName) {

        return originResultTypeData[i].value;
      }
    }
  }

  /**
  * 电子资料库
  */

  //查询某个会员的电子资料
  requestOriginResultOfMember = (pageNow) => {

    this.refs.originResultSearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ originResultTableLoading: true});

        console.log('拉取第'+ pageNow + "页原始数据-执行情况信息", values);

        $.ajax({
            url : SERVER + '/api/origin/list/' + this.props.params.memberId,
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({secondId: this.state.secondId,
                                   userName : values.userName,
                                   memberNum: values.memberNum,
                                   uploaderName : values.uploaderName,
                                   checkerName: values.checkerName,
                                   status: values.status,
                                   beginTime: values.time !== undefined ? formatDate(values.time[0], DATE_FORMAT) : undefined,
                                   endTime: values.time !== undefined ? formatDate(values.time[1], DATE_FORMAT) : undefined,
                                   pageNow: pageNow,
                                   pageSize: PAGE_SIZE}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code !== RESULT.SUCCESS) {
                    this.setState({ originResultTableLoading: false});
                    message.error(result.reason, 2);
                    return;
                }

                //更新页码
                const originResultPager = this.state.originResultPager;
                originResultPager.total = result.content.rowTotal;
                originResultPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({ originResultData: result.content.data, originResultTableLoading: false, originResultPager});
            }
        });
      }
    });
  }

  //翻页
  changeOriginResultPager = (pager) =>  this.requestOriginResultOfMember(pager.current)

  //查看扫描件对话框
  showWatchPictureModal = (originResultId) => {

    this.setState({watchPictureModalVisible: true});
    this.requestUploadedPictures(originResultId); //获取originResultId已上传了的文件
  }

  closeWatchPictureModal = () => this.setState({watchPictureModalVisible: false})

  requestUploadedPictures = (originResultId) => {

    console.log("拉取第" + originResultId + "号已上传了的所有文件");
    $.ajax({
        url : SERVER + '/api/origin/file/' + originResultId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

          console.log(result);
          if(result.code !== RESULT.SUCCESS) {
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
          this.setState({fileList: fileList});
        }
    });
  }

  //拉取电子资料类别级联数据
  requestOriginResultSecondType = () => {

    console.log('拉取电子资料类别数据');
    $.ajax({
        url : SERVER + '/api/origin_category/level',
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code !== RESULT.SUCCESS) {
                message.error(result.reason, 2);
                return;
            }

            //将后端返回的map整理成级联列表识别的数据结构
            let originResultTypeData = [];
            for(let firstType in result.content) {

              //加入大类
              let firstTypeData = {value: result.content[firstType][0].id, label: firstType};
              originResultTypeData.push(firstTypeData);
            }

            let secondId = this.findSecondIdByTypeName(originResultTypeData);
            this.setState({originResultTypeData: originResultTypeData,
                           secondId: secondId});

            this.requestOriginResultOfMember(1);
        }
    });
  }



  componentDidMount = () => {

      this.requestOriginResultSecondType();
  }

  render(){

    const role = sessionStorage.getItem(SESSION.ROLE);

    const originResultColumns = [{
      title: '资料名称',
      dataIndex: 'note',
      key: 'note'
    },{
      title: '异常判断',
      dataIndex: 'normal',
      key: 'normal',
      render: (normal) => normal === '异常' ? <span className="abnormal">异常</span> : null
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
      key: 'checkerName',
      render: (checkerName) => checkerName === null ? '/' : checkerName
    }, {
      title: '操作',
      key: 'action',
      render: (record) =>  <a onClick={() => this.showWatchPictureModal(record.id)}>查看扫描件</a>
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
              <Breadcrumb.Item>心理资料</Breadcrumb.Item>
            </Breadcrumb>
            :
            <Breadcrumb className="category-path">
              <Breadcrumb.Item><Link to={ROUTE.MEMBER_DETAIL.URL_PREFIX + "/" + ROUTE.MEMBER_DETAIL.MENU_KEY + "/" + this.props.params.memberId + "/" + this.props.params.memberName}>个人资料</Link></Breadcrumb.Item>
              <Breadcrumb.Item>心理资料</Breadcrumb.Item>
            </Breadcrumb>
          }
          <Tabs defaultActiveKey="1">

            {
              role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN
              || role === ROLE.MEMBER_1 || role === ROLE.MEMBER_2 || role === ROLE.MEMBER_3
              ?
              <TabPane tab="心理资料" key="1">
                <MemberDetailOriginResultSearchForm ref="originResultSearchForm" requestOriginResultOfMember={this.requestOriginResultOfMember}/>
                <Table className='origin-result-table' columns={originResultColumns} dataSource={this.state.originResultData} rowKey='id' loading={this.state.originResultTableLoading} pagination={this.state.originResultPager} onChange={this.changeOriginResultPager}/>
              </TabPane>
              :
              null
            }
          </Tabs>
          <OriginResultWatchPictureModal visible={this.state.watchPictureModalVisible} onCancel={this.closeWatchPictureModal} fileList={this.state.fileList} />
      </div>
    );
  }
}

export default MemberDetailOriginResultXinli;
