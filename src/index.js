import {SESSION, ROUTE} from './App/PublicConstant.js';
import {clearSession, containsElement} from './App/PublicMethod.js'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App.js';
import Main from './Index/Main/Main.js';
import Login from './Index/Login/Login.js';
import Register from './Index/Register/Register.js';
import Home from './Home/Home.js';
import Welcome from './Home/Welcome/Welcome.js';
import UserManage from './Home/UserManage/UserManage.js';
import FirstCategoryManage from './Home/CategoryManage/FirstCategoryManage.js';
import SecondCategoryManage from './Home/CategoryManage/SecondCategoryManage.js';
import ThirdCategoryManage from './Home/CategoryManage/ThirdCategoryManage.js';
import OriginResultManage from './Home/OriginResultManage/OriginResultManage.js';
import ExamResultManage from './Home/ExamResultManage/ExamResultManage.js';
import ExamResultDetail from './Home/ExamResultManage/ExamResultDetail.js';
import {message} from 'antd'
import {Router, Route, browserHistory, IndexRoute} from 'react-router';


//页面进入认证
var certifyAccess = function(nextState, replace){

    let token = sessionStorage.getItem(SESSION.TOKEN);
    let role = sessionStorage.getItem(SESSION.ROLE);

    //判断有没有token存在
    if(token == null || role == null) {
        message.error('请先登录');
        replace({ pathname: ROUTE.LOGIN.URL })
        return false;
    }

    //判断token时效性
    let expiredTime = sessionStorage.getItem(SESSION.EXPIRED_TIME); //获取过期时间戳
    let now = new Date().getTime();
    if(now > expiredTime) {
        clearSession();
        message.error('已过期请重新登录');
        replace({ pathname: ROUTE.LOGIN.URL });
        return false;
    }

    //判断当前用户的role是否能进入targetUrl页面
    let targetUrl = "/" + nextState.location.pathname.split('/')[1];
    switch(targetUrl) {
      case ROUTE.LOGIN.URL_PREFIX:certifyRole(replace, role, ROUTE.LOGIN.PERMISSION);break;
      case ROUTE.REGISTER.URL_PREFIX:certifyRole(replace, role, ROUTE.REGISTER.PERMISSION);break;
      case ROUTE.HOME.URL_PREFIX:certifyRole(replace, role, ROUTE.HOME.PERMISSION);break;

      case ROUTE.USER_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.USER_MANAGE.PERMISSION);break;

      case ROUTE.FIRST_CATEGORY_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.FIRST_CATEGORY_MANAGE.PERMISSION);break;
      case ROUTE.SECOND_CATEGORY_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.SECOND_CATEGORY_MANAGE.PERMISSION);break;
      case ROUTE.THIRD_CATEGORY_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.THIRD_CATEGORY_MANAGE.PERMISSION);break;

      case ROUTE.ORIGIN_RESULT_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.ORIGIN_RESULT_MANAGE.PERMISSION);break;

      case ROUTE.EXAM_RESULT_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.EXAM_RESULT_MANAGE.PERMISSION);break;
      case ROUTE.EXAM_RESULT_DETAIL.URL_PREFIX:certifyRole(replace, role, ROUTE.EXAM_RESULT_DETAIL.PERMISSION);break;

      default:clearSession();replace({ pathname: ROUTE.LOGIN.URL });message.error('暂无该页面，请重新登录');break;
    }

    //放行
    return true;
};

//角色认证(legalRoles == []表示所有角色均可以通过)
var certifyRole = function(replace, role, legalRoles) {

  if(legalRoles.length === 0)
    return true;

  if(containsElement(role, legalRoles)) //包含
    return true;

  //定位到登录页面
  clearSession();
  message.error('权限不够，请更换账号登录');
  replace({ pathname: ROUTE.LOGIN.URL });
  return false;
};


class AppRouter extends React.Component {
  render() {
    return (<Router history={browserHistory}>
              <Route component={App}>

                <Route onEnter={certifyAccess}>
                  <Route path={ROUTE.HOME.URL} component={Home}>
                      <IndexRoute component={Welcome} />
                      <Route path={ROUTE.USER_MANAGE.URL} component={UserManage}/>

                      <Route path={ROUTE.FIRST_CATEGORY_MANAGE.URL} component={FirstCategoryManage}/>
                      <Route path={ROUTE.SECOND_CATEGORY_MANAGE.URL} component={SecondCategoryManage}/>
                      <Route path={ROUTE.THIRD_CATEGORY_MANAGE.URL} component={ThirdCategoryManage}/>

                      <Route path={ROUTE.ORIGIN_RESULT_MANAGE.URL} component={OriginResultManage}/>

                      <Route path={ROUTE.EXAM_RESULT_MANAGE.URL} component={ExamResultManage}/>
                      <Route path={ROUTE.EXAM_RESULT_DETAIL.URL} component={ExamResultDetail}/>
                  </Route>
                </Route>

                <Route path={ROUTE.ROOT.URL} component={Main}/>
                <Route path={ROUTE.MAIN.URL} component={Main}/>
                <Route path={ROUTE.LOGIN.URL} component={Login}/>
                <Route path={ROUTE.REGISTER.URL} component={Register}/>

                <Route path="*"  onEnter={certifyAccess} />
              </Route>
          </Router>);
  }
}



ReactDOM.render(<AppRouter />, document.getElementById('root'));
