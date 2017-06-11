//公用常量



//var SERVER = 'http://10.108.113.8:8080' //renzilong_lab
//var SERVER = 'http://10.108.119.104:8080' //renzilong_mac
const SERVER = 'http://localhost:8080' //yaochenkun_mac
const LOADING_DELAY_TIME = 500 //加载延迟时间，若在0.5s内加载完毕则不显示

//正则表达式
const REGEX = {
    PHONE : /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
}



//公用方法


//清空登录状态信息
const clearSession = function() {

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("expiredTime");
}















//导出常量
export {
  SERVER,
  REGEX,
  LOADING_DELAY_TIME
};

//导出方法
export {
  clearSession
}
