import './OriginResultManage.css';
import {SERVER, SESSION, RESULT, ROUTE, PAGE_SIZE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import OriginResultSearchForm from './OriginResultSearchForm.js';
import OriginResultUploadModal from './OriginResultUploadModal.js';
import React from 'react';
import {Tabs, Table, message, Popconfirm, Button, BackTop} from 'antd';
import $ from 'jquery';
import {Link} from 'react-router';
const TabPane = Tabs.TabPane;


class OriginResultManage extends React.Component {

  state = {

    //待审核
    originResultData: [],
    originResultTableLoading: false,
    originResultPager: {pageSize: PAGE_SIZE, total: 0},

    //添加对话框
    uploadModalVisible: false,
    confirmUploadModalLoading: false,
    secondCategoryParentOfAssayData: [],
    secondCategoryParentOfTechData: []
  };


  /**
  * 待审核表格
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
                                   secondName : values.secondName,
                                   uploaderName : values.uploaderName,
                                   checkerName: values.checkerName,
                                   inputerName: values.inputerName,
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




  /**
  * 待录入表格
  **/




  /**
  * 上传原始资料扫描件对话框
  **/
  showUploadModal = () => this.setState({ uploadModalVisible: true})
  closeUploadModal = () => this.setState({ uploadModalVisible: false})

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

                  if(this.refs.uploadForm == null) return;
                  this.refs.uploadForm.setFieldsValue({secondCategoryParentOfAssayId: secondCategoryParentData.length > 0 ? [secondCategoryParentData[0].value, secondCategoryParentData[0].children[0].value] : []});
                } else {

                  this.setState({secondCategoryParentOfTechData: secondCategoryParentData});

                  if(this.refs.uploadForm == null) return;
                  this.refs.uploadForm.setFieldsValue({secondCategoryParentOfTechId: secondCategoryParentData.length > 0 ? [secondCategoryParentData[0].value, secondCategoryParentData[0].children[0].value] : []});
                }
            } else {
                message.error(result.reason, 2);
            }
        }
    });
  }

  //确认更新信息
  confirmUploadModal = () => {

    //请求修改亚亚类
    this.refs.uploadForm.validateFields((err, values) => {
      if(!err) {
        console.log('上传一份原始资料', values);

        //显示加载圈
        this.setState({ confirmUploadModalLoading: true });

        $.ajax({
            url : SERVER + '/api/origin',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({type: this.categoryType, name: values.name}),
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
                message.success(result.reason, 2);
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



  componentDidMount = () => {

    this.handleSearchOriginResultList(1);
    this.requestSecondCategoryParentData("化验");
    this.requestSecondCategoryParentData("医技");
  }


  render(){

    const originResultColumns = [{
      title: '会员姓名',
      dataIndex: 'userName',
      key: 'userName',
      render: (name) => <a>{name}</a>,
    },{
      title: '检查亚类',
      dataIndex: 'secondName',
      key: 'secondName'
    },{
      title: '上传者',
      dataIndex: 'uploaderName',
      key: 'uploaderName'
    }, {
      title: '审核者',
      dataIndex: 'checkerName',
      key: 'checkerName'
    }, {
      title: '录入者',
      dataIndex: 'inputerName',
      key: 'inputerName'
    },{
      title: '日期',
      dataIndex: 'time',
      key: 'time',
      render: (time) => formatDate(time)
    }, {
      title: '执行状态',
      dataIndex: 'status',
      key: 'status'
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showOriginResultEditModal(record)}>查看</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该条执行记录吗?" onConfirm={() => this.handleOriginResultDelete(record)} okText="是" cancelText="取消">
            <a className='operation-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];

    return (
      <div>
        <BackTop visibilityHeight="200"/>
        <Tabs defaultActiveKey={"1"} tabBarExtraContent={<Button type="primary" onClick={this.showUploadModal}>上传原始资料</Button>}>
          <TabPane tab="执行情况" key="1">
            <OriginResultSearchForm ref="searchForm" handleSearchOriginResultList={this.handleSearchOriginResultList}/>
            <Table className='origin-result-table' columns={originResultColumns} dataSource={this.state.originResultData} rowKey='id' loading={this.state.originResultTableLoading}/>
          </TabPane>
        </Tabs>
        <OriginResultUploadModal ref="uploadForm" visible={this.state.uploadModalVisible} confirmLoading={this.state.confirmUploadModalLoading} onCancel={this.closeUploadModal} onConfirm={this.confirmUploadModal} secondCategoryParentOfAssayData={this.state.secondCategoryParentOfAssayData} secondCategoryParentOfTechData={this.state.secondCategoryParentOfTechData}  />
      </div>
    );
  }
}

export default OriginResultManage;
