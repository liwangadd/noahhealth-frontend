
//服务器地址
//const SERVER = 'http://localhost:8080' //yaochenkun
const SERVER = 'http://10.109.247.127:8080' //lab
//const SERVER = 'http://47.92.91.99:8080' //alicloud

//文件服务器地址
const FILE_SERVER = 'http://10.109.247.127:8088' //lab
//const FILE_SERVER = 'http://47.92.91.99:8088' //alicloud



const LOADING_DELAY_TIME = 500 //加载延迟时间，若在0.5s内加载完毕则不显示
const PAGE_SIZE = 10 //每页条数
const DATE_FORMAT = 'YYYY-MM-DD'

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
  MAIN: {URL: '/main', PERMISSION: []},
  HELP: {URL: '/help', PERMISSION: []},
  MEMBER_LOGIN: {URL: '/member_login', URL_PREFIX:'/member_login', PERMISSION: []},
  EMPLOYEE_LOGIN: {URL: '/employee_login', URL_PREFIX:'/employee_login', PERMISSION: []},
  REGISTER: {URL: '/register', URL_PREFIX:'/register', PERMISSION: []},
  FIND_PASSWORD: {URL: '/find_password/:roleType', URL_PREFIX:'/find_password', PERMISSION: []},

  HOME: {URL:'/home/:menuKey', URL_PREFIX:'/home', MENU_KEY: '1', PERMISSION: []},

    WELCOME: {URL:'/home/:menuKey', URL_PREFIX:'/home', MENU_KEY: '1', PERMISSION: []},
    EMPLOYEE_MANAGE: {URL:'/employee_manage/:menuKey', URL_PREFIX:'/employee_manage', MENU_KEY: '2', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_FINANCER, ROLE.EMPLOYEE_ARCHIVE_MANAGER, ROLE.EMPLOYEE_ADVISE_MANAGER]},
    MEMBER_MANAGE: {URL:'/member_manage/:menuKey', URL_PREFIX:'/member_manage', MENU_KEY: '6', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_FINANCER]},

    FINANCE_MANAGE: {URL:'/finance_manage/:menuKey', URL_PREFIX:'/finance_manage', MENU_KEY: '7', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_FINANCER]},

    FIRST_CATEGORY_MANAGE: {URL:'/first_category_manage/:menuKey/:tabKey', URL_PREFIX:'/first_category_manage', MENU_KEY: '3', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_ARCHIVE_MANAGER, ROLE.EMPLOYEE_ARCHIVER, ROLE.EMPLOYEE_ADVISE_MANAGER, ROLE.EMPLOYEE_ADVISER]},
    SECOND_CATEGORY_MANAGE: {URL:'/second_category_manage/:menuKey/:tabKey/:firstId/:firstName', URL_PREFIX:'/second_category_manage', MENU_KEY: '3', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_ARCHIVE_MANAGER, ROLE.EMPLOYEE_ARCHIVER, ROLE.EMPLOYEE_ADVISE_MANAGER, ROLE.EMPLOYEE_ADVISER]},
    THIRD_CATEGORY_MANAGE: {URL:'/third_category_manage/:menuKey/:tabKey/:firstId/:firstName/:secondId/:secondName', URL_PREFIX:'/third_category_manage', MENU_KEY: '3', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_ARCHIVE_MANAGER, ROLE.EMPLOYEE_ARCHIVER, ROLE.EMPLOYEE_ADVISE_MANAGER, ROLE.EMPLOYEE_ADVISER]},

    ORIGIN_RESULT_MANAGE: {URL:'/origin_result_manage/:menuKey', URL_PREFIX:'/origin_result_manage', MENU_KEY: '4', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_ARCHIVE_MANAGER, ROLE.EMPLOYEE_ARCHIVER, ROLE.EMPLOYEE_ADVISE_MANAGER, ROLE.EMPLOYEE_ADVISER, ROLE.MEMBER_1, ROLE.MEMBER_2, ROLE.MEMBER_3]},

    EXAM_RESULT_MANAGE: {URL:'/exam_result_manage/:menuKey', URL_PREFIX:'/exam_result_manage', MENU_KEY: '5', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_ARCHIVE_MANAGER, ROLE.EMPLOYEE_ARCHIVER, ROLE.EMPLOYEE_ADVISE_MANAGER, ROLE.EMPLOYEE_ADVISER]},
    EXAM_RESULT_DETAIL: {URL:'/exam_result_detail/:menuKey/:memberId/:memberName', URL_PREFIX:'/exam_result_detail', MENU_KEY: '5', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_ARCHIVE_MANAGER, ROLE.EMPLOYEE_ARCHIVER, ROLE.EMPLOYEE_ADVISE_MANAGER, ROLE.EMPLOYEE_ADVISER, ROLE.MEMBER_2, ROLE.MEMBER_3]}
}

//session中常量
const SESSION = {
  TOKEN: 'TOKEN',
  USER_ID: 'USER_ID',
  USERNAME: 'USERNAME',
  ROLE: 'ROLE',
  NAME: 'NAME',
  AVATAR: 'AVATAR',
  EXPIRED_TIME: 'EXPIRED_TIME'
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
  ROUTE,
  FILE_SERVER,
  DATE_FORMAT
};
