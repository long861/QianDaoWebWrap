var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var serveStatic = require('serve-static');
var matchApi = require('./routers/matchApi');
var lineApi = require('./routers/lineApi');
var uploadApi = require('./routers/uploadApi');
var markerApi = require('./routers/markerApi');
var parkApi = require('./routers/parkApi');
var userApi = require('./routers/userApi');
var checkApi = require('./routers/check');
var qrlogin = require('./routers/qrlogin');
var themeApi = require('./routers/themeApi');

//new 
var assetsApi = require('./routers/assetsApi');
var moneyApi = require('./routers/moneyApi');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socketio = require('./socket.io.js');
io.on('connection', socketio.connect);


app.use(logger(':date[iso] :method :url :status :response-time ms - :res[content-length]'));
// app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serveStatic(path.join(__dirname, '../public')));
app.use(serveStatic(path.join(__dirname, '../dist')));
app.use(compression({ filter: shouldCompress }));
app.get("/qrcode/:random", qrlogin);
app.use(checkApi);
app.use('/api/match', matchApi);
app.use('/api/matchLines', lineApi);
app.use('/api/upload', uploadApi);
app.use('/api/marker', markerApi);
app.use('/api/park', parkApi);
app.use('/api/user', userApi);
app.use('/api/theme', themeApi);

//new
app.use('/api/assets',assetsApi);
app.use('/api/money',moneyApi);

var port = (process.env.PORT || 2300);
var host = (process.env.BIND_IP || 'localhost');
server.listen(port, host, function () {
  console.log(`Express server listening on http://${host}:${port}`);
});
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
}
