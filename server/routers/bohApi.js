var express = require('express');
var router = express.Router();
router.post('/notice', function (req, res, next) {
    let { type, bill_num, stable_code, rtable_code } = req.body;
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