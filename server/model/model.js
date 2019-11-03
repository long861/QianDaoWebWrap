var _ = require('underscore');
var mongoose = require('mongoose');
var utils = require('../utils');

if (!process.env.MONGO_URL) {
  console.log('please set `MONGO_URL` environment before start the application.');
  process.exit(1);
}
// 连接数据库 
mongoose.connect(process.env.MONGO_URL, {
  // 配置参数保护在宕机后重连
  autoReconnect: true,
  poolSize: 10,
  reconnectTries: 30,
  reconnectInterval: 500,
  bufferCommands: false,
  useNewUrlParser: true
});
// mongoose.connect(process.env.MONGO_URL);

// 此处防止 node.js - Mongoose: mpromise 错误
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error======', console.error.bind(console, 'Connect error'));
db.once('open', function () {
  console.log('Mongodb started successfully======');
});

var defaultSchema = mongoose.Schema({}, { versionKey: false, collection: 'test' });
// 供应商
var eCSDomainSchema = mongoose.Schema({ _id: String, ecId: String, domainId: Object, userId: Date, modules: Array, matchmanagers: Array, createdAt: Date, matchmanagercount: Number, matchpublishcount: Number, matchcreatecount: Number, venuemanagercount: Number, venuepublishcount: Number, venuecreatecount: Number, venuemanagers: Array }, { versionKey: false, collection: 'app.ecs.domain' });
// 微信公众号access_token jsapi_ticket
var xd_apiSchema = mongoose.Schema({ _id: String, name: String, access_token: String, jsapi_ticket: String, createtime: Date, expire: Date, appId: String, appsecret: String, createdAt: Date, updatedAt: Date, card_ticket: String }, { versionKey: false, collection: 'xd_api' });
var matchesLogSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, createAt: Date, action: String, data: Object, ip: String, userId: String }, { versionKey: false, collection: 'platform.apps.log' });
var gameSubsSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, name: String, gameId: String, longitude: String, latitude: String, xcxurl: String, location: String, isStatistics: Number, city: String, matchType: Number, disclaimer: Object, linkphone: String, domainId: String, ecId: String, slider: Array, cover: String, reviewtype: Number, payonline: Number, createdAt: Date, sdate: Date, edate: Date, state: Number, idNoRequired: Boolean, status: Number, address: String }, { versionKey: false, collection: 'game.substation' });

var gameSubsLogSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, createdAt: Date, action: String, data: Object, ip: String, userId: String }, { versionKey: false, collection: 'game.substation.log' })
//赛事
var matchSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, name: String, longitude: String, latitude: String, xcxurl: String, location: String, shortname: String, city: String, isStatistics: Number, matchType: Number, linkphone: String, domainId: String, ecId: String, slider: Array, cover: String, reviewtype: Number, payonline: Number, leaders: Object, sdate: Date, edate: Date, state: Number, uuid: String, status: Number, isPublish: Number, rss: Boolean, rss_keywords: Array, address: String }, { versionKey: false, collection: 'platform.apps' });
//团体
var teamSchema = mongoose.Schema({ _id: String, gameId: String, subId: String, groupId: String, gname: String, state: Number, status: Number, teamId: String, leader: Object, _userId: String, createtime: Number, createAt: Date, from: String, needpay: Boolean }, { versionKey: false, collection: 'game.team' });
//成员
var playerSchema = mongoose.Schema({ _id: String, gameId: String, subId: String, groupId: String, userId: String, profileId: String, name: String, idNo: String, province: String, city: String, birth: String, sex: String, gender: String, age: Number, from: String, status: Number, state: Number, needpay: Boolean, teamId: String, playerId: String, createtime: Number, createAt: Date, avatar: String, projects: [{ projectid: String, worktype: String }], number: Number }, { versionKey: false, collection: 'game.player' });
//线路
var ItemsSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, isShow: Boolean, createBy: String, one: String, index: Number, state: Number, color: String, name: String, desc: String, userId: String, created: Number, center: Object, zoom: Number, updated: Date, type: Number, _type: String, _start: Number, _end: Number, _count: Number, totaldistance: String, matches: Array, operators: Array, groups: Array, cover: String, address: String, tags: Array, xcxurl: String, isHide: String, isTourist: Boolean }, { versionKey: false, collection: 'saidao.items' });
var FormIdsSchema = mongoose.Schema({ _id: String, formId: String, openid: String, userId: String, created: Date }, { versionKey: false, collection: 'saidao.formids' });
//点标
var ItemMarkersSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, purpType: Number, defaultMarkerName: String, createBy: String, number: String, itemId: String, defaultMarkerId: String, index: Number, desc: String, markerAttr: Number, gameId: Array, type: String, center: Object, icon: String, userId: String, created: Number, updated: Number, name: String, marker_type: String, image: String, tw: String, major: String, minor: String, b_uuid: String, path: Array, color: String, delete: Date, radius: Number, password: String, QA: Object, isStart: Number, isEnd: String, uuid: String }, { versionKey: false, collection: 'saidao.item.markers' });
var MarkersDefaultSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, number: String, createBy: String, markerAttr: Number, isEnd: Number, isStart: Number, status: Number, delete: Number, desc: String, type: String, center: Object, icon: String, created: Number, name: String, marker_type: String, image: String, tw: String, major: String, minor: String, b_uuid: String, path: Array, radius: Number, password: String, QA: Object }, { versionKey: false, collection: 'saidao.markers.default' });
var CustomIconSchema = mongoose.Schema({ _id: String, name: String, userId: String, icon: String }, { versionKey: false, collection: 'saidao.custom.icon' });
//打卡记录
var SignSchema = mongoose.Schema({ _id: String, itemId: String, userId: String, teamId: String, markerId: String, gps: Object, sdate: Date, ip: String, state: Number, optime: Date, operator: String, opip: String, isStart: Number, isEnd: Number }, { versionKey: false, collection: 'saidao.sign' });
var LoginQrcodesSchema = mongoose.Schema({ _id: String, path: String, userId: String, status: Number, created: Date, itemId: String, departId: String, taskId: String, status: Number, update: Date, loginToken: String }, { versionKey: false, collection: 'login.qrcodes' });
var ViewLogsSchema = mongoose.Schema({ _id: String, userId: String, itemId: String, created: Date }, { versionKey: false, collection: 'saidao.view.logs' });
//打卡结果
var SignResultSchema = mongoose.Schema({ _id: String, itemId: String, teamId: String, isStart: Number, isEnd: Number, markerId: String, state: Number, finish: Boolean, records: Array, createdAt: Date, isEnd: Number, finishTime: Date, isStart: Number }, { versionKey: false, collection: 'saidao.sign.result' });
//游客线路记录
var TouristItemsSchema = mongoose.Schema({ _id: String, openid: String, itemId: String, createdAt: Date, userId: String }, { versionKey: false, collection: 'saidao.tourist.items' });
var newSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, type: String, cover: String, tags: Array, author: String, content: String, domainId: String, ecId: String, info: Array, summary: String, cover: String, createtime: Number, title: String, uuid: String, gameId: String, from: Number, link: String, updatedAt: Date, timestamp: Number, state: Number, subtitle: String }, { versionKey: false, collection: 'game.media' });
var ParkSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, name: String, createBy: String, address: String, phone: String, desc: String, validtime: String, addressInfo: String, center: Object, parkRules: String, created: Date, updated: Date, domainId: String, ecId: String }, { versionKey: false, collection: 'saidao.park' });
//
var ShhUserSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, username: String, createBy: String, password: String, mobile: String, salt: String, token: String, userId: String, name: String, introduction: String, roles: [String], avatar: String, isAdmin: Number, createdAt: { type: Number, default: nowTime }, updatedAt: Number, state: Number, }, { versionKey: false, collection: 'shh.users' });
//
var UserSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, mobile: String, name: String, createdAt: { type: Date, default: nowDate }, }, { versionKey: false, collection: 'users' });
//
var UserOauthSchema = mongoose.Schema({ _id: String, userId: String, state: Number }, { versionKey: false, collection: 'user.oauth' });
var ShhThemeSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, name: String, createBy: String, summary: String, color: String, cover: String, content: String, createdAt: Number, updatedAt: Number, userId: String, state: Number }, { versionKey: false, collection: 'shh.theme' });
var ShhPlayersSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, itemId: String, leader: String, members: Array, userId: String, openid: String, createdAt: Date, state: Number, finish: Boolean, time: Number, rank: Number }, { versionKey: false, collection: 'saidao.item.groups' });
function uniqid() {
  return utils.getUUID();
}
function nowTime() {
  return Date.now();
}
function nowDate() {
  return new Date();
}

// 比赛
matchSchema.statics = {
  getMatchById: ((_id, callback) => {
    models.Matches.findOne({ _id, state: 0 }).then((Match) => {
      callback(null, Match);
    }).catch((err) => {
      callback(err);
    })
  })
}
// 线路
ItemsSchema.statics = {
  getItemsByMatchId: ((matchId, callback) => {
    models.Items.find({ matches: matchId, state: 0, createBy: "shh" }).then((Items) => {
      callback(null, Items);
    }).catch((err) => {
      callback(err);
    })
  }),
  getItemsById: ((_id, callback) => {
    models.Items.findOne({ _id, state: 0, createBy: "shh" }).then((Items) => {
      callback(null, Items);
    }).catch((err) => {
      callback(err);
    })
  })
}

