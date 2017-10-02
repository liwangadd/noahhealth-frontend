import {SESSION, ROUTE} from './App/PublicConstant.js';
import {clearSession, containsElement, isEmployee} from './App/PublicMethod.js'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App.js';
import Main from './Index/Main/Main.js';
import FindPassword from './Index/FindPassword/FindPassword.js';
import MemberLogin from './Index/Login/MemberLogin.js';
import EmployeeLogin from './Index/Login/EmployeeLogin.js';
import Register from './Index/Register/Register.js';
import Home from './Home/Home.js';
import Welcome from './Home/Welcome/Welcome.js';
import FinanceManage from './Home/FinanceManage/FinanceManage.js';

import EmployeeManage from './Home/EmployeeManage/EmployeeManage.js';
import EmployeeDetail from './Home/EmployeeManage/EmployeeDetail.js';

import MemberManage from './Home/MemberManage/MemberManage.js';
import MemberDetail from './Home/MemberManage/MemberDetail.js';

import MemberDetailOriginResultMenzhen from './Home/MemberManage/MemberDetailOriginResultMenzhen.js';
import MemberDetailOriginResultZhuyuan from './Home/MemberManage/MemberDetailOriginResultZhuyuan.js';
import MemberDetailOriginResultTijian from './Home/MemberManage/MemberDetailOriginResultTijian.js';
import MemberDetailOriginResultYingxiang from './Home/MemberManage/MemberDetailOriginResultYingxiang.js';
import MemberDetailOriginResultYake from './Home/MemberManage/MemberDetailOriginResultYake.js';
import MemberDetailOriginResultZhongyi from './Home/MemberManage/MemberDetailOriginResultZhongyi.js';
import MemberDetailOriginResultXinli from './Home/MemberManage/MemberDetailOriginResultXinli.js';
import MemberDetailOriginResultQita from './Home/MemberManage/MemberDetailOriginResultQita.js';

import MemberDetailHealthResult from './Home/MemberManage/MemberDetailHealthResult.js';
import MemberDetailAssayResult from './Home/MemberManage/MemberDetailAssayResult.js';
import MemberDetailTechResult from './Home/MemberManage/MemberDetailTechResult.js';

import FirstCategoryManage from './Home/CategoryManage/FirstCategoryManage.js';
import SecondCategoryManage from './Home/CategoryManage/SecondCategoryManage.js';
import ThirdCategoryManage from './Home/CategoryManage/ThirdCategoryManage.js';

import OriginResultMenzhenManage from './Home/OriginResultManage/OriginResultMenzhenManage.js';
import OriginResultZhuyuanManage from './Home/OriginResultManage/OriginResultZhuyuanManage.js';
import OriginResultTijianManage from './Home/OriginResultManage/OriginResultTijianManage.js';
import OriginResultYingxiangManage from './Home/OriginResultManage/OriginResultYingxiangManage.js';
import OriginResultYakeManage from './Home/OriginResultManage/OriginResultYakeManage.js';
import OriginResultZhongyiManage from './Home/OriginResultManage/OriginResultZhongyiManage.js';
import OriginResultXinliManage from './Home/OriginResultManage/OriginResultXinliManage.js';
import OriginResultQitaManage from './Home/OriginResultManage/OriginResultQitaManage.js';

import ExamResultAssayManage from './Home/ExamResultManage/ExamResultAssayManage.js';
import ExamResultTechManage from './Home/ExamResultManage/ExamResultTechManage.js';
import ExamResultAssayCloseup from './Home/ExamResultManage/ExamResultAssayCloseup.js';
import ExamResultTechCloseup from './Home/ExamResultManage/ExamResultTechCloseup.js';

import HealthResultManage from './Home/HealthResultManage/HealthResultManage.js';
import HealthResultDetail from './Home/HealthResultManage/HealthResultDetail.js';

import {message} from 'antd'
import {Router, Route, browserHistory, IndexRoute} from 'react-router';


