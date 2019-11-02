var express = require('express');
var router = express.Router();
var models = require('../model/model').models;
var ecId = "xydSXCsZ38TqQshY7";
var domainId = "PFSvkHRcArfzJEuZt";
var commons = require('../model/common');
var _ = require('underscore')
const utils = require('../utils');

router.post('/BymatchId', function (req, res, next) {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) {
    res.json({ code: 1050, message: '账号已失效，请重新登录' });
  } else {
    const { matchId, gameId, page, limit } = req.body;
    models.Items.find({ matches: gameId, state: 0, createBy }).sort({ created: -1 }).exec((err, items) => {
      if (err) {
        return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
      }
      var arr = [];
      for (var i = (page - 1) * limit; i < page * limit; i++) {
        if (items[i]) {
          arr.push(items[i]);
        } else {
          break;
        }
      }
      res.json({ code: 200, data: arr, total: items.length });
    })
  }
})

router.post('/all', function (req, res, next) {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) {
    res.json({ code: 1050, message: '账号已失效，请重新登录' });
  } else {
    const { page, limit } = req.body;
    models.Items.find({ state: 0, createBy }).sort({ created: -1 }).exec((err, items) => {
      if (err) {
        return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
      }
      var arr = [];
      for (var i = (page - 1) * limit; i < page * limit; i++) {
        if (items[i]) {
          arr.push(items[i]);
        } else {
          break;
        }
      }
      res.json({ code: 200, data: arr, total: items.length });
    })
  }
})

router.post('/edit', function (req, res, next) {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) {
    res.json({ code: 1050, message: '账号已失效，请重新登录' });
  } else {
    var data = req.body;
    if (_.isEmpty(data.cover)) return res.json({ 'code': 400, message: '封面照片不能为空' });
    if (_.isEmpty(data.name)) return res.json({ 'code': 400, message: '线路名称不能为空' });
    if (_.isEmpty(data.desc)) return res.json({ 'code': 400, message: '点标描述不能为空' });
    if (data._type == 'team' && !data._count) return res.json({ 'code': 400, message: '请填写队伍人数' });
    if (_.isEmpty(data._start)) return res.json({ 'code': 400, message: '请选择线路开启时间' });
    if (_.isEmpty(data._end)) return res.json({ 'code': 400, message: '请选择线路关闭时间' });
    var _start = new Date(data._start).getTime();
    var _end = new Date(data._end).getTime();
    if (_start >= _end) return res.json({ 'code': 400, message: '线路关闭时间有误' });
    if (data.tags.length == 0) return res.json({ 'code': 400, message: '至少选择一个线路标签' });
    if (data._type == 'self') data._count = 1;
    var Item = (_id) => {
      return models.Items.findOne({ _id, state: 0, createBy }).exec();
    }
    var updateItem = (_id, newDate) => {
      return models.Items.findOneAndUpdate({ _id, createBy }, { $set: newDate }, { new: true }).exec();
    }
    var getItemMarker = (data) => {
      return models.ItemMarkers.findOne(data).exec();
    }
    var asyncFun = async () => {
      try {
        var ItemGet = await Item(data._id);
        if (!ItemGet) return res.json({ 'code': 505, 'message': '该线路已被删除' });
        var whereStart = { isStart: 1, createBy, delete: null, itemId: data._id };
        var getMarkerStart = await getItemMarker(whereStart);
        if (data.isShow) {
          if (!getMarkerStart) return res.json({ 'code': 505, 'message': '起点不存在，请先设置起点' });
          var whereEnd = { isEnd: 1, createBy, delete: null, itemId: data._id }
          var getMarkerEnd = await getItemMarker(whereEnd);
          if (!getMarkerEnd) return res.json({ 'code': 505, 'message': '终点不存在，请先设置终点' });
        }
        var one = data.name.slice(0, 1)
        var color = commons.textToColor(data.name)
        var newDate = {
          tags: data.tags,
          name: data.name,
          one,
          isShow: data.isShow,
          color,
          _type: data._type,
          _count: data._count,
          _start,
          _end,
          center: data.center,
          zoom: data.zoom,
          cover: data.cover,
          desc: data.desc,
          update: Date.now(),
          createBy
        };
        var updateItemOver = await updateItem(data._id, newDate);
        if (!updateItemOver) return res.json({ 'code': 500, 'message': '系统错误' });
        res.json({ code: 200 })
      } catch (err) {
        return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
      }
    }
    asyncFun();
  }
})

