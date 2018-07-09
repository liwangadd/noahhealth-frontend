import './ExamResultManage.css';
import { STYLE, SESSION, ROLE } from './../../App/PublicConstant.js';
import { formatDate } from './../../App/PublicUtil.js';
import React from 'react';
import { Table, Button, Timeline, Card, Icon, Form, Input, Popconfirm, Checkbox } from 'antd';
const { TextArea } = Input

//判断是否含有异常项
const hasAbnormal = (tableItem) => {

    for (let i = 0; i < tableItem.length; i++)
        if (tableItem[i].normal === true)
            return true;
}


class ExamAssayResultDetailItem_ extends React.Component {

    state = {
        formVisible: STYLE.BLOCK,
        switchText: '收起',
        note: '',

        unpassReason: ''
    }

    //展开、收起表单列表
    switchForm = () => {

        if (this.state.formVisible === STYLE.NONE)
            this.setState({ formVisible: STYLE.BLOCK, switchText: '收起' });
        else
            this.setState({ formVisible: STYLE.NONE, switchText: '展开' });
    }

    //未通过
    changeUnpassReason = (e) => this.setState({ unpassReason: e.target.value })
    confirmUnpass = (id) => {

        this.props.onUnpass(id, this.state.unpassReason);
        this.setState({ popoverVisible: false, unpassReason: '' })
    }

    handleNote = (e) => {
        // this.setState({note: e.target.value})
        this.props.detail.note = e.target.value
    }


