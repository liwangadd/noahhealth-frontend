import './OriginResultManage.css';
import React from 'react';
import {Form, Input, Modal, Upload, Button, Popconfirm} from 'antd';

//上传扫描件
class OriginResultCheckPictureModal_ extends React.Component {

  state = {
    unpassReason: ''
  }

  changeUnpassReason = (e) => this.setState({unpassReason: e.target.value})

  confirmUnpass = () => {

    this.props.onUnpass(this.state.unpassReason);
    this.setState({ popoverVisible: false, unpassReason: ''})
  }

  render() {

    return (
        <Modal title="审核扫描件" visible={this.props.visible} onCancel={this.props.onCancel}
          footer={<div>
                    <Popconfirm title="您确定要通过审核吗?" placement="bottom" onConfirm={this.props.onPass}>
                      <Button type="primary" size="large" loading={this.props.passLoading}>通过</Button>
                    </Popconfirm>
                    <Popconfirm title={<Input size="small" value={this.state.unpassReason} onChange={this.changeUnpassReason} placeholder="未通过原因"/>}
                                placement="bottom"
                                onConfirm={this.confirmUnpass}>
                      <Button type="danger" size="large">不通过</Button>
                    </Popconfirm>
                  </div>}>
          <Upload name="file" fileList={this.props.fileList}></Upload>
        </Modal>
    );
  }
}

const OriginResultCheckPictureModal = Form.create()(OriginResultCheckPictureModal_);
export default OriginResultCheckPictureModal;