router.post('/remove', function (req, res, next) {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) {
    res.json({ code: 1050, message: '账号已失效，请重新登录' });
  } else {
    var _id = req.body._id;
    models.Items.getItemsById(_id, (err, Items) => {
      if (err) {
        return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
      }
      if (!Items) {
        return res.json({ 'code': 505, 'message': '该线路已被删除' });
      }
      models.Items.findOneAndUpdate({ _id, createBy }, { $set: { state: 1 } }, { new: true }, (err) => {
        if (err) {
          return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
        }
        res.json({ code: 200 })
      })
    })
  }
});

router.post('/searchLines', function (req, res, next) {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) {
    res.json({ code: 1050, message: '账号已失效，请重新登录' });
  } else {
    const { matchId, gameId, page, limit, name, lineTag } = req.body;
    var where = { state: 0, createBy };
    if (gameId) where.matches = gameId;
    if (name) where.name = new RegExp(name);
    models.Items.find(where).sort({ created: -1 }).exec((err, Items) => {
      if (err) {
        return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
      }
      var items = [];
      if (!lineTag) {
        items = Items;
      } else {
        for (var j = 0; j < Items.length; j++) {
          if (Items[j].tags.length > 0) {
            var tags = _.where(Items[j].tags, { 'themeId': lineTag });
            if (tags.length > 0) {
              items.push(Items[j]);
            }
          }
        }
      }
      var arr = [];
      for (var i = (page - 1) * limit; i < page * limit; i++) {
        if (items[i]) {
          arr.push(items[i]);
        } else {
          break;
        }
      }
      res.json({ code: 200, data: arr, total: items.length });
    })
  }
})

router.post("/createLine", (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) {
    res.json({ code: 1050, message: '账号已失效，请重新登录' });
  } else {
    var data = req.body;
    if (_.isEmpty(data.cover)) return res.json({ 'code': 400, message: '封面照片不能为空' });
    if (_.isEmpty(data.name)) return res.json({ 'code': 400, message: '线路名称不能为空' });
    if (_.isEmpty(data.desc)) return res.json({ 'code': 400, message: '点标描述不能为空' });
    if (data._type == 'team' && !data._count) return res.json({ 'code': 400, message: '请填写队伍人数' });
    if (data._count && (data._count < 2)) return res.json({ 'code': 400, message: '团队赛人数应大于1' });
    if (_.isEmpty(data._start)) return res.json({ 'code': 400, message: '请选择线路开启时间' });
    if (_.isEmpty(data._end)) return res.json({ 'code': 400, message: '请选择线路关闭时间' });
    var _start = new Date(data._start).getTime();
    var _end = new Date(data._end).getTime();
    if (_start >= _end) return res.json({ 'code': 400, message: '线路关闭时间有误' });
    if (data.tags.length == 0) return res.json({ 'code': 400, message: '至少选择一个线路标签' });
    if (data._type == 'self') data._count = 1;
    var lineData = {
      tags: data.tags,
      name: data.name,
      isShow: data.isShow,
      one: data.name.slice(0, 1),
      color: commons.textToColor(data.name),
      center: { 'lat': 34.4013559186449, 'lng': 113.854526912596 },
      zoom: 17,
      cover: data.cover,
      desc: data.desc,
      created: Date.now(),
      state: 0,
      _type: data._type,
      _count: data._count,
      _start,
      _end,
      createBy
    }
    var lineInsert = (lineData) => {
      var lineData = new models.Items(lineData);
      return lineData.save().then((line) => {
        return line;
      })
    }
    var asyncFun = async () => {
      try {
        var lineNew = await lineInsert(lineData);
        res.json({ code: 200, lineNew });
      } catch (err) {
        res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
      }
    }
    asyncFun();
  }
})

router.post('/getHotLine', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  models.Items.find({ state: 0, createBy, isShow: true }).sort({ created: -1 }).limit(4).then((lines) => {
    var arr1 = [];
    for (var i = 0; i < lines.length; i++) {
      if (lines[i]) {
        var arr = { _id: lines[i]._id, name: lines[i].name, one: lines[i].one, color: lines[i].color, _start: lines[i]._start, _end: lines[i]._end, }
        arr1.push(arr);
      }
    }
    if (arr1.length > 0) {
      models.ShhPlayers.find({ state: 0, itemId: { $in: arr1 } }).then((players) => {
        for (var j = 0; j < arr1.length; j++) {
          var itemId = arr1[j]._id;
          var playerList = _.where(players, { itemId });
          var num = 0;
          for (var k = 0; k < playerList.length; k++) {
            num = num + playerList[k].members.length;
          }
          arr1[j].playersCount = num;
        }
        return res.json({ code: 200, data: arr1 })
      })
    } else {
      res.json({ code: 200, data: lines })
    }
  }).catch((err) => {
    res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
  })
})

module.exports = router;