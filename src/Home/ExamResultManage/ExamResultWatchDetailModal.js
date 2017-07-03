import './ExamResultManage.css';
import React from 'react';
import {Form, Modal, Table} from 'antd';

//查看检查结果
class ExamResultWatchDetailModal extends React.Component {

  render() {

    const examResultDetailColumns = [{
      title: '检查亚类',
      dataIndex: 'secondName',
      key: 'secondName',
      render: (value, row, index) => {

        const cell = {children: <h2 className="secondName">{this.props.examResultSecondName}</h2>, props:{}};
        cell.props.rowSpan = index === 0 ? this.props.examResultDetailData.length : 0;
        return cell;
      }
    },{
      title: '检查项目名称',
      dataIndex: 'thirdName',
      key: 'thirdName'
    },{
      title: '系统分类',
      dataIndex: 'systemCategory',
      key: 'systemCategory',
    },{
      title: '参考值及单位',
      dataIndex: 'referenceValue',
      key: 'referenceValue',
    },{
      title: '301医院',
      dataIndex: 'hospital',
      key: 'hospital',
    },{
      title: '检查结果',
      dataIndex: 'value',
      key: 'value'
    }];



    return (
        <Modal title="查看检查结果" visible={this.props.visible} confirmLoading={this.props.downloadLoading} onCancel={this.props.onCancel} onOk={this.props.onDownload} width={1000} okText="下载">
          <Form>
            <Table columns={examResultDetailColumns} dataSource={this.props.examResultDetailData} loading={this.props.examResultDetailTableLoading} pagination={false} size="small" rowKey='id'/>
          </Form>
        </Modal>
    );
  }
}

export default ExamResultWatchDetailModal;
