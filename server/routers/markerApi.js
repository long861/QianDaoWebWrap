var express = require('express');
var router = express.Router();
var models = require('../model/model').models;
var ecId = "xydSXCsZ38TqQshY7";
var domainId = "PFSvkHRcArfzJEuZt";
var commons = require('../model/common');
var _ = require('underscore');
var async = require('async');
const utils = require('../utils');

router.post('/getMarkersList', function (req, res, next) {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { page, limit, itemId, name } = req.body;
    // 赛事列表
    // var matchesList = (ecId, domainId) => {
    //     return models.Matches.find({ 'ecId': ecId, 'domainId': domainId, state: 0 }).sort({ createAt: -1 }).exec();
    // };

    //线路列表 
    var linesList = () => {
        return models.Items.find({ state: 0, createBy }).sort({ created: -1 }).exec();
    }
    var lineInfo = (itemId) => {
        return models.Items.find({ state: 0, itemId, createBy }).sort({ created: -1 }).exec();
    }
    // 点标列表
    var Markers = (itemId) => {
        if (name) {
            return models.ItemMarkers.find({ 'itemId': itemId, createBy, type: "marker", name: new RegExp(name), delete: null }).sort({ index: 1 }).exec();
        } else {
            return models.ItemMarkers.find({ 'itemId': itemId, createBy, type: "marker", delete: null }).sort({ index: 1 }).exec();
        }
    }
    var MarkersAllBox = (itemId) => {
        return models.ItemMarkers.find({ 'itemId': itemId, createBy, type: "marker", delete: null }).sort({ index: 1 }).exec();
    }
    var markersList = (markers) => {
        var MarkersShow = [];
        for (var i = (page - 1) * limit; i < page * limit; i++) {
            if (markers[i]) {
                var Item = _.extend({}, markers[i]);
                MarkersShow.push(Item);
            } else {
                break;
            }
        }
        return MarkersShow;
    }
    // if (!gameId) {
    //     asyncFun = async () => {
    //         try {
    //             const matches = await matchesList(ecId, domainId);
    //             if (matches && matches.length == 0) {
    //                 return res.json({ 'code': 200, NoData: true, message: "当前没有比赛，快去添加比赛吧！" });
    //             }
    //             const lines = await linesList(matches[0].uuid);
    //             if (lines && lines.length == 0) {
    //                 return res.json({ 'code': 200, NoData: true, noLine: true, matches, message: "当前比赛没有线路，快去添加线路吧！" });
    //             }
    //             const markers = await markersList(lines[0]._id, matches[0].uuid);
    //             if (markers && markers.length == 0) {
    //                 return res.json({ 'code': 200, NoData: true, noMarker: true, matches, lines, markers, message: "当前比赛没有点标，快去添加点标吧！" });
    //             }
    //             res.json({ 'code': 200, matches, lines, markers, NoData: false, hasAll: true, total: markers.length });
    //         }
    //         catch (err) {
    //             res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    //         }
    //     }
    //     asyncFun();
    // } else {
    if (!itemId) {
        asyncFun = async () => {
            try {
                const lines = await linesList();
                if (lines && lines.length == 0) {
                    return res.json({ 'code': 200, NoData: true, noLine: true, lines, message: "当前比赛没有线路，快去添加线路吧！" });
                }
                const markersAll = await Markers(lines[0]._id);
                if (markersAll && markersAll.length == 0) {
                    return res.json({ 'code': 200, NoData: true, noMarker: true, total: markersAll.length, lines, markers: markersAll, message: "当前比赛没有任务点，快去添加任务点吧！" });
                }
                var markers = await markersList(markersAll);
                var markerAllBoxOver = await MarkersAllBox(lines[0]._id);
                if (markerAllBoxOver && markerAllBoxOver.length == 0) {
                    return res.json({ 'code': 200, NoData: true, noMarker: true, total: markersAll.length, lines, markers: markersAll, message: "当前比赛没有任务点，快去添加任务点吧！", MarkersAll: [] });
                }
                res.json({ 'code': 200, lines, markers, NoData: false, hasAll: true, total: markersAll.length, MarkersAll: markerAllBoxOver });
            }
            catch (err) {
                res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
            }
        }
        asyncFun();
    }
    else {
        asyncFun = async () => {
            try {
                const lines = await linesList();
                if (lines && lines.length == 0) {
                    return res.json({ 'code': 200, NoData: true, noLine: true, lines, message: "当前没有线路，快去添加线路吧！" });
                }
                const markersAll = await Markers(itemId);
                if (markersAll && markersAll.length == 0) {
                    return res.json({ 'code': 200, lines, NoData: true, noMarker: true, total: markersAll.length, markers: markersAll, message: "当前线路没有任务点，快去添加任务点吧！" });
                }
                var markers = await markersList(markersAll);
                var markerAllBoxOver = await MarkersAllBox(itemId);
                if (markerAllBoxOver && markerAllBoxOver.length == 0) {
                    return res.json({ 'code': 200, lines, NoData: true, noMarker: true, total: markersAll.length, markers: markersAll, message: "当前线路没有任务点，快去添加任务点吧！", MarkersAll: [] });
                }
                res.json({ 'code': 200, markers, lines, NoData: false, hasAll: true, total: markersAll.length, MarkersAll: markerAllBoxOver });
            }
            catch (err) {
                res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
            }
        }
        asyncFun();
    }
    // }
})

