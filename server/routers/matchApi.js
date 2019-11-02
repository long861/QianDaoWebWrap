var express = require('express');
var router = express.Router();
var models = require('../model/model').models;
var ecId = "xydSXCsZ38TqQshY7";
var domainId = "PFSvkHRcArfzJEuZt";
var commons = require('../model/common');
var _ = require('underscore');
var HTTP = require('http');
var Config = require('../model/config');
const utils = require('../utils')

router.post('/getMatchList', function (req, res, next) {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    models.Matches.find({ ecId, domainId, state: 0 }, { id: 1, name: 1, sdate: 1, edate: 1, createAt: 1, state: 1, uuid: 1, subId: 1 }).sort({ createAt: -1 }).exec(function (err, data) {
        if (err) {
            return res.json({ "err": err, "message": "系统错误" });
        }
        var nowTime = new Date().getTime();
        var arr_gameId = [];
        for (var j = 0; j < data.length; j++) {
            arr_gameId.push(data[j].uuid)
        }
        models.Players.find({ status: 0, gameId: { $in: arr_gameId } }).exec((err, plays) => {
            var arr = [];
            for (let i = 0; i < data.length; i++) {
                var item = {
                    matchId: data[i]._id,
                    title: data[i].name,
                    sdate: data[i].sdate,
                    edate: data[i].edate
                };
                item.count = _.where(plays, { gameId: data[i].uuid }).length;
                item.color = commons.textToColor(data[i].name);
                item.key = item.title.substring(0, 1);
                item.isDelete = true;
                if (nowTime < item.sdate) {
                    item.MatchState = 0;
                } else if (nowTime >= item.sdate && nowTime <= item.edate) {
                    item.MatchState = 1;
                } else {
                    item.MatchState = 2;
                }
                arr.push(item);
            }
            res.json({ "code": 200, data: arr })
        })
    })
});

router.post('/getHotMatch', function (req, res, next) {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    models.Matches.find({ ecId, domainId, state: 0 }, { id: 1, name: 1, sdate: 1, edate: 1, createAt: 1, state: 1, uuid: 1, subId: 1 }).limit(4).sort({ createAt: -1 }).exec(function (err, data) {
        if (err) {
            return res.json({ "err": err, "message": "系统错误" });
        }
        var nowTime = new Date().getTime();
        var arr_gameId = [];
        for (var j = 0; j < data.length; j++) {
            arr_gameId.push(data[j].uuid)
        }
        models.Players.find({ status: 0, gameId: { $in: arr_gameId } }).exec((err, plays) => {
            var arr = [];
            for (let i = 0; i < data.length; i++) {
                var item = {
                    matchId: data[i]._id,
                    title: data[i].name,
                    sdate: data[i].sdate,
                    edate: data[i].edate
                };
                item.count = _.where(plays, { gameId: data[i].uuid }).length;
                item.color = commons.textToColor(data[i].name);
                item.key = item.title.substring(0, 1);
                item.isDelete = false;
                if (nowTime < item.sdate) {
                    item.MatchState = 0;
                } else if (nowTime >= item.sdate && nowTime <= item.edate) {
                    item.MatchState = 1;
                } else {
                    item.MatchState = 2;
                }
                arr.push(item);
            }
            res.json({ "code": 200, data: arr })
        })
    })
});

router.post('/getMatchInfo/:matchId', function (req, res, next) {
  const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    var matchId = req.params.matchId;
    models.Matches.getMatchById(matchId, (err, match) => {
        if (err) {
            return res.json({ "err": err, "message": "系统错误" });
        }
        if (!match) {
            return res.json({ "code": 500, "message": "系统错误" });
        } else {
            var gameId = match.uuid
            var news = function (gameId) {
                return models.GameNews.find({ gameId, state: 0 }).sort({ createtime: -1 }).exec();
            }
            var items = function (gameId) {
                return models.Items.find({ matches: gameId, createBy }).sort({ created: -1 }).exec();
            }
            var itemMaps = async function (itemId) {
                var items = await models.ItemMarkers.find({ itemId, createBy }).sort({ created: -1 }).exec();
                return items;
            }
            Promise.all([news(gameId), items(gameId)]).then((result) => {
                return result;
            }).then((result) => {
                var arr_id = _.pluck(result[1], "_id");
                models.ItemMarkers.find({ itemId: { $in: arr_id }, createBy }).sort({ created: -1 }).exec((err, itemMapList) => {
                    if (err) {
                        return res.json({ "code": 500, "message": "系统错误111" });
                    }
                    res.json({ code: 200, data: match, News: result[0], Items: result[1], itemMapList });
                });
            })
                .catch((err) => {
                    res.json({ "err": err, "message": "系统错误" });
                })
        }
    })
})

router.post('/delete', function (req, res, next) {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    models.Matches.getMatchById(req.body._id, (err, match) => {
        if (err) {
            return res.json({ code: '500', "err": err, "message": "系统错误" });
        }
        if (!match) {
            return res.json({ code: '500', "err": err, "message": "当前赛事不存在" });
        }
        match.state = 1;
        matchNew = new models.Matches(match);
        matchNew.save().then((data) => {
            res.json({ code: 200 });
        }).catch((err) => {
            res.json({ code: '500', "err": err, "message": "系统错误" })
        })
    })
})

