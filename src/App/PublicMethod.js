import {SESSION} from './PublicConstant.js'

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
  isImgExist
}
