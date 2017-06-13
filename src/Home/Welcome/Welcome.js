import './Welcome.css'
import React from 'react';
import {Card} from 'antd';


class Welcome extends React.Component {
  render(){
    return (
      <div>
        <div className='introduce-text'>
          <h1>医海慈航信息管理系统</h1>
          <h3 className='introduce-content'>本系统主要是为档案部、顾问部管理用户健康档案服务，方便数据的录入、查询、修改等操作，也会加入部分财务人员的工作。该系统包含的功能模块主要有：用户管理模块、原始数据管理模块、化验/医技数据管理模块、健康摘要/就医方案管理模块、系统功能模块。</h3>
        </div>
        <div>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/user_card.svg" />
            </div>
            <div className="custom-card">
              <h3>会员管理</h3>
              <p>个人信息管理、账户信息管理</p>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/doctor_card.svg"/>
            </div>
            <div className="custom-card">
              <h3>专家管理</h3>
              <p>信息管理</p>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/health_card.svg" />
            </div>
            <div className="custom-card">
              <h3>健康管理</h3>
              <p>专病管理、亚健康管理</p>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/record_card.svg" />
            </div>
            <div className="custom-card">
              <h3>记录管理</h3>
              <p>反馈记录、访问记录、会诊记录</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

export default Welcome;
