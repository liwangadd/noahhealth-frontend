import { Layout} from 'antd';
import React from 'react';
const {Header} = Layout;

class IndexFooter extends React.Component{

  render() {
    return (
      <Header className='footer footer-affix'>
        医海慈航 ©2017 Created by BUPT
      </Header>)
  }
}

export default IndexFooter;
