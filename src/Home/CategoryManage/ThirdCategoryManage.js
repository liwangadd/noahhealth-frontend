import './CategoryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROUTE} from './../../App/PublicConstant.js'
import React from 'react';
import {Table, message, Popconfirm, Breadcrumb} from 'antd';
import $ from 'jquery';
import {Link} from 'react-router';
import ThirdCategoryEditModal from './ThirdCategoryEditModal.js'


class ThirdCategoryManage extends React.Component {

  state = {

    //亚亚类
    thirdCategoryData: [],
    thirdCategoryTableLoading: false,
    pager: {pageSize: PAGE_SIZE, total: 0},

    editModalVisible: false,
    confirmLoading: false
  };

  //拉取secondId下的所有亚亚类
  requestThirdCategoryData = (secondId, pageNow) => {

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
  changePager = (pager) => this.requestThirdCategoryData(this.props.params.secondId, pager.current)

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
                this.requestThirdCategoryData(this.props.params.secondId, 1);

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

  closeEditModal = () => this.setState({editModalVisible: false})


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
                this.refs.editForm.setFieldsValue({name: category.name,
                                              referenceValue: category.referenceValue,
                                              enShort: category.enShort});

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
    this.refs.editForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改检查项目', values);

        //显示加载圈
        this.setState({ confirmLoading: true });

        $.ajax({
            url : SERVER + '/api/third/' + this.categoryId,
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({secondId: Number(this.props.params.secondId),
                                   name: values.name,
                                   referenceValue: values.referenceValue,
                                   enShort: values.enShort}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.requestThirdCategoryData(this.props.params.secondId, this.state.pager.current);

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


  componentDidMount = () => this.requestThirdCategoryData(this.props.params.secondId, 1)

  render(){

    const thirdCategoryColumns = [{
      title: '检查项目名称',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '英文缩写',
      dataIndex: 'enShort',
      key: 'enShort'
    },{
      title: '参考值及单位',
      dataIndex: 'referenceValue',
      key: 'referenceValue',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该项目吗?" onConfirm={() => this.handleDelete(record)}>
            <a className='operation-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];


    return (
        <div>
          <Breadcrumb separator=">" className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.FIRST_CATEGORY_MANAGE.URL_PREFIX + "/" + ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY + "/" + this.props.params.tabKey}>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={ROUTE.SECOND_CATEGORY_MANAGE.URL_PREFIX + "/" + ROUTE.SECOND_CATEGORY_MANAGE.MENU_KEY + "/" + this.props.params.tabKey + "/" + this.props.params.firstId + "/" + this.props.params.firstName}>{this.props.params.firstName}</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.params.secondName}</Breadcrumb.Item>
          </Breadcrumb>
          <Table className='third-category-table' columns={thirdCategoryColumns} dataSource={this.state.thirdCategoryData} rowKey='id' loading={this.state.thirdCategoryTableLoading} pagination={this.state.pager} onChange={this.changePager}/>
          <ThirdCategoryEditModal ref="editForm" visible={this.state.editModalVisible} confirmLoading={this.state.confirmLoading} onCancel={this.closeEditModal} onConfirm={this.confirmEditModal} />
        </div>
    );
  }
}

export default ThirdCategoryManage;
