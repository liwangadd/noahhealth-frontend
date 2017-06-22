import './CategoryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, ROUTE} from './../../App/PublicConstant.js'
import CategoryAddForm from './CategoryAddForm.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, Breadcrumb, Button} from 'antd';
import $ from 'jquery';
import {Link} from 'react-router';
import FirstSecondCategoryEditModal from './FirstSecondCategoryEditModal.js'
const TabPane = Tabs.TabPane;


class SecondCategoryManage extends React.Component {

  state = {

    //亚类
    secondCategoryData: [],
    secondCategoryTableLoading: false,
    pager: {pageSize: PAGE_SIZE, total: 0},

    editModalVisible: false,
    confirmLoading: false
  };

  //拉取firstId下的所有亚类
  requestSecondCategoryData = (firstId, pageNow) => {

    console.log('查询'+ this.props.params.firstName +'下的所有检查亚类');

    this.setState({ secondCategoryTableLoading: true});
    $.ajax({
        url : SERVER + '/api/second/' + firstId + '/list',
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
                  secondCategoryData: result.content.data,
                  pager: pager
                });
            } else {
                message.error(result.reason, 2);
            }

            this.setState({ secondCategoryTableLoading: false});
        }
    });
  }

  //翻页
  changePager = (pager) => {
    this.requestSecondCategoryData(this.props.params.firstId, pager.current);
  }


  //删除亚类
  handleDelete(record) {

    console.log('删除检查亚类', record);

    this.setState({ secondCategoryTableLoading: true});
    $.ajax({
        url : SERVER + '/api/second/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.requestSecondCategoryData(this.props.params.firstId, 1);

                message.success(result.reason, 2);
            } else {
                message.error(result.reason, 2);
            }

            this.setState({ secondCategoryTableLoading: false});
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

    console.log('查询检查亚类', categoryId);

    $.ajax({
        url : SERVER + '/api/second/' + categoryId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                let category = result.content;
                this.editForm.setFieldsValue({name: category.name});

                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }



  componentDidMount = () => {

    this.requestSecondCategoryData(this.props.params.firstId, 1);
  }

  render(){

    const secondCategoryColumns = [{
      title: '检查亚类名称',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => <Link to={ROUTE.HOME_THIRD_CATEGORY_MANAGE.URL_PREFIX + "/" + this.props.params.tabKey + "/" + this.props.params.firstId +"/" + this.props.params.firstName + "/" + record.id + "/" + name}>{name}</Link>,
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该亚类吗?" onConfirm={() => this.handleDelete(record)} okText="是" cancelText="取消">
            <a className='operation-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];


    return (
        <div>
          <Breadcrumb separator=">" className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.HOME_FIRST_CATEGORY_MANAGE.URL_PREFIX + "/" + this.props.params.tabKey}>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.params.firstName}</Breadcrumb.Item>
          </Breadcrumb>
          <Table className='second-category-table' columns={secondCategoryColumns} dataSource={this.state.secondCategoryData} rowKey='id' loading={this.state.secondCategoryTableLoading} pagination={this.state.pager} onChange={this.changePager}/>
          <FirstSecondCategoryEditModal ref={this.saveEditFormRef} visible={this.state.editModalVisible} confirmLoading={this.state.confirmLoading} onCancel={this.closeEditModal} onConfirm={this.confirmEditModal} />
        </div>
    );
  }
}

export default SecondCategoryManage;