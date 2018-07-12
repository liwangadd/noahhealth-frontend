import React from 'react';
import { Input, Form, Row, Col, Button, Radio } from 'antd';

class MemberInfoTable_ extends React.Component {

  render() {

    const { getFieldDecorator } = this.props.form;
    const { memberInfo, editable } = this.props;

    return (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#1DA57A' }}>健康信息表</h2>
        <table className="member-info-table">
          <tbody>
            <tr>
              <td>姓名</td>
              <td>
                {editable ?
                  getFieldDecorator('name', { initialValue: memberInfo.name })(
                    <Input className='member-info-table-input' style={{ border: '0' }}/>
                  )
                  :
                  <p>{memberInfo.name}</p>
                }
              </td>
              
              <td>性别</td>
              <td>
                {editable ?
                  getFieldDecorator('gender', { initialValue: memberInfo.gender })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.gender}</p>
                }
              </td>

              <td>出生日期</td>
              <td>
                {editable ?
                  getFieldDecorator('birth', { initialValue: memberInfo.birth })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.birth}</p>
                }
              </td>
            </tr>

            <tr>
              <td>血型</td>
              <td>
                {editable ?
                  getFieldDecorator('bloodType', { initialValue: memberInfo.bloodType })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.bloodType}</p>
                }
              </td>

              <td>基础体温</td>
              <td>
                {editable ?
                  getFieldDecorator('baseTemperature', { initialValue: memberInfo.baseTemperature })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.baseTemperature}</p>
                }
              </td>

              <td>呼吸</td>
              <td>
                {editable ?
                  getFieldDecorator('breath', { initialValue: memberInfo.breath })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.breath}</p>
                }
              </td>
            </tr>

            <tr>
              <td>血压</td>
              <td>
                {editable ?
                  getFieldDecorator('bloodPressure', { initialValue: memberInfo.bloodPressure })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.bloodPressure}</p>
                }
              </td>

              <td>心率</td>
              <td>
                {editable ?
                  getFieldDecorator('heartRate', { initialValue: memberInfo.heartRate })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.heartRate}</p>
                }
              </td>

              <td>心律</td>
              <td>
                {editable ?
                  getFieldDecorator('heartRate2', { initialValue: memberInfo.heartRate2 })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.heartRate2}</p>
                }
              </td>
            </tr>

            <tr>
              <td>身高</td>
              <td>
                {editable ?
                  getFieldDecorator('height', { initialValue: memberInfo.height })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.height}</p>
                }
              </td>

              <td>体重</td>
              <td>
                {editable ?
                  getFieldDecorator('weight', { initialValue: memberInfo.weight })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.weight}</p>
                }
              </td>

              <td>体重指数</td>
              <td>
                {editable ?
                  getFieldDecorator('weightRate', { initialValue: memberInfo.weightRate })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.weightRate}</p>
                }
              </td>
            </tr>

            <tr>
              <td>腰围</td>
              <td>
                {editable ?
                  getFieldDecorator('waistCircum', { initialValue: memberInfo.waistCircum })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.waistCircum}</p>
                }
              </td>

              <td>臂围</td>
              <td>
                {editable ?
                  getFieldDecorator('armCircum', { initialValue: memberInfo.armCircum })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.armCircum}</p>
                }
              </td>

              <td>腰臂比</td>
              <td>
                {editable ?
                  getFieldDecorator('waistArmRate', { initialValue: memberInfo.waistArmRate })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.waistArmRate}</p>
                }
              </td>
            </tr>

            <tr>
              <td>身体状况</td>
              <td colSpan={5}>
                {editable ?
                  getFieldDecorator('physicalCondition', { initialValue: memberInfo.physicalCondition })(
                    <Radio.Group>
                      <Radio value="很好">很好</Radio>
                      <Radio value="良好">良好</Radio>
                      <Radio value="一般">一般</Radio>
                      <Radio value="较差">较差</Radio>
                      <Radio value="很差">很差</Radio>
                    </Radio.Group>
                  )
                  :
                  <p>{memberInfo.physicalCondition}</p>
                }
              </td>
            </tr>

            <tr>
              <td>医疗费别</td>
              <td colSpan={5}>
                {editable ?
                  getFieldDecorator('medicalCare', { initialValue: memberInfo.medicalCare })(
                    <Radio.Group>
                      <Radio value="公费">公费</Radio>
                      <Radio value="自费">自费</Radio>
                      <Radio value="基本医保">基本医保</Radio>
                      <Radio value="商业保险">商业保险</Radio>
                      <Radio value="外地医保">外地医保</Radio>
                    </Radio.Group>
                  )
                  :
                  <p>{memberInfo.medicalCare}</p>
                }
              </td>
            </tr>

            <tr>
              <td>定点医院</td>
              <td colSpan={5}>
                {editable ?
                  getFieldDecorator('hospital', { initialValue: memberInfo.hospital })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.hospital}</p>
                }
              </td>
            </tr>

            <tr>
              <td>医疗保险</td>
              <td colSpan={5}>
                {editable ?
                  getFieldDecorator('insurance', { initialValue: memberInfo.insurance })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.insurance}</p>
                }
              </td>
            </tr>

            <tr>
              <td>过敏史</td>
              <td colSpan={5}>
                {editable ?
                  getFieldDecorator('allergyDrug', { initialValue: memberInfo.allergyDrug })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.allergyDrug}</p>
                }
              </td>
            </tr>

            <tr>
              <td>手术史</td>
              <td colSpan={5}>
                {editable ?
                  getFieldDecorator('surgery', { initialValue: memberInfo.surgery })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.surgery}</p>
                }
              </td>
            </tr>

            <tr>
              <td>家族史</td>
              <td colSpan={5}>
                {editable ?
                  getFieldDecorator('family', { initialValue: memberInfo.family })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.family}</p>
                }
              </td>
            </tr>

            <tr>
              <td>主要疾病</td>
              <td colSpan={5}>
                {editable ?
                  getFieldDecorator('disease', { initialValue: memberInfo.disease })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.disease}</p>
                }
              </td>
            </tr>

            <tr>
              <td>主要用药</td>
              <td colSpan={5}>
                {editable ?
                  getFieldDecorator('medication', { initialValue: memberInfo.medication })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.medication}</p>
                }
              </td>
            </tr>

            <tr>
              <td>特殊事项</td>
              <td colSpan={5}>
                {editable ?
                  getFieldDecorator('special', { initialValue: memberInfo.special })(
                    <Input className='member-info-table-input' style={{ border: '0' }} />
                  )
                  :
                  <p>{memberInfo.special}</p>
                }
              </td>
            </tr>
          </tbody>
        </table>

        {editable ?
          <Row className="member-info-table" style={{ marginBottom: '30px', margin: '0 auto' }}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" loading={this.props.updateMemberInfoLoading} onClick={this.props.onClick} style={{ marginTop: 15 }}>更新</Button>
            </Col>
          </Row>
          : null
        }

      </div>);
  }
}

const MemberInfoTable = Form.create()(MemberInfoTable_);
export default MemberInfoTable;
