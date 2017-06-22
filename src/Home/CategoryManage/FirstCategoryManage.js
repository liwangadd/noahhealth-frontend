import './CategoryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, ROUTE} from './../../App/PublicConstant.js'
import CategoryAddForm from './CategoryAddForm.js'
import FirstSecondCategoryEditModal from './FirstSecondCategoryEditModal.js'
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
    techTableLoading: false,

    editModalVisible: false
  };

  //拉取所有大类
  requestFirstCategoryData = (type) => {

    console.log('查询所有'+ type +'检查分类');

    this.setState({ assayTableLoading: true, techTableLoading: true});
    $.ajax({
        url : SERVER + '/api/first/' + type + '/list',
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                type === "化验" ? this.setState({assayData: result.content}) : this.setState({techData: result.content});
            } else {

                message.error(result.reason, 2);
            }

            this.setState({ assayTableLoading: false, techTableLoading: false});
        }
    });
  }

  //删除大类
  handleDelete(record, type) {

    console.log('删除' + type + '检查分类', record);

    this.setState({ assayTableLoading: true, techTableLoading: true});
    $.ajax({
        url : SERVER + '/api/first/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.requestFirstCategoryData(type);

                message.success(result.reason, 2);
            } else {

                message.error(result.reason, 2);
            }

            this.setState({ assayTableLoading: false, techTableLoading: false});
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

    console.log('查询检查分类', categoryId);

    $.ajax({
        url : SERVER + '/api/first/' + categoryId,
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

      this.requestFirstCategoryData("化验");
      this.requestFirstCategoryData("医技");
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
          <a onClick={() => this.showEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该分类吗?" onConfirm={() => this.handleDelete(record, "化验")} okText="是" cancelText="取消">
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
          <a onClick={() => this.showEditModal(record)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="您确定要删除该分类吗?" onConfirm={() => this.handleDelete(record, "医技")} okText="是" cancelText="取消">
            <a className='operation-delete'>删除</a>
          </Popconfirm>
        </span>
      )
    }];

    return (
      <div>
        <Tabs defaultActiveKey={this.props.params.tabKey} tabBarExtraContent={<Button type="primary">添加检查项目</Button>}>
          <TabPane tab="化验检查项目" key="1">
            <Table className='first-category-table' columns={assayColumns} dataSource={this.state.assayData} rowKey='id' loading={this.state.assayTableLoading} pagination={false}/>
          </TabPane>
          <TabPane tab="医技检查项目" key="2">
            <Table className='first-category-table' columns={techColumns} dataSource={this.state.techData} rowKey='id' loading={this.state.techTableLoading} pagination={false}/>
          </TabPane>
          <TabPane tab="添加检查项目" key="3">
            <CategoryAddForm refreshFirstCategoryData={this.requestFirstCategoryData}/>
          </TabPane>
        </Tabs>
        <FirstSecondCategoryEditModal ref={this.saveEditFormRef} visible={this.state.editModalVisible} confirmLoading={this.state.confirmLoading} onCancel={this.closeEditModal} onConfirm={this.confirmEditModal} />
      </div>
    );
  }
}

export default FirstCategoryManage;
