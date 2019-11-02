var titles = {
  'shh.xidong360.com': '双鹤湖定向',
  'localhost:9528': '双鹤湖定向',
  'aidingxiang.xidong360.com': 'AI定向',
}
var logos = {
  'shh.xidong360.com': 'https://cdn.xidong360.com/dxs/shh/shhlogo.jpg',
  'localhost:9528': 'https://cdn.xidong360.com/dxs/shh/shhlogo.jpg',
  'aidingxiang.xidong360.com': 'https://cdn.xidong360.com/dxs/ai/logo.png',
}
var lists = {
  'shh.xidong360.com': [
    '是以“科技生态”为主题，建设一个完全不同于传统的崭新园博会展区，同时建设一座既先于城市又融于城市的中央公园。',
    '第十一届郑州园博会的重要组成部分。',
    '双鹤湖中央公园规划设计以本地出土的青铜器代表作莲鹤方壶为创意起点。'
  ],
  'localhost:9528': [
    '是以“科技生态”为主题，建设一个完全不同于传统的崭新园博会展区，同时建设一座既先于城市又融于城市的中央公园。',
    '第十一届郑州园博会的重要组成部分。',
    '双鹤湖中央公园规划设计以本地出土的青铜器代表作莲鹤方壶为创意起点。'
  ],
  'aidingxiang.xidong360.com': [
    '是以“科技生态”为主题，建设一个完全不同于传统的崭新园博会展区，同时建设一座既先于城市又融于城市的中央公园。',
    '第十一届郑州园博会的重要组成部分。',
    '双鹤湖中央公园规划设计以本地出土的青铜器代表作莲鹤方壶为创意起点。'
  ],
}
var Providers = {
  'shh.xidong360.com': '双鹤湖公园',
  'localhost:9528': '双鹤湖公园',
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