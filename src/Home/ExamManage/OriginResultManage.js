// import './OriginResultManage.css';
// import {SERVER, SESSION, RESULT, ROUTE, PAGE_SIZE} from './../../App/PublicConstant.js';
// import {formatDate} from './../../App/PublicUtil.js';
// import OriginResultSearchForm from './OriginResultSearchForm.js';
// import OriginResultUploadModal from './OriginResultUploadModal.js';
// import OriginResultUploadPictureModal from './OriginResultUploadPictureModal.js'
// import React from 'react';
// import {Tabs, Table, message, Popconfirm, Button, BackTop, Modal} from 'antd';
// import $ from 'jquery';
// import {Link} from 'react-router';
// const TabPane = Tabs.TabPane;
// const confirm = Modal.confirm;
//
//
// class OriginResultManage extends React.Component {
//
//   state = {
//
//     //执行情况
//     originResultData: [],
//     originResultTableLoading: false,
//     originResultPager: {pageSize: PAGE_SIZE, total: 0},
//
//     //添加对话框
//     uploadModalVisible: false,
//     confirmUploadModalLoading: false,
//     memberUnderEmployeeData: [],
//     secondCategoryParentOfAssayData: [],
//     secondCategoryParentOfTechData: [],
//
//     //上传扫描件
//     uploadPictureModalVisible: false,
//     originResultId: -1,
//     fileList: []
//   };
//
//
//   /**
//   * 执行情况表格
//   **/
//
//   //查表
//   handleSearchOriginResultList = (pageNow) => {
//
//     this.refs.searchForm.validateFields((err, values) => {
//       if(!err) {
//
//         this.setState({ originResultTableLoading: true});
//
//         console.log('拉取第'+ pageNow + "页原始数据-执行情况信息", values);
//
//         $.ajax({
//             url : SERVER + '/api/origin/list',
//             type : 'POST',
//             contentType: 'application/json',
//             data : JSON.stringify({userName : values.userName,
//                                    secondName : values.secondName,
//                                    uploaderName : values.uploaderName,
//                                    checkerName: values.checkerName,
//                                    inputerName: values.inputerName,
//                                    status: values.status,
//                                    time: values.time,
//                                    pageNow: pageNow,
//                                    pageSize: PAGE_SIZE}),
//             dataType : 'json',
//             beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
//             success : (result) => {
//
//                 console.log(result);
//                 if(result.code !== RESULT.SUCCESS) {
//                     message.error(result.reason, 2);
//                     return;
//                 }
//
//                 //更新页码
//                 const originResultPager = this.state.originResultPager;
//                 originResultPager.total = result.content.rowTotal;
//                 originResultPager.current = pageNow;
//
//                 //更新获取到的数据到状态中
//                 this.setState({
//                   originResultData: result.content.data,
//                   originResultPager
//                 });
//
//                 this.setState({ originResultTableLoading: false});
//             }
//         });
//       }
//     });
//   }
//
//   //翻页
//   changeOriginResultPager = (pager) =>  this.handleSearchOriginResultList(pager.current)
//
//
//
//   /**
//   * 上传原始资料对话框
//   **/
//   showUploadModal = () => this.setState({ uploadModalVisible: true})
//   closeUploadModal = () => this.setState({ uploadModalVisible: false})
//
//   //拉取系统中所有检查亚类
//   requestSecondCategoryParentData = (type) => {
//
//     console.log('查询所有'+ type +'检查亚类');
//     $.ajax({
//         url : SERVER + '/api/first/level',
//         type : 'POST',
//         contentType: 'application/json',
//         dataType : 'json',
//         data : JSON.stringify({type : type}),
//         // async: false,
//         beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
//         success : (result) => {
//
//             console.log(result);
//             if(result.code === RESULT.SUCCESS) {
//
//                 //将后端返回的map整理成级联列表识别的数据结构
//                 let secondCategoryParentData = [];
//                 for(let firstCategory in result.content) {
//
//                   //加入大类
//                   let firstCategoryData = {value: firstCategory, label: firstCategory, children:[]};
//
//                   //获取旗下所有亚类
//                   let secondCategories = result.content[firstCategory];
//                   for(let i = 0; i < secondCategories.length; i++) {
//                     firstCategoryData.children.push({value: secondCategories[i].id, label: secondCategories[i].name});
//                   }
//
//                   secondCategoryParentData.push(firstCategoryData);
//                 }
//
//                 if(type === "化验") {
//
//                   this.setState({secondCategoryParentOfAssayData: secondCategoryParentData});
//
//                   if(this.refs.uploadForm == null) return;
//                   this.refs.uploadForm.setFieldsValue({secondCategoryParentOfAssayId: secondCategoryParentData.length > 0 ? [secondCategoryParentData[0].value, secondCategoryParentData[0].children[0].value] : []});
//                 } else {
//
//                   this.setState({secondCategoryParentOfTechData: secondCategoryParentData});
//
//                   if(this.refs.uploadForm == null) return;
//                   this.refs.uploadForm.setFieldsValue({secondCategoryParentOfTechId: secondCategoryParentData.length > 0 ? [secondCategoryParentData[0].value, secondCategoryParentData[0].children[0].value] : []});
//                 }
//             } else {
//                 message.error(result.reason, 2);
//             }
//         }
//     });
//   }
//
//   //确认上传原始资料信息
//   confirmUploadModal = () => {
//
//     this.refs.uploadForm.validateFields((err, values) => {
//       if(!err) {
//         console.log('上传一份原始资料', values);
//
//         //显示加载圈
//         this.setState({ confirmUploadModalLoading: true });
//         console.log(values.time);
//         let secondId = values.type === '化验' ? values.secondCategoryParentOfAssayId[1] : values.secondCategoryParentOfTechId[1];
//         $.ajax({
//             url : SERVER + '/api/origin',
//             type : 'POST',
//             contentType: 'application/json',
//             data : JSON.stringify({userId: Number(values.userId),
//                                    secondId: secondId,
//                                    time: values.time}),
//             dataType : 'json',
//             beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
//             success : (result) => {
//               console.log(result);
//               if(result.code === RESULT.SUCCESS) {
//
//                 this.handleSearchOriginResultList(this.state.originResultPager.current); //更新表格数据
//
//                 //关闭加载圈、对话框
//                 this.setState({
//                   uploadModalVisible: false,
//                   confirmUploadModalLoading: false,
//                 });
//
//                 //询问是否弹出上传对话框继续上传扫描件
//                 let originResultId = result.content;
//                 confirm({title: '添加成功! 是否继续上传原始资料的扫描件?',
//                          onOk: () => this.showUploadPictureModal(originResultId)});
//
//               } else {
//
//                 //关闭加载圈
//                 this.setState({ confirmUploadModalLoading: false });
//                 message.error(result.reason, 2);
//               }
//             }
//         });
//       }
//     });
//   }
//
//   /**
//   * 上传扫描件图片对话框
//   **/
//
//   showUploadPictureModal = (originResultId) => {
//
//     this.setState({uploadPictureModalVisible: true, originResultId: originResultId});
//
//     //record.path对应的图片显示到上传预览组件中
//     //ajax查询originResult，获得其fileList，setState
//   }
//
//   closeUploadPictureModal = () => this.setState({uploadPictureModalVisible: false})
//
//   requestMembersUnderEmployee = () => {
//
//       console.log('拉取'+ sessionStorage.getItem(SESSION.NAME) +'旗下的所有会员信息');
//       $.ajax({
//           url : SERVER + '/api/origin/member_under_employee',
//           type : 'GET',
//           dataType : 'json',
//           beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
//           success : (result) => {
//
//               console.log(result);
//               if(result.code !== RESULT.SUCCESS) {
//                   message.error(result.reason, 2);
//                   return;
//               }
//
//               //更新获取到的数据到状态中
//               const memberUnderEmployeeData = result.content;
//               this.setState({ memberUnderEmployeeData: memberUnderEmployeeData});
//               if(this.refs.uploadForm == null) return;
//               this.refs.uploadForm.setFieldsValue({userId: memberUnderEmployeeData.length > 0 ? memberUnderEmployeeData[0].id.toString() : ''});
//           }
//       });
//   }
//
//
//   componentDidMount = () => {
//
//     this.handleSearchOriginResultList(1);
//     this.requestSecondCategoryParentData("化验");
//     this.requestSecondCategoryParentData("医技");
//
//     //拉取上传对话框中的会员信息(该employee旗下的)
//     this.requestMembersUnderEmployee();
//   }
//
//
//   render(){
//
//     const originResultColumns = [{
//       title: '会员姓名',
//       dataIndex: 'userName',
//       key: 'userName',
//       render: (name) => <a>{name}</a>,
//     },{
//       title: '检查亚类',
//       dataIndex: 'secondName',
//       key: 'secondName'
//     },{
//       title: '上传者',
//       dataIndex: 'uploaderName',
//       key: 'uploaderName'
//     }, {
//       title: '审核者',
//       dataIndex: 'checkerName',
//       key: 'checkerName'
//     }, {
//       title: '录入者',
//       dataIndex: 'inputerName',
//       key: 'inputerName'
//     },{
//       title: '日期',
//       dataIndex: 'time',
//       key: 'time',
//       render: (time) => formatDate(time)
//     }, {
//       title: '执行状态',
//       dataIndex: 'status',
//       key: 'status'
//     }, {
//       title: '操作',
//       key: 'action',
//       render: (record) => (
//         <span>
//           <a onClick={() => this.showOriginResultEditModal(record)}>查看</a>
//           <span className="ant-divider" />
//           <Popconfirm title="您确定要删除该条执行记录吗?" onConfirm={() => this.handleOriginResultDelete(record)} okText="是" cancelText="取消">
//             <a className='operation-delete'>删除</a>
//           </Popconfirm>
//         </span>
//       )
//     }];
//
//     return (
//       <div>
//         <BackTop visibilityHeight="200"/>
//         <Tabs defaultActiveKey={"1"} tabBarExtraContent={<Button type="primary" onClick={this.showUploadModal}>上传原始资料</Button>}>
//           <TabPane tab="原始数据" key="1">
//             <OriginResultSearchForm ref="searchForm" handleSearchOriginResultList={this.handleSearchOriginResultList}/>
//             <Table className='origin-result-table' columns={originResultColumns} dataSource={this.state.originResultData} rowKey='id' loading={this.state.originResultTableLoading} pagination={this.state.originResultPager} onChange={this.changeOriginResultPager}/>
//           </TabPane>
//         </Tabs>
//         <OriginResultUploadModal ref="uploadForm" visible={this.state.uploadModalVisible} confirmLoading={this.state.confirmUploadModalLoading} onCancel={this.closeUploadModal} onConfirm={this.confirmUploadModal} secondCategoryParentOfAssayData={this.state.secondCategoryParentOfAssayData} secondCategoryParentOfTechData={this.state.secondCategoryParentOfTechData}  memberUnderEmployeeData={this.state.memberUnderEmployeeData}/>
//         <OriginResultUploadPictureModal visible={this.state.uploadPictureModalVisible} onCancel={this.closeUploadPictureModal} fileList={this.state.fileList} originResultId={this.state.originResultId}/>
//       </div>
//     );
//   }
// }
//
// export default OriginResultManage;
