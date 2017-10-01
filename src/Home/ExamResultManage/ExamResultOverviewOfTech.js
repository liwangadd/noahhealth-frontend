import './ExamResultManage.css';
import {PAGE_SIZE, STYLE, SESSION, ROLE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import React from 'react';
import {Table, Button, Timeline, Card, Icon, Input,Popconfirm, Checkbox} from 'antd';


class ExamResultOverviewOfAssay extends React.Component {


  changePager = (pager) => this.props.changeExamResultOverviewOfAssayTablePager('医技', this.props.overview.secondId, pager.current,  this.props.tableIndex)

  render() {

    const {overview, tableIndex} = this.props;

    const overviewColumns = [{
      title: '检查时间',
      dataIndex: 'time',
      key: 'time',
      render: (time) => <span>{formatDate(time)}</span>
    },{
      title: '检查医院',
      dataIndex: 'hospital',
      key: 'hospital'
    },{
      title: '检查结果',
      key: 'value',
      render: (record) => <span className={record.data[0].normal === true ? "abnormal" : ""}>{record.data[0].value}</span>
    }];


    return (
      <Timeline.Item>
        <h4 id={overview.secondId.toString()}>{overview.secondName}</h4>
        <Table columns={overviewColumns} dataSource={overview.data} pagination={{pageSize: PAGE_SIZE, total: overview.colTotal }} onChange={this.changePager} size="small" rowKey='id' className="exam-result-detail-item-form" style={{marginTop: 20}}/>
        <Button size="default" type="primary" onClick={() => this.props.onDownload('医技', overview.secondId, tableIndex)} style={{bottom: 40}} >下载</Button>
      </Timeline.Item>
    );
  }
}

export default ExamResultOverviewOfAssay;
