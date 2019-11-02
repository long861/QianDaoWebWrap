var models = require('../model/model').models;
var sio = require("../socket.io");
var async = require('async');
var utils = require('../utils');

module.exports = function (req, res) {
  const { createBy, creator } = utils.getCreator(req.headers);
  var random = req.params.random;
  const { status, oid } = req.query;
  if (status == 1) {
    sio.setQstatus(random, { status: '成功扫描二维码', class: 'qstatus-success' });
  }
  if (status == 2) {
    async.auto({
      getoauth: function (callback) {
        models.UserOauth.findOne({ _id: oid }, callback);
      },
      getuser: ['getoauth', function (results, callback) {
        var oauth = results.getoauth;
        if (!!oauth && oauth.state == 0 && !!oauth.userId) {
          models.ShhUsers.findOne({ userId: oauth.userId, state: 0, createBy }, callback);
        } else {
          callback(null);
        }
      }],
    }, function (error, results) {
      var user = results.getuser;
      if (user) {
        var token = utils.getUUID();
        models.ShhUsers.updateOne({ _id: user._id ,createBy }, { $set: { token } }, function (err, res) {
          sio.setToken(random, { token });
        });
      } else {
        sio.setToken(random, { token: '' });
      }
      models.UserOauth.deleteOne({ _id: oid }, console.log);
    });
  }
  if (status == 3) {
    sio.setQstatus(random, { status: '等待扫描二维码', class: '' });
  }
  if (status == 4) {
    sio.setQstatus(random, { status: '此功能仅提供给管理员使用', class: 'qstatus-fail' });
  }
  res.end();
}