import './CategoryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE} from './../../App/PublicConstant.js'
import CategoryAddForm from './CategoryAddForm.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, Breadcrumb, Button} from 'antd';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class CategoryManage extends React.Component {

  state = {


  };

  //保存子组件引用
  saveMemberSearchFormRef = (form) => {

    this.memberSearchForm = form;
    if(form == null) return; //防止卸载时为空

    this.handleSearchMemberList(1);
  }
  saveEmployeeSearchFormRef = (form) => {
    this.employeeSearchForm = form;
    if(form == null) return; //防止卸载时为空

    this.handleSearchEmployeeList(1);
  }
  saveMemberEditFormRef = (form) => {
    this.memberEditForm = form;
  }
  saveEmployeeEditFormRef = (form) => {
    this.employeeEditForm = form;
  }


  //翻页


  render(){


    const addCategoryButton = <Button type="primary">添加检查项目</Button>;

    return (
        <div>
          <Tabs defaultActiveKey="1" tabBarExtraContent={addCategoryButton}>
            <TabPane tab="化验检查项目" key="1">
              <Breadcrumb separator=">">
                <Breadcrumb.Item href="">分类目录</Breadcrumb.Item>
                <Breadcrumb.Item>血常规</Breadcrumb.Item>
              </Breadcrumb>
            </TabPane>
            <TabPane tab="医技检查项目" key="2">
              2
            </TabPane>
            <TabPane tab="添加检查项目" key="3">
              <CategoryAddForm />
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default CategoryManage;