router.post('/searchMarkerByName', function (req, res, next) {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { itemId, name, page, limit } = req.body;
    var allMarkers = () => {
        return models.ItemMarkers.find({ 'itemId': itemId, type: "marker", createBy, name: new RegExp(name), delete: null }).sort({ index: 1 }).exec();
    }
    var LimitMarkers = (MarkersBox, page, limit) => {
        var Arr = [];
        for (var i = (page - 1) * limit; i < page * limit; i++) {
            if (MarkersBox[i]) {
                var Item = _.extend({}, MarkersBox[i]);
                Arr.push(Item);
            } else {
                break;
            }
        }
        return Arr;
    }
    var asyncFun = async () => {
        try {
            var MarkersBox = await allMarkers();
            var Arr = await LimitMarkers(MarkersBox, page, limit);
            if (!Arr) {
                return res.json({ 'code': 500, markers: Arr, 'message': '系统错误' });
            }
            if (Arr.length == 0) {
                return res.json({ 'code': 200, NoData: true, noMarker: true, markers: Arr, 'message': `没有与"${name}"相关的点标` });
            }
            res.json({ code: 200, markers: Arr, NoData: false, hasAll: true, total: MarkersBox.length });
        } catch (err) {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        }
    }
    asyncFun();
})

router.post('/remove', function (req, res, next) {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { _id, itemId } = req.body;
    var markers = () => {
        return models.ItemMarkers.findOne({ _id, createBy, delete: null }).exec();
    }
    var markersAll = () => {
        return models.ItemMarkers.find({ itemId, createBy, delete: null }).sort({ index: 1 }).exec();
    }
    var markersBox = (markersAllGet, markersGet) => {
        var arr = [];
        for (var i = 0; i < markersAllGet.length; i++) {
            if (markersAllGet[i].index > markersGet.index) {
                markersAllGet[i].index = markersAllGet[i].index - 1;
                arr.push(markersAllGet[i]);
            }
        }
        return arr;
    }
    var markerRemove = () => {
        return models.ItemMarkers.update({ _id, createBy }, { $set: { 'delete': Date.now() } }, { new: true }).exec();
    }
    var markersBoxUpdate = (markersBoxGet) => {
        async.eachSeries(markersBoxGet, function (item, callback) {
            models.ItemMarkers.update({ _id: item._id, createBy }, { $set: item }, { new: true }).then(result => {
                callback(null);
            }).catch(e => {
                callback(e);
            });
        });
        res.json({ code: 200, delete: true })
    }
    var asyncFun = async () => {
        try {
            var markersGet = await markers();
            if (!markersGet) return res.json({ 'code': 404, delete: false, message: '该点标已被删除' });
            var markersAllGet = await markersAll();
            if (!markersAllGet) return res.json({ 'code': 404, delete: false, message: '该点标已被删除' });
            var markersBoxGet = await markersBox(markersAllGet, markersGet);
            var markerRemoveOver = await markerRemove();
            if (!markerRemoveOver) return res.json({ 'code': 404, delete: false, message: '删除失败' });
            markersBoxUpdate(markersBoxGet);
        } catch (err) {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        }
    }
    asyncFun();
})

