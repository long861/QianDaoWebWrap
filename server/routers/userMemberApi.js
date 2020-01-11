var express = require('express');
var router = express.Router();
var modelsBox = require('../model/modelsBox').models;
var _ = require('underscore');
var utils = require('../utils');
var md5 = require("md5");
var async = require('async');


router.post('/register', (req, res, next) => {
    const { username, password, pwd, role, phone } = req.body;
    if (!username) return res.json({ code: 403, message: '账号不存在,请重新输入' });
    if (!phone) return res.json({ code: 403, message: '手机号不存在，请重新输入' });
    if (!password) return res.json({ code: 403, message: '密码不能为空' });
    if (!pwd) return res.json({ code: 403, message: '验证密码不能为空' });
    if (password !== pwd) return res.json({ code: 403, message: '两次密码不相同' });
    if (!role) return res.json({ code: 403, message: '账号错误,请重新输入' });
    if (role == 3) {
        var roles = ['member']
    }
    var getAssetsDefault = () => {
        return modelsBox.AssetsDefault.find({ state: 1 }).sort({ createdAt: -1 }).exec();
    }
    var initAssets = (data, userId) => {
        async.eachSeries(data, function (itemInfo, callback) {
            let item = _.extend({}, itemInfo);
            item.userId = userId;
            item.createdAt = Date.now();
            item.updatedAt = Date.now();
            item._id = utils.getUUID();
            modelsBox.Assets.create(item).then((assets) => {
                callback(null);
            }).catch((error) => {
                callback(error);
            })
        }, function (err) { throw err; });
    }
    var getMoneyTypeDefault = () => {
        return modelsBox.MoneyTypeDefault.find({ status: 1 }).sort({ createdAt: -1 }).exec();
    }
    var initMoney = (data, userId) => {
        async.eachSeries(data, function (itemInfo, callback) {
            let item = _.extend({}, itemInfo);
            item.userId = userId;
            item.createdAt = Date.now();
            item.updatedAt = Date.now();
            item._id = utils.getUUID();
            modelsBox.Money.create(item).then((money) => {
                callback(null);
            }).catch((error) => {
                callback(error);
            })
        }, function (err) { throw err; });
    }
    var getUserByPhone = (phone) => {
        return modelsBox.Users.findOne({ phone }).exec();
    }
    var createUser = (data) => {
        var user = { name: data.name, phone: data.phone, roles: data.roles, password: '', salt: '', token: '', userId: '', state: 1, createdAt: Date.now(), updatedAt: Date.now() }
        user.salt = utils.getUUID();
        user.password = utils.getPwd(data.password, user.salt);
        user.token = utils.getUUID();
        return modelsBox.Users.create(user).then((newUser) => {
            return newUser;
        }).catch((err) => {
            return err;
        })
    }
    var asyncFun = async () => {
        try {
            let getUserByPhoneOver = await getUserByPhone(phone);
            if (getUserByPhoneOver) return res.json({ 'code': 501, 'message': '当前手机号已注册' });
            var data = { name: username, phone, password, roles };
            let createUserOver = await createUser(data);
            if (!createUserOver) return res.json({ 'code': 500, 'message': '注册失败' });
            let userId = createUserOver._id;
            let getAssetsDefaultOver = await getAssetsDefault();
            await initAssets(getAssetsDefaultOver, userId);
            let getMoneyTypeDefaultOver = await getMoneyTypeDefault();
            await initMoney(getMoneyTypeDefaultOver, userId);
            await delete createUserOver.password;
            await delete createUserOver.salt;
            await res.json({ code: 200, user: createUserOver });
        } catch (err) {
            return res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        }
    }
    asyncFun();
})


router.post('/updateUser', (req, res, next) => {
    if (!req.$user) {
        res.json({ code: 1050, message: '账号已失效，请重新登录' });
    } else {
        let { _id, avatar, password, newPwd, newPwd2, note, name } = req.body;
        if (!name) return res.json({ code: 404, message: '姓名不能为空' });
        if (password && !newPwd) return res.json({ code: 404, message: '新密码不存在' });
        if (password && (password.length < 6)) return res.json({ code: 404, message: '密码长度不得小于6个字符' });
        if (password && newPwd && (newPwd.length < 6)) return res.json({ code: 404, message: '密码长度不得小于6个字符' });
        if (password && newPwd2 && (newPwd2.length < 6)) return res.json({ code: 404, message: '密码长度不得小于6个字符' });
        if (password && newPwd && (password == newPwd)) return res.json({ code: 404, message: '新密码与原密码相同' });
        if (password && newPwd && !newPwd2) return res.json({ code: 404, message: '两次密码不同，请确定后提交' });
        if (password && newPwd && newPwd2 && (newPwd != newPwd2)) return res.json({ code: 404, message: '两次密码不同，请确定后提交' });
        var user = () => {
            return modelsBox.Users.findOne({ _id, state: 1 }).exec();
        }
        var asyncFun = async () => {
            var userInfo = await user();
            if (!userInfo) return res.json({ code: 505, message: '当前用户不存在' });
            if (password) {
                var isPwd = utils.checkPwd(password, userInfo.salt, userInfo.password);
                if (!isPwd) return res.json({ code: 404, message: "旧密码错误，请重新输入" });
                var NewPwd = utils.getPwd(newPwd, userInfo.salt);
            }
            if (!avatar) avatar = "";
            var userData = { avatar, note, name };
            if (NewPwd) {
                userData.password = NewPwd;
            }
            modelsBox.Users.findOneAndUpdate({ _id, state: 1 }, { $set: userData }, { new: true }).then((newUser) => {
                var user = {
                    _id: newUser._id,
                    phone: newUser.phone,
                    name: newUser.name,
                    token: newUser.token,
                    userId: newUser.userId,
                    name: newUser.name,
                    note: newUser.note,
                    avatar: newUser.avatar,
                    state: newUser.state,
                    roles: newUser.roles,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt
                }
                res.json({ code: 200, message: "编辑成功", userInfo: user })
            }).catch((err) => {
                res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
            })
        }
        asyncFun();
    }
})

