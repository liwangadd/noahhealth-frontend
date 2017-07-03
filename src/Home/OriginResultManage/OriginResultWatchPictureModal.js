import './OriginResultManage.css';
import React from 'react';
import {Form, Modal, Upload} from 'antd';

//上传扫描件
class OriginResultWatchPictureModal_ extends React.Component {

  render() {

    return (
        <Modal title="查看扫描件" visible={this.props.visible} onCancel={this.props.onCancel} footer={null}>
          <Upload name="file" fileList={this.props.fileList}></Upload>
        </Modal>
    );
  }
}

const OriginResultWatchPictureModal = Form.create()(OriginResultWatchPictureModal_);
export default OriginResultWatchPictureModal;
