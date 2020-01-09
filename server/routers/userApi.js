var express = require('express');
var router = express.Router();
var models = require('../model/model').models;
var modelsBox = require('../model/modelsBox').models;
var ecId = "xydSXCsZ38TqQshY7";
var domainId = "PFSvkHRcArfzJEuZt";
var commons = require('../model/common');
var _ = require('underscore');
var HTTP = require('http');
var Config = require('../model/config');
var utils = require('../utils');
var md5 = require("md5");

router.post('/register', (req, res, next) => {
    console.log('======register', req.body);
    const { username, password, pwd, role, phone } = req.body;
    if (!username) return res.json({ code: 403, message: '账号不存在,请重新输入' });
    if (!phone) return res.json({ code: 403, message: '手机号不存在，请重新输入' });
    if (!password) return res.json({ code: 403, message: '密码不能为空' });
    if (!pwd) return res.json({ code: 403, message: '验证密码不能为空' });
    if (password !== pwd) return res.json({ code: 403, message: '两次密码不相同' });
    if (!role) return res.json({ code: 403, message: '账号错误,请重新输入' });
    if (role == 1) {
        var roles = ['admin'];
    } else {
        var roles = ['editor']
    }
    modelsBox.Users.getUserByPhone(phone, (err, user) => {
        if (err) return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
        if (user) return res.json({ 'code': 501, 'message': '当前手机号已注册' });
        var data = { name: username, phone, password, roles };
        console.log('--------data', data);
        modelsBox.Users.createUser(data, (err, newUser) => {
            if (err) return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
            if (!newUser) return res.json({ 'err': err, 'code': 500, 'message': '系统错误' });
            delete newUser.password;
            delete newUser.salt;
            res.json({ code: 200, user: newUser });
        })
    })

})
router.post('/login', (req, res, next) => {
    // const { createBy, creator } = utils.getCreator(req.headers);
    console.log('=======ceshi', req.body)
    let { phone, password } = req.body;
    console.log('=======ceshi', req.body)
    if (!phone) return res.json({ code: 403, message: '账号未填写' });
    if (!password) return res.json({ code: 403, message: '密码未填写' });
    var UserGet = () => {
        return modelsBox.Users.findOne({ phone }).exec();
    }
    var asyncFun = async () => {
        try {
            let user = await UserGet();
            if (!user) return res.json({ code: 403, message: '账号错误,请重新输入' });
            let checkPwd = await utils.checkPwd(password, user.salt, user.password);
            if (!checkPwd) return res.json({ code: 403, message: '密码错误,请重新输入' });
            if (user.state == 0) return res.json({ code: 403, message: '账号正在审核，请稍后登录' });
            var token = utils.getUUID();
            modelsBox.Users.findOneAndUpdate({ _id: user._id, state: 1 }, { $set: { token } }, { new: true }).then((newUser) => {
                if (!newUser) return res.json({ code: 403, message: '账号不存在' });
                var User = {
                    _id: newUser._id,
                    name: newUser.name,
                    token: newUser.token,
                    userId: newUser.userId,
                    name: newUser.name,
                    note: newUser.note,
                    avatar: newUser.avatar,
                    state: newUser.state,
                    roles: newUser.roles,
                    // role: newUser.role,
                    createdAt: newUser.createdAt,
                    updatedAt: Date.now()
                }
                return res.json({ code: 200, user: User });
            })
        } catch (err) {
            return res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        }
    }
    asyncFun()
})

