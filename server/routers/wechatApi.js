var express = require('express');
var router = express.Router();
var modelsBox = require('../model/modelsBox').models;
var _ = require('underscore');
var utils = require('../utils');
var md5 = require("md5");
var async = require('async');
let axios = require('axios');
var crypto =  require('crypto');
var config = require('../model/config').CONFIG;
console.log('=======config',config);

let AppID = "wxe58e2ce45ad2c431";
let AppSecret = "6898f32db2ec708446e4a29d994348f6";
let Token = "longshen123";
let EncodingAESKey = "qfoM4eKtn2cgO9DT4cJSYQsIJyC4gm4cIw6cmv99pAz";

// router.post('/getToken', (req, res, next) => {
//     console.log('===getToken');
//     // const { createBy, creator } = utils.getCreator(req.headers);
//     // if (!req.$user) {
//     //     res.json({ code: 1050, message: '账号已失效，请重新登录' });
//     // } else {

//     // }
//     let data = {
//         grant_type: "client_credential",
//         appid: AppID,
//         secret: AppSecret
//     }
//     console.log('===data',data)
//     axios.get("https://api.weixin.qq.com/cgi-bin/token", { params: data }).then((tokenRes)=>{
//         console.log('=====token',tokenRes)
//     })
// })

router.get('/',function(req,res){
  // console.log(req)
  //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
  var signature = req.query.signature,//微信加密签名
      timestamp = req.query.timestamp,//时间戳
          nonce = req.query.nonce,//随机数
        echostr = req.query.echostr;//随机字符串

        console.log('=====signature',signature)
  //2.将token、timestamp、nonce三个参数进行字典序排序
  var array = [config.token,timestamp,nonce];
  array.sort();

  //3.将三个参数字符串拼接成一个字符串进行sha1加密
  var tempStr = array.join('');
  const hashCode = crypto.createHash('sha1'); //创建加密类型 
  var resultCode = hashCode.update(tempStr,'utf8').digest('hex'); //对传入的字符串进行加密

  //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if(resultCode === signature){
    console.log('=====测试',resultCode)
      res.send(echostr);
  }else{
      res.send('mismatch');
  }
});
module.exports = router;