import './OriginResultManage.css';
import {STYLE, SESSION, SERVER, FILE_SERVER} from './../../App/PublicConstant.js';
import React from 'react';
import {Form, Input, Radio, Select, Cascader, Modal, DatePicker, message, Upload, Button, Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//上传扫描件
class OriginResultUploadPictureModal_ extends React.Component {

  state = {




    fileList: [{
      uid: 1,
      name: 'A.jpg',
      status: 'done',
      url: FILE_SERVER + '/A.jpg',
    },{
      uid: 2,
      name: 'sanzhu.pdf',
      status: 'done',
      url: FILE_SERVER + '/sanzhu.pdf',
    }]
    // fileList: []
  }


  //上传状态变化

  // changeUploadStatus = (info) => {
  //   if (info.file.status !== 'uploading') {
  //     console.log(info.file, info.fileList);
  //   }
  //   if (info.file.status === 'done') {
  //     message.success(`${info.file.name} 上传成功`);
  //   } else if (info.file.status === 'error') {
  //     message.error(`${info.file.name} 上传失败.`);
  //   }
  // }

  handleChange = (info) => {
    let fileList = info.fileList;

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      console.log(file);
      if (file.response) {
        // Component will show file.url as link
        console.log(file.response);
        file.url = file.response.url;
      }

      // file.url = FILE_SERVER + "/1_系统权限划分.xlsx";
      return file;
    });

    this.setState({ fileList });
  }


  render() {

    const { getFieldDecorator } = this.props.form;
    return (
        <Modal title="上传扫描件" visible={this.props.visible} onCancel={this.props.onCancel} footer={false}>
          <Upload name="file"
                  action= {SERVER + "/api/origin/upload" }
                  data = {{originResultId: 5}}
                  headers={{ 'TOKEN' : sessionStorage.getItem(SESSION.TOKEN)}}
                  multiple={true}
                  onChange={this.handleChange}
                  fileList={this.state.fileList}>
            <Button type="primary">
              <Icon type="upload" /> 上传
            </Button>
          </Upload>
        </Modal>
    );
  }
}

const OriginResultUploadPictureModal = Form.create()(OriginResultUploadPictureModal_);
export default OriginResultUploadPictureModal;
