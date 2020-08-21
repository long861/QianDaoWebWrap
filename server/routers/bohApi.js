var express = require('express');
var router = express.Router();
var models = require('../model/model').models;
var ecId = "xydSXCsZ38TqQshY7";
var domainId = "PFSvkHRcArfzJEuZt";
var commons = require('../model/common');
var _ = require('underscore')
const utils = require('../utils');
router.post('/notice', function (req, res, next) {
    console.log('===notice',req.body)
    let { type, bill_num, stable_code, rtable_code } = req.body;
    console.log('===============','type',type,'bill_num',bill_num, stable_code, rtable_code)
    if (!type) return res.json({ code: 4002, message: "type值不能为空" });
    if (!bill_num) return res.json({ code: 4002, message: "订单号不能为空" });
    let resData = { code: 200, type, bill_num };
    if (type == 2) {
        if (!stable_code) return res.json({ code: 4002, message: "原始台位不能为空" });
        if (!rtable_code) return res.json({ code: 4002, message: "新台位不能为空" });
        resData.stable_code = stable_code;
        resData.rtable_code = rtable_code;
    }
    res.json(resData)
})

module.exports = router;