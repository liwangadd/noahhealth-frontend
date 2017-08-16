import './HealthResultManage.css';
import {STYLE, SESSION, ROLE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import {isEmployee, isMember} from './../../App/PublicMethod.js';
import React from 'react';
import {Table, Button, Timeline, Card, Icon, Form, Input,Popconfirm, Checkbox} from 'antd';


class HealthResultDetailItem_ extends React.Component {

  state = {
    formVisible: STYLE.BLOCK,
    switchText: '收起',

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
    const detailColumns = [
    {
      title: '摘要内容',
      key: 'contentNew',
      render: (record) => {
        return getFieldDecorator('contentNew', {'initialValue': isEmployee(role) ? record.contentNew : record.content})(<Input type="textarea" placeholder={isEmployee(role) && (detail.status === "录入中" || detail.status === "未通过" || detail.status === "已通过") ? "请输入" : null} rows={5} style={{border: '0px'}} disabled={isEmployee(role) && (detail.status === "录入中" || detail.status === "未通过" || detail.status === "已通过") ? false : true}/>)
      }
    }];

    const role = sessionStorage.getItem(SESSION.ROLE);

    //操作栏
    let detailOperationDelete = role === ROLE.EMPLOYEE_ADMIN || role === ROLE.EMPLOYEE_ADVISE_MANAGER
                                ?
                                <Popconfirm title="您确定要删除该条检查记录吗?" placement="bottom" onConfirm={() => this.props.onDelete(detail.id)}>
                                  <Button type="danger" size="default" className="gutter" loading={this.props.deleteLoading}>删除</Button>
                                </Popconfirm>
                                :
                                null;
    let detailOperation = null;
    if(detail.status === "录入中" || detail.status === "未通过" || detail.status === "已通过")
      detailOperation =
      isEmployee(role)
      ?
      <div>
        {detailOperationDelete}
        <Button className="gutter" size="default" onClick={() => this.props.onSave(this.props.form, detail.id)} loading={this.props.saveLoading}>保存</Button>
        <Popconfirm title="您确定要提交审核吗?" placement="bottom" onConfirm={() => this.props.onSubmit(this.props.form, detail.id)}>
          <Button size="default" type="primary" loading={this.props.submitLoading}>提交审核</Button>
        </Popconfirm>
      </div>
      :
      null ;
    else if(detail.status === "待审核")
      detailOperation =
      <div>
        {detailOperationDelete}
        {
          role === ROLE.EMPLOYEE_ADVISE_MANAGER || role === ROLE.EMPLOYEE_ADMIN
          ?
          <span>
            <Popconfirm title={<Input value={this.state.unpassReason} size="small" onChange={this.changeUnpassReason} placeholder="未通过原因"/>}
                        placement="bottom"
                        onConfirm={() => this.confirmUnpass(detail.id)}>
              <Button className="gutter" type="danger" size="default">不通过</Button>
            </Popconfirm>
            <Popconfirm title="您确定要通过审核吗?" placement="bottom" onConfirm={() => this.props.onPass(this.props.form, detail.id)}>
              <Button type="primary" size="default" loading={this.props.passLoading}>通过</Button>
            </Popconfirm>
          </span>
          :
          null
        }
      </div>
    else //已通过
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

    const timeLineIcon = isEmployee(role) ? <Icon type={iconType} style={{ fontSize: '16px' , fontWeight: 'bold', color: iconColor}} /> : null;

    return (
      <Timeline.Item dot={timeLineIcon}>
        <h4 id={detail.id.toString()}>{detail.secondName + " " + formatDate(detail.time)}</h4>
        <Card title={isEmployee(role) ? detail.status : null} extra={<a onClick={this.switchForm}>{this.state.switchText}</a>} className="health-result-detail-item-card">
          <p>录入时间：{formatDate(detail.uploadTime)}</p>
          <p>录入者：{detail.inputerName}</p>
          {detail.status !== "录入中" && detail.status !== "待审核" ? <p>审核者：{detail.checkerName}</p> : null}
          {detail.status === "未通过" ? <p>审核结果：{detail.reason}</p> : null}
          <p>备注：{detail.note}</p>
        </Card>
        <Form className="health-result-detail-item-form" style={{display: this.state.formVisible}}>
          <Table columns={detailColumns} dataSource={[{id: detail.id, content: detail.content, contentNew: detail.contentNew}]} pagination={false} size="small" rowKey='id'/>
          <div className="operation">
            {detailOperation}
          </div>
        </Form>
      </Timeline.Item>
    );
  }
}

const HealthResultDetailItem = Form.create()(HealthResultDetailItem_);
export default HealthResultDetailItem;
