var models = require('../model/model').models;
var utils = require('../utils');

//请求拦截 处理token
module.exports = function (req, res, next) {
  if (req.method == 'POST' && req.url != '/api/user/login') {
    var authorization = req.headers['authorization'];
    var token = authorization ? authorization.split(' ')[1] : '';
    const { createBy, creator } = utils.getCreator(req.headers);
    models.ShhUsers.findOne({ token, state: 0, createBy }, function (err, user) {
      if (user) req.$user = user;
      next();
    });
  } else {
    next();
  }
}