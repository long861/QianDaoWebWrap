var titles = {
  'shh.xidong360.com': '钱道',
  'localhost:9526': '钱道',
  'aidingxiang.xidong360.com': 'AI定向',
}
var logos = {
  'shh.xidong360.com': 'https://cdn.xidong360.com/dxs/shh/shhlogo.jpg',
  'localhost:9526': 'https://cdn.xidong360.com/dxs/shh/shhlogo.jpg',
  'aidingxiang.xidong360.com': 'https://cdn.xidong360.com/dxs/ai/logo.png',
}
var lists = {
  'shh.xidong360.com': [
    '是以“科技生态”为主题，建设一个完全不同于传统的崭新园博会展区，同时建设一座既先于城市又融于城市的中央公园。',
    '第十一届郑州园博会的重要组成部分。',
    '双鹤湖中央公园规划设计以本地出土的青铜器代表作莲鹤方壶为创意起点。'
  ],
  'localhost:9526': [
   '省钱有道，是为钱道；',
   '记录生活中中的点点滴滴，生活开支一览无余，是为钱道；',
   '计划消费，是为钱道！！！'
  ],
  'aidingxiang.xidong360.com': [
    '是以“科技生态”为主题，建设一个完全不同于传统的崭新园博会展区，同时建设一座既先于城市又融于城市的中央公园。',
    '第十一届郑州园博会的重要组成部分。',
    '双鹤湖中央公园规划设计以本地出土的青铜器代表作莲鹤方壶为创意起点。'
  ],
}
var Providers = {
  'shh.xidong360.com': '钱道',
  'localhost:9526': '钱道',
  'aidingxiang.xidong360.com': '喜动体育',
}
function getWebSite(host) {
  return {
    title: titles[host],
    logo: logos[host],
    author: '',
    whiteList: ['/login', '/404', '/401', '/lock'],
    lockPage: '/lock',
    info: {
      title: titles[host],
      list: lists[host]
    },
    provider: Providers[host],
  }
}


export default getWebSite;
