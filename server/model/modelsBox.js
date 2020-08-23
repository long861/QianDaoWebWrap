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
function uniqid() {
    return utils.getUUID();
}
var UserSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, password: String, phone: String, roles: [String], role: String, name: String, salt: String, token: String, userId: String, state: Number, note: { type: String, default: '' }, avatar: { type: String, default: null }, createdAt: { type: Date, default: Date.now() }, updatedAt: { type: Date, default: Date.now() } }, { versionKey: false, collection: 'users' });
var AssetsDefaultSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, state: Number, title: String, color: String, type: String, amount: { type: Number, default: 0.00 }, userId: String, cover: { type: String, default: null }, createdAt: { type: Date, default: Date.now() }, updatedAt: { type: Date, default: Date.now() } }, { versionKey: false, collection: 'assets.type.default' });
var AssetsSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, state: Number, title: String, color: String, type: String, amount: { type: Number, default: 0.00 }, userId: String, cover: { type: String, default: null }, createdAt: { type: Date, default: Date.now() }, updatedAt: { type: Date, default: Date.now() } }, { versionKey: false, collection: 'assets' });
var MoneyTypeDefaultSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, status: Number, title: { type: String, default: "" }, type: String, userId: String, cover: { type: String, default: null }, createdAt: { type: Date, default: Date.now() }, updatedAt: { type: Date, default: Date.now() } }, { versionKey: false, collection: 'money.type.default' });
var MoneySchema = mongoose.Schema({ _id: { type: String, default: uniqid }, status: Number, title: { type: String, default: "" }, type: String, userId: String, cover: { type: String, default: null }, createdAt: { type: Date, default: Date.now() }, updatedAt: { type: Date, default: Date.now() } }, { versionKey: false, collection: 'money' });
var newSchema = mongoose.Schema({ _id: { type: String, default: uniqid }, type: String, cover: String, tags: Array, author: String, content: String, domainId: String, ecId: String, info: Array, summary: String, cover: String, createtime: Number, title: String, uuid: String, gameId: String, from: Number, link: String, updatedAt: Date, timestamp: Number, state: Number, subtitle: String }, { versionKey: false, collection: 'news.test' });

// users
UserSchema.statics = {
    getUserByPhone: ((phone, callback) => {
        models.Users.findOne({ phone }).then((user) => {
            callback(null, user);
        }).catch((err) => {
            callback(err);
        })
    }),
    createUser: ((data, callback) => {
        var user = { name: data.name, phone: data.phone, role: data.role, roles: data.roles, password: '', salt: '', token: '', userId: '', state: 1, createdAt: Date.now(), updatedAt: Date.now() }
        user.salt = utils.getUUID();
        user.password = utils.getPwd(data.password, user.salt);
        user.token = utils.getUUID();
        models.Users.create(user).then((newUser) => {
            callback(null, newUser);
        }).catch((err) => {
            callback(err);
        })
    })
}


var models = {
    Users: mongoose.model('users', UserSchema),
    AssetsDefault: mongoose.model('assets.type.default', AssetsDefaultSchema),
    Assets: mongoose.model('assets', AssetsSchema),
    MoneyTypeDefault: mongoose.model('money.type.default', MoneyTypeDefaultSchema),
    Money: mongoose.model('money', MoneySchema),
    GameNews: mongoose.model('news.test', newSchema),
}


module.exports = { mongoose, models, };