    render() {
        const role = sessionStorage.getItem(SESSION.ROLE);

        const { getFieldDecorator } = this.props.form;

        const { detail, type } = this.props;

        const detailColumns = [{
            title: '化验项目',
            key: 'thirdName',
            width: '20%',
            render: (record) => {
                return <span className={record.normal === true ? "abnormal" : ""}>{record.thirdName}{record.enShort === null || record.enShort === '' || record.enShort === undefined ?
                    '' : '(' + record.enShort + ')'}</span>
            }
        }, {
            title: '参考值',
            dataIndex: 'referenceValue',
            width: '30%',
            key: 'referenceValue'
        },
        (detail.status === "录入中" || detail.status === "未通过" || detail.status === "待审核") &&
            (role === ROLE.EMPLOYEE_ARCHIVE_MANAGER || role === ROLE.EMPLOYEE_ADMIN || role === ROLE.EMPLOYEE_ARCHIVER)
            ?
            {
                title: '化验数据',
                key: 'value',
                width: '20%',
                render: (record) => {
                    return getFieldDecorator(record.id.toString() + "-value", { 'initialValue': record.value })(<TextArea autosize={{ minRows: 1, maxRows: 6 }} />)
                }
            }
            :
            {
                title: '化验数据',
                dataIndex: 'value',
                key: 'value',
                width: '20%'
            }, {
            title: '异常判断',
            key: 'normal',
            width: '10%',
            render: (record) => {
                return getFieldDecorator(record.id.toString() + "-normal", { valuePropName: 'checked', 'initialValue': record.normal })
                    (<Checkbox style={{ marginLeft: 18 }} disabled={
                        detail.status === "录入中" || detail.status === "未通过" || detail.status === '待审核' && (role === ROLE.EMPLOYEE_ADMIN || role === role.EMPLOYEE_ARCHIVE_MANAGER)
                            ? false : true} />)
            }
        },
        (detail.status === "录入中" || detail.status === "未通过" || detail.status === "待审核") &&
            (role === ROLE.EMPLOYEE_ARCHIVE_MANAGER || role === ROLE.EMPLOYEE_ADMIN || role === ROLE.EMPLOYEE_ARCHIVER)
            ?
            {
                title: '备注',
                key: 'note',
                width: '30%',
                render: (value, row, index) => {
                    const obj = {
                        children: <TextArea autosize={{ minRows: 8, }} onChange={this.handleNote} defaultValue={detail.note} />,
                        props: {}
                    }
                    if (index === 0) {
                        obj.props.rowSpan = detail.data.length
                    } else {
                        obj.props.rowSpan = 0
                    }
                    return obj
                }
            }
            :
            {
                title: '备注',
                dataIndex: 'note',
                key: 'note',
                width: '30%',
                render: (value, row, index) => {
                    const obj = {
                        children: detail.note,
                        props: {}
                    };
                    if (index === 0) {
                        obj.props.rowSpan = detail.data.length;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                    return obj;
                }
            }
        ];

        //操作栏
        let detailOperationDelete = (<Popconfirm title="您确定要删除该条检查记录吗?" placement="bottom" onConfirm={() => this.props.onDelete(detail.id)}>
            <Button type="danger" size="default" className="gutter" loading={this.props.deleteLoading}>删除</Button>
        </Popconfirm>);

        let detailOperation = null;
        if (detail.status === "录入中" || detail.status === "未通过")
            detailOperation =
                <div>
                    {role === ROLE.EMPLOYEE_ADMIN || role === ROLE.EMPLOYEE_ARCHIVE_MANAGER
                        ?
                        detailOperationDelete
                        :
                        null
                    }
                    <Button className="gutter" size="default" onClick={() => this.props.onSave(this.props.form, detail.id, detail.note)} loading={this.props.saveLoading}>保存</Button>
                    <Popconfirm title="您确定要提交审核吗?" placement="bottom" onConfirm={() => this.props.onSubmit(this.props.form, detail.id, detail.note)}>
                        <Button size="default" type="primary" loading={this.props.submitLoading}>提交审核</Button>
                    </Popconfirm>
                </div>;
        else if (detail.status === "待审核")
            detailOperation =
                <div>
                    {role === ROLE.EMPLOYEE_ADMIN || role === ROLE.EMPLOYEE_ARCHIVE_MANAGER
                        ?
                        detailOperationDelete
                        :
                        null
                    }
                    {
                        role === ROLE.EMPLOYEE_ARCHIVE_MANAGER || role === ROLE.EMPLOYEE_ADMIN
                            ?
                            <span>
                                <Popconfirm title={<Input value={this.state.unpassReason} size="small" onChange={this.changeUnpassReason} placeholder="未通过原因" />}
                                    placement="bottom"
                                    onConfirm={() => this.confirmUnpass(detail.id)}>
                                    <Button className="gutter" type="danger" size="default">不通过</Button>
                                </Popconfirm>
                                <Popconfirm title="您确定要通过审核吗?" placement="bottom" onConfirm={() => this.props.onPass(this.props.form, detail.id, detail.note)}>
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
                    {role === ROLE.EMPLOYEE_ADMIN
                        ?
                        detailOperationDelete
                        :
                        null
                    }
                    <Button size="default" type="primary" onClick={() => this.props.onDownload(detail.id)} loading={this.props.downloadLoading}>下载</Button>
                </div>

        //时间轴节点图标
        let iconType = "plus-circle-o";
        let iconColor = "#ffce3d";
        if (detail.status === "录入中") { iconType = "plus-circle-o"; iconColor = "#ffce3d"; }
        else if (detail.status === "待审核") { iconType = "clock-circle-o"; iconColor = "#108ee9"; }
        else if (detail.status === "未通过") { iconType = "close-circle-o"; iconColor = "#f04134"; }
        else { iconType = "check-circle-o"; iconColor = "#1DA57A"; }

        const timeLineIcon = <Icon type={iconType} style={{ fontSize: '16px', fontWeight: 'bold', color: iconColor }} />

        return (
            <Timeline.Item dot={timeLineIcon}>
                <h4 id={detail.id.toString()} className={hasAbnormal(detail.data) ? "abnormal" : ""}>{detail.secondName + " " + formatDate(detail.time)}</h4>
                <Card title={detail.status} extra={<a onClick={this.switchForm}>{this.state.switchText}</a>} className="exam-result-detail-item-card">
                    <p className={hasAbnormal(detail.data) ? "abnormal" : ""}>检查亚类：{detail.secondName}</p>
                    <p >检查医院：{detail.hospital}</p>
                    <p>录入时间：{formatDate(detail.uploadTime)}</p>
                    <p>录入者：{detail.inputerName}</p>
                    {detail.status !== "录入中" && detail.status !== "待审核" ? <p>审核者：{detail.checkerName}</p> : null}
                    {detail.status === "未通过" ? <p>审核结果：{detail.reason}</p> : null}
                    {detail.type === '医技' ? <p>备注: {detail.note}</p> : null}
                </Card>
                <Form className="exam-result-detail-item-form" style={{ display: this.state.formVisible }}>
                    <Table columns={detailColumns} dataSource={detail.data} pagination={false} size="small" rowKey='id' />
                    <div className="operation">
                        {detailOperation}
                    </div>
                </Form>
            </Timeline.Item>
        );
    }
}

const ExamAssayResultDetailItem = Form.create()(ExamAssayResultDetailItem_);
export default ExamAssayResultDetailItem;
