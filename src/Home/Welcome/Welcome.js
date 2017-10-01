import './Welcome.css'
import React from 'react';
import {SESSION, RESULT, ROLE, SERVER, ROUTE} from './../../App/PublicConstant.js';
import {isMember} from './../../App/PublicMethod.js';
import {Card, BackTop, Calendar, Button, message, Anchor} from 'antd';
import {Link, browserHistory} from 'react-router';
import MemberInfoTable from './../MemberManage/MemberInfoTable.js';
import $ from 'jquery';


class Welcome extends React.Component {

  state = {

    /*
    *会员健康信息
    */
    memberInfo: {},
    updateMemberInfoLoading: false
  }

  test = () => {
    // $.ajax({
    //     url : 'https://10.109.247.72:8443/email/user/register.action?user.username=bob&user.password=1234&user.password2=1234&user.pwdEmail=test@bupt.com&user.question=&user.answer=none&user.alias=&user.gender=MAN&user.phoneNum=&user.address=&user.mark=&user.authCode=bupt',
    //     type : 'POST'
    // });

   //window.location.href = 'https://10.109.247.72:8443/email/user/login.action?username=alice&password=1234&receiver=bob@boat2.wuhan';

  }

  //获取memberId对应的健康信息
  requestMemberInfoData = () => {

    $.ajax({
        url : SERVER + '/api/user/' + sessionStorage.getItem(SESSION.USER_ID),
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

          console.log(result);
          if(result.code !== RESULT.SUCCESS) {
            message.error(result.reason, 2);
          }

          this.setState({memberInfo: result.content});
        }
    });
  }

  //获取memberId对应的健康信息
  updateMemberInfoData = () => {

    this.refs.memberInfoForm.validateFields((err, values) => {
      if(!err) {
        console.log('更新会员的健康信息表', values);

        //显示加载圈
        this.setState({updateMemberInfoLoading: true});
        $.ajax({
            url : SERVER + '/api/user/' + sessionStorage.getItem(SESSION.USER_ID),
            type : 'PUT',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({name: values.name,
                                   birth: values.birth,
                                   gender: values.gender,
                                   idCard: values.idCard,
                                   physicalCondition: values.physicalCondition,
                                   maritalStatus: values.maritalStatus,
                                   medicalCare: values.medicalCare,
                                   hospital: values.hospital,
                                   insurance: values.insurance,
                                   allergyDrug: values.allergyDrug,
                                   allergyOthers: values.allergyOthers}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //关闭加载圈、对话框
                this.setState({updateMemberInfoLoading: false});
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({updateMemberInfoLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  //点击跳转按钮跳转到页面
  handleClickJumpBtn = (page) => {

    const targetUrl = page.URL_PREFIX + "/" + page.MENU_KEY;
    browserHistory.push(targetUrl);
  }


  componentDidMount = () => {

    //如果是会员
    //拉取健康信息表数据
    const role = sessionStorage.getItem(SESSION.ROLE);
    if(isMember(role)) {
      this.requestMemberInfoData();
    }
  }

  render(){
    return (
      <div>
        <BackTop visibilityHeight="200"/>
        <div className='introduce-text'>
          <h1>欢迎来到诺亚健康信息管理系统</h1>
        </div>

        {
          isMember(sessionStorage.getItem(SESSION.ROLE))
          ?
          <MemberInfoTable ref="memberInfoForm" memberInfo={this.state.memberInfo} updateMemberInfoLoading={this.state.updateMemberInfoLoading} onClick={this.updateMemberInfoData}/>
          :
          null
        }

        <div style={{textAlign: 'center'}}>
          <h2 style={{marginBottom: '15px', color:'#1DA57A'}}>健康详情入口</h2>
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
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.HEALTH_RESULT_MANAGE)}>健康摘要库</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.EXAM_RESULT_ASSAY_MANAGE)}>化验数据库</Button>
            <Button className="card-btn" onClick={() => this.handleClickJumpBtn(ROUTE.EXAM_RESULT_TECH_MANAGE)}>医技数据库</Button>
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
            <Button className="card-btn">体检服务预约单</Button>
            <Button className="card-btn">就医服务预约单</Button>
            <Button className="card-btn">其他服务预约单</Button>
          </Card>
        </div>
      </div>
    );
  }
}

export default Welcome;
