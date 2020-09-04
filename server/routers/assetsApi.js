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


router.post('/createAssetsDafult', (req, res, next)=> {
    if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    var data = req.body;
    if(!data._id){
        data.userId = req.$user._id;
        data.state = 1;
        modelsBox.AssetsDefault.create(data).then((assets)=>{
            return res.json({code:200,message:'success',assets});
        }).catch((error)=>{
            return res.json({code:500,message:'系统错误',error})
        })
    }else{
        let {_id,updatedAt,userId,color,title,type,cover} = data;
        userId = req.$user._id;
        var dataUpdate = {updatedAt:Date.now(),userId,color,title,type,cover};
        modelsBox.AssetsDefault.findOne({_id}).then((assets)=>{
            if(!assets) return res.json({code:403,message:'该资产已被删除'});
            modelsBox.AssetsDefault.findOneAndUpdate({_id},{ $set: dataUpdate }, { multi: true }).then((newAssets)=>{
                return res.json({code:200,message:'success',assets:newAssets});
            })
        }).catch((error)=>{
            return res.json({code:500,message:'系统错误',error})
        })
    }
    
})
router.post('/getAssetsDefault', (req, res, next)=> {
    // if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    const { page, limit } = req.body;
    var allAssetsTypes = () => {
        return modelsBox.AssetsDefault.find({}).sort({ createdAt: -1 }).exec();
    }
    var limitAssetsTypes = () => {
        return modelsBox.AssetsDefault.find({}).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }).exec();
    }
    var asyncFun = async () => {
        try {
            var assetsBox = await allAssetsTypes();
            var assets = await limitAssetsTypes();
            res.json({ code: 200, assets, total: assetsBox.length,message:'success' });
        } catch (err) {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });
        }

    }
    asyncFun();
})
router.post('/assetsInfoById', (req, res, next)=> {
    // if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    let {_id} = req.body;
    if (!_id) return res.json({ code: 403, message: '入参错误' });
    modelsBox.AssetsDefault.findOne({_id}).then((assets)=>{
        return res.json({code:200,message:'success',assets});
    }).catch((error)=>{
        return res.json({code:500,message:'系统错误',error})
    })
})
router.post('/removeAssetsTypeDefault', (req, res, next)=> {
    // if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    let {_id} = req.body;
    if (!_id) return res.json({ code: 403, message: '入参错误' });
    modelsBox.AssetsDefault.findOne({_id}).then((assets)=>{
        // return res.json({code:200,message:'success',assets});
        if (!assets) return res.json({ code: 403, message: '该资产类型已被删除' });
        modelsBox.AssetsDefault.findOneAndDelete({ _id }).then(() => {
            return res.json({ code: 200, message: '删除完成' });
        })
    }).catch((error)=>{
        return res.json({code:500,message:'系统错误',error})
    })
})
router.post('/searchAssetsTypesDefault', (req, res, next)=> {
    // if (!req.$user) return res.json({ code: 1050, message: '账号已失效，请重新登录' });
    let { limit, page, title, type } = req.body;
    if(!page){
        page = 1;
    }
    if(!limit){
        limit=10;
    }
    var where = {type};
    if(title){
        where.title = new RegExp(title);
    }
    let allAssetsTypes = () => {
        return modelsBox.AssetsDefault.find(where).exec();
    }
    let limitAssetsTypes = () => {
        return modelsBox.AssetsDefault.find(where).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).exec();
    }
    var asyncFun = async () => {
        try {
            var assetsBox = await allAssetsTypes();
            var assets = await limitAssetsTypes();
            res.json({ code: 200, assets, total: assetsBox.length ,message:'success'});
        } catch (err) {
            res.json({ 'code': 500, 'err': err, 'message': '系统错误' });

        }
    }
    asyncFun();
})



module.exports = router;