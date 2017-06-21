import './CategoryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, ROUTE} from './../../App/PublicConstant.js'
import CategoryAddForm from './CategoryAddForm.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, Breadcrumb, Button} from 'antd';
import $ from 'jquery';
import {Link} from 'react-router';
const TabPane = Tabs.TabPane;


class ThirdCategoryManage extends React.Component {

  state = {

    //亚类
    thirdCategoryData: [],
    thirdCategoryTableLoading: false,
    pager: {pageSize: PAGE_SIZE, total: 0}
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
          <a onClick={() => this.showMemberEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该项目吗?" onConfirm={() => this.handleDeleteMember(record)} okText="是" cancelText="取消">
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
          <Table className='second-category-table' columns={thirdCategoryColumns} dataSource={this.state.thirdCategoryData} rowKey='id' loading={this.state.thirdCategoryTableLoading} pagination={this.state.pager} onChange={this.changePager}/>
        </div>
    );
  }
}

export default ThirdCategoryManage;
