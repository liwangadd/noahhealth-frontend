import {SESSION, ROUTE} from './App/PublicConstant.js';
import {clearSession, containsElement} from './App/PublicMethod.js'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App.js';
import Login from './Login/Login.js';
import Register from './Register/Register.js';
import Home from './Home/Home.js';
import Welcome from './Home/Welcome/Welcome.js';
import UserManage from './Home/UserManage/UserManage.js';
import FirstCategoryManage from './Home/CategoryManage/FirstCategoryManage.js';
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
    let targetUrl = nextState.location.pathname;
    switch(targetUrl) {
      case ROUTE.LOGIN.URL:certifyRole(replace, role, ROUTE.LOGIN.PERMISSION);break;
      case ROUTE.REGISTER.URL:certifyRole(replace, role, ROUTE.REGISTER.PERMISSION);break;
      case ROUTE.HOME.URL:certifyRole(replace, role, ROUTE.HOME.PERMISSION);break;
      case ROUTE.HOME_USER_MANAGE.URL:certifyRole(replace, role, ROUTE.HOME_USER_MANAGE.PERMISSION);break;
      case ROUTE.HOME_FIRST_CATEGORY_MANAGE.URL:certifyRole(replace, role, ROUTE.HOME_FIRST_CATEGORY_MANAGE.PERMISSION);break;
      default:;break;
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
              <Route path={ROUTE.ROOT.URL} component={App}>
                <Route onEnter={certifyAccess}>
                  <Route path={ROUTE.HOME.URL} component={Home}>
                    <IndexRoute component={Welcome}/>
                    <Route path={ROUTE.HOME_USER_MANAGE.URL} component={UserManage}/>
                    <Route path={ROUTE.HOME_FIRST_CATEGORY_MANAGE.URL} component={FirstCategoryManage}/>
                    {/* <Route path={ROUTE.HOME_SECOND_CATEGORY_MANAGE.URL/:id} component={SecondCategoryManage}/>
                    <Route path={ROUTE.HOME_THIRD_CATEGORY_MANAGE.URL/:id} component={SecondCategoryManage}/> */}
                  </Route>
                </Route>
                <Route path={ROUTE.LOGIN.URL} component={Login}/>
                <Route path={ROUTE.REGISTER.URL} component={Register}/>
              </Route>
          </Router>);
  }
}



ReactDOM.render(<AppRouter />, document.getElementById('root'));
