import './CategoryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, ROUTE} from './../../App/PublicConstant.js'
import CategoryAddForm from './CategoryAddForm.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, Breadcrumb, Button} from 'antd';
import $ from 'jquery';
import {Link} from 'react-router';
import ThirdCategoryEditModal from './ThirdCategoryEditModal.js'
const TabPane = Tabs.TabPane;


class ThirdCategoryManage extends React.Component {

  state = {

    //亚亚类
    thirdCategoryData: [],
    thirdCategoryTableLoading: false,
    pager: {pageSize: PAGE_SIZE, total: 0},

    editModalVisible: false,
    confirmLoading: false
  };

  //拉取firstId下的所有亚类
  requestSecondCategoryData = (secondId, pageNow) => {

    console.log('查询'+ this.props.params.secondName +'下的所有检查项目');

    this.setState({ thirdCategoryTableLoading: true});
    $.ajax({
        url : SERVER + '/api/third/' + secondId + '/list',
        type : 'POST',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({pageNow: pageNow, pageSize: PAGE_SIZE}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //更新页码
                const pager = this.state.pager;
                pager.total = result.content.rowTotal;
                pager.current = pageNow;

                this.setState({
                  thirdCategoryData: result.content.data,
                  pager: pager
                });
            } else {
                message.error(result.reason, 2);
            }

            this.setState({ thirdCategoryTableLoading: false});
        }
    });
  }

  //翻页
  changePager = (pager) => {
    this.requestSecondCategoryData(this.props.params.secondId, pager.current);
  }

  //删除亚亚类
  handleDelete(record) {

    console.log('删除检查项目', record);

    this.setState({ thirdCategoryTableLoading: true});
    $.ajax({
        url : SERVER + '/api/third/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.requestSecondCategoryData(this.props.params.secondId, 1);

                message.success(result.reason, 2);
            } else {

                message.error(result.reason, 2);
            }

            this.setState({ thirdCategoryTableLoading: false});
        }
    });
  }

  //打开编辑对话框
  showEditModal = (record) => {

    this.setState({editModalVisible: true});

    this.categoryId = record.id //保存当前正在编辑的类别，方便更新提交时使用

    this.requestCategory(this.categoryId);
  }

  closeEditModal = () => {

    this.setState({editModalVisible: false});
  }

  //保存子组件引用
  saveEditFormRef = (form) => {

    this.editForm = form;
  }

  //查询categoryId类别信息显示到对话框内
  requestCategory = (categoryId) => {

    console.log('查询检查项目', categoryId);

    $.ajax({
        url : SERVER + '/api/third/' + categoryId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                let category = result.content;
                this.editForm.setFieldsValue({secondId: this.props.params.secondId,
                                              name: category.name,
                                              systemCategory: category.systemCategory,
                                              referenceValue: category.referenceValue,
                                              hospital: category.hospital});

                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //确认更新信息
  confirmEditModal = () => {

    //请求修改亚亚类
    this.editForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改检查项目', values);

        //显示加载圈
        this.setState({ confirmLoading: true });

        $.ajax({
            url : SERVER + '/api/third/' + this.categoryId,
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({name: values.name,
                                   systemCategory: values.systemCategory,
                                   referenceValue: values.referenceValue,
                                   hospital: values.hospital}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.requestSecondCategoryData(this.props.params.secondId, 1);

                //关闭加载圈、对话框
                this.setState({
                  editModalVisible: false,
                  confirmLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }


  componentDidMount = () => {

    this.requestSecondCategoryData(this.props.params.secondId, 1);
  }

  render(){

    const thirdCategoryColumns = [{
      title: '检查项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <a>{name}</a>,
    },{
      title: '系统分类',
      dataIndex: 'systemCategory',
      key: 'systemCategory',
    },{
      title: '参考值及单位',
      dataIndex: 'referenceValue',
      key: 'referenceValue',
    },{
      title: '301医院',
      dataIndex: 'hospital',
      key: 'hospital',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该项目吗?" onConfirm={() => this.handleDelete(record)} okText="是" cancelText="取消">
            <a className='operation-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];


    return (
        <div>
          <Breadcrumb separator=">" className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.HOME_FIRST_CATEGORY_MANAGE.URL_PREFIX + "/" + this.props.params.tabKey}>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={ROUTE.HOME_SECOND_CATEGORY_MANAGE.URL_PREFIX + "/" + this.props.params.tabKey + "/" + this.props.params.firstId + "/" + this.props.params.firstName}>{this.props.params.firstName}</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.params.secondName}</Breadcrumb.Item>
          </Breadcrumb>
          <Table className='third-category-table' columns={thirdCategoryColumns} dataSource={this.state.thirdCategoryData} rowKey='id' loading={this.state.thirdCategoryTableLoading} pagination={this.state.pager} onChange={this.changePager}/>
          <ThirdCategoryEditModal ref={this.saveEditFormRef} visible={this.state.editModalVisible} confirmLoading={this.state.confirmLoading} onCancel={this.closeEditModal} onConfirm={this.confirmEditModal} />
        </div>
    );
  }
}

export default ThirdCategoryManage;