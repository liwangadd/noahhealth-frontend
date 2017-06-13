const SERVER = 'http://10.109.247.127:8080' //lab
//const SERVER = 'http://10.108.113.8:8080' //renzilong
//const SERVER = 'http://localhost:8080' //yaochenkun
const LOADING_DELAY_TIME = 500 //加载延迟时间，若在0.5s内加载完毕则不显示
const PAGE_SIZE = 5 //每页条数

//角色
const ROLE = {
  EMPLOYEE_ADMIN : '系统管理员',
  EMPLOYEE_FINANCER : '财务部员工',
  EMPLOYEE_ARCHIVER : '档案部员工',
  EMPLOYEE_ARCHIVE_MANAGER : '档案部主管',
  EMPLOYEE_ADVISER : '顾问部员工',
  ADVISE_MANAGER : '顾问部主管',
  MEMBER_1 : '一级会员',
  MEMBER_2 : '二级会员',
  MEMBER_3 : '三级会员'
}

//路由跳转地址
const URL = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/home',
    HOME_WELCOME: '/home',
    HOME_USER_MANAGE: '/user_manage',
    HOME_CATEGORY_MANAGE: '/category_manage'
}

//session中常量
const SESSION = {
  TOKEN: 'TOKEN',
  USER_ID: 'USER_ID',
  PHONE: 'PHONE',
  ROLE: 'ROLE',
  NAME: 'NAME',
  EXPIRED_TIME: 'EXPIRED_TIME'
}

//result
const RESULT = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  FAILURE_LOGIN: 'FAILURE_LOGIN',
  FAILURE_AUTH: 'FAILURE_AUTH'
}

////////////////////////导出
export {
  SERVER,
  LOADING_DELAY_TIME,
  ROLE,
  URL,
  SESSION,
  RESULT,
  PAGE_SIZE
};