//页面进入认证
const certifyAccess = function(nextState, replace){

    let token = sessionStorage.getItem(SESSION.TOKEN);
    let role = sessionStorage.getItem(SESSION.ROLE);

    //判断有没有token存在
    if(token == null || role == null) {
        message.error('请先登录');
        replace({ pathname: ROUTE.MEMBER_LOGIN.URL })
        return false;
    }

    //判断token时效性
    let expiredTime = sessionStorage.getItem(SESSION.EXPIRED_TIME); //获取过期时间戳
    let now = new Date().getTime();
    if(now > expiredTime) {
        clearSession();
        message.error('已过期请重新登录');
        isEmployee(role) ? replace({ pathname: ROUTE.EMPLOYEE_LOGIN.URL }) : replace({ pathname: ROUTE.MEMBER_LOGIN.URL });
        return false;
    }

    //判断当前用户的role是否能进入targetUrl页面
    let targetUrl = "/" + nextState.location.pathname.split('/')[1];
    switch(targetUrl) {
      case ROUTE.MEMBER_LOGIN.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_LOGIN.PERMISSION);break;
      case ROUTE.EMPLOYEE_LOGIN.URL_PREFIX:certifyRole(replace, role, ROUTE.EMPLOYEE_LOGIN.PERMISSION);break;
      case ROUTE.REGISTER.URL_PREFIX:certifyRole(replace, role, ROUTE.REGISTER.PERMISSION);break;
      case ROUTE.FIND_PASSWORD.URL_PREFIX:certifyRole(replace, role, ROUTE.FIND_PASSWORD.PERMISSION);break;

      case ROUTE.HOME.URL_PREFIX:certifyRole(replace, role, ROUTE.HOME.PERMISSION);break;

      case ROUTE.FINANCE_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.FINANCE_MANAGE.PERMISSION);break;

      case ROUTE.EMPLOYEE_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.EMPLOYEE_MANAGE.PERMISSION);break;
      case ROUTE.EMPLOYEE_DETAIL.URL_PREFIX:certifyRole(replace, role, ROUTE.EMPLOYEE_DETAIL.PERMISSION);break;

      case ROUTE.MEMBER_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_MANAGE.PERMISSION);break;

      case ROUTE.MEMBER_DETAIL.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL.PERMISSION);break;
      case ROUTE.MEMBER_DETAIL_HEALTH_RESULT.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_HEALTH_RESULT.PERMISSION);break;
      case ROUTE.MEMBER_DETAIL_ASSAY_RESULT.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_ASSAY_RESULT.PERMISSION);break;
      case ROUTE.MEMBER_DETAIL_TECH_RESULT.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_TECH_RESULT.PERMISSION);break;

      case ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_MENZHEN.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_MENZHEN.PERMISSION);break;
      case ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_ZHUYUAN.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_ZHUYUAN.PERMISSION);break;
      case ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_TIJIAN.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_TIJIAN.PERMISSION);break;
      case ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_YINGXIANG.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_YINGXIANG.PERMISSION);break;
      case ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_YAKE.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_YAKE.PERMISSION);break;
      case ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_ZHONGYI.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_ZHONGYI.PERMISSION);break;
      case ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_XINLI.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_XINLI.PERMISSION);break;
      case ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_QITA.URL_PREFIX:certifyRole(replace, role, ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_QITA.PERMISSION);break;


      case ROUTE.FIRST_CATEGORY_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.FIRST_CATEGORY_MANAGE.PERMISSION);break;
      case ROUTE.SECOND_CATEGORY_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.SECOND_CATEGORY_MANAGE.PERMISSION);break;
      case ROUTE.THIRD_CATEGORY_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.THIRD_CATEGORY_MANAGE.PERMISSION);break;

      case ROUTE.ORIGIN_RESULT_MENZHEN_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.ORIGIN_RESULT_MENZHEN_MANAGE.PERMISSION);break;
      case ROUTE.ORIGIN_RESULT_ZHUYUAN_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.ORIGIN_RESULT_ZHUYUAN_MANAGE.PERMISSION);break;
      case ROUTE.ORIGIN_RESULT_TIJIAN_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.ORIGIN_RESULT_TIJIAN_MANAGE.PERMISSION);break;
      case ROUTE.ORIGIN_RESULT_YINGXIANG_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.ORIGIN_RESULT_YINGXIANG_MANAGE.PERMISSION);break;
      case ROUTE.ORIGIN_RESULT_YAKE_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.ORIGIN_RESULT_YAKE_MANAGE.PERMISSION);break;
      case ROUTE.ORIGIN_RESULT_ZHONGYI_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.ORIGIN_RESULT_ZHONGYI_MANAGE.PERMISSION);break;
      case ROUTE.ORIGIN_RESULT_XINLI_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.ORIGIN_RESULT_XINLI_MANAGE.PERMISSION);break;
      case ROUTE.ORIGIN_RESULT_QITA_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.ORIGIN_RESULT_QITA_MANAGE.PERMISSION);break;


      case ROUTE.EXAM_RESULT_ASSAY_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.EXAM_RESULT_ASSAY_MANAGE.PERMISSION);break;
      case ROUTE.EXAM_RESULT_ASSAY_CLOSEUP.URL_PREFIX:certifyRole(replace, role, ROUTE.EXAM_RESULT_ASSAY_CLOSEUP.PERMISSION);break;

      case ROUTE.EXAM_RESULT_TECH_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.EXAM_RESULT_TECH_MANAGE.PERMISSION);break;
      case ROUTE.EXAM_RESULT_TECH_CLOSEUP.URL_PREFIX:certifyRole(replace, role, ROUTE.EXAM_RESULT_TECH_CLOSEUP.PERMISSION);break;

      case ROUTE.HEALTH_RESULT_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.HEALTH_RESULT_MANAGE.PERMISSION);break;
      case ROUTE.HEALTH_RESULT_DETAIL.URL_PREFIX:certifyRole(replace, role, ROUTE.HEALTH_RESULT_DETAIL.PERMISSION);break;

      default:clearSession(); isEmployee(role) ? replace({ pathname: ROUTE.EMPLOYEE_LOGIN.URL }) : replace({ pathname: ROUTE.MEMBER_LOGIN.URL }); message.error('暂无该页面，请重新登录');break;
    }

    //放行
    return true;
};

