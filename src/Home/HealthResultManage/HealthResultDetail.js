import './HealthResultManage.css';
import {SERVER, SESSION, RESULT, ROLE, FILE_SERVER, ROUTE, LOADING_DELAY_TIME, DATE_FORMAT} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import {isEmployee, isAdviser} from './../../App/PublicMethod.js';
import HealthResultDetailAddModal from './HealthResultDetailAddModal.js';
import HealthResultDetailItem from './HealthResultDetailItem.js';
import HealthResultDetailSearchForm from './HealthResultDetailSearchForm.js';
import React from 'react';
import {message, Button, BackTop, Breadcrumb, Timeline, Anchor, Alert, Spin, Tabs} from 'antd';
import {Link} from 'react-router';
import $ from 'jquery';

const TabPane = Tabs.TabPane;

class HealthResultDetail extends React.Component {

  state = {

    pageLoading: true,

    //添加健康摘要对话框
    addModalVisible: false,
    confirmAddModalLoading: false,
    healthResultSecondTypeData: [],

    //录入检查结果
    saveLoading: false,
    submitLoading: false,

    //审核检查结果
    passLoading: false,
    unpassLoading: false,

    //查看检查结果
    downloadLoading: false,

    //删除
    deleteLoading: false,

    healthResultSecondName: '',
    healthResultDetailTableLoading: false,

    //正文 化验/医技 卡片/表格 内容
    healthResultDetailData: [],
    healthResultDetailItems: null,
  };


  /**
  * 添加健康摘要对话框
  **/
  showAddModal = () => this.setState({ addModalVisible: true})
  closeAddModal = () => this.setState({ addModalVisible: false})