router.post('/getUserList', (req, res, next) => {
    if (!req.$user) {
        res.json({ code: 1050, message: '账号已失效，请重新登录' });
    } else {
        const { name, page, limit, roles } = req.body;
        let where = { state: 1 };
        if (name) {
            where.name = new RegExp(name);
        }
        if (roles !== "all") {
            where.roles = roles;
        }
        // _id: { $ne: req.$user._id },
        var users = () => {
            if (name) {
                return modelsBox.Users.find(where, { password: 0, salt: 0, token: 0 }).sort({ createdAt: -1 }).exec();
            } else {
                return modelsBox.Users.find(where, { password: 0, salt: 0, token: 0 }).sort({ createdAt: -1 }).exec();
            }
        }
        var asyncFun = async () => {
            var usersBox = await users();
            if (usersBox.length == 0) return res.json({ code: 200, users: usersBox, total: usersBox.length, message: '当前没有其他管理员，快去添加吧' });
            var usersShow = [];
            for (var i = ((page - 1) * limit); i < (page * limit); i++) {
                if (usersBox[i]) {
                    usersShow.push(usersBox[i]);
                } else {
                    break;
                }
            }
            res.json({ code: 200, users: usersShow, total: usersBox.length });
        }
        asyncFun();
    }
})

router.post('/resetPwd', (req, res, next) => {
    const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) {
        res.json({ code: 1050, message: '账号已失效，请重新登录' });
    } else {
        let { _id, password } = req.body;
        if (!password) return res.json({ code: 404, message: '密码不能为空' });
        var user = () => {
            return modelsBox.Users.findOne({ _id, state: 1 }).exec();
        }
        var asyncFun = async () => {
            var userInfo = await user();
            if (!userInfo) return res.json({ code: 505, message: '当前用户不存在' });
            var NewPwd = utils.getPwd(password, userInfo.salt);
            var userData = { password: NewPwd };
            modelsBox.Users.findOneAndUpdate({ _id, state: 0, createBy }, { $set: userData }, { new: true }).then((newUser) => {
                res.json({ code: 200, message: "重置成功" })
            }).catch((err) => {
                res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
            })
        }
        asyncFun();
    }
})
router.post('/createUserByAdmin', (req, res, next) => {
    if (!req.$user) {
        res.json({ code: 1050, message: '账号已失效，请重新登录' });
    } else {
        let { roles, phone, name } = req.body;
        if (!phone) return res.json({ code: 404, message: '账号不能为空' });
        if (!name) return res.json({ code: 404, message: '姓名不能为空' });
        var user = () => {
            return modelsBox.Users.findOne({ phone, state: 1 }).exec();
        }
        var asyncFun = async () => {
            var userInfo = await user();
            if (userInfo) return res.json({ code: 404, message: '当前手机号已注册' });
            let password = md5('111111');
            var data = { phone, roles, name, password };
            modelsBox.Users.createUser(data, (err, newUser) => {
                if (err) return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
                if (!newUser) return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
                delete newUser.password;
                delete newUser.salt;
                res.json({ code: 200, user: newUser });
            })
        }
        asyncFun();
    }
})
router.post('/removeUser', (req, res, next) => {
    // const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) {
        res.json({ code: 1050, message: '账号已失效，请重新登录' });
    } else {
        if (!req.body._id) return res.json({ code: 404, message: '删除失败' });
        modelsBox.Users.findOne({ _id: req.body._id, state: 1 }).then((user) => {
            if (!user) return res.json({ code: 505, message: '当前用户不存在' });
            modelsBox.Users.findOneAndDelete({ _id: req.body._id, state: 1 }).then(() => {
                res.json({ code: 200, message: "删除成功" })
            })
        }).catch((err) => {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        })
    }
})
module.exports = router;