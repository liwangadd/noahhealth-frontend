import './CategoryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, ROUTE} from './../../App/PublicConstant.js'
import CategoryAddForm from './CategoryAddForm.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, Breadcrumb, Button} from 'antd';
import $ from 'jquery';
import {Link} from 'react-router';
const TabPane = Tabs.TabPane;


class FirstCategoryManage extends React.Component {

  state = {

    //化验大类
    assayData: [],
    assayTableLoading: false,

    //医技大类
    techData: [],
    techTableLoading: false
  };

  //拉取所有大类
  requestFirstCategoryData = (type) => {

    let data = [];
    console.log('查询所有'+ type +'检查分类');

    this.setState({ assayTableLoading: true});
    $.ajax({
        url : SERVER + '/api/first/' + type + '/list',
        type : 'GET',
        dataType : 'json',
        async: false,
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {
                data = result.content;
            } else {
                message.error(result.reason, 2);
            }

            this.setState({ assayTableLoading: false});
        }
    });

    return data;
  }



  componentDidMount = () => {

    this.setState({
      assayData: this.requestFirstCategoryData("化验"),
      techData: this.requestFirstCategoryData("医技")
    });
  }

  render(){

    const assayColumns = [{
      title: '检查分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => <Link to={ROUTE.HOME_SECOND_CATEGORY_MANAGE.URL_PREFIX + "/1/" + record.id + "/" + name}>{name}</Link>,
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showMemberEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该分类吗?" onConfirm={() => this.handleDeleteMember(record)} okText="是" cancelText="取消">
            <a className='operation-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];

    const techColumns = [{
      title: '检查分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => <Link to={ROUTE.HOME_SECOND_CATEGORY_MANAGE.URL_PREFIX + "/2/" + record.id + "/" + name}>{name}</Link>,
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showMemberEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该分类吗?" onConfirm={() => this.handleDeleteMember(record)} okText="是" cancelText="取消">
            <a className='operation-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];

    return (
        <Tabs defaultActiveKey={this.props.params.tabKey} tabBarExtraContent={<Button type="primary">添加检查项目</Button>}>
          <TabPane tab="化验检查项目" key="1">
            <Table className='first-category-table' columns={assayColumns} dataSource={this.state.assayData} rowKey='id' loading={this.state.assayTableLoading} pagination={false}/>
          </TabPane>
          <TabPane tab="医技检查项目" key="2">
            <Table className='first-category-table' columns={techColumns} dataSource={this.state.techData} rowKey='id' loading={this.state.techTableLoading} pagination={false}/>
          </TabPane>
          <TabPane tab="添加检查项目" key="3">
            <CategoryAddForm />
          </TabPane>
        </Tabs>
    );
  }
}

export default FirstCategoryManage;