  //确认录入健康摘要信息
  confirmAddModal = () => {

    this.refs.addForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加一条健康摘要', values);

        //显示加载圈
        this.setState({ confirmAddModalLoading: true });

        $.ajax({
            url : SERVER + '/api/health',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({userId: Number(this.props.params.memberId),
                                   secondId: Number(values.secondId[1]),
                                   contentNew: values.contentNew}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {


                //关闭加载圈、对话框
                this.setState({ addModalVisible: false, confirmAddModalLoading: false});
                this.requestHealthResultDetailOfMember();

                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmAddModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  //保存录入的检查结果
  saveHealthDetail = (form, id) => {

    console.log('保存录入了的检查结果', id);

    form.validateFields((err, values) => {
      if(!err) {

        //显示加载圈
        this.setState({ saveLoading: true });
        $.ajax({
            url : SERVER + '/api/health/' + id,
            type : 'PUT',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({contentNew: values.contentNew}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                message.success(result.reason, 2);
              } else {

                message.error(result.reason, 2);
              }

              //关闭加载圈
              this.setState({ saveLoading: false });
            }
        });
      }
    });
  }

  //提交录入的检查结果（先请求保存、再请求改变状态）
  submitHealthDetail = (form, id) => {

    console.log('提交一份检查结果,变为待审核', id);

    //先保存
    this.saveHealthDetail(form, id);

    //再提交
    this.setState({ submitLoading: true });
    $.ajax({
        url : SERVER + '/api/health/status/' + id,
        type : 'PUT',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({status: '待审核'}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {
          console.log(result);
          if(result.code === RESULT.SUCCESS) {

            //关闭加载圈、对话框
            this.setState({ submitLoading: false});

            //重新查一遍
            this.requestHealthResultDetailOfMember();
            message.success(result.reason, 2);
          } else {

            //关闭加载圈
            this.setState({ submitLoading: false });
            message.error(result.reason, 2);
          }
        }
    });
  }

  /**
  * 审核检查结果对话框
  **/

  passHealthDetail = (form, id) => {

    console.log('通过一份检查结果,变为已通过', id);

    //显示加载圈
    this.setState({ passLoading: true });
    $.ajax({
        url : SERVER + '/api/health/status/' + id,
        type : 'PUT',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({status: '已通过'}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {
          console.log(result);
          if(result.code === RESULT.SUCCESS) {

            //关闭加载圈、对话框
            this.setState({ passLoading: false });

            this.requestHealthResultDetailOfMember();
            message.success(result.reason, 2);
          } else {

            //关闭加载圈
            this.setState({ passLoading: false });
            message.error(result.reason, 2);
          }
        }
    });
  }

  unpassHealthDetail = (id, unpassReason) => {

    console.log('不通过一份检查结果,变为未通过', id);

    //显示加载圈
    this.setState({ unpassLoading: true });
    $.ajax({
        url : SERVER + '/api/health/status/' + id,
        type : 'PUT',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({status: '未通过', reason: unpassReason}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {
          console.log(result);
          if(result.code === RESULT.SUCCESS) {

            //关闭加载圈、对话框
            this.setState({ unpassLoading: false});

            this.requestHealthResultDetailOfMember();
            message.success(result.reason, 2);
          } else {

            //关闭加载圈
            this.setState({ unpassLoading: false });
            message.error(result.reason, 2);
          }
        }
    });
  }

  //下载
  downloadHealthDetail = (id) => {

    console.log('请求下载检查结果', id);

    //显示加载圈
    this.setState({ downloadLoading: true });
    $.ajax({
        url : SERVER + '/api/health/download/' + id,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {
          console.log(result);
          if(result.code === RESULT.SUCCESS) {

            //下载
            window.location.href = FILE_SERVER + result.content;

            //关闭加载圈、对话框
            this.setState({downloadLoading: false});
            message.success(result.reason, 2);
          } else {

            //关闭加载圈
            this.setState({ downloadLoading: false });
            message.error(result.reason, 2);
          }
        }
    });
  }


  //删除
  deleteHealthDetail = (id) => {

    console.log('删除一条健康摘要', id);

    $.ajax({
        url : SERVER + '/api/health/' + id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                this.setState({deleteLoading: false});

                this.requestHealthResultDetailOfMember();
                message.success(result.reason, 2);
                return;
            } else {
                this.setState({deleteLoading: false});
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //获取memberId用户的所有健康摘要~~~~~~~~~~~~~
  requestHealthResultDetailOfMember = () => {

    let values = this.refs.searchForm.getFieldsValue();

    console.log('查询' + this.props.params.memberId + '会员的所有健康摘要');
    $.ajax({
        url : SERVER + '/api/health/list/' + this.props.params.memberId,
        type : 'POST',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({secondId: Number(values.secondId[1]),
                               beginTime: values.time !== undefined ? formatDate(values.time[0], DATE_FORMAT) : undefined,
                               endTime: values.time !== undefined ? formatDate(values.time[1], DATE_FORMAT) : undefined}),
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

              const role = sessionStorage.getItem(SESSION.ROLE);
              const healthResultDetailItems = result.content.length <= 0
                                            ?
                                              <Alert
                                              message="暂无相关健康摘要"
                                              description=" "
                                              type="info"
                                              showIcon
                                              />
                                            :
                                            result.content.map((detail, index) => <HealthResultDetailItem detail={detail}
                                                                                                        key={index}

                                                                                                        onSave={this.saveHealthDetail}
                                                                                                        saveLoading={this.state.saveLoading}

                                                                                                        onSubmit={this.submitHealthDetail}
                                                                                                        submitLoading={this.state.submitLoading}

                                                                                                        onPass={this.passHealthDetail}
                                                                                                        passLoading={this.state.passLoading}

                                                                                                        onUnpass={this.unpassHealthDetail}
                                                                                                        unpassLoading={this.state.unpassLoading}

                                                                                                        onDownload={this.downloadHealthDetail}
                                                                                                        downloadLoading={this.state.downloadLoading}

                                                                                                        onDelete={this.deleteHealthDetail}
                                                                                                        deleteLoading={this.state.deleteLoading} />);



              this.setState({healthResultDetailData: result.content,
                             healthResultDetailItems: healthResultDetailItems,
                             pageLoading: false});

            } else {

              message.error(result.reason, 2);
              this.setState({pageLoading: false});
            }
        }
    });
  }

  //拉取电子资料类别级联数据
  requestHealthResultSecondType = () => {

    console.log('拉取健康摘要类别数据');
    $.ajax({
        url : SERVER + '/api/health_category/level',
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code !== RESULT.SUCCESS) {
                message.error(result.reason, 2);
                return;
            }

            //将后端返回的map整理成级联列表识别的数据结构
            let healthResultSecondTypeData = [];
            for(let firstType in result.content) {

              //加入大类
              let firstTypeData = {value: firstType, label: firstType, children:[]};

              //获取旗下所有亚类
              let secondTypes = result.content[firstType];
              for(let i = 0; i < secondTypes.length; i++) {
                firstTypeData.children.push({value: secondTypes[i].id, label: secondTypes[i].name});
              }

              healthResultSecondTypeData.push(firstTypeData);
            }

            this.setState({healthResultSecondTypeData: healthResultSecondTypeData});

            if(this.refs.addForm == null) return;
            this.refs.addForm.setFieldsValue({secondId: healthResultSecondTypeData.length > 0 ? [healthResultSecondTypeData[0].value, healthResultSecondTypeData[0].children[0].value] : []});
        }
    });
  }



  componentDidMount = () => {

    //拉取该用户的已添加的所有健康摘要
    this.requestHealthResultDetailOfMember();

    this.requestHealthResultSecondType(); //拉取健康摘要类别的级联数据
  }


  render(){

    const role = sessionStorage.getItem(SESSION.ROLE);

    //拆分healthResultDetailData
    //1.组装成卡片+表格条目
    //2.组装成锚点目录
    const healthResultDetailAnchors = this.state.healthResultDetailData.map((detail, index) => <Anchor.Link href={"#" + detail.id.toString()} key={index} title={detail.secondName + " " + formatDate(detail.time)}/>);

    return (
      <Spin spinning={this.state.pageLoading} delay={LOADING_DELAY_TIME} tip='加载中'>
        <BackTop visibilityHeight="200"/>
        {
          isEmployee(role)
          ?
          <Breadcrumb separator=">" className="category-path">
            <Breadcrumb.Item><Link to={ROUTE.HEALTH_RESULT_MANAGE.URL_PREFIX + "/" + ROUTE.HEALTH_RESULT_MANAGE.MENU_KEY}>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.params.memberName}</Breadcrumb.Item>
          </Breadcrumb>
          :
          null
        }
        <HealthResultDetailAddModal ref="addForm" visible={this.state.addModalVisible} confirmLoading={this.state.confirmAddModalLoading} onCancel={this.closeAddModal} onConfirm={this.confirmAddModal} healthResultSecondTypeData={this.state.healthResultSecondTypeData}/>


        <Tabs defaultActiveKey={"1"} tabBarExtraContent={role === ROLE.EMPLOYEE_ARCHIVER || role === ROLE.EMPLOYEE_ADMIN ? <Button type="primary" onClick={this.showAddModal}>添加健康摘要</Button> : null} onChange={this.handleMenuItemClick}>
          <TabPane tab="健康摘要" key="1">
            <HealthResultDetailSearchForm ref="searchForm" healthResultSecondTypeData={this.state.healthResultSecondTypeData} />
            <div className="health-result-detail-info">
              <Anchor className="health-result-detail-anchor">
                {healthResultDetailAnchors}
              </Anchor>
              <Timeline pending={this.state.healthResultDetailData.length <= 0 ? null : <h4>已到底部</h4>}>
                {this.state.healthResultDetailItems}
              </Timeline>
            </div>
          </TabPane>
        </Tabs>
      </Spin>
    );
  }
}

export default HealthResultDetail;
