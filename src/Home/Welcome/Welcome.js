import './Welcome.css'
import React from 'react';
import {Card, BackTop, Calendar, Button} from 'antd';
import {Link} from 'react-router';
import $ from 'jquery';

class Welcome extends React.Component {

  test = () => {
    // $.ajax({
    //     url : 'https://10.109.247.72:8443/email/user/register.action?user.username=bob&user.password=1234&user.password2=1234&user.pwdEmail=test@bupt.com&user.question=&user.answer=none&user.alias=&user.gender=MAN&user.phoneNum=&user.address=&user.mark=&user.authCode=bupt',
    //     type : 'POST'
    // });

   window.location.href = 'https://10.109.247.72:8443/email/user/login.action?username=alice&password=1234&receiver=bob@boat2.wuhan';

  }


  render(){
    return (
      <div>
        <BackTop visibilityHeight="200"/>
        <div className='introduce-text'>
          <h1>欢迎来到诺亚健康信息管理系统</h1>
        </div>
        <div>
          <Card title="电子健康银行" className="card">
            <Button className="card-btn">门诊资料</Button>
            <Button className="card-btn">住院资料</Button>
            <Button className="card-btn">体检资料</Button>
            <Button className="card-btn">影像资料</Button>
            <Button className="card-btn">牙科资料</Button>
            <Button className="card-btn">中医资料</Button>
            <Button className="card-btn">心理资料</Button>
            <Button className="card-btn">其他资料</Button>
          </Card>
          <Card title="健康大数据库" className="card" style={{width:'20%'}}>
            <Button className="card-btn" >健康摘要库</Button>
            <Button className="card-btn" >化验数据库</Button>
            <Button className="card-btn" >医技数据库</Button>
          </Card>
          <Card title="健康长程管理" className="card" style={{width:'28%'}}>
            <Button className="card-btn">健康管理方案</Button>
            <Button className="card-btn">健康问题记录</Button>
            <Button className="card-btn">专病监测表格</Button>
            <Button className="card-btn">调查评估量表</Button>
            <Button className="card-btn">私人定制体检</Button>
            <Button className="card-btn">年度健康总结</Button>
          </Card>
          <Card title="会员服务预约" className="card" style={{width:'22%'}}>
            <Button className="card-btn" >体检服务预约单</Button>
            <Button className="card-btn">就医服务预约单</Button>
            <Button className="card-btn" >其他服务预约单</Button>
          </Card>
        </div>
      </div>
    );
  }
}

export default Welcome;
