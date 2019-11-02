import Vue from 'vue'
import moment from 'moment';
//定义一个全局过滤器实现日期格式化

// import _ from 'underscore' 
import VCharts from 'v-charts'
import BaiduMap from 'vue-baidu-map'
import ElementUI from 'element-ui'
import "../static/css/weui.css"
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import App from './App'
import router from './router'
import store from './store'
import contentmenu from 'v-contextmenu'
import i18n from './lang'
import { global } from '@/global/global'
import { oadStyle } from './utils/util'
// import { iconfontUrl, iconfontVersion } from '@/config/env'
import * as filters from './filters' // global filters

import '../static/css/iconfont/1.0.0/index.css' /* icofont*/
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
// import './mock' // simulation data
import './errorLog'// error log

import '@/styles/index.scss' // global css
import '@/assets/library/font-awesome-4.7.0/css/font-awesome.min.css'
import '@/icons' // icon
import '@/permission' // permission control

Vue.use(VCharts)
Vue.use(contentmenu)
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI, { size: 'medium', i18n: (key, value) => i18n.t(key, value) })
Vue.use(BaiduMap, { ak: 'oW2UEhdth2tRbEE4FUpF9E5YVDCIPYih' }) // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */

import VueQrcode from '@xkeshi/vue-qrcode'
Vue.component('qrcode', VueQrcode);
var protocol = window.location.protocol;
var host = window.location.host;
var shost = host == 'localhost:9528' ? 'https://shh.xidong360.com' : `${protocol}//${host}`;
import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
  debug: true,
  connection: shost,
  // connection: 'http://localhost:2300',
  vuex: {
    store,
    actionPrefix: 'socket_',
    mutationPrefix: 'SOCKET_'
  },
}));
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.filter('momentTime', function (date, formatType) {
  moment.updateLocale('zh_cn', {
    weekdays: [
      "周日", "周一", "周二", "周三", "周四", "周五", "周六",
    ]
  });
  moment.locale('zh_cn');
  formatType = typeof formatType == 'string' ? formatType : 'YYYY年MM月DD日 HH:mm:ss';
  var res = moment(date).format(formatType);
  return res;
})
// iconfontVersion.forEach(ele => {
//   loadStyle(iconfontUrl.replace('$key', ele))
// })

// 加载用户主题
if (localStorage.getItem('themeValue')) {
  global.changeTheme(localStorage.getItem('themeValue'))
} else {
  global.changeTheme('default')
}
import axios from 'axios';
Vue.prototype.$axios = axios;
Vue.prototype._host_ = host;
Vue.config.productionTip = false
window.Vue = Vue;
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
