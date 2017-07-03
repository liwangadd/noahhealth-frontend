import './ExamResultManage.css';
import React from 'react';
import {Form, Input, Modal, Button, Table} from 'antd';

//录入检查结果
class ExamResultInputDetailModal_ extends React.Component {


  render() {

    const { getFieldDecorator } = this.props.form;

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
      key: 'action',
      render: (record) => {
        return getFieldDecorator(record.id.toString(), {'initialValue': record.value})(<Input size="small"/>)
      }
    }];



    return (
        <Modal title="录入检查结果" visible={this.props.visible} onCancel={this.props.onCancel} width={1000}
          footer={
            <div>
              <Button size="large" onClick={this.props.onSave} loading={this.props.saveLoading}>保存</Button>
              <Button size="large" type="primary" onClick={this.props.onSubmit} loading={this.props.submitLoading}>提交审核</Button>
            </div>
          }>
          <Form>
            <Table columns={examResultDetailColumns} dataSource={this.props.examResultDetailData} loading={this.props.examResultDetailTableLoading} pagination={false} size="small" rowKey='id'/>
          </Form>
        </Modal>
    );
  }
}

const ExamResultInputDetailModal = Form.create()(ExamResultInputDetailModal_);
export default ExamResultInputDetailModal;
