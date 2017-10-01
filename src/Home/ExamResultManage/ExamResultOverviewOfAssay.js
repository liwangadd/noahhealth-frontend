import './ExamResultManage.css';
import {STYLE, SESSION, ROLE, OVERVIEW_PAGE_SIZE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import React from 'react';
import {Table, Button, Timeline, Card, Icon, Input,Popconfirm, Checkbox} from 'antd';


class ExamResultOverviewOfAssay extends React.Component {


  changePager = (pager) => this.props.changeExamResultOverviewOfAssayTablePager('化验', this.props.overview.secondId, pager.current,  this.props.tableIndex)

  render() {

    const {overview, tableIndex} = this.props;

    let visits = overview.data;

    //构造表格每行的数据
    let tableData = [];
    if(visits.length > 0 && visits[0].data.length > 0) {

      for(let j = 0; j < visits[0].data.length; j++) {

        tableData.push({thirdName: visits[0].data[j].thirdName,
                        thirdId: visits[0].data[j].thirdId,
                        enShort: visits[0].data[j].enShort,
                        referenceValue: visits[0].data[j].referenceValue})
      }
    }

    for(let i = 0; i < visits.length; i++) {

      for(let j = 0; j < visits[i].data.length; j++) {

        tableData[j]['value-' + i] = visits[i].data[j].value;
        tableData[j]['normal-' + i] = visits[i].data[j].normal;

      }
    }

    console.log(tableData);

    const overviewColumns = [{
      title: '化验项目',
      key: 'thirdName',
      render: (record) => {
        return <span>{record.thirdName}{record.enShort === null || record.enShort === '' || record.enShort === undefined ? '' : '(' + record.enShort +')'}</span>
      }
    },{
      title: '参考值',
      dataIndex: 'referenceValue',
      key: 'referenceValue'
    }];


    for(let i = 0; i < visits.length; i++) {

        overviewColumns.push({
          title: <span>{visits[i].hospital}<br/>{formatDate(visits[i].time)}</span>,
          key: 'value-' + i,
          render: (record) => <span className={record['normal-' + i] === true ? "abnormal" : ""}>{record['value-' + i]}</span>
        });
    }


    const role = sessionStorage.getItem(SESSION.ROLE);
    return (
      <Timeline.Item>
        <h4 id={overview.secondId.toString()}>{overview.secondName}</h4>
        <Table columns={overviewColumns} dataSource={tableData} pagination={{pageSize: 100, total: 100 * ( overview.colTotal / OVERVIEW_PAGE_SIZE) }} onChange={this.changePager} size="small" rowKey='thirdId' className="exam-result-detail-item-form" style={{marginTop: 20}}/>
        <Button size="default" type="primary" onClick={() => this.props.onDownload('化验', overview.secondId, tableIndex)} style={{bottom: 40}} >下载</Button>
      </Timeline.Item>
    );
  }
}

export default ExamResultOverviewOfAssay;
