var express = require('express');
var router = express.Router();
var models = require('../model/model').models;
var ecId = "xydSXCsZ38TqQshY7";
var domainId = "PFSvkHRcArfzJEuZt";
var commons = require('../model/common');
var _ = require('underscore');
var utils = require('../utils');

router.post('/createTheme', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  let { _id, name, summary, tags, cover, content } = req.body;
  if (_.isEmpty(name)) return res.json({ 'code': 400, message: '名称不能为空' });
  if (_.isEmpty(summary)) return res.json({ 'code': 400, message: '概述不能为空' });
  if (_.isEmpty(content)) return res.json({ 'code': 400, message: '主题内容不能为空' });
  if (!cover) cover = "";
  var theme = (_id) => {
    return models.ShhTheme.findOne({ _id, state: 0, createBy }).exec();
  }
  var themeByname = (name) => {
    return models.ShhTheme.findOne({ name, state: 0, createBy }).exec();
  }
  var themeUpdate = (_id, data) => {
    return models.ShhTheme.findOneAndUpdate({ _id, createBy }, { $set: data }, { new: true });
  }
  var newTheme = (data) => {
    return models.ShhTheme.create(data);
  }
  var asyncFun = async () => {
    try {
      var themeBynameGet = await themeByname(name);
      if (themeBynameGet) return res.json({ code: 500, message: '当前主题已存在，请更换主题名称' });
      var data = { name, summary, cover, content, createdAt: Date.now(), state: 0, color: utils.textToColor(name), createBy };
      var newThemeGet = await newTheme(data);
      res.json({ code: 200, message: '创建成功' })
    } catch (err) {
      res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    }
  }
  var asyncFun2 = async () => {
    try {
      var themeGet = await theme(_id);
      if (!themeGet) return res.json({ code: 500, message: '当前主题已被删除' });
      var data = { name, summary, cover, content, state: 0, updatedAt: Date.now(), createBy };
      var themeUpdateGet = await themeUpdate(_id, data);
      if (!themeUpdateGet) return res.json({ code: 500, message: '系统错误' });
      res.json({ code: 200, message: '编辑成功' });
    } catch (err) {
      res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    }
  }
  if (!_id) {
    asyncFun();
  } else {
    asyncFun2();
  }
})

router.post('/getThemeAll', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  models.ShhTheme.find({ state: 0, createBy }).then((themes) => {
    var arr = [];
    for (var i = 0; i < themes.length; i++) {
      var item = { themeId: themes[i]._id, name: themes[i].name, color: themes[i].color };
      arr.push(item);
    }
    res.json({ code: 200, themes: arr });
  }).catch((err) => {
    res.json({ code: 500, 'err': err, message: '系统错误' });
  })
})

router.post('/getTheme', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  const { name, limit, page } = req.body;
  var themes = () => {
    if (!name) {
      return models.ShhTheme.find({ state: 0, createBy }).sort({ createdAt: -1 }).exec();
    } else {
      return models.ShhTheme.find({ state: 0, name: new RegExp(name), createBy }).sort({ createdAt: -1 }).exec();
    }
  }
  var asyncFun = async () => {
    var themesGet = await themes();
    if (!themesGet) return res.json({ code: 500, message: '系统错误' });
    var themesArr = [];
    for (var i = (page - 1) * limit; i < page * limit; i++) {
      if (themesGet[i]) {
        var themeItem = _.extend({}, themesGet[i]);
        themesArr.push(themeItem);
      } else {
        break;
      }
    }
    res.json({ code: 200, themes: themesArr, total: themesArr.length })
  }
  asyncFun();
})

router.post('/getThemeById', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  const { _id } = req.body;
  models.ShhTheme.findOne({ _id, state: 0, createBy }).then((theme) => {
    if (!theme) res.json({ code: 400, message: '当前主题已被删除' });
    res.json({ code: 200, theme });
  }).catch((err) => {
    res.json({ code: 500, 'err': err, message: '系统错误' });
  })
})

router.post('/removeTheme', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  const { _id } = req.body;
  models.ShhTheme.findOne({ _id, state: 0, createBy }).then((theme) => {
    if (!theme) res.json({ code: 400, message: '当前主题已被删除' });
    models.ShhTheme.update({ _id, state: 0, createBy }, { $set: { state: 1 } }, { new: true }).then((newTheme) => {
      if (!newTheme) res.json({ code: 400, message: '当前主题已被删除' });
      res.json({ code: 200, message: "删除成功" });
    })
  }).catch((err) => {
    res.json({ code: 500, 'err': err, message: '系统错误' });
  })
})


module.exports = router;