// router.post('/getMarkerInfo', (req, res, next) => {
// const { createBy, creator } = utils.getCreator(req.headers);
//     if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
//     var _id = req.body.markerId;
//     models.ItemMarkers.findOne({ _id, createBy }).then((marker) => {
//         if (!marker) {
//             return res.json({ 'code': 505, 'message': '当前点标已被删除' });
//         }
//         models.CustomIcon.find({}).exec((err, icons) => {
//             if (err) {
//                 return res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
//             }
//             res.json({ 'code': 200, marker, icons });
//         })
//     }).catch((err) => {
//         res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
//     })
// });

router.post('/editMarkerInfo', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { _id, name, image, tw, number, markerAttr, itemId, isStart, isEnd } = req.body;
    if (_.isEmpty(name)) return res.json({ 'code': 400, message: '名称不能为空' });
    if (_.isEmpty(tw)) return res.json({ 'code': 400, message: '介绍不能为空' });
    var Marker = (id) => {
        return models.ItemMarkers.findOne({ _id: id, delete: null, type: 'marker', createBy }).exec();
    }
    var line = (itemId) => {
        return models.Items.findOne({ _id: itemId, createBy, state: 0 }).exec();
    }
    var noCommon = (markerAttr, itemId) => {
        if (markerAttr == 0) {
            return models.ItemMarkers.find({ "markerAttr": markerAttr, createBy, 'itemId': itemId, delete: null, type: 'marker', isStart: 1 }).exec();
        } else if (markerAttr == 1) {
            return models.ItemMarkers.find({ "markerAttr": markerAttr, createBy, 'itemId': itemId, delete: null, type: 'marker', isEnd: 1 }).exec();
        }
    }
    var asyncFun = async () => {
        try {
            var marker = await Marker(_id);
            if (!marker) {
                return res.json({ 'code': 505, 'message': '当前点标已被删除' });
            }
            if ((marker.isStart && (markerAttr != 0) || (marker.isEnd && markerAttr != 1))) {
                var Line = await line(itemId);
                if (!Line) return res.json({ 'code': 505, 'message': '当前线路已被删除' });
                if (Line.isShow) return res.json({ 'code': 505, 'message': '请先撤销线路发布，再修改线路起点' });
                if (Line.isShow) return res.json({ 'code': 505, 'message': '请先撤销线路发布，再修改线路终点' });
            }
            var common = await noCommon(markerAttr, itemId);
            var data = { _id, name, image, markerAttr, tw, updated: Date.now(), isStart, isEnd, number };
            if (markerAttr == 0 || markerAttr == 1) {
                if (common.length > 0) {
                    if (common[0]._id != _id) {
                        if (markerAttr == 0) return res.json({ 'code': 505, 'message': '当前线路已存在起点' });
                        if (markerAttr == 1) return res.json({ 'code': 505, 'message': '当前线路已存在终点' });
                    }
                } else {
                    if (markerAttr == 0) { data.isStart = 1; data.isEnd = null; } else if (markerAttr == 1) { data.isEnd = 1; data.isStart = null; }
                }
            } else {
                data.isEnd = null; data.isStart = null;
            }
            models.ItemMarkers.updateOne({ _id, createBy }, { $set: data }, { new: true }).then((newMarker) => {
                res.json({ code: 200 });
            })
        }
        catch (err) {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        }
    }
    asyncFun();
});

// router.post('/getDefIcon', (req, res, next) => {
//     if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
//     models.CustomIcon.find({}).exec((err, icons) => {
//         if (err) {
//             return res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
//         }
//         res.json({ 'code': 200, icons });
//     })
// })

