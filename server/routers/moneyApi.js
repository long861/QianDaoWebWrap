var express = require('express');
var router = express.Router();
// var models = require('../model/model').models;
var modelsBox = require('../model/modelsBox').models;
// var ecId = "xydSXCsZ38TqQshY7";
// var domainId = "PFSvkHRcArfzJEuZt";
var commons = require('../model/common');
var _ = require('underscore');
var HTTP = require('http');
var Config = require('../model/config');
var utils = require('../utils');

router.post('/createMoneyTypeDafult', (req, res, next) => {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    var data = req.body;
    console.log('====data', data);
    if(!data.cover) return res.json({ code: 403, message: '封面图片不能为空' });
    if(!data._id){
        data.userId = req.$user._id;
        modelsBox.MoneyTypeDefault.create(data).then((moneyTypes)=>{
            return res.json({code:200,message:'success',moneyTypes});
        }).catch((error)=>{
            return res.json({code:500,message:'系统错误',error})
        })
    }else{
        let {_id,userId,title,type,cover,status} = data;
        userId = req.$user._id;
        var dataUpdate = {updatedAt:Date.now(),userId,title,type,cover,status};
        modelsBox.MoneyTypeDefault.findOne({_id}).then((moneyTypes)=>{
            if(!moneyTypes) return res.json({code:403,message:'该收支已被删除'});
            modelsBox.MoneyTypeDefault.findOneAndUpdate({_id},{ $set: dataUpdate }, { multi: true }).then((newMoneyTypes)=>{
                return res.json({code:200,message:'success',moneyTypes:newMoneyTypes});
            })
        }).catch((error)=>{
            return res.json({code:500,message:'系统错误',error})
        })
    }

})
router.post('/getMoneyTypeDefault', (req, res, next) => {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    modelsBox.MoneyTypeDefault.find({}).sort({ createdAt: -1 }).then((moneyTypes) => {
        return res.json({ code: 200, message: 'success', moneyTypes });
    }).catch((error) => {
        return res.json({ code: 500, message: '系统错误', error })
    })
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



module.exports = router;