// 运动员
playerSchema.statics = {
  getPlayersCounts: ((gameId, callback) => {
    models.Players.find({ "gameId": gameId, status: 0 }).countDocuments((err, count) => {
      if (err) {
        callback(err);
      } else {
        callback(null, count);
      }
    })
  })
}

// 新闻
newSchema.statics = {
  getNewsByGameId: ((gameId, callback) => {
    models.GameNews.find({ gameId, state: 0 }).sort({ createtime: -1 }).then((news) => {
      callback(null, news);
    }).catch((err) => {
      callback(err);
    })
  })
}





var models = {
  Test: mongoose.model('test', defaultSchema),
  ECSDomain: mongoose.model('app.ecs.domain', eCSDomainSchema),
  XD_API: mongoose.model('xd_api', xd_apiSchema),
  MatchesLog: mongoose.model('platform.apps.log', matchesLogSchema),
  GameSubs: mongoose.model('game.substation', gameSubsSchema),
  GameSubsLog: mongoose.model('game.substation.log', gameSubsLogSchema),
  // 赛事
  Matches: mongoose.model('platform.apps', matchSchema),
  // 队伍
  Teams: mongoose.model('game.team', teamSchema),
  // 成员
  Players: mongoose.model('game.player', playerSchema),
  // 线路图
  Items: mongoose.model('saidao.items', ItemsSchema),
  // 登录
  FormIds: mongoose.model('saidao.formids', FormIdsSchema),
  // 点标
  ItemMarkers: mongoose.model('saidao.item.markers', ItemMarkersSchema),

  MarkersDefault: mongoose.model('saidao.markers.default', MarkersDefaultSchema),
  // 自定义图标
  CustomIcon: mongoose.model('saidao.custom.icon', CustomIconSchema),
  // 打卡记录
  Sign: mongoose.model('saidao.sign', SignSchema),
  // pc扫码登录状态
  LoginQrcodes: mongoose.model('login.qrcodes', LoginQrcodesSchema),
  // 
  ViewLogs: mongoose.model('saidao.view.logs', ViewLogsSchema),
  // 打卡结果
  SignResults: mongoose.model('saidao.sign.result', SignResultSchema),
  // 游客线路记录
  TouristItems: mongoose.model('saidao.tourist.items', TouristItemsSchema),
  // 新闻
  GameNews: mongoose.model('game.media', newSchema),
  Park: mongoose.model('saidao.park', ParkSchema),
  ShhUsers: mongoose.model('shh.users', ShhUserSchema),
  Users: mongoose.model('users', UserSchema),
  UserOauth: mongoose.model('user.oauth', UserOauthSchema),
  ShhTheme: mongoose.model('shh.theme', ShhThemeSchema),
  ShhPlayers: mongoose.model('saidao.item.groups', ShhPlayersSchema),
};




//创建用户信息
/**
 * 
 * @param {*} mobile 手机号
 * @param {*} name 姓名
 * @param {*} roles 权限
 * @param {*} introduction 描述
 */
async function createuser({ createBy, mobile, name, roles, introduction }) {
  var user = await saveuser({ mobile, name });
  var shhuser = await models.ShhUsers.findOne({ userId: user.userId, createBy }).exec();
  var doc = _.extend({ state: 0, roles, introduction, createBy }, user);
  if (!shhuser) {
    shhuser = await saveshhuser(doc);
  } else {
    await models.ShhUsers.updateOne({ _id: shhuser._id }, { $set: doc }).exec();
  }
}
async function saveshhuser({ userId, mobile, name, roles, introduction, createBy }) {
  var shhuser = {
    username: mobile, password: '', salt: '', token: '',
    userId, name, introduction: introduction || '', roles,
    avatar: 'https://raw.githubusercontent.com/mgbq/nx-admin/master/src/assets/img/home/logo.png',
    state: 0, createBy,
  };
  shhuser.salt = utils.getUUID();
  shhuser.password = utils.getPwd(mobile, shhuser.salt);
  shhuser.token = utils.getUUID();
  shhuser = await models.ShhUsers.create(shhuser);
  return new Promise((resolve, reject) => {
    resolve(shhuser);
  });
}
async function saveuser({ mobile, name }) {
  var user = await models.Users.findOne({ mobile }).exec();
  if (user) {
    return new Promise((resolve, reject) => {
      resolve({ userId: user._id, mobile: user.mobile, name: user.name, });
    });
  } else {
    user = models.Users.create({ mobile, name, });
    return new Promise((resolve, reject) => {
      resolve({ userId: user._id, mobile, name, });
    });
  }
}

module.exports = { mongoose, models, };