router.post('/getDefaultMarters', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    models.MarkersDefault.find({ delete: null, status: 1, createBy }).sort({ created: -1 }).then((defaultMarkers) => {
        res.json({ 'code': 200, defaultMarkers });
    }).catch((err) => {
        res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    })
})
router.post('/getDefaultMartersAll', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    let { page, limit } = req.body;
    page = Number(page);
    limit = Number(limit);
    models.MarkersDefault.find({ delete: null, createBy }).sort({ created: -1 }).then((Markers) => {
        var defaultMarkers = [];
        for (var i = (page - 1) * limit; i < page * limit; i++) {
            if (Markers[i]) {
                var Item = _.extend({}, Markers[i]);
                defaultMarkers.push(Item);
            } else {
                break;
            }
        }
        if (Markers.length == 0) {
            res.json({ 'code': 200, defaultMarkers, total: Markers.length, message: '当前暂时没有点标，快去添加吧！' });
        } else {
            res.json({ 'code': 200, defaultMarkers, total: Markers.length });
        }

    }).catch((err) => {
        res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    })
})

// router.post('/getMartersItem', (req, res, next) => {
// const { createBy, creator } = utils.getCreator(req.headers);
//     if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
//     models.MarkersDefault.find({ createBy }).then((defaultMarkers) => {
//         models.ItemMarkers.find({ itemId: req.body._id, delete: null, type: 'marker', createBy }).sort({ index: 1 }).then((Markers) => {
//             res.json({ 'code': 200, Markers, defaultMarkers });
//         })
//     }).catch((err) => {
//         res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
//     })
// })

router.post('/saveMarkers', (req, res, next) => {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    var markers = req.body.newMarkers || [];
    var count = Number(req.body.count);
    var itemId = req.body.itemId;
    var markersInsert = (markers, itemId, count) => {
        for (var i = 0; i < markers.length; i++) {
            markers[i].defaultMarkerId = markers[i]._id;
            markers[i].defaultMarkerName = markers[i].name;
            delete markers[i]._id;
            markers[i].itemId = itemId;
            markers[i].index = count + i + 1;
            markers[i].created = new Date().getTime();
            var markersData = new models.ItemMarkers(markers[i]);
            markersData.save();
        }
    }
    var asyncFun = async () => {
        try {
            await markersInsert(markers, itemId, count);
            res.json({ code: 200 });
        } catch (err) {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        }
    }
    asyncFun();
})
router.post('/editInfo', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { _id, name, lat, lng, tw, image, number } = req.body;
    if (_.isEmpty(name)) return res.json({ 'code': 400, message: '名称不能为空' });
    if (!number) return res.json({ 'code': 400, message: '编号不能为空' });
    // if (_.isEmpty(icon)) return res.json({ 'code': 400, message: '标志不能为空' });
    if (!lat || !lng) return res.json({ 'code': 400, message: '位置不能为空' });
    if (!Number(lat)) return res.json({ 'code': 400, message: '经度格式错误' });
    if (!Number(lng)) return res.json({ 'code': 400, message: '纬度格式错误' });
    if (_.isEmpty(tw)) return res.json({ 'code': 400, message: '介绍不能为空' });
    var isStart = null;
    var isEnd = null;
    // if (markerAttr == 0) {
    //     isStart = 1;
    // } else if (markerAttr == 1) {
    //     isEnd = 1;
    // }
    var icon = "https://scdn.xidong360.com/dxs/ai/poi.png";
    var center = { lat, lng };
    var data = { _id, name, icon, isStart, number, isEnd, center, tw, image };
    models.MarkersDefault.findOne({ _id, createBy }).then((Marker) => {
        if (!Marker) return res.json({ 'code': 505, 'message': '当前点标已被删除' });
        models.MarkersDefault.findOneAndUpdate({ _id, createBy }, { $set: data }).then((newMarter) => {
            res.json({ code: 200 });
        }).catch((err) => {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        })
    })
})

