import './OriginResultManage.css';
import {SERVER, SESSION, RESULT, ROUTE, PAGE_SIZE, ROLE, FILE_SERVER} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import OriginResultSearchForm from './OriginResultSearchForm.js';
import OriginResultUploadModal from './OriginResultUploadModal.js';
import OriginResultUploadPictureModal from './OriginResultUploadPictureModal.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, Button, BackTop, Modal, Tooltip} from 'antd';
import $ from 'jquery';
import {Link} from 'react-router';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class OriginResultManage extends React.Component {

  state = {

    //执行情况
    originResultData: [],
    originResultTableLoading: false,
    originResultPager: {pageSize: PAGE_SIZE, total: 0},

    //添加对话框
    uploadModalVisible: false,
    confirmUploadModalLoading: false,
    memberUnderEmployeeData: [],

    //上传扫描件
    uploadPictureModalVisible: false,
    originResultId: -1,
    fileList: []
  };


  /**
  * 执行情况表格
  **/

  //查表
  handleSearchOriginResultList = (pageNow) => {

    this.refs.searchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ originResultTableLoading: true});

        console.log('拉取第'+ pageNow + "页原始数据-执行情况信息", values);

        $.ajax({
            url : SERVER + '/api/origin/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({userName : values.userName,
                                   uploaderName : values.uploaderName,
                                   checkerName: values.checkerName,
                                   status: values.status,
                                   time: values.time,
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
                const originResultPager = this.state.originResultPager;
                originResultPager.total = result.content.rowTotal;
                originResultPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  originResultData: result.content.data,
                  originResultPager
                });

                this.setState({ originResultTableLoading: false});
            }
        });
      }
    });
  }

  //翻页
  changeOriginResultPager = (pager) =>  this.handleSearchOriginResultList(pager.current)



  /**
  * 上传原始资料对话框
  **/
  showUploadModal = () => this.setState({ uploadModalVisible: true})
  closeUploadModal = () => this.setState({ uploadModalVisible: false})

  //确认上传原始资料信息
  confirmUploadModal = () => {

    this.refs.uploadForm.validateFields((err, values) => {
      if(!err) {
        console.log('上传一份原始资料', values);

        //显示加载圈
        this.setState({ confirmUploadModalLoading: true });
        $.ajax({
            url : SERVER + '/api/origin',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({userId: Number(values.userId),
                                   time: values.time,
                                   note: values.note}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                this.handleSearchOriginResultList(this.state.originResultPager.current); //更新表格数据

                //关闭加载圈、对话框
                this.setState({
                  uploadModalVisible: false,
                  confirmUploadModalLoading: false,
                });

                //询问是否弹出上传对话框继续上传扫描件
                let originResultId = result.content;
                confirm({title: '添加成功! 是否继续上传原始资料的扫描件?',
                         onOk: () => this.showUploadPictureModal(originResultId)});

              } else {

                //关闭加载圈
                this.setState({ confirmUploadModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  /**
  * 上传扫描件图片对话框
  **/

  showUploadPictureModal = (originResultId) => {

    this.setState({uploadPictureModalVisible: true});

    //record.path对应的图片显示到上传预览组件中
    //ajax查询originResult，获得其fileList
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
          fileList.map((file, index) => {
            file.uid = index;
            file.status = 'done';
            file.url = FILE_SERVER + file.url;
          });

          //更新状态
          this.setState({fileList: fileList, originResultId: originResultId});
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

      if(info.file.response.code === RESULT.SUCCESS) {
        message.success(`${info.file.name} 上传成功`);
      } else {
        message.error(info.file.response.reason);
      }
    } else if (info.file.status === 'error') {

      message.error(`${info.file.name} 上传失败.`);
    } else if (info.file.status === 'removed') {

      //请求删除文件
      const fileName = info.file.url.split('/')[4];
      this.requestDeletePicture(this.state.originResultId, fileName);
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
    this.setState({fileList: fileList});
  }

  requestDeletePicture = (originResultId, fileName) => {

    console.log('删除' + originResultId + '号原始数据记录的扫描件-', fileName);

    $.ajax({
        url : SERVER + '/api/origin/file/' + originResultId,
        type : 'DELETE',
        dataType : 'json',
        contentType: 'application/json',
        data : JSON.stringify({fileName: fileName}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                message.success(result.reason, 2);
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });

  }

  closeUploadPictureModal = () => this.setState({uploadPictureModalVisible: false})

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
              if(this.refs.uploadForm == null) return;
              this.refs.uploadForm.setFieldsValue({userId: memberUnderEmployeeData.length > 0 ? memberUnderEmployeeData[0].id.toString() : ''});
          }
      });
  }


  componentDidMount = () => {

    this.handleSearchOriginResultList(1);

    //拉取上传对话框中的会员信息(该employee旗下的)
    this.requestMembersUnderEmployee();
  }


  render(){

    const role = sessionStorage.getItem(SESSION.ROLE);

    const originResultColumns = [{
      title: '会员姓名',
      dataIndex: 'userName',
      key: 'userName',
      render: (name) => <a>{name}</a>,
    },{
      title: '上传者',
      dataIndex: 'uploaderName',
      key: 'uploaderName'
    },{
      title: '上传日期',
      dataIndex: 'time',
      key: 'time',
      render: (time) => formatDate(time)
    },{
      title: '备注',
      dataIndex: 'note',
      key: 'note'
    },{
      title: '审核者',
      dataIndex: 'checkerName',
      key: 'checkerName'
    }, {
      title: '执行状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => status === '未通过' ? <Tooltip title={record.reason}><span className="unpass">未通过</span></Tooltip> : status
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>

          {
            (record.status === '待上传' || record.status === '上传中' || record.status === '未通过') && (role === ROLE.EMPLOYEE_ARCHIVER || role === ROLE.EMPLOYEE_ADMIN)
            ?
            <span>
              <a onClick={() => this.showUploadPictureModal(record.id)}>
                {
                  record.status === '未通过'
                  ?
                  "重新上传扫描件"
                  :
                  "上传扫描件"
                }
              </a>
              <span className="ant-divider"/>
            </span>
            :
            null
          }

          {
            (record.status === '待审核') && (role === ROLE.EMPLOYEE_ARCHIVE_MANAGER || role === ROLE.EMPLOYEE_ADMIN)
            ?
            <span>
              <a onClick={() => this.showCheckModal(record)}>审核</a>
              {
                role === ROLE.EMPLOYEE_ADMIN
                ?
                <span className="ant-divider"/>
                :
                null
              }
            </span>
            :
            null
          }

          {
            (record.status === '已录入') && (role === ROLE.EMPLOYEE_ADVISER || role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN)
            ?
            <span>
              <a onClick={() => this.showWatchModal(record)}>查看扫描件</a>
              {
                role === ROLE.EMPLOYEE_ADMIN
                ?
                <span className="ant-divider"/>
                :
                null
              }
            </span>
            :
            null
          }

          {
            ((record.status === '上传中' || record.status === '未通过') && role === ROLE.EMPLOYEE_ARCHIVER) || role === ROLE.EMPLOYEE_ADMIN
            ?
            <Popconfirm title="您确定要删除该条原始资料吗?" onConfirm={() => this.handleDelete(record)} okText="是" cancelText="取消">
              <a className='operation-delete'>删除</a>
            </Popconfirm>
            :
            null
          }
        </span>
      )
    }];

    return (
      <div>
        <BackTop visibilityHeight="200"/>
        <Tabs defaultActiveKey={"1"} tabBarExtraContent={role === ROLE.EMPLOYEE_ARCHIVER || role === ROLE.EMPLOYEE_ADMIN ? <Button type="primary" onClick={this.showUploadModal}>上传原始资料</Button> : null}>
          <TabPane tab="原始资料" key="1">
            <OriginResultSearchForm ref="searchForm" handleSearchOriginResultList={this.handleSearchOriginResultList}/>
            <Table className='origin-result-table' columns={originResultColumns} dataSource={this.state.originResultData} rowKey='id' loading={this.state.originResultTableLoading} pagination={this.state.originResultPager} onChange={this.changeOriginResultPager}/>
          </TabPane>
        </Tabs>
        <OriginResultUploadModal ref="uploadForm" visible={this.state.uploadModalVisible} confirmLoading={this.state.confirmUploadModalLoading} onCancel={this.closeUploadModal} onConfirm={this.confirmUploadModal} memberUnderEmployeeData={this.state.memberUnderEmployeeData}/>
        <OriginResultUploadPictureModal visible={this.state.uploadPictureModalVisible} onCancel={this.closeUploadPictureModal} fileList={this.state.fileList} originResultId={this.state.originResultId} onChange={this.handleUploadPictureChange}/>
      </div>
    );
  }
}

export default OriginResultManage;
