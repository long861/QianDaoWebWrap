var express = require('express');
var router = express.Router();
var multer = require("multer");
var fs = require('fs');
var path = require('path');
var request = require('request');
var upload = multer({ dest: "../uploads" });

// Upload to server
router.post('/One', upload.single("file"), function (req, res, next) {
    if (req.method === "POST") {
        var uploadFile = req.file;
        if (uploadFile) {
            // path.extname
            // var extname = path.extname(uploadFile.originalname);
            uploadFuc(uploadFile.path, uploadFile.originalname, function (err, data) {
                if (!err) {
                    var result = { code: 0, data };
                    res.set({
                        "access-control-allow-origin": "*",
                        "access-control-allow-methods": "GET, POST, OPTIONS",
                        "access-control-allow-headers": "content-type"
                    });
                    res.end(JSON.stringify(result));
                } else {
                    var result = { code: 1, msg: "上传失败" };
                    res.end(JSON.stringify(result));
                }
            });
        } else {
            var result = { code: 2, msg: "参数错误" };
            res.end(JSON.stringify(result));
        }
    } else if (req.method.toUpperCase() === "OPTIONS") {
        var origin = (req.headers.origin || "*");
        res.set({
            "access-control-allow-origin": origin,
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type",
            "access-control-max-age": 10, // Seconds.
            "content-length": 0
        });
        res.status(204).send('No Content');
        res.end();
    } else {
        next();
    }
})

function uploadFuc(filepath, filename, callback) {
    var options = { url: "https://cdn.xidong360.com/upload", timeout: 300000 };
    var r = request.post(options, function (err, res, body) {
        if (!err) {
            try {
                if (typeof body == "string") body = JSON.parse(body);
                if (body.code == 0) {
                    callback(null, body.data);
                }
                else {
                    callback(null, "");
                }
            }
            catch (e) {
                callback(null, "");
            }
        }
        else {
            callback(null, "");
        }
    });
    var form = r.form();
    form.append('name', 'file');
    form.append('file', fs.createReadStream(filepath), { filename: filename });
}




module.exports = router;