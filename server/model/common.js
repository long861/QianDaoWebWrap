const commons = {
  // 按字符串生成颜色
  textToColor: (str) => {
    if (!str || str.length == 0)
      return false;

    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
    for (var i = 0, color = '#'; i < 3; color += ('00' + ((hash >> i++ * 2) & 0xFF)
      .toString(16))
      .slice(-2));
    return color;
  },
  // 生成uuid
  makeUUID: () => {
    return require('uuid/v4')().replace(/-/g, '');
  },
  // 生成二维码
  // getXcxQr: (Data) => {
  //   const {appId, path, models,width, is_hyaline,HTTP} = Data;
  //   models.XD_API.findOne({ appId:appId }).sort({ createtime: -1 }).then((api)=>{
  //     if(!api){
  //       return null;
  //     }
  //     var result = null;
  //     var data = { path, width: width || 430, is_hyaline: !!is_hyaline }
  //     try {
  //       result = HTTP.post('https://api.weixin.qq.com/wxa/getwxacode?access_token=' + api.access_token, { data, npmRequestOptions: { encoding: null } })
  //     } catch (e) {
  //       console.dir(e);
  //     }
  //     if (!result) return null;
  //     var filename = '/home/tmp/' + Random.id() + (is_hyaline ? '.png' : '.jpg')
  //     fs.writeFileSync(filename, result.content)
  //     var qrurl = Meteor.call('upload', filename)
  //     //删除临时文件
  //     fs.unlinkSync(filename);
  //     return qrurl;
  //   })
  // },
  // 获取请求端ip
  getClientIp: (req) => {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  },

}


module.exports = commons;