var express = require('express');
var router = express.Router();
var modelsBox = require('../model/modelsBox').models;
var _ = require('underscore');
var utils = require('../utils');
var md5 = require("md5");
var async = require('async');
let axios = require('axios');


let AppID = "wx45fb80e9e9fe5a68";
let AppSecret = "a4ac3758d3c3c1a8892a5b1ba27dc1e5";
let Token = "longshen123";
let EncodingAESKey = "qfoM4eKtn2cgO9DT4cJSYQsIJyC4gm4cIw6cmv99pAz";

router.post('/getToken', (req, res, next) => {
    console.log('===getToken');
    // const { createBy, creator } = utils.getCreator(req.headers);
    // if (!req.$user) {
    //     res.json({ code: 1050, message: '账号已失效，请重新登录' });
    // } else {

    // }
    let data = {
        grant_type: "client_credential",
        appid: AppID,
        secret: AppSecret
    }
    console.log('===data',data)
    axios.get("https://api.weixin.qq.com/cgi-bin/token", { params: data }).then((tokenRes)=>{
        console.log('=====token',tokenRes)
    })
})
module.exports = router;