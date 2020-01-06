const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const config = require('./config');
module.exports = {
  getUUID,
  getPwd,
  checkPwd,
  textToColor,
  getClientIp,
  isPhoneNo,
  getCreator
}
//生成uuid
function getUUID() {
  return uuidv4().replace(/-/g, '');
}
//密码加密
/**
 * 
 * @param {*} password 密码
 * @param {*} salt 数据库salt字段
 */
function getPwd(password, salt) {
  var hash = crypto.createHmac('sha512', config.key);
  hash.update(password + salt);
  return hash.digest('hex');
}
//密码比对
/**
 * 
 * @param {*} password 登录密码
 * @param {*} salt 数据库salt字段
 * @param {*} password2 数据库password字段
 */
function checkPwd(password, salt, password2) {
  return getPwd(password, salt) == password2;
}
function textToColor(str) {
  if (!str || str.length == 0) return false;
  for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
  for (var i = 0, color = '#'; i < 3; color += ('00' + ((hash >> i++ * 2) & 0xFF).toString(16)).slice(-2));
  return color;
}
function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}
function isPhoneNo(phone) {
  var pattern = /^1[34578]\d{9}$/;
  return pattern.test(phone);
}
function getCreator(headers) {
  if (headers.host == 'shh.xidong360.com' || headers.host == 'localhost:2300') return { createBy: 'shh', creator: '钱道' };
  return { createBy: 'xidong', creator: 'AI定向' };;
}