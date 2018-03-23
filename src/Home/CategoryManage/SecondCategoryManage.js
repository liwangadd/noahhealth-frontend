import './CategoryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROUTE} from './../../App/PublicConstant.js'
import React from 'react';
import {Table, message, Popconfirm, Breadcrumb} from 'antd';
import $ from 'jquery';
import {Link} from 'react-router';
import FirstSecondCategoryEditModal from './FirstSecondCategoryEditModal.js'


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
  changePager = (pager) => this.requestSecondCategoryData(this.props.params.firstId, pager.current)


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

  closeEditModal = () => this.setState({editModalVisible: false})

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
                this.refs.editForm.setFieldsValue({name: category.name});

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
        console.log('修改检查亚类', values);

        //显示加载圈
        this.setState({ confirmLoading: true });

        $.ajax({
            url : SERVER + '/api/second/' + this.categoryId,
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({firstId: Number(this.props.params.firstId), name: values.name, number: values.number}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.requestSecondCategoryData(this.props.params.firstId, this.state.pager.current);

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

  componentDidMount = () => this.requestSecondCategoryData(this.props.params.firstId, 1)

  render(){

    const secondCategoryColumns = [{
      title: '检查亚类名称',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => this.props.params.tabKey === '1' ? <Link to={ROUTE.THIRD_CATEGORY_MANAGE.URL_PREFIX + "/" + ROUTE.THIRD_CATEGORY_MANAGE.MENU_KEY + "/" + this.props.params.tabKey + "/" + this.props.params.firstId +"/" + this.props.params.firstName + "/" + record.id + "/" + name}>{name}</Link> : <span>{name}</span>,
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该亚类吗?" onConfirm={() => this.handleDelete(record)}>
            <a className='operation-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];


    return (
        <div>
          <Breadcrumb className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.FIRST_CATEGORY_MANAGE.URL_PREFIX + "/" + ROUTE.FIRST_CATEGORY_MANAGE.MENU_KEY + "/" + this.props.params.tabKey}>检查项目管理</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.params.firstName}</Breadcrumb.Item>
          </Breadcrumb>
          <Table className='second-category-table' columns={secondCategoryColumns} dataSource={this.state.secondCategoryData} rowKey='id' loading={this.state.secondCategoryTableLoading} pagination={this.state.pager} onChange={this.changePager}/>
          <FirstSecondCategoryEditModal ref="editForm" visible={this.state.editModalVisible} confirmLoading={this.state.confirmLoading} onCancel={this.closeEditModal} onConfirm={this.confirmEditModal} />
        </div>
    );
  }
}

export default SecondCategoryManage;
