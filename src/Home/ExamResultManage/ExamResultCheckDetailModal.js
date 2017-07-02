import './ExamResultManage.css';
import {STYLE, SESSION, SERVER, FILE_SERVER,RESULT} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Input, Radio, Select, Cascader, Modal, DatePicker, message, Button, Icon, Tag, Table, Popover} from 'antd';

//录入检查结果
class ExamResultCheckDetailModal extends React.Component {

  state = {
    unpassReason: '',
    popoverVisible: false
  }

  changeVisible = (visible) => this.setState({ popoverVisible: visible })

  changeUnpassReason = (e) => this.setState({unpassReason: e.target.value})

  confirmUnpass = () => {

    this.props.onUnpass(this.state.unpassReason);
    this.setState({ popoverVisible: false, unpassReason: ''})
  }

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
        <Modal title="审核检查结果" visible={this.props.visible} onCancel={this.props.onCancel} width={1000}
          footer={<div>
                    <Button type="primary" size="large" onClick={this.props.onPass} loading={this.props.passLoading}>通过</Button>
                    <Popover content={<div><Input value={this.state.unpassReason} onChange={this.changeUnpassReason} placeholder="未通过原因" style={{width:'80%'}}/><a onClick={this.confirmUnpass} className="unpass-confirm">确定</a></div>}
                             title={null}
                             trigger="click"
                             placement="bottom"
                             visible={this.state.popoverVisible}
                             onVisibleChange={this.changeVisible}>
                      <Button type="danger" size="large">不通过</Button>
                    </Popover>
                  </div>}>
          <Form>
            <Table columns={examResultDetailColumns} dataSource={this.props.examResultDetailData} loading={this.props.examResultDetailTableLoading} pagination={false} size="small" rowKey='id'/>
          </Form>
        </Modal>
    );
  }
}

export default ExamResultCheckDetailModal;