router.post('/editEqui', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { _id, major, minor } = req.body;
    if (_.isEmpty(major)) return res.json({ 'code': 400, message: '主BeaconsId不能为空' });
    if (!Number(major)) return res.json({ 'code': 400, message: '主BeaconsId格式错误' });
    if (minor && !Number(minor)) return res.json({ 'code': 400, message: '次BeaconsId格式错误' });
    var data = { _id, major, minor, status: 1 };
    models.MarkersDefault.findOne({ _id, createBy }).then((Marker) => {
        if (!Marker) return res.json({ 'code': 505, 'message': '当前点标已被删除' });
        models.MarkersDefault.findOneAndUpdate({ _id, createBy }, { $set: data }).then((newMarter) => {
            res.json({ code: 200 });
        }).catch((err) => {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        })
    })
})

router.post('/EditQuestion', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { _id, QA_options, QA_title, answer, password, marker_type, desc, image1 } = req.body;
    if (_.isEmpty(desc)) return res.json({ 'code': 400, message: '请输入任务描述' });
    if (marker_type == 0) return res.json({ 'code': 400, message: '请选择打卡类型' });
    if (marker_type == 3 && _.isEmpty(QA_title.title)) return res.json({ 'code': 400, message: '题目不能为空' });
    if (marker_type == 3 && QA_options.length < 2) return res.json({ 'code': 400, message: '至少两个选项' });
    if (marker_type == 3 && answer.length == 0) return res.json({ 'code': 400, message: '至少一个答案' });
    if (marker_type == 2 && _.isEmpty(password)) return res.json({ 'code': 400, message: '密码不能为空' });
    var data = { _id, marker_type, updated: Date.now(), desc };
    if (marker_type == 2) {
        data.password = password;
    }
    if (marker_type == 3) {
        data.QA = { title: QA_title.title, options: QA_options, answer, image: image1 };
    }
    models.MarkersDefault.findOne({ _id, delete: null, createBy }).then((Marker) => {
        if (!Marker) return res.json({ 'code': 505, 'message': '当前点标已被删除' });
        if (Marker.major) data.status = 1;
        models.MarkersDefault.findOneAndUpdate({ _id, delete: null, createBy }, { $set: data }).then((newMarter) => {
            res.json({ code: 200 });
        }).catch((err) => {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        })
    })
})

router.post('/EditMarkerQuestion', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { _id, QA_options, QA_title, answer, password, marker_type, desc, image1, image2 } = req.body;
    if (_.isEmpty(desc)) return res.json({ 'code': 400, message: '请输入任务描述' });
    if (marker_type == 0) return res.json({ 'code': 400, message: '请选择打卡类型' });
    if (marker_type == 3 && _.isEmpty(QA_title.title)) return res.json({ 'code': 400, message: '题目不能为空' });
    if (marker_type == 3 && QA_options.length < 2) return res.json({ 'code': 400, message: '至少两个选项' });
    if (marker_type == 3 && answer.length == 0) return res.json({ 'code': 400, message: '至少一个答案' });
    if (marker_type == 2 && _.isEmpty(password)) return res.json({ 'code': 400, message: '密码不能为空' });
    var data = { _id, marker_type, password, updated: Date.now(), desc };
    if (marker_type == 3) {
        data.QA = { title: QA_title.title, options: QA_options, answer, img: image1 };
    }
    // if (marker_type == 2) {
    //     data.imageRef = image2;
    // }
    models.ItemMarkers.findOne({ _id, delete: null, createBy }).then((Marker) => {
        if (!Marker) return res.json({ 'code': 505, 'message': '当前点标已被删除' });
        if (Marker.major) data.status = 1;
        models.ItemMarkers.findOneAndUpdate({ _id, delete: null, createBy }, { $set: data }).then((newMarter) => {
            res.json({ code: 200 });
        }).catch((err) => {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        })
    })
})

router.post('/removeDefaultMarker', function (req, res, next) {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { _id } = req.body;
    models.MarkersDefault.findOne({ _id, delete: null, createBy }).then((marker) => {
        if (!marker) {
            return res.json({ 'code': 505, message: '该点标已被删除' });
        }
        models.MarkersDefault.findOneAndUpdate({ _id, createBy }, { $set: { 'delete': Date.now() } }, { new: true }).then((data) => {
            res.json({ 'code': 200 });
        })
    }).catch((err) => {
        res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    })
})

