//const SERVER = 'http://10.109.247.127:8080' //lab
const SERVER = 'http://10.108.113.8:8080' //renzilong
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
  EMPLOYEE_ADVISE_MANAGER : '顾问部主管',
  MEMBER_1 : '一级会员',
  MEMBER_2 : '二级会员',
  MEMBER_3 : '三级会员'
}

//路由(跳转地址 和 可访问的角色,[]表示所有角色均可访问)
const ROUTE = {
  ROOT: {URL: '/', PERMISSION: []},
  LOGIN: {URL: '/login', PERMISSION: []},
  REGISTER: {URL: '/register', PERMISSION: []},
  HOME: {URL:'/home', PERMISSION: []},
    HOME_WELCOME: {URL:'/home', PERMISSION: []},
    HOME_USER_MANAGE: {URL:'/user_manage', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_FINANCER]},
    HOME_CATEGORY_MANAGE: {URL:'/category_manage', PERMISSION: [ROLE.EMPLOYEE_ADMIN]}
}

//session中常量
const SESSION = {
  TOKEN: 'TOKEN',
  USER_ID: 'USER_ID',
  PHONE: 'PHONE',
  ROLE: 'ROLE',
  NAME: 'NAME',
  EXPIRED_TIME: 'EXPIRED_TIME',
  MENUITEM_KEY: 'MENUITEM_KEY'
}

//result
const RESULT = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  FAILURE_LOGIN: 'FAILURE_LOGIN',
  FAILURE_AUTH: 'FAILURE_AUTH'
}

//css样式常量
const STYLE = {
  BLOCK: 'block',
  NONE: 'none'
}

//颜色
const COLOR = {
  RED: 'red',
  PINK: 'pink',
  ORANGE: 'orange',
  GREEN: 'green',
  CYAN: 'cyan',
  BLUE: 'blue'
}

////////////////////////导出
export {
  SERVER,
  LOADING_DELAY_TIME,
  ROLE,
  SESSION,
  RESULT,
  PAGE_SIZE,
  STYLE,
  COLOR,
  ROUTE
};
