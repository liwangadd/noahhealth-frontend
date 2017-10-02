import React from 'react';
import { Input, Form, Row, Col, Button, Radio} from 'antd';

class MemberInfoTable_ extends React.Component {

  render() {

    const { getFieldDecorator } = this.props.form;
    const { memberInfo } = this.props;
    return (
      <div style={{textAlign: 'center'}}>
        <h2 style={{color:'#1DA57A'}}>健康信息表</h2>
        <table className="member-info-table">
          <tbody>
            <tr>
              <td>姓名</td>
              <td>
                {getFieldDecorator('name', { initialValue: memberInfo.name })(
                <Input className='member-info-table-input' style={{border: '0'}}/>
                )}
              </td>

              <td>出生日期</td>
              <td>
                {getFieldDecorator('birth', { initialValue: memberInfo.birth })(
                <Input className='member-info-table-input' style={{border: '0'}}/>
                )}
              </td>
            </tr>

            <tr>
              <td>性别</td>
              <td>
                {getFieldDecorator('gender', { initialValue: memberInfo.gender })(
                <Input className='member-info-table-input' style={{border: '0'}}/>
                )}
              </td>

              <td>身份证号码</td>
              <td>
                {getFieldDecorator('idCard', { initialValue: memberInfo.idCard })(
                <Input className='member-info-table-input' style={{border: '0'}}/>
                )}
              </td>
            </tr>

            <tr>
              <td>身体状况</td>
              <td colSpan={3}>
                {getFieldDecorator('physicalCondition', { initialValue: memberInfo.physicalCondition })(
                <Radio.Group>
                  <Radio value="很好">很好</Radio>
                  <Radio value="良好">良好</Radio>
                  <Radio value="一般">一般</Radio>
                  <Radio value="较差">较差</Radio>
                  <Radio value="很差">很差</Radio>
                </Radio.Group>
                )}
              </td>
            </tr>

            <tr>
              <td>婚姻状况</td>
              <td colSpan={3}>
                {getFieldDecorator('maritalStatus', { initialValue: memberInfo.maritalStatus })(
                  <Radio.Group>
                    <Radio value="未婚">未婚</Radio>
                    <Radio value="已婚">已婚</Radio>
                    <Radio value="离异">离异</Radio>
                    <Radio value="丧偶">丧偶</Radio>
                  </Radio.Group>
                )}
              </td>
            </tr>

            <tr>
              <td>医疗费别</td>
              <td colSpan={3}>
                {getFieldDecorator('medicalCare', { initialValue: memberInfo.medicalCare })(
                  <Radio.Group>
                    <Radio value="公费">公费</Radio>
                    <Radio value="自费">自费</Radio>
                    <Radio value="基本医保">基本医保</Radio>
                    <Radio value="商业保险">商业保险</Radio>
                    <Radio value="外地医保">外地医保</Radio>
                  </Radio.Group>
                )}
              </td>
            </tr>

            <tr>
              <td>医保定点医院</td>
              <td colSpan={3}>
                {getFieldDecorator('hospital', { initialValue: memberInfo.hospital })(
                <Input className='member-info-table-input' style={{border: '0'}}/>
                )}
              </td>
            </tr>

            <tr>
              <td>商业健康保险</td>
              <td colSpan={3}>
                {getFieldDecorator('insurance', { initialValue: memberInfo.insurance })(
                <Input className='member-info-table-input' style={{border: '0'}}/>
                )}
              </td>
            </tr>

            <tr>
              <td rowSpan={2}>过敏史</td>
              <td>药物</td>
              <td colSpan={2}>
                {getFieldDecorator('allergyDrug', { initialValue: memberInfo.allergyDrug })(
                <Input className='member-info-table-input' style={{border: '0'}}/>
                )}
              </td>
            </tr>

            <tr>
              <td>其他</td>
              <td colSpan={2}>
                {getFieldDecorator('allergyOthers', { initialValue: memberInfo.allergyOthers })(
                <Input className='member-info-table-input' style={{border: '0'}}/>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <Row className="member-info-table" style={{marginBottom: '30px'}}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" loading={this.props.updateMemberInfoLoading} onClick={this.props.onClick}>更新</Button>
          </Col>
        </Row>

      </div>);
  }
}

const MemberInfoTable = Form.create()(MemberInfoTable_);
export default MemberInfoTable;
