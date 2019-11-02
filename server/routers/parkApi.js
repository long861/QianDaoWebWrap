var express = require('express');
var router = express.Router();
var models = require('../model/model').models;
var ecId = "xydSXCsZ38TqQshY7";
var domainId = "PFSvkHRcArfzJEuZt";
var commons = require('../model/common');
var _ = require('underscore');
var utils = require('../utils');

router.post('/createNews', function (req, res, next) {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  const { _id, title, summary, tags, content, cover } = req.body;
  if (_.isEmpty(title)) return res.json({ 'code': 400, message: '标题不能为空' });
  if (_.isEmpty(summary)) return res.json({ 'code': 400, message: '概述不能为空' });
  if (_.isEmpty(content)) return res.json({ 'code': 400, message: '内容不能为空' });
  if (!tags) return res.json({ 'code': 400, message: '新闻标签不能为空' });
  if (tags && tags.length == 0) return res.json({ 'code': 400, message: '新闻标签不能为空' });
  if (!_id) {
    data = { title, summary, type: "2", tags, content, cover, createtime: Date.now(), state: 0, createBy, author: creator, from: 3 };
    var newNews = new models.GameNews(data);
    newNews.save().then((result) => {
      res.json({ code: 200 });
    }).catch((err) => {
      res.json({ code: 500, "err": err, "message": "系统错误" })
    })
  } else {
    models.GameNews.findOne({ _id, state: 0, createBy }).then((News) => {
      if (!News) {
        return res.json({ 'code': 505, 'message': '该园区动态已被删除' });
      }
      data = { _id, title, summary, tags, content, cover, state: 0, createBy, author: creator, updatedAt: new Date() };
      models.GameNews.findOneAndUpdate({ _id, state: 0, from: 3, createBy }, { $set: data }, { multi: true }).then((News1) => {
        res.json({ code: 200 });
      })
    }).catch((err) => {
      res.json({ code: 500, "err": err, "message": "系统错误" })
    })
  }
})
router.post('/createKnowL', function (req, res, next) {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  const { _id, title, summary, tags, content, cover } = req.body;
  if (_.isEmpty(title)) return res.json({ 'code': 400, message: '标题不能为空' });
  if (_.isEmpty(summary)) return res.json({ 'code': 400, message: '概述不能为空' });
  if (_.isEmpty(content)) return res.json({ 'code': 400, message: '内容不能为空' });
  if (!_id) {
    data = { title, summary, type: "1", tags, content, cover, createtime: Date.now(), state: 0, createBy, author: creator, from: 3 };
    var newNews = new models.GameNews(data);
    newNews.save().then((result) => {
      res.json({ code: 200 });
    }).catch((err) => {
      res.json({ code: 500, "err": err, "message": "系统错误" })
    })
  } else {
    models.GameNews.findOne({ _id, state: 0, createBy }).then((News) => {
      if (!News) {
        return res.json({ 'code': 505, 'message': '该园区动态已被删除' });
      }
      data = { _id, title, summary, tags, content, cover, state: 0, createBy, author: creator, updatedAt: new Date() };
      models.GameNews.findOneAndUpdate({ _id, state: 0, from: 3, createBy }, { $set: data }, { multi: true }).then((News1) => {
        res.json({ code: 200 });
      })
    }).catch((err) => {
      res.json({ code: 500, "err": err, "message": "系统错误" })
    })
  }
})

