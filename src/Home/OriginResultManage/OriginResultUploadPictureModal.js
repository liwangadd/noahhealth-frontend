import './OriginResultManage.css';
import {SESSION, SERVER} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Modal, Upload, Button, Icon, Tag, Popconfirm} from 'antd';

//上传扫描件
class OriginResultUploadPictureModal_ extends React.Component {

  render() {

    return (
        <Modal title="上传扫描件" visible={this.props.visible} onCancel={this.props.onCancel}
               footer={
                 <Popconfirm title="您确定要提交审核吗?" placement="bottom" onConfirm={this.props.onSubmit}>
                   <Button type="primary" size="large" loading={this.props.submitLoading}>提交审核</Button>
                 </Popconfirm>}>
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
            <Tag color="orange" className="upload-file-warning">文件名请勿包含下划线</Tag>
            <Tag color="orange">文件大小请勿超过10MB</Tag>
          </Upload>
        </Modal>
    );
  }
}

const OriginResultUploadPictureModal = Form.create()(OriginResultUploadPictureModal_);
export default OriginResultUploadPictureModal;
