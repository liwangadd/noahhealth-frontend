import './HealthResultManage.css';
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROUTE} from './../../App/PublicConstant.js';
import HealthResultSearchForm from './HealthResultSearchForm.js';
import React from 'react';
import {Tabs, Table, message, BackTop} from 'antd';
import {Link} from 'react-router';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class HealthResultManage extends React.Component {

  state = {

    //执行情况
    healthResultData: [],
    healthResultTableLoading: false,
    healthResultPager: {pageSize: PAGE_SIZE, total: 0}
  };

  //查表
  handleSearchHealthResultList = (pageNow) => {

    this.refs.searchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ healthResultTableLoading: true});

        console.log('拉取第'+ pageNow + "页化验/医技目录", values);

        $.ajax({
            url : SERVER + '/api/input/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({userName : values.userName,
                                   memberNum: values.memberNum,
                                   pageNow: pageNow,
                                   pageSize: PAGE_SIZE}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code !== RESULT.SUCCESS) {
                    message.error(result.reason, 2);
                    return;
                }

                //更新页码
                const healthResultPager = this.state.healthResultPager;
                healthResultPager.total = result.content.rowTotal;
                healthResultPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  healthResultTableLoading: false,
                  healthResultData: result.content.data,
                  healthResultPager
                });
            }
        });
      }
    });
  }

  //翻页
  changeHealthResultPager = (pager) =>  this.handleSearchHealthResultList(pager.current)


  componentDidMount = () => this.handleSearchHealthResultList(1)

  render(){

    const healthResultColumns = [{
      title: '会员姓名',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '会员编号',
      dataIndex: 'memberNum',
      key: 'memberNum'
    },{
      title: '所属顾问',
      dataIndex: 'staffName',
      key: 'staffName'
    },{
      title: '所属顾问主管',
      dataIndex: 'staffMgrName',
      key: 'staffMgrName'
    },{
      title: '级别',
      dataIndex: 'role',
      key: 'role'
    },{
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <Link to={ROUTE.EXAM_RESULT_DETAIL.URL_PREFIX + "/" + ROUTE.EXAM_RESULT_DETAIL.MENU_KEY + "/" + record.id + "/" + record.name}>查看详情</Link>
        </span>
      )
    }];


    return (
      <div>
        <BackTop visibilityHeight="200"/>
        <Tabs defaultActiveKey={"1"}>
          <TabPane tab="健康摘要库" key="1">
            <HealthResultSearchForm ref="searchForm" handleSearchHealthResultList={this.handleSearchHealthResultList}/>
            <Table className='health-result-table' columns={healthResultColumns} dataSource={this.state.healthResultData} rowKey='id' loading={this.state.healthResultTableLoading} pagination={this.state.healthResultPager} onChange={this.changeHealthResultPager}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default HealthResultManage;