router.post('/getKnowL', function (req, res, next) {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  let { page, limit, tags } = req.body;
  page = Number(page);
  limit = Number(limit);
  if (tags.length == 0) {
    var allNews = () => {
      return models.GameNews.find({ state: 0, type: "1", from: 3, createBy, }).sort({ createtime: -1 }).exec();
    }
  } else {
    var allNews = () => {
      return models.GameNews.find({ tags, state: 0, type: "1", from: 3, createBy, }).sort({ createtime: -1 }).exec();
    }
  }
  var LimitNews = (NewsBox, page, limit) => {
    var newsArr = [];
    for (var i = (page - 1) * limit; i < page * limit; i++) {
      if (NewsBox[i]) {
        var newsItem = _.extend({}, NewsBox[i]);
        newsItem.createtime = new Date(newsItem.createtime);
        newsArr.push(newsItem);
      } else {
        break;
      }
    }
    return newsArr;
  }
  var asyncFun = async () => {
    try {
      var NewsBox = await allNews();
      var News = LimitNews(NewsBox, page, limit);
      if (!News) {
        return res.json({ 'code': 500, News, 'message': '系统错误' });
      }
      if (News.length == 0) {
        return res.json({ 'code': 200, News, 'message': '暂无定向知识，快去发布吧' });
      }
      res.json({ code: 200, News, total: NewsBox.length });
    } catch (err) {
      res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    }
  }
  asyncFun();
})
router.post('/getParkNews', function (req, res, next) {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  let { page, limit, tags } = req.body;
  page = Number(page);
  limit = Number(limit);
  if (!tags) {
    var allNews = () => {
      return models.GameNews.find({ state: 0, type: "2", from: 3, createBy, }).sort({ createtime: -1 }).exec();
    }
  } else {
    var allNews = () => {
      return models.GameNews.find({ tags: new RegExp(tags), state: 0, type: "2", from: 3, createBy, }).sort({ createtime: -1 }).exec();
    }
  }
  var LimitNews = (NewsBox, page, limit) => {
    var newsArr = [];
    for (var i = (page - 1) * limit; i < page * limit; i++) {
      if (NewsBox[i]) {
        var newsItem = _.extend({}, NewsBox[i]);
        newsItem.createtime = new Date(newsItem.createtime);
        newsArr.push(newsItem);
      } else {
        break;
      }
    }
    return newsArr;
  }
  var asyncFun = async () => {
    try {
      var NewsBox = await allNews();
      var News = LimitNews(NewsBox, page, limit);
      if (!News) {
        return res.json({ 'code': 500, News, 'message': '系统错误' });
      }
      if (News.length == 0) {
        return res.json({ 'code': 200, News, 'message': '暂无园区动态，快去发布吧' });
      }
      res.json({ code: 200, News, total: NewsBox.length });
    } catch (err) {
      res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    }
  }
  asyncFun();
})

router.post('/removeNews', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  const { _id } = req.body;
  models.GameNews.findOne({ _id, state: 0, createBy, }).then((News) => {
    if (!News) {
      return res.json({ 'code': 505, 'message': '该园区动态已被删除' });
    }
    models.GameNews.findOneAndUpdate({ _id, state: 0, from: 3, createBy, }, { $set: { state: 1 } }, { multi: true }).then((data) => {
      res.json({ code: 200 });
    })
  }).catch((err) => {
    res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
  })
})


router.post('/NewsInfoById', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  const { _id } = req.body;
  models.GameNews.findOne({ _id, state: 0, from: 3, createBy, }).then((News) => {
    if (!News) {
      return res.json({ 'code': 500, 'message': '系统错误' });
    }
    res.json({ code: 200, News });
  }).catch((err) => {
    res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
  })
})
router.post('/getKnowLByTags', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  const { tags, page, limit } = req.body;
  var allNews = () => {
    return models.GameNews.find({ tags, state: 0, type: "1", from: 3, createBy, }).sort({ createtime: -1 }).exec();
  }
  var LimitNews = (NewsBox, page, limit) => {
    var newsArr = [];
    for (var i = (page - 1) * limit; i < page * limit; i++) {
      if (NewsBox[i]) {
        var newsItem = _.extend({}, NewsBox[i]);
        newsItem.createtime = new Date(newsItem.createtime);
        newsArr.push(newsItem);
      } else {
        break;
      }
    }
    return newsArr;
  }
  var asyncFun = async () => {
    try {
      var NewsBox = await allNews();
      var News = LimitNews(NewsBox, page, limit);
      if (!News) {
        return res.json({ 'code': 500, News, 'message': '系统错误' });
      }
      if (News.length == 0) {
        return res.json({ 'code': 200, News, 'message': '暂无相关定向知识，快去发布吧' });
      }
      res.json({ code: 200, News, total: NewsBox.length });
    } catch (err) {
      res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    }
  }
  asyncFun();
})

