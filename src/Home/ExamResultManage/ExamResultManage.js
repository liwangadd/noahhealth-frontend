import './ExamResultManage.css';
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROUTE} from './../../App/PublicConstant.js';
import ExamResultSearchForm from './ExamResultSearchForm.js';
import React from 'react';
import {Tabs, Table, message, BackTop} from 'antd';
import {Link} from 'react-router';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class ExamResultManage extends React.Component {

  state = {

    //执行情况
    examResultData: [],
    examResultTableLoading: false,
    examResultPager: {pageSize: PAGE_SIZE, total: 0}
  };

  //查表
  handleSearchExamResultList = (pageNow) => {

    this.refs.searchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ examResultTableLoading: true});

        console.log('拉取第'+ pageNow + "页化验/医技目录", values);

        $.ajax({
            url : SERVER + '/api/input/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({userName : values.userName,
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
                const examResultPager = this.state.examResultPager;
                examResultPager.total = result.content.rowTotal;
                examResultPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  examResultTableLoading: false,
                  examResultData: result.content.data,
                  examResultPager
                });
            }
        });
      }
    });
  }

  //翻页
  changeExamResultPager = (pager) =>  this.handleSearchExamResultList(pager.current)


  componentDidMount = () => this.handleSearchExamResultList(1)

  render(){

    const examResultColumns = [{
      title: '会员姓名',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '所属顾问',
      dataIndex: 'staffId',
      key: 'staffId'
    },{
      title: '所属顾问主管',
      dataIndex: 'staffMgrId',
      key: 'staffMgrId'
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
          <TabPane tab="化验/医技数据" key="1">
            <ExamResultSearchForm ref="searchForm" handleSearchExamResultList={this.handleSearchExamResultList}/>
            <Table className='exam-result-table' columns={examResultColumns} dataSource={this.state.examResultData} rowKey='id' loading={this.state.examResultTableLoading} pagination={this.state.examResultPager} onChange={this.changeExamResultPager}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ExamResultManage;
