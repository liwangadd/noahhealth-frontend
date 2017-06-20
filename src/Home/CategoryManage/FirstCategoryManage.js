import './CategoryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE} from './../../App/PublicConstant.js'
import CategoryAddForm from './CategoryAddForm.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, Breadcrumb, Button} from 'antd';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class FirstCategoryManage extends React.Component {

  state = {
    firstCategoryOfAssayData: [],
    firstCategoryOfTechData: []
  };


  //翻页


  render(){

    //member表头//////////
    const firstCategoryOfAssayColumns = [{
      title: '检查分类名称',
      dataIndex: 'name',
      key: 'name',
      render: name => <a>{name}</a>,
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showMemberEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该检查分类吗?" onConfirm={() => this.handleDeleteMember(record)} okText="是" cancelText="取消">
            <a className='operation-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];

    return (
        <Tabs defaultActiveKey="1" tabBarExtraContent={<Button type="primary">添加检查项目</Button>}>
          <TabPane tab="化验检查项目" key="1">
            <Breadcrumb separator=">" className="category-path">
              <Breadcrumb.Item href="">分类目录</Breadcrumb.Item>
            </Breadcrumb>
            <Table className='first-category-table' columns={firstCategoryOfAssayColumns} dataSource={this.state.firstCategoryOfAssayData} pagination={this.state.assayPager} onChange={this.changeMemberPager} rowKey='id' loading={this.state.memberTableLoading}/>
          </TabPane>
          <TabPane tab="医技检查项目" key="2">
            2
          </TabPane>
          <TabPane tab="添加检查项目" key="3">
            <CategoryAddForm />
          </TabPane>
        </Tabs>
    );
  }
}

export default FirstCategoryManage;