router.post('/getNewsByTags', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  const { tags, page, limit } = req.body;
  var allNews = () => {
    return models.GameNews.find({ tags: new RegExp(tags), state: 0, type: "2", from: 3, createBy, }).sort({ createtime: -1 }).exec();
  }
  var LimitNews = (NewsBox, page, limit) => {
    var newsArr = [];
    for (var i = (page - 1) * limit; i < page * limit; i++) {
      if (NewsBox[i]) {
        var newsItem = _.extend({}, NewsBox[i]);
        newsItem.createtime = new Date(newsItem.createtime);
        newsArr.push(newsItem);
      } else {
        break;
      }
    }
    return newsArr;
  }
  var asyncFun = async () => {
    try {
      var NewsBox = await allNews();
      var News = LimitNews(NewsBox, page, limit);
      if (!News) {
        return res.json({ 'code': 500, News, 'message': '系统错误' });
      }
      if (News.length == 0) {
        return res.json({ 'code': 200, News, 'message': '暂无相关园区动态，快去发布吧' });
      }
      res.json({ code: 200, News, total: NewsBox.length });
    } catch (err) {
      res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    }
  }
  asyncFun();
})
router.post('/updateParkInfo', (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  const { _id, name, address, phone, desc, validtime, addressInfo, center, parkRules, tab } = req.body;
  if (_id) {
    var data = {};
    if (tab == 0) {
      if (_.isEmpty(name)) return res.json({ 'code': 400, message: '园区名称不能为空' });
      if (_.isEmpty(address)) return res.json({ 'code': 400, message: '园区地址不能为空' });
      if (_.isEmpty(phone)) return res.json({ 'code': 400, message: '园区联系电话不能为空' });
      if (_.isEmpty(desc)) return res.json({ 'code': 400, message: '园区介绍不能为空' });
      data = { _id, name, address, phone, desc, updated: Date.now() };
    } else if (tab == 1) {
      if (_.isEmpty(validtime)) return res.json({ 'code': 400, message: '开放时间不能为空' });
      data = { _id, validtime, updated: Date.now() };
    } else if (tab == 2) {
      if (_.isEmpty(addressInfo)) return res.json({ 'code': 400, message: '地理交通不能为空' });
      data = { _id, addressInfo, updated: Date.now() };
    } else if (tab == 3) {
      if (_.isEmpty(parkRules)) return res.json({ 'code': 400, message: '园区防护通知不能为空' });
      data = { _id, parkRules, updated: Date.now() };
    }
    models.Park.findOne({ _id, createBy }).then((Park) => {
      if (!Park) {
        return res.json({ 'code': 505, 'message': '园区信息不存在' });
      }
      models.Park.findOneAndUpdate({ _id, createBy }, { $set: data }, { multi: true }).then((newPark) => {
        res.json({ code: 200 });
      })
    }).catch((err) => {
      res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    })
  } else {
    var data = { createBy };
    if (tab == 0) {
      if (_.isEmpty(name)) return res.json({ 'code': 400, message: '园区名称不能为空' });
      if (_.isEmpty(address)) return res.json({ 'code': 400, message: '园区地址不能为空' });
      if (_.isEmpty(phone)) return res.json({ 'code': 400, message: '园区联系电话不能为空' });
      if (_.isEmpty(desc)) return res.json({ 'code': 400, message: '园区介绍不能为空' });
      data = { name, address, phone, desc, created: Date.now(), updated: Date.now() };
    } else if (tab == 1) {
      if (_.isEmpty(validtime)) return res.json({ 'code': 400, message: '开放时间不能为空' });
      data = { validtime, updated: Date.now() };
    } else if (tab == 2) {
      data = { addressInfo, updated: Date.now() };
    } else if (tab == 3) {
      data = { parkRules, updated: Date.now() };
    }
    var park = new models.Park(data);
    park.save().then((result) => {
      res.json({ 'code': 200, });
    }).catch((err) => {
      res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    })
  }
})
router.post("/getParkInfo", (req, res, next) => {
  const { createBy, creator } = utils.getCreator(req.headers);
  if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
  models.Park.findOne({ createBy }).then((Park) => {
    res.json({ 'code': 200, Park });
  }).catch((err) => {
    res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
  })
})
module.exports = router;