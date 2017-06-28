import './OriginResultManage.css';
import {STYLE, SESSION, SERVER, FILE_SERVER,RESULT} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Input, Radio, Select, Cascader, Modal, DatePicker, message, Upload, Button, Icon, Tag, Popover} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//上传扫描件
class OriginResultCheckPictureModal_ extends React.Component {

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

    return (
        <Modal title="审核扫描件" visible={this.props.visible} onCancel={this.props.onCancel}
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
          <Upload name="file" fileList={this.props.fileList}></Upload>
        </Modal>
    );
  }
}

const OriginResultCheckPictureModal = Form.create()(OriginResultCheckPictureModal_);
export default OriginResultCheckPictureModal;
