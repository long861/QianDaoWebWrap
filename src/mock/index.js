// import Mock from 'mockjs'
// import tableAPI from './table'
// import loginAPI from './login'
// import articleAPI from './article'
// import groupsAPI from './groups'
// import linesAPI from './lines'
// // 设置全局延时 没有延时的话有时候会检测不到数据变化 建议保留
// Mock.setup({
//   timeout: '300-600'
// })

// // 登录相关
// Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
// Mock.mock(/\/user\/logout/, 'post', loginAPI.logout)
// Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// // 文章相关
// Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
// Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
// Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
// Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
// Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// // 用户相关
// Mock.mock(/\/user\/listpage/, 'get', tableAPI.getUserList)
// Mock.mock(/\/user\/remove/, 'get', tableAPI.deleteUser)
// Mock.mock(/\/user\/batchremove/, 'get', tableAPI.batchremove)
// Mock.mock(/\/user\/add/, 'get', tableAPI.createUser)
// Mock.mock(/\/user\/edit/, 'get', tableAPI.updateUser)

// // 组别相关
// Mock.mock(/\/groups\/list/, 'get', groupsAPI.getGroupsList)
// Mock.mock(/\/groups\/remove/, 'get', groupsAPI.removeGroup)
// Mock.mock(/\/groups\/add/, 'get', groupsAPI.addGroup)  
// Mock.mock(/\/groups\/edit/, 'get', groupsAPI.editGroup)
// Mock.mock(/\/groups\/batchremove/, 'get', groupsAPI.batchremove)

// // 线路相关
// Mock.mock(/\/lines\/list/, 'get', linesAPI.getLinesList)
// Mock.mock(/\/lines\/add/, 'get', linesAPI.addLine)   
// Mock.mock(/\/lines\/remove/, 'get', linesAPI.removeLine)
// Mock.mock(/\/lines\/edit/, 'get', linesAPI.editLine)
// Mock.mock(/\/lines\/batchremove/, 'get', linesAPI.batchremove)
// export default Mock