router.post('/createMatch', function (req, res, next) {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { name, shortname, city, address, location, timeAll, matchType, linkphone, slider, domainId, ecId } = req.body;
    if (_.isEmpty(slider)) return res.json({ 'code': 400, message: '轮播图至少一张' });
    if (_.isEmpty(name)) return res.json({ 'code': 400, message: '名称不能为空' });
    if (_.isEmpty(shortname)) return res.json({ 'code': 400, message: '简称不能为空' });
    if (_.isEmpty(city)) return res.json({ 'code': 400, message: '主办城市不能为空' });
    if (_.isEmpty(address)) return res.json({ 'code': 400, message: '详细地址不能为空' });
    if (_.isEmpty(timeAll)) return res.json({ 'code': 400, message: '比赛时间不能为空' });
    if (!matchType) return res.json({ 'code': 400, message: '比赛类型不能为空' });
    if (_.isEmpty(linkphone)) return res.json({ 'code': 400, message: '联系电话不能为空' });
    var data = { name, shortname, city, address, isStatistics: 1, location, linkphone, domainId, ecId, slider, cover: slider[0], sdate: new Date(timeAll[0]).getTime(), edate: new Date(timeAll[1]).getTime(), reviewtype: 0, payonline: 1, createAt: new Date(), uuid: commons.makeUUID(), state: 0, status: 0, isPublish: 0, rss: true, rss_keywords: [name] };
    if (location && location.split(',').length == 2) {
        data.longitude = location.split(',')[0];
        data.latitude = location.split(',')[1];
        data.location = location;
    }
    //设置新闻抓取关键词
    if (shortname && shortname != name) data.rss_keywords.push(shortname);
    // var ecDomain = ECSDomain.findOne({ domainId, ecId });
    var EcDomain = (domainId, ecId) => {
        return models.ECSDomain.findOne({ domainId, ecId }).exec();
    }
    var Matches = (domainId, ecId) => {
        return models.Matches.find({ domainId, ecId, state: 0 }).exec();
    }
    var matctNew = (data) => {
        var newMatch = new models.Matches(data);
        return newMatch.save().then((match) => { console.log('赛事保存成功'); return match._id });
    }
    // var saveMatchLog = (userId,data,req)=>{
    //     var matchLogData = { createAt: new Date(), userId, action: 'match/createMatch', data, ip: commons.getClientIp(req)}
    //     var matchLog = new models.MatchesLog(matchLogData);
    //     return matchLog.save(()=>{console.log('赛事日志保存成功')});
    // }
    var saveMatchLog = (data, req) => {
        var matchLogData = { createAt: new Date(), action: 'match/createMatch', data, ip: commons.getClientIp(req) }
        var matchLog = new models.MatchesLog(matchLogData);
        return matchLog.save(() => { console.log('赛事日志保存成功') });
    }
    var subData = { gameId: data.uuid, isStatistics: 1, name, city, matchType, address, location: data.location, longitude: data.longitude, latitude: data.latitude, linkphone, sdate: data.sdate, edate: data.edate, cover: data.cover, slider: data.slider, domainId, ecId, disclaimer: Config.disclaimer, reviewtype: 0, payonline: 1, state: 0, createdAt: new Date(), idNoRequired: true };
    var saveSub = (subData) => {
        var subDataNew = new models.GameSubs(subData);
        return subDataNew.save().then((sub) => { console.log('分站保存成功'); return sub._id });
    }
    var saveSubLog = (subData, req) => {
        var subLogData = { action: 'match/createMatch', data: subData, createdAt: new Date(), ip: commons.getClientIp(req) };
        var subLog = new models.GameSubsLog(subLogData);
        return subLog.save(() => { console.log('分站日志保存成功') })
    }
    var matchUpdate = (_id, subId) => {
        return models.Matches.findOneAndUpdate({ '_id': _id, state: 0 }, { $set: { 'subId': subId } }, { new: true }).then((match) => { return match });
    }
    Promise.all([EcDomain(domainId, ecId), Matches(domainId, ecId)]).then((result) => {
        // 判断能否创建赛事
        if (result[1].length >= result[0].matchcreatecount) return res.json({ 'code': 505, message: `可创建赛事限额:${result[0].matchcreatecount}` });
        // var xcxurl = commons.getXcxQr({ appId: 'wx7e4c7bc6eea1456e', path: '/pages/index/index?matchId=' + data.uuid , models,HTTP});
        // if (xcxurl) data.xcxurl = xcxurl;
        return data;
    }).then((data) => {
        // 创建赛事
        var matchId = matctNew(data);
        return matchId;
    }).then((matchId) => {
        // 保存赛事日志
        saveMatchLog(data, req);
        return matchId;
    }).then((matchId) => {
        //创建分站
        var subId = saveSub(subData);
        var result = { matchId, subId }
        return result;
    }).then((result) => {
        // 分站日志
        saveSubLog(subData, req);
        return result;
    }).then((result) => {
        // 更新赛事subId
        var match = matchUpdate(result.matchId, result.subId);
        return match;
    }).then((match) => {
        res.json({ 'code': 200, match })
    }).catch((err) => {
        res.json({ code: '500', "err": err, "message": "系统错误" })
    })

})
module.exports = router;