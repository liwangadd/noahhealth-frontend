import './OriginResultManage.css';
import React from 'react';
import {Form, Input, Modal, Upload, Button, Popover, Popconfirm} from 'antd';

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
                    <Popconfirm title="您确定要通过审核吗?" placement="bottom" onConfirm={this.props.onPass} okText="是" cancelText="取消">
                      <Button type="primary" size="large" loading={this.props.passLoading}>通过</Button>
                    </Popconfirm>
                    <Popover content={<div><Input value={this.state.unpassReason} onChange={this.changeUnpassReason} placeholder="未通过原因" style={{width:'80%'}}/><Button shape="circle" type="primary" size="small" icon="check" className="unpass-check" onClick={this.confirmUnpass}/></div>}
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