//角色认证(legalRoles == []表示所有角色均可以通过)
const certifyRole = function(replace, role, legalRoles) {

  if(legalRoles.length === 0)
    return true;

  if(containsElement(role, legalRoles)) //包含
    return true;

  //定位到登录页面
  clearSession();
  message.error('权限不够，请更换账号登录');
  isEmployee(role) ? replace({ pathname: ROUTE.EMPLOYEE_LOGIN.URL }) : replace({ pathname: ROUTE.MEMBER_LOGIN.URL });
  return false;
};


class AppRouter extends React.Component {
  render() {
    return (<Router history={browserHistory} addHandlerKey={true}>
              <Route component={App}>

                <Route onEnter={certifyAccess}>
                  <Route path={ROUTE.HOME.URL} component={Home}>
                      <IndexRoute component={Welcome} />
                      <Route path={ROUTE.FINANCE_MANAGE.URL} component={FinanceManage}/>

                      <Route path={ROUTE.EMPLOYEE_MANAGE.URL} component={EmployeeManage}/>
                      <Route path={ROUTE.EMPLOYEE_DETAIL.URL} component={EmployeeDetail}/>

                      <Route path={ROUTE.MEMBER_MANAGE.URL} component={MemberManage}/>

                      <Route path={ROUTE.MEMBER_DETAIL.URL} component={MemberDetail}/>

                      <Route path={ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_MENZHEN.URL} component={MemberDetailOriginResultMenzhen}/>
                      <Route path={ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_ZHUYUAN.URL} component={MemberDetailOriginResultZhuyuan}/>
                      <Route path={ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_TIJIAN.URL} component={MemberDetailOriginResultTijian}/>
                      <Route path={ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_YINGXIANG.URL} component={MemberDetailOriginResultYingxiang}/>
                      <Route path={ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_YAKE.URL} component={MemberDetailOriginResultYake}/>
                      <Route path={ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_ZHONGYI.URL} component={MemberDetailOriginResultZhongyi}/>
                      <Route path={ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_XINLI.URL} component={MemberDetailOriginResultXinli}/>
                      <Route path={ROUTE.MEMBER_DETAIL_ORIGIN_RESULT_QITA.URL} component={MemberDetailOriginResultQita}/>


                      <Route path={ROUTE.MEMBER_DETAIL_HEALTH_RESULT.URL} component={MemberDetailHealthResult}/>
                      <Route path={ROUTE.MEMBER_DETAIL_ASSAY_RESULT.URL} component={MemberDetailAssayResult}/>
                      <Route path={ROUTE.MEMBER_DETAIL_TECH_RESULT.URL} component={MemberDetailTechResult}/>

                      <Route path={ROUTE.FIRST_CATEGORY_MANAGE.URL} component={FirstCategoryManage}/>
                      <Route path={ROUTE.SECOND_CATEGORY_MANAGE.URL} component={SecondCategoryManage}/>
                      <Route path={ROUTE.THIRD_CATEGORY_MANAGE.URL} component={ThirdCategoryManage}/>

                      <Route path={ROUTE.ORIGIN_RESULT_MENZHEN_MANAGE.URL} component={OriginResultMenzhenManage}/>
                      <Route path={ROUTE.ORIGIN_RESULT_ZHUYUAN_MANAGE.URL} component={OriginResultZhuyuanManage}/>
                      <Route path={ROUTE.ORIGIN_RESULT_TIJIAN_MANAGE.URL} component={OriginResultTijianManage}/>
                      <Route path={ROUTE.ORIGIN_RESULT_YINGXIANG_MANAGE.URL} component={OriginResultYingxiangManage}/>
                      <Route path={ROUTE.ORIGIN_RESULT_YAKE_MANAGE.URL} component={OriginResultYakeManage}/>
                      <Route path={ROUTE.ORIGIN_RESULT_ZHONGYI_MANAGE.URL} component={OriginResultZhongyiManage}/>
                      <Route path={ROUTE.ORIGIN_RESULT_XINLI_MANAGE.URL} component={OriginResultXinliManage}/>
                      <Route path={ROUTE.ORIGIN_RESULT_QITA_MANAGE.URL} component={OriginResultQitaManage}/>

                      <Route path={ROUTE.EXAM_RESULT_ASSAY_MANAGE.URL} component={ExamResultAssayManage}/>
                      <Route path={ROUTE.EXAM_RESULT_TECH_MANAGE.URL} component={ExamResultTechManage}/>
                      <Route path={ROUTE.EXAM_RESULT_ASSAY_CLOSEUP.URL} component={ExamResultAssayCloseup}/>
                      <Route path={ROUTE.EXAM_RESULT_TECH_CLOSEUP.URL} component={ExamResultTechCloseup}/>


                      <Route path={ROUTE.HEALTH_RESULT_MANAGE.URL} component={HealthResultManage}/>
                      <Route path={ROUTE.HEALTH_RESULT_DETAIL.URL} component={HealthResultDetail}/>

                  </Route>
                </Route>

                <Route path={ROUTE.ROOT.URL} component={Main}/>
                <Route path={ROUTE.MAIN.URL} component={Main}/>
                <Route path={ROUTE.MEMBER_LOGIN.URL} component={MemberLogin}/>
                <Route path={ROUTE.EMPLOYEE_LOGIN.URL} component={EmployeeLogin}/>
                <Route path={ROUTE.REGISTER.URL} component={Register}/>
                <Route path={ROUTE.FIND_PASSWORD.URL} component={FindPassword}/>

                <Route path="*"  onEnter={certifyAccess} />
              </Route>
          </Router>);
  }
}



ReactDOM.render(<AppRouter />, document.getElementById('root'));
