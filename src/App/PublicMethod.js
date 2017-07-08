import {SESSION, ROLE} from './PublicConstant.js'

//清空登录状态信息
const clearSession = function() {

    sessionStorage.removeItem(SESSION.TOKEN);
    sessionStorage.removeItem(SESSION.USER_ID);
    sessionStorage.removeItem(SESSION.PHONE);
    sessionStorage.removeItem(SESSION.ROLE);
    sessionStorage.removeItem(SESSION.NAME);
    sessionStorage.removeItem(SESSION.EXPIRED_TIME);
    sessionStorage.removeItem(SESSION.MENUITEM_KEY);
};

//判断一个用户是否为职员
const isEmployee = function(role) {

  switch(role){

    case ROLE.EMPLOYEE_ADMIN:
    case ROLE.EMPLOYEE_FINANCER:
    case ROLE.EMPLOYEE_ARCHIVER:
    case ROLE.EMPLOYEE_ARCHIVE_MANAGER:
    case ROLE.EMPLOYEE_ADVISER:
    case ROLE.EMPLOYEE_ADVISE_MANAGER: return true;
    default: return false;
  }
}

//判断数组中是否存在obj元素
const containsElement = function(obj, arr) {

  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
};

//判断imgUrl对应图片资源是否存在
const isImgExist = function(imgurl) {
  var ImgObj = new Image(); //判断图片是否存在
  ImgObj.src = imgurl;
  //没有图片，则返回-1
  if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
    return true;
  } else {
    return false;
  }
}


//导出
export {
  clearSession,
  containsElement,
  isImgExist,
  isEmployee
}
