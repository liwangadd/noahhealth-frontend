
//将时间戳timestamp转成 yyyy-MM-dd
const formatDate = (timestamp) => {

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
}


//导出
export {
  formatDate
}
