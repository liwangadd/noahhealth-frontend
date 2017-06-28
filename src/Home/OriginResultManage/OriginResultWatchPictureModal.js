import './OriginResultManage.css';
import {STYLE, SESSION, SERVER, FILE_SERVER,RESULT} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Input, Radio, Select, Cascader, Modal, DatePicker, message, Upload, Button, Icon, Tag} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

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
