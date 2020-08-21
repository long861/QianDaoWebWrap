var express = require('express');
var router = express.Router();
var modelsBox = require('../model/modelsBox').models;
var commons = require('../model/common');
var _ = require('underscore');
var HTTP = require('http');
var Config = require('../model/config');
var utils = require('../utils');

router.post('/createMoneyTypeDafult', (req, res, next) => {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    var data = req.body;
    console.log('====data', data);
    if (!data.cover) return res.json({ code: 403, message: '封面图片不能为空' });
    if (!data._id) {
        data.userId = req.$user._id;
        modelsBox.MoneyTypeDefault.create(data).then((moneyTypes) => {
            return res.json({ code: 200, message: 'success', moneyTypes });
        }).catch((error) => {
            return res.json({ code: 500, message: '系统错误', error })
        })
    } else {
        let { _id, userId, title, type, cover, status } = data;
        userId = req.$user._id;
        var dataUpdate = { updatedAt: Date.now(), userId, title, type, cover, status };
        modelsBox.MoneyTypeDefault.findOne({ _id }).then((moneyTypes) => {
            if (!moneyTypes) return res.json({ code: 403, message: '该收支已被删除' });
            modelsBox.MoneyTypeDefault.findOneAndUpdate({ _id }, { $set: dataUpdate }, { multi: true }).then((newMoneyTypes) => {
                return res.json({ code: 200, message: 'success', moneyTypes: newMoneyTypes });
            })
        }).catch((error) => {
            return res.json({ code: 500, message: '系统错误', error })
        })
    }

})
router.post('/getMoneyTypeDefault', (req, res, next) => {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { page, limit } = req.body;
    var allMoneyTypes = () => {
        return modelsBox.MoneyTypeDefault.find({}).sort({ createdAt: -1 }).exec();
    }
    var limitMoneyTypes = () => {
        return modelsBox.MoneyTypeDefault.find({}).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }).exec();
    }
    var asyncFun = async () => {
        try {
            var moneyTypesBox = await allMoneyTypes();
            var moneyTypes = await limitMoneyTypes();
            res.json({ code: 200, moneyTypes, total: moneyTypesBox.length });
        } catch (err) {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        }

    }
    asyncFun();
})
router.post('/MoneyTypeInfoById', (req, res, next) => {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    let { _id } = req.body;
    if (!_id) return res.json({ code: 403, message: '入参错误' });
    modelsBox.MoneyTypeDefault.findOne({ _id }).then((moneyTypes) => {
        return res.json({ code: 200, message: 'success', moneyTypes });
    }).catch((error) => {
        return res.json({ code: 500, message: '系统错误', error })
    })
})
router.post('/removeMoneyTypeDefault', (req, res, next) => {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    let { _id } = req.body;
    if (!_id) return res.json({ code: 403, message: '入参错误' });
    modelsBox.MoneyTypeDefault.findOne({ _id }).then((moneyTypes) => {
        if (!moneyTypes) return res.json({ code: 403, message: '该收支类型已被删除' });
        modelsBox.MoneyTypeDefault.findOneAndDelete({ _id }).then(() => {
            return res.json({ code: 200, message: '删除完成' });
        })
    }).catch((error) => {
        return res.json({ code: 500, message: '系统错误', error })
    })
})
router.post('/searchMoneyTypes', (req, res, next) => {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { limit, page, title, type } = req.body;
    var where = {type};
    if(title){
        where.title = new RegExp(title);
    }
    let allMoneyTypes = () => {
        return modelsBox.MoneyTypeDefault.find(where).exec();
    }
    let limitMoneyTypes = () => {
        return modelsBox.MoneyTypeDefault.find(where).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).exec();
    }
    var asyncFun = async () => {
        try {
            var moneyTypesBox = await allMoneyTypes();
            var moneyTypes = await limitMoneyTypes();
            res.json({ code: 200, moneyTypes, total: moneyTypesBox.length });
        } catch (err) {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });

        }
    }
    asyncFun();
})




module.exports = router;