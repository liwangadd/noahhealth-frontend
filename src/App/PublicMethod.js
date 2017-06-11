//清空登录状态信息
const clearSession = function() {

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("expiredTime");
}


//导出
export {
  clearSession
}
