import './Welcome.css'
import React from 'react';
import {Card, BackTop} from 'antd';
// import $ from 'jquery';

class Welcome extends React.Component {

  test = () => {
    // $.ajax({
    //     url : 'http://10.109.247.97:8080/email/user/register.action?user.username=ken5&user.password=123&user.password2=123&user.pwdEmail=690559724@qq.com&user.question=&user.answer=none&user.alias=&user.gender=MAN&user.phoneNum=&user.address=&user.mark=&user.authCode=bupt',
    //     type : 'POST'
    // });
    //window.location.href = 'http://10.109.247.97:8080/email/user/register.action?user.username=ken3&user.password=123&user.password2=123&user.pwdEmail=690559724@qq.com&user.question=&user.answer=none&user.alias=&user.gender=MAN&user.phoneNum=&user.address=&user.mark=&user.authCode=bupt';
  }


  render(){
    return (
      <div>
        <BackTop visibilityHeight="200"/>
        <div className='introduce-text'>
          <h1>诺亚健康信息管理系统</h1>
          <h3 className='introduce-content'>本系统主要是为档案部、顾问部管理用户健康档案服务，方便数据的录入、查询、修改等操作，也会加入部分财务人员的工作。该系统包含的功能模块主要有：用户管理模块、原始数据管理模块、化验/医技数据管理模块、健康摘要/就医方案管理模块、系统功能模块。</h3>
        </div>
        <div>
          <Card className='card' bodyStyle={{ padding: 0 }} onClick={this.test}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/user_card.svg" />
            </div>
            <div className="custom-card">
              <h3>会员管理</h3>
              <p>会员信息、角色级别、所属顾问</p>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/doctor_card.svg"/>
            </div>
            <div className="custom-card">
              <h3>职员管理</h3>
              <p>权限配置、所属主管</p>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/health_card.svg" />
            </div>
            <div className="custom-card">
              <h3>健康管理</h3>
              <p>健康摘要、就医方案</p>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/record_card.svg" />
            </div>
            <div className="custom-card">
              <h3>原始数据管理</h3>
              <p>用户扫描件</p>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/origindata_card.svg" />
            </div>
            <div className="custom-card">
              <h3>化验/医技数据管理</h3>
              <p>数据录入、数据导出</p>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/config_card.svg" />
            </div>
            <div className="custom-card">
              <h3>系统管理</h3>
              <p>维护检查项目、用户申请单</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

export default Welcome;