router.post('/getInfo', (req, res, next) => {
    // const { createBy, creator } = utils.getCreator(req.headers);
    if (req.$user) {
        modelsBox.Users.findOne({ _id: req.$user._id, state: 1 }).then((user) => {
            if (!user) return res.json({ code: 500, message: '账号不存在' });
            var newUser = {
                _id: user._id,
                phone: user.phone,
                name: user.name,
                token: user.token,
                userId: user.userId,
                name: user.name,
                note: user.note,
                avatar: user.avatar,
                state: user.state,
                roles: user.roles,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
            return res.json({ code: 200, user: newUser });
        }).catch((err) => {
            return res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        })
    } else {
        return res.json({ code: 505, message: '账号不存在' });
    }
})

router.post('/updateUser', (req, res, next) => {
    // const { createBy, creator } = utils.getCreator(req.headers);
    if (!req.$user) {
        res.json({ code: 1050, message: '账号已失效，请重新登录' });
    } else {
        let { _id, avatar, password, newPwd, newPwd2, note, name, roles } = req.body;
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
            var userData = { avatar, note, roles, name };
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
        let { roles,phone,name } = req.body;
        if (!phone ) return res.json({ code: 404, message: '账号不能为空' });
        if (!name) return res.json({ code: 404, message: '姓名不能为空' });
        var user = () => {
            return modelsBox.Users.findOne({ phone, state: 1 }).exec();
        }
        var asyncFun = async () => {
            var userInfo = await user();
            if (userInfo) return res.json({ code: 404, message: '当前手机号已注册' });
            let password = md5('111111');
            var data = { phone, roles, name,password };
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
// router.post('/updateUser', (req, res, next) => {
//     const { createBy, creator } = utils.getCreator(req.headers);
//     if (!req.$user) {
//         res.json({ code: 1050, message: '账号已失效，请重新登录' });
//     } else {
//         let { _id, avatar, password, newPwd, newPwd2, introduction, name, roles } = req.body;
//         if (!name) return res.json({ code: 404, message: '姓名不能为空' });
//         if (password && !newPwd) return res.json({ code: 404, message: '新密码不存在' });
//         if (password && (password.length < 6)) return res.json({ code: 404, message: '密码长度不得小于6个字符' });
//         if (password && newPwd && (newPwd.length < 6)) return res.json({ code: 404, message: '密码长度不得小于6个字符' });
//         if (password && newPwd2 && (newPwd2.length < 6)) return res.json({ code: 404, message: '密码长度不得小于6个字符' });
//         if (password && newPwd && (password == newPwd)) return res.json({ code: 404, message: '新密码与原密码相同' });
//         if (password && newPwd && !newPwd2) return res.json({ code: 404, message: '两次密码不同，请确定后提交' });
//         if (password && newPwd && newPwd2 && (newPwd != newPwd2)) return res.json({ code: 404, message: '两次密码不同，请确定后提交' });
//         var user = () => {
//             return models.ShhUsers.findOne({ _id, state: 0, createBy }).exec();
//         }
//         var asyncFun = async () => {
//             var userInfo = await user();
//             if (!userInfo) return res.json({ code: 505, message: '当前用户不存在' });
//             if (password) {
//                 var isPwd = utils.checkPwd(password, userInfo.salt, userInfo.password);
//                 if (!isPwd) return res.json({ code: 404, message: "旧密码错误，请重新输入" });
//                 var NewPwd = utils.getPwd(newPwd, userInfo.salt);
//             }
//             if (!avatar) avatar = "";
//             var userData = { avatar, introduction, roles, name };
//             if (NewPwd) {
//                 userData.password = NewPwd;
//             }
//             models.ShhUsers.findOneAndUpdate({ _id, state: 0, createBy }, { $set: userData }, { new: true }).then((newUser) => {
//                 res.json({ code: 200, message: "编辑成功" })
//             }).catch((err) => {
//                 res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
//             })
//         }
//         asyncFun();
//     }
// })

// router.post('/removeUser', (req, res, next) => {
//     const { createBy, creator } = utils.getCreator(req.headers);
//     if (!req.$user) {
//         res.json({ code: 1050, message: '账号已失效，请重新登录' });
//     } else {
//         models.ShhUsers.findOne({ _id: req.body._id, state: 0, createBy }).then((user) => {
//             if (!user) return res.json({ code: 505, message: '当前用户不存在' });
//             models.ShhUsers.findOneAndUpdate({ _id: req.body._id, state: 0, createBy }, { $set: { state: 1 } }, { new: true }).then((newUser) => {
//                 res.json({ code: 200, message: "删除成功" })
//             })
//         }).catch((err) => {
//             res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
//         })
//     }
// })

// router.post('/createUser', (req, res, next) => {
//     const { createBy, creator } = utils.getCreator(req.headers);
//     if (!req.$user) {
//         res.json({ code: 1050, message: '账号已失效，请重新登录' });
//     } else {
//         const { username, roles, name } = req.body;
//         if (_.isEmpty(username)) return res.json({ 'code': 400, message: '账号不能为空' });
//         var isUserName = utils.isPhoneNo(username);
//         if (!isUserName) return res.json({ 'code': 400, message: '账号格式错误' });
//         var user = () => {
//             return models.Users.findOne({ mobile: username }).exec();
//         }
//         var ShhUser = () => {
//             return models.ShhUsers.findOne({ username, createBy }).exec();
//         }
//         var ShhUser2 = (userId) => {
//             return models.ShhUsers.findOne({ userId, createBy }).exec();
//         }
//         var createShhUser = (data) => {
//             var Pwd = utils.getPwd(username, data.salt);
//             data.password = Pwd;
//             return models.ShhUsers.create(data);
//         }
//         var createUser = (username, name) => {
//             return models.Users.create({ mobile: username, name, createdAt: new Date() });
//         }
//         var ShhUserByUserId = (userId) => {
//             return models.ShhUsers.findOne({ userId, createBy }).exec();
//         }
//         var ShhUserUpdate = (userId, data) => {
//             var Pwd = utils.getPwd(username, data.salt);
//             data.password = Pwd;
//             return models.ShhUsers.findOneAndUpdate({ userId, createBy }, { $set: data }, { new: true });
//         }
//         var asyncFun = async () => {
//             var userGet = await user();
//             var userbyCreate;
//             if (!userGet) {
//                 userbyCreate = await createUser(username, name);
//             }
//             var userInfo = userGet || userbyCreate;
//             userInfo.name = userInfo.name || "";
//             var ShhUserGet = await ShhUser();
//             if (!ShhUserGet) ShhUserGet = await ShhUser2(userInfo._id);
//             if (ShhUserGet) return res.json({ code: 400, message: '账号/手机号已注册，请重新添加' });
//             var ShhUserByUserIdGet = await ShhUserByUserId(userInfo._id);
//             if (!ShhUserByUserIdGet) {
//                 var data = { mobile: username, "username": username, name, createBy, userId: userInfo._id, state: 0, roles, avatar: "", introduction: "" };
//                 data.salt = utils.getUUID();
//                 data.createdAt = Date.now();
//                 data.token = utils.getUUID();
//                 var createShhUserOver = await createShhUser(data);
//                 if (!createShhUserOver) return res.json({ code: 500, message: '系统错误' });
//                 res.json({ code: 200, message: '添加成功' });
//             } else {
//                 if (ShhUserByUserIdGet.state == 0) return res.json({ code: 400, message: '该手机号已注册，请重新添加' });
//                 var data = { mobile: username, "username": username, name, createBy, userId: userInfo._id, state: 0, roles, avatar: "", introduction: "" };
//                 data.salt = utils.getUUID();
//                 data.createdAt = Date.now();
//                 data.token = utils.getUUID();
//                 var ShhUserUpdateOver = await ShhUserUpdate(userInfo._id, data);
//                 if (!ShhUserUpdateOver) return res.json({ code: 500, message: '系统错误' });
//                 res.json({ code: 200, message: '添加成功' });
//             }
//         }
//         asyncFun();
//     }
// })

// router.post('/updateUserBySelf', (req, res, next) => {
//     const { createBy, creator } = utils.getCreator(req.headers);
//     if (!req.$user) {
//         res.json({ code: 1050, message: '账号已失效，请重新登录' });
//     } else {
//         const { _id, username, avatar, introduction, name, password, newPwd, newPwd2 } = req.body;
//         if (!name) return res.json({ code: 404, message: '姓名不能为空' });
//         if (password && !newPwd) return res.json({ code: 404, message: '新密码不存在' });
//         if (password && (password.length < 6)) return res.json({ code: 404, message: '密码长度不得小于6个字符' });
//         if (password && newPwd && (newPwd.length < 6)) return res.json({ code: 404, message: '密码长度不得小于6个字符' });
//         if (password && newPwd2 && (newPwd2.length < 6)) return res.json({ code: 404, message: '密码长度不得小于6个字符' });
//         if (password && newPwd && (password == newPwd)) return res.json({ code: 404, message: '新密码与原密码相同' });
//         if (password && newPwd && !newPwd2) return res.json({ code: 404, message: '两次密码不同，请确定后提交' });
//         if (password && newPwd && newPwd2 && (newPwd != newPwd2)) return res.json({ code: 404, message: '两次密码不同，请确定后提交' });
//         var user = () => {
//             return models.ShhUsers.findOne({ _id, state: 0, createBy }).exec();
//         }
//         var userUpdate = (data, _id) => {
//             return models.ShhUsers.findOneAndUpdate({ _id, createBy }, { $set: data }, { new: true });
//         }
//         var asyncFun = async () => {
//             var userGet = await user();
//             if (!userGet) return res.json({ code: 505, message: '该账号已被删除' });
//             if (password) {
//                 var isPwd = utils.checkPwd(password, userGet.salt, userGet.password);
//                 if (!isPwd) return res.json({ code: 404, message: "旧密码错误，请重新输入" });
//                 var NewPwd = utils.getPwd(newPwd, userGet.salt);
//             }
//             var data = { state: 0, avatar, introduction, name, updatedAt: Date.now() };
//             if (NewPwd) {
//                 data.password = NewPwd;
//             }
//             var userUpdateGet = await userUpdate(data, _id);
//             if (!userUpdateGet) return res.json({ code: 500, message: '系统错误' });
//             var userInfo = {
//                 _id: userUpdateGet._id,
//                 name: userUpdateGet.name,
//                 token: userUpdateGet.token,
//                 userId: userUpdateGet.userId,
//                 username: userUpdateGet.username,
//                 introduction: userUpdateGet.introduction,
//                 avatar: userUpdateGet.avatar,
//                 state: userUpdateGet.state,
//                 roles: userUpdateGet.roles,
//                 createdAt: userUpdateGet.createdAt,
//                 updatedAt: userUpdateGet.updatedAt
//             }
//             res.json({ code: 200, users: userInfo, message: '修改成功' });
//         }
//         asyncFun();
//     }
// })
module.exports = router;