router.post('/searchDefaultMarkerByName', function (req, res, next) {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { name, page, limit } = req.body;
    var allMarkersDefault = () => {
        return models.MarkersDefault.find({ type: "marker", name: new RegExp(name), delete: null, createBy }).sort({ created: -1 }).exec();
    }
    var LimitMarkers = (MarkersBox, page, limit) => {
        var Arr = [];
        for (var i = (page - 1) * limit; i < page * limit; i++) {
            if (MarkersBox[i]) {
                var Item = _.extend({}, MarkersBox[i]);
                Arr.push(Item);
            } else {
                break;
            }
        }
        return Arr;
    }
    var asyncFun = async () => {
        try {
            var MarkersBox = await allMarkersDefault();
            var Arr = await LimitMarkers(MarkersBox, page, limit);
            if (!Arr) {
                return res.json({ 'code': 500, markers: Arr, 'message': '系统错误' });
            }
            if (Arr.length == 0) {
                return res.json({ 'code': 200, NoData: true, markers: Arr, 'message': `没有与"${name}"相关的点标` });
            }
            res.json({ code: 200, markers: Arr, NoData: false, total: MarkersBox.length });
        } catch (err) {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        }
    }
    asyncFun();
})

router.post('/createDefaultMarker', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { name, lat, lng, tw, image, number } = req.body;
    if (_.isEmpty(name)) return res.json({ 'code': 400, message: '名称不能为空' });
    if (!number) return res.json({ 'code': 400, message: '编号不能为空' });
    // if (_.isEmpty(icon)) return res.json({ 'code': 400, message: '标志不能为空' });
    if (!lat || !lng) return res.json({ 'code': 400, message: '位置不能为空' });
    if (!Number(lat)) return res.json({ 'code': 400, message: '经度格式错误' });
    if (!Number(lng)) return res.json({ 'code': 400, message: '纬度格式错误' });
    if (_.isEmpty(tw)) return res.json({ 'code': 400, message: '介绍不能为空' });
    var isStart = null;
    var isEnd = null;
    // if (markerAttr == 0) {
    //     isStart = 1;
    // } else if (markerAttr == 1) {
    //     isEnd = 1;
    // }
    var icon = "https://scdn.xidong360.com/dxs/ai/poi.png";
    var center = { lat, lng };
    var data = { name, icon, isStart, isEnd, center, number, tw, type: "marker", createBy, marker_type: 1, desc: '点击打卡即可', created: Date.now(), status: 0, image };
    var defaultMarker = new models.MarkersDefault(data);
    defaultMarker.save().then((result) => {
        res.json({ code: 200 });
    }).catch((err) => {
        res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
    })
})
router.post('/upMarkerIndex', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { _id, index, itemId } = req.body;
    var markerItem = (_id, index) => {
        return models.ItemMarkers.findOne({ _id, index, type: "marker", delete: null, createBy }).exec();
    }
    var markerFirst = (itemId) => {
        return models.ItemMarkers.find({ itemId, type: "marker", delete: null, createBy }).sort({ index: 1 }).limit(1).exec();
    }
    var markerUp = (itemId, num) => {
        return models.ItemMarkers.findOne({ itemId, index: num, type: "marker", delete: null, createBy }).exec();
    }
    var updateMarker = (_id, num) => {
        return models.ItemMarkers.update({ _id, type: "marker", delete: null, createBy }, { $set: { index: num } }, { new: true }).exec();
    }
    var asyncFun = async () => {
        try {
            var markerItemOver = await markerItem(_id, index);
            if (!markerItemOver) return res.json({ code: '505', message: '当前任务点已被删除' });
            var markerFirstOver = await markerFirst(itemId);
            if (markerFirstOver[0].index == index) return res.json({ code: '505', message: '当前任务点已为第一位' });
            var num = index - 1;
            var markerUpOver = await markerUp(itemId, num);
            if (!markerUpOver) return res.json({ code: '505', message: '当前任务点已为第一位' });
            var updateMarkerThis = await updateMarker(_id, num);
            if (!updateMarkerThis) return res.json({ code: '505', message: '系统错误' });
            var updateMarkerOther = await updateMarker(markerUpOver._id, index);
            if (!updateMarkerOther) return res.json({ code: '505', message: '系统错误' });
            res.json({ code: 200 });
        } catch (err) {
            res.json({ code: 500, message: '系统错误', 'err': err });
        }
    }
    asyncFun();
})

