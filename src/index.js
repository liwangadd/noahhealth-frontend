import {URL, SESSION} from './App/PublicConstant.js';
import {clearSession} from './App/PublicMethod.js'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App.js';
import Login from './Login/Login.js';
import Register from './Register/Register.js';
import Home from './Home/Home.js';
import Welcome from './Home/Welcome/Welcome.js';
import UserManage from './Home/UserManage/UserManage.js';
import CategoryManage from './Home/CategoryManage/CategoryManage.js';
import {message} from 'antd'
import {Router, Route, browserHistory, IndexRoute} from 'react-router';


//登录认证
var certifyLogin = function(nextState, replace){

    let token = sessionStorage.getItem(SESSION.TOKEN);
    if(token == null) {
        message.error('请先登录');
        replace({ pathname: URL.LOGIN })
        return false;
    } else {

        //判断token是否过期
        let expiredTime = sessionStorage.getItem(SESSION.EXPIRED_TIME); //获取过期时间戳
        let now = new Date().getTime();
        if(now > expiredTime) {
            clearSession();
            message.error('已过期请重新登录');
            replace({ pathname: URL.LOGIN });
            return false;
        }
    }

    //放行
    return true;
};


class AppRouter extends React.Component {
  render() {
    return (<Router history={browserHistory}>
              <Route path={URL.ROOT} component={App}>
                <Route onEnter={certifyLogin}>
                  <Route path={URL.HOME} component={Home}>
                    <IndexRoute component={Welcome}/>
                    <Route path={URL.HOME_USER_MANAGE} component={UserManage}/>
                    <Route path={URL.HOME_CATEGORY_MANAGE} component={CategoryManage}/>
                  </Route>
                </Route>
                <Route path={URL.LOGIN} component={Login}/>
                <Route path={URL.REGISTER} component={Register}/>
              </Route>
          </Router>);
  }
}



ReactDOM.render(<AppRouter />, document.getElementById('root'));
