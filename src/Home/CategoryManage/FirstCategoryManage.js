import './CategoryManage.css'
import {SERVER, SESSION, RESULT, ROUTE} from './../../App/PublicConstant.js'
import CategoryAddModal from './CategoryAddModal.js'
import FirstSecondCategoryEditModal from './FirstSecondCategoryEditModal.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, Button, BackTop} from 'antd';
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

    //编辑对话框
    editModalVisible: false,
    confirmEditModalLoading: false,

    //添加对话框
    addModalVisible: false,
    confirmAddModalLoading: false,
    firstCategoryParentOfAssayData: [],
    firstCategoryParentOfTechData:  [],
    secondCategoryParentOfAssayData: [],
    secondCategoryParentOfTechData: []
  };

  //拉取所有大类
  requestFirstCategoryData = (type) => {

    console.log('查询所有'+ type +'检查分类');

    type === "化验" ? this.setState({ assayTableLoading: true}) : this.setState({ techTableLoading: true});
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

            type === "化验" ? this.setState({ assayTableLoading: false}) : this.setState({ techTableLoading: false});
        }
    });
  }

  //删除大类
  handleDelete(record, type) {

    console.log('删除' + type + '检查分类', record);

    type === "化验" ? this.setState({ assayTableLoading: true}) : this.setState({ techTableLoading: true});
    $.ajax({
        url : SERVER + '/api/first/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                this.requestFirstCategoryParentData(type); //更新添加对话框中大类列表数据
                this.requestFirstCategoryData(type); //更新表格中数据

                message.success(result.reason, 2);
            } else {

                message.error(result.reason, 2);
            }

            type === "化验" ? this.setState({ assayTableLoading: false}) : this.setState({ techTableLoading: false});
        }
    });
  }

  /*
  * 编辑大类对话框
  */

  //打开编辑对话框
  showEditModal = (record) => {

    this.setState({editModalVisible: true});

    this.categoryId = record.id //保存当前正在编辑的类别，方便更新提交时使用
    this.categoryType = record.type;

    this.requestCategory(this.categoryId);
  }

  closeEditModal = () => this.setState({editModalVisible: false})

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
        console.log('修改检查分类', values);

        //显示加载圈
        this.setState({ confirmEditModalLoading: true });

        $.ajax({
            url : SERVER + '/api/first/' + this.categoryId,
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({type: this.categoryType, name: values.name}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                this.requestFirstCategoryParentData(this.categoryType); //更新添加对话框中大类列表数据
                this.requestFirstCategoryData(this.categoryType); //更新表格数据

                //关闭加载圈、对话框
                this.setState({
                  editModalVisible: false,
                  confirmEditModalLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmEditModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  /*
  * 添加检查项目对话框
  */
  showAddModal = () => this.setState({addModalVisible: true})
  closeAddModal = () => this.setState({addModalVisible: false})

  //拉取系统中所有检查分类
  requestFirstCategoryParentData = (type) => {

    console.log('查询所有'+ type +'检查分类');
    $.ajax({
        url : SERVER + '/api/first/' + type + '/list',
        type : 'GET',
        dataType : 'json',
        async: false,
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                if(type === "化验") {

                  this.setState({firstCategoryParentOfAssayData: result.content});
                  this.refs.addForm.setFieldsValue({firstCategoryParentOfAssayId : result.content.length > 0 ? result.content[0].id.toString() : ''});
                } else {

                  this.setState({firstCategoryParentOfTechData: result.content});
                  this.refs.addForm.setFieldsValue({firstCategoryParentOfTechId : result.content.length > 0 ? result.content[0].id.toString() : ''});
                }

            } else {

                message.error(result.reason, 2);
            }
        }
    });
  }

  //拉取系统中所有检查亚类
  requestSecondCategoryParentData = (type) => {

    console.log('查询所有'+ type +'检查亚类');
    $.ajax({
        url : SERVER + '/api/first/level',
        type : 'POST',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({type : type}),
        async: false,
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
                  this.refs.addForm.setFieldsValue({secondCategoryParentOfAssayId: secondCategoryParentData.length > 0 ? [secondCategoryParentData[0].value, secondCategoryParentData[0].children[0].value] : []});
                } else {

                  this.setState({secondCategoryParentOfTechData: secondCategoryParentData});
                  this.refs.addForm.setFieldsValue({secondCategoryParentOfTechId: secondCategoryParentData.length > 0 ? [secondCategoryParentData[0].value, secondCategoryParentData[0].children[0].value] : []});
                }
            } else {
                message.error(result.reason, 2);
            }
        }
    });
  }

  //添加
  handleAddCategory = () => {

    let level = this.refs.addForm.getFieldValue('level');
    switch(level){
      case '检查分类':this.requestAddFirstCategory();break;
      case '检查亚类':this.requestAddSecondCategory();break;
      case '检查项目':this.requestAddThirdCategory();break;
      default:;break;
    }
  }

  //添加检查分类
  requestAddFirstCategory = () => {

    this.refs.addForm.validateFields(['type', 'firstCategoryName'], (err, values) => {
      if (!err) {
        console.log('添加'+ values.type + '检查分类' + values.firstCategoryName);

        this.setState({confirmLoading: true});
        $.ajax({
            url : SERVER + '/api/first',
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({type : values.type, name: values.firstCategoryName}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code === RESULT.SUCCESS) {

                  this.requestFirstCategoryParentData(values.type); //更新添加对话框中大类列表数据
                  this.requestFirstCategoryData(values.type); //更新大类表格中的数据

                  //关闭加载圈、对话框
                  this.setState({
                    addModalVisible: false,
                    confirmAddModalLoading: false,
                  });

                  message.success(result.reason, 2);
                } else {

                  this.setState({confirmAddModalLoading: false});
                  message.error(result.reason, 2);
                }
            }
        });
      }
    });
  }

  //添加检查亚类
  requestAddSecondCategory = () => {

    this.refs.addForm.validateFields(['type', 'firstCategoryParentOfAssayId', 'firstCategoryParentOfTechId', 'secondCategoryName'], (err, values) => {
      if (!err) {
        console.log('添加'+ values.type + '检查亚类' + values.secondCategoryName);

        this.setState({confirmLoading: true});
        let firstId = values.type === '化验' ? Number(values.firstCategoryParentOfAssayId) : Number(values.firstCategoryParentOfTechId);
        $.ajax({
            url : SERVER + '/api/second',
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({firstId : firstId, name: values.secondCategoryName}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code === RESULT.SUCCESS) {

                  this.requestSecondCategoryParentData(values.type); //更新添加对话框中大类列表数据
                  //关闭加载圈、对话框
                  this.setState({
                    addModalVisible: false,
                    confirmAddModalLoading: false,
                  });

                  message.success(result.reason, 2);
                } else {

                  this.setState({confirmAddModalLoading: false});
                  message.error(result.reason, 2);
                }
            }
        });
      }
    });
  }

  //添加检查项目
  requestAddThirdCategory = () => {

    this.refs.addForm.validateFields(['type', 'secondCategoryParentOfAssayId', 'secondCategoryParentOfTechId', 'thirdCategoryName', 'systemCategory', 'referenceValue', 'hospital'], (err, values) => {
      if (!err) {
        console.log('添加'+ values.type + '检查项目' + values.thirdCategoryName);

        this.setState({confirmLoading: true});
        let secondId = values.type === '化验' ? values.secondCategoryParentOfAssayId[1] : values.secondCategoryParentOfTechId[1];
        $.ajax({
            url : SERVER + '/api/third',
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({secondId : secondId, name: values.thirdCategoryName, systemCategory: values.systemCategory, referenceValue: values.referenceValue, hospital: values.hospital}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code === RESULT.SUCCESS) {

                  //关闭加载圈、对话框
                  this.setState({
                    addModalVisible: false,
                    confirmAddModalLoading: false,
                  });

                  message.success(result.reason, 2);
                } else {

                  this.setState({confirmAddModalLoading: false});
                  message.error(result.reason, 2);
                }
            }
        });
      }
    });
  }


  componentDidMount = () => {

      //选项卡中两个表格数据
      this.requestFirstCategoryData("化验");
      this.requestFirstCategoryData("医技");

      //添加对话框下拉列表数据
      this.requestFirstCategoryParentData("化验");
      this.requestSecondCategoryParentData("化验");
      this.requestFirstCategoryParentData("医技");
      this.requestSecondCategoryParentData("医技");
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
        <BackTop visibilityHeight="200"/>
        <Tabs defaultActiveKey={this.props.params.tabKey} tabBarExtraContent={<Button type="primary" onClick={this.showAddModal}>+&nbsp;&nbsp;检查项目</Button>}>
          <TabPane tab="化验检查项目" key="1">
            <Table className='first-category-table' columns={assayColumns} dataSource={this.state.assayData} rowKey='id' loading={this.state.assayTableLoading} pagination={false}/>
          </TabPane>
          <TabPane tab="医技检查项目" key="2">
            <Table className='first-category-table' columns={techColumns} dataSource={this.state.techData} rowKey='id' loading={this.state.techTableLoading} pagination={false}/>
          </TabPane>
        </Tabs>
        <FirstSecondCategoryEditModal ref="editForm" visible={this.state.editModalVisible} confirmLoading={this.state.confirmEditModalLoading} onCancel={this.closeEditModal} onConfirm={this.confirmEditModal} />
        <CategoryAddModal ref="addForm" visible={this.state.addModalVisible} confirmLoading={this.state.confirmAddModalLoading} onCancel={this.closeAddModal} onConfirm={this.handleAddCategory}
        firstCategoryParentOfAssayData={this.state.firstCategoryParentOfAssayData}
        firstCategoryParentOfTechData={this.state.firstCategoryParentOfTechData}
        secondCategoryParentOfAssayData={this.state.secondCategoryParentOfAssayData}
        secondCategoryParentOfTechData={this.state.secondCategoryParentOfTechData} />
      </div>
    );
  }
}

export default FirstCategoryManage;
