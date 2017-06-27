import './OriginResultManage.css';
import {STYLE, SESSION, SERVER, FILE_SERVER,RESULT} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Input, Radio, Select, Cascader, Modal, DatePicker, message, Upload, Button, Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//上传扫描件
class OriginResultUploadPictureModal_ extends React.Component {

  render() {

    const { getFieldDecorator } = this.props.form;
    return (
        <Modal title="上传扫描件" visible={this.props.visible} onCancel={this.props.onCancel} footer={false}>
          <Upload name="file"
                  action= {SERVER + "/api/origin/upload" }
                  data = {{id: this.props.originResultId}}
                  headers={{'TOKEN' : sessionStorage.getItem(SESSION.TOKEN)}}
                  multiple={true}
                  onChange={this.props.onChange}
                  fileList={this.props.fileList}>
            <Button type="primary">
              <Icon type="upload" /> 上传
            </Button>
            <span className="upload-file-warning">文件名请勿包含下划线&nbsp;'_'&nbsp;</span>
          </Upload>
        </Modal>
    );
  }
}

const OriginResultUploadPictureModal = Form.create()(OriginResultUploadPictureModal_);
export default OriginResultUploadPictureModal;
