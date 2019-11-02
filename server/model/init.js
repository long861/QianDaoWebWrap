var models = require('./model').models;
var async = require('async');
var ecId = "xydSXCsZ38TqQshY7";
var domainId = "PFSvkHRcArfzJEuZt";
const init = {
  // addGameId: () => {
  //     models.ItemMarkers.update({ itemId: 'K7WmS9RCqqB2dbo6T' }, { $set: { gameId: ['d93e452968b2419f940ae43b12005107'] } }, { multi: true }).then((data) => {
  //         console.log('itemsMap', data);
  //     }).catch((err) => {
  //         console.log('err', err)
  //     })
  // },
  // addAttr: () => {
  //     models.ItemMarkers.update({ itemId: 'K7WmS9RCqqB2dbo6T' }, { $set: { markerAttr: 2 } }, { multi: true }).then((data) => {
  //         console.log('itemsMap', data);
  //     }).catch((err) => {
  //         console.log('err', err)
  //     })
  // }
  changDate: () => {
    var markers = () => {
      return models.ItemMarkers.find({ itemId: 'b352614014a44a46bae0dbbe318b99d9' }).exec();
    }
    var newMarkers = (Markers) => {
      // for (var i = 0; i < Markers.length; i++) {
      //   var time = Date.now(Markers[i].created);
      //   models.MarkersDefault.update({ _id: Markers[i]._id }, { $set: { created: time } }).then((result) => {
      //     console.log('result', result)
      //   });
      // }
      async.eachSeries(Markers, function (marker, callback) {
        var time = marker.created.getTime();
        models.MarkersDefault.update({ _id: marker._id, createBy: 'shh' }, { $set: { createBy: 'shh' } }).then(result => {
          console.log('result', result)
          callback(null);
        }).catch(e => {
          callback(e);
        });
      }, function (err) {

      });
    }
    var asyncFun = async () => {
      var Markers = await markers();
      newMarkers(Markers);
    }
    asyncFun();
  },
  changeNews() {
    var news = () => {
      return models.GameNews.find({ domainId, ecId, state: 0, }).exec();
    }
    var newNews = (news) => {
      async.eachSeries(news, function (newItem, callback) {
        models.GameNews.update({ _id: newItem._id }, { $set: { from: 3 } }, { new: true }).then(result => {
          callback(null);
        }).catch(e => {
          callback(e);
        });
      }, function (err) {
      });
    }
    var asyncFun = async () => {
      var News = await markers();
      newNews(News);
    }
    asyncFun();
  },
  // changemarkers() {
  //   models.ItemMarkers.update({itemId:'b352614014a44a46bae0dbbe318b99d9' }, { $set: { createBy: 'shh' } }, { multi: true }).then((data) => {
  //     console.log('itemsMapOver');
  //   }).catch((err) => {
  //     console.log('err', err)
  //   })
  // },
}
// init.changDate();
module.exports = init;