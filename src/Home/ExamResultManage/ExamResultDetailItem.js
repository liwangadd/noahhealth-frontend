import './ExamResultManage.css';
import {STYLE, SESSION, ROLE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import React from 'react';
import {Table, Button, Timeline, Card, Icon, Form, Input,Popconfirm} from 'antd';


class ExamResultDetailItem_ extends React.Component {

  state = {
    formVisible: STYLE.NONE,
    switchText: '展开',

    unpassReason: ''
  }

  //展开、收起表单列表
  switchForm = () => {

    if(this.state.formVisible === STYLE.NONE)
      this.setState({formVisible: STYLE.BLOCK, switchText: '收起'});
    else
      this.setState({formVisible: STYLE.NONE, switchText: '展开'});
  }

  //未通过
  changeUnpassReason = (e) => this.setState({unpassReason: e.target.value})
  confirmUnpass = (id) => {

    this.props.onUnpass(id, this.state.unpassReason);
    this.setState({ popoverVisible: false, unpassReason: ''})
  }


  render() {

    const { getFieldDecorator } = this.props.form;

    const {detail} = this.props;
    const detailColumns = [{
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
    },
    detail.status === "录入中" || detail.status === "未通过"
    ?
    {
      title: '检查结果',
      key: 'action',
      render: (record) => {
        return getFieldDecorator(record.id.toString(), {'initialValue': record.value})(<Input size="small"/>)
      }
    }
    :
    {
      title: '检查结果',
      dataIndex: 'value',
      key: 'value'
    }];


    //操作栏
    let detailOperationDelete = sessionStorage.getItem(SESSION.ROLE) === ROLE.EMPLOYEE_ADMIN
                                ?
                                <Popconfirm title="您确定要删除该条检查记录吗?" placement="bottom" onConfirm={() => this.props.onDelete(detail.id)}>
                                  <Button type="danger" size="default" className="delete" loading={this.props.deleteLoading}>删除</Button>
                                </Popconfirm>
                                :
                                null;
    let detailOperation = null;
    if(detail.status === "录入中" || detail.status === "未通过")
      detailOperation =
      <div>
        {detailOperationDelete}
        <Button className="gutter" size="default" onClick={() => this.props.onSave(this.props.form, detail.id)} loading={this.props.saveLoading}>保存</Button>
        <Popconfirm title="您确定要提交审核吗?" placement="bottom" onConfirm={() => this.props.onSubmit(this.props.form, detail.id)}>
          <Button size="default" type="primary" loading={this.props.submitLoading}>提交审核</Button>
        </Popconfirm>
      </div>;
    else if(detail.status === "待审核")
      detailOperation =
      <div>
        {detailOperationDelete}
        <Popconfirm title="您确定要通过审核吗?" placement="bottom" onConfirm={() => this.props.onPass(this.props.form, detail.id)}>
          <Button className="gutter" type="primary" size="default" loading={this.props.passLoading}>通过</Button>
        </Popconfirm>
        <Popconfirm title={<Input value={this.state.unpassReason} size="small" onChange={this.changeUnpassReason} placeholder="未通过原因"/>}
                    placement="bottom"
                    onConfirm={() => this.confirmUnpass(detail.id)}>
          <Button type="danger" size="default">不通过</Button>
        </Popconfirm>
      </div>
    else
      detailOperation =
      <div>
        {detailOperationDelete}
        <Button size="default" type="primary" onClick={() => this.props.onDownload(detail.id)} loading={this.props.downloadLoading}>下载</Button>
      </div>


    //时间轴节点图标
    let iconType = "plus-circle-o";
    let iconColor = "#ffce3d";
    if(detail.status === "录入中") { iconType = "plus-circle-o"; iconColor = "#ffce3d";}
    else if(detail.status === "待审核") { iconType = "clock-circle-o"; iconColor = "#108ee9";}
    else if(detail.status === "未通过") { iconType = "close-circle-o"; iconColor = "#f04134";}
    else { iconType = "check-circle-o"; iconColor = "#1DA57A";}

    const timeLineIcon = <Icon type={iconType} style={{ fontSize: '16px' , fontWeight: 'bold', color: iconColor}} />

    return (
      <Timeline.Item dot={timeLineIcon}>
        <h4 id={detail.id.toString()}>{detail.secondName + " " + formatDate(detail.time)}</h4>
        <Card title={detail.status} extra={<a onClick={this.switchForm}>{this.state.switchText}</a>} className="exam-result-detail-item-card">
          <p>检查亚类：{detail.secondName}</p>
          <p>检查医院：{detail.hospital}</p>
          <p>录入者：{detail.inputerName}</p>
          {detail.status !== "录入中" && detail.status !== "待审核" ? <p>审核者：{detail.checkerName}</p> : null}
          {detail.status === "未通过" ? <p>审核结果：{detail.reason}</p> : null}
          <p>备注：{detail.comment}</p>
        </Card>
        <Form className="exam-result-detail-item-form" style={{display: this.state.formVisible}}>
          <Table columns={detailColumns} dataSource={detail.data} pagination={false} size="small" rowKey='id'/>
          <div className="operation">
            {detailOperation}
          </div>
        </Form>
      </Timeline.Item>
    );
  }
}

const ExamResultDetailItem = Form.create()(ExamResultDetailItem_);
export default ExamResultDetailItem;