router.post('/downMarkerIndex', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { _id, index, itemId } = req.body;
    var markerItem = (_id, index) => {
        return models.ItemMarkers.findOne({ _id, index, type: "marker", delete: null, createBy }).exec();
    }
    var markerLast = (itemId) => {
        return models.ItemMarkers.find({ itemId, type: "marker", delete: null, createBy }).sort({ index: -1 }).limit(1).exec();
    }
    var markerUp = (itemId, num) => {
        return models.ItemMarkers.findOne({ itemId, index: num, type: "marker", delete: null, createBy }).exec();
    }
    var updateMarker = (_id, num) => {
        return models.ItemMarkers.update({ _id, type: "marker", delete: null, createBy }, { $set: { index: num } }, { new: true }).exec();
    }
    var asyncFun = async () => {
        try {
            var markerItemOver = await markerItem(_id, index);
            if (!markerItemOver) return res.json({ code: '505', message: '当前任务点已被删除' });
            var markerLastOver = await markerLast(itemId);
            if (markerLastOver[0].index == index) return res.json({ code: '505', message: '当前任务点已为最后一位' });
            var num = index + 1;
            var markerUpOver = await markerUp(itemId, num);
            if (!markerUpOver) return res.json({ code: '505', message: '当前任务点已为最后一位' });
            var updateMarkerThis = await updateMarker(_id, num);
            if (!updateMarkerThis) return res.json({ code: '505', message: '系统错误' });
            var updateMarkerOther = await updateMarker(markerUpOver._id, index);
            if (!updateMarkerOther) return res.json({ code: '505', message: '系统错误' });
            res.json({ code: 200 });
        } catch (err) {
            res.json({ code: 500, message: '系统错误', 'err': err });
        }
    }
    asyncFun();
})

// function changDate() {
//     var markers = () => {
//         return models.ItemMarkers.find({ itemId: 'b352614014a44a46bae0dbbe318b99d8' }).exec();
//     }
//     var defaultMarkers = () => {
//         return models.MarkersDefault.find({}).exec();
//     }
//     var newMarkers = (Markers, DefaultMarkers) => {
//         for (var i = 0; i < Markers.length; i++) {
//             for (var j = 0; j < DefaultMarkers.length; j++) {
//                 if (Markers[i].defaultMarkerId == DefaultMarkers[j]._id) {
//                     var data = { number: DefaultMarkers[j].number, defaultMarkerName: DefaultMarkers[j].name };
//                     models.ItemMarkers.update({ _id: Markers[i]._id }, { $set: data }, { new: true }).then((result) => {
//                         console.log('resultOver')
//                     });
//                 }
//             }

//         }
//     }
//     var asyncFun = async () => {
//         var Markers = await markers();
//         var DefaultMarkers = await defaultMarkers();
//         newMarkers(Markers, DefaultMarkers);
//     }
//     asyncFun();
// }
// setTimeout(function () { changDate() }, 2000)



// function changDate() {
//     var markers = () => {
//         return models.ItemMarkers.find({ itemId: 'b352614014a44a46bae0dbbe318b99d8' }).exec();
//     }
//     var newMarkers = (Markers) => {
//           for (var i = 0; i < Markers.length; i++) {
//             models.ItemMarkers.update({ _id: Markers[i]._id}, { $set: { createBy:'shh' }},{new:true} ).then((result) => {
//               console.log('resultOver')
//             });
//           }
//     }
//     var asyncFun = async () => {
//         var Markers = await markers();
//         newMarkers(Markers);
//     }
//     asyncFun();
// }
// setTimeout(function () { changDate() }, 2000)

module.exports = router;