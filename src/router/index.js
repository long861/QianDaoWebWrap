import Vue from 'vue'
import Router from 'vue-router'

// const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: '/dashboard/dashboard'
  },
  { path: '/login', component: () => import('@/views/login'), name: '登录', hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  // 锁屏
  {
    path: '/lock',
    hidden: true,
    name: '锁屏页',
    component: () => import('@/views/common/lock')
  },
  // 首页-图表
  {
    path: '/dashboard',
    component: Layout,
    meta: { title: '工作台', icon: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        name: '工作台',
        component: () => import('@/views/dashboard/dashboard'),
        meta: { title: '工作台', icon: 'dashboard' }
      }
    ]
  },
  // 默认资产管理
  {
    path: '/assets',
    component: Layout,
    meta: { title: '默认资产管理', icon: 'discounting' },
    children: [
      // 线路管理(有添加线路、)
      {
        path: 'list',
        name: '默认资产管理',
        component: () => import('@/pages/assets/assetsList'),
        meta: { title: '默认资产管理', icon: 'discounting' }
      },
    ]
  },
  // 默认收支类型
  {
    path: '/money',
    component: Layout,
    meta: { title: '默认收支类型', icon: 'discounting' },
    children: [
      // 线路管理(有添加线路、)
      {
        path: 'defaultType/list',
        name: '默认收支类型',
        component: () => import('@/pages/money/moneyDefaultTypeList'),
        meta: { title: '默认收支类型', icon: 'discounting' }
      },
    ]
  },
  // // 线路管理
  // {
  //   path: '/lineManage',
  //   component: Layout,
  //   meta: { title: '线路管理', icon: 'discounting' },
  //   children: [
  //     // 线路管理(有添加线路、)
  //     {
  //       path: 'list',
  //       name: '线路管理',
  //       component: () => import('@/pages/lineManage/lineList'),
  //       meta: { title: '线路管理', icon: 'discounting' }
  //     },
  //   ]
  // },
  // // 点标管理
  // {
  //   path: '/markers',
  //   component: Layout,
  //   meta: { title: '点标管理', icon: 'gpsMap' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: '点标管理',
  //       component: () => import('@/pages/markers/MarkerListDefault'),
  //       meta: { title: '点标管理', icon: 'gpsMap' }
  //     },
  //   ]
  // },
  // {
  //   path: '/park',
  //   component: Layout,
  //   meta: { title: '内容管理', icon: 'right-mean' },
  //   children: [
  //     {
  //       path: 'themeList',
  //       name: '线路主题',
  //       component: () => import('@/pages/park/themeList'),
  //       meta: { title: '线路主题', icon: 'theme' }
  //     },
  //     {
  //       path: 'knowledge',
  //       name: '定向知识',
  //       component: () => import('@/pages/park/knowledgeList'),
  //       meta: { title: '定向知识', icon: 'right-mean' }
  //     },
  //     {
  //       path: 'news',
  //       name: '园区动态',
  //       component: () => import('@/pages/park/NewsList'),
  //       meta: { title: '园区动态', icon: 'barGraph' }
  //     },
  //     {
  //       path: 'info',
  //       name: '园区介绍',
  //       component: () => import('@/pages/park/ParkInfo'),
  //       meta: { title: '园区介绍', icon: 'tab' }
  //     }
  //   ]
  // },
  //账号管理
  {
    path: '/user',
    component: Layout,
    meta: { title: '账号管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: '账号列表',
        component: () => import('@/pages/user/userList'),
        meta: { title: '账号列表', icon: 'user' }
      },
      // {
      //   path: 'power',
      //   name: '账号权限',
      //   component: () => import('@/pages/nowrap/nowrap'),
      //   meta: { title: '账号权限', icon: 'lock' }
      // }
    ]
  },

    //微信公众号
    {
      path: '/wechat',
      component: Layout,
      meta: { title: '微信公众号', icon: 'star' },
      children: [
        {
          path: 'token',
          name: 'token',
          component: () => import('@/pages/wechat/pushNews'),
          meta: { title: 'token', icon: 'star' }
        },
        {
          path: 'pushNews',
          name: '推送消息',
          component: () => import('@/pages/wechat/pushNews'),
          meta: { title: '推送消息', icon: 'errorLog' }
        }
        
      ]
    },

  // 设置
  {
    path: '/install',
    component: Layout,
    meta: { title: '设置', icon: 'star', roles: ['editor'] },
    children: [
      {
        path: 'log',
        name: '日志',
        component: () => import('@/pages/nowrap/nowrap'),
        meta: { title: '日志', icon: 'errorLog' }
      },
      {
        path: 'logout',
        name: '退出',
        component: () => import('@/pages/log/logout'),
        meta: { title: '退出', icon: 'star' }
      }
    ]
  },


  //new
  {
    path: '/assets',
    // name: '创建线路',
    component: Layout,
    children: [
      {
        path: '/createDefault',
        name: '创建资产类型',
        component: () => import('@/pages/assets/createAssetsDefault'),
        meta: { title: '创建资产类型' }
      }
    ],
    hidden: true
  },
  {
    path: '/assets',
    // name: '修改动态',
    component: Layout,
    children: [
      {
        path: '/assetsEdit/:assetsId',
        name: '修改资产信息',
        component: () => import('@/pages/assets/createAssetsDefault'),
        meta: { title: '修改资产信息' }
      }
    ],
    hidden: true
  },
  {
    path: '/money',
    component: Layout,
    children: [
      {
        path: '/defaultType/createDefault',
        name: '创建收支类型',
        component: () => import('@/pages/money/createMoneyDefaultType'),
        meta: { title: '创建收支类型' }
      }
    ],
    hidden: true
  },
  {
    path: '/money',
    component: Layout,
    children: [
      {
        path: '/defaultType/moneyTypeEdit/:moneyTypeId',
        name: '修改收支信息',
        component: () => import('@/pages/money/createMoneyDefaultType'),
        meta: { title: '修改收支信息' }
      }
    ],
    hidden: true
  },
  

  //user
  {
    path: '/user',
    // name: '我的账号',
    component: Layout,
    children: [
      {
        path: '/Info',
        name: '我的账号',
        component: () => import('@/pages/user/userInfo'),
        meta: { title: '我的账号' }
      }
    ],
    hidden: true
  },




  //old
  {
    path: '/matchInfo',
    // name: '赛事详情',
    component: Layout,
    children: [
      {
        path: '/matchInfo/:matchId',
        name: '赛事详情',
        component: () => import('@/pages/matchManage/matchDetail'),
        meta: { title: '赛事详情', icon: 'international' }
      }
    ],
    hidden: true
  },
  {
    path: '/lineManage',
    // name: '赛事线路',
    component: Layout,
    children: [
      {
        path: '/lineManage/list/:matchId/:gameId',
        name: '赛事线路',
        component: () => import('@/pages/lineManage/MatchLine'),
        meta: { title: '赛事线路' }
      }
    ],
    hidden: true
  },
  {
    path: '/line',
    // name: '创建线路',
    component: Layout,
    children: [
      {
        path: '/create',
        name: '创建线路',
        component: () => import('@/pages/lineManage/createLine'),
        meta: { title: '创建线路' }
      }
    ],
    hidden: true
  },
  {
    path: '/markers',
    // name: '点标设置',
    component: Layout,
    children: [
      {
        path: '/markers/lists/:itemId',
        name: '点标设置',
        component: () => import('@/pages/markers/MarkerList'),
        meta: { title: '点标设置' }
      },
    ],
    hidden: true
  },
  {
    path: '/error',
    component: Layout,
    // name: '404',
    children: [
      { path: '/error', component: () => import('@/views/errorPage/404'), name: '404', meta: { title: '404' } }
    ],
    hidden: true
  },
  {
    path: '/park',
    // name: '创建动态',
    component: Layout,
    children: [
      {
        path: '/createNews',
        name: '创建动态',
        component: () => import('@/pages/park/CreateNews'),
        meta: { title: '创建动态' }
      }
    ],
    hidden: true
  },
  {
    path: '/park',
    // name: '修改动态',
    component: Layout,
    children: [
      {
        path: '/editNews/:newsId',
        name: '修改动态',
        component: () => import('@/pages/park/CreateNews'),
        meta: { title: '修改动态' }
      }
    ],
    hidden: true
  },
  {
    path: '/park',
    // name: '预览',
    component: Layout,
    children: [
      {
        path: '/prev/:newsId',
        name: '预览',
        component: () => import('@/pages/park/PrevNews'),
        meta: { title: '预览' }
      }
    ],
    hidden: true
  },
  {
    path: '/park',
    // name: '创建定向知识',
    component: Layout,
    children: [
      {
        path: '/createKnowL',
        name: '创建定向知识',
        component: () => import('@/pages/park/CreateKnowL'),
        meta: { title: '创建定向知识' }
      }
    ],
    hidden: true
  },
  {
    path: '/park',
    // name: '修改定向知识',
    component: Layout,
    children: [
      {
        path: '/editKnowL/:newsId',
        name: '修改定向知识',
        component: () => import('@/pages/park/CreateKnowL'),
        meta: { title: '修改定向知识' }
      }
    ],
    hidden: true
  },
  // {
  //   path: '/user',
  //   // name: '我的账号',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/Info',
  //       name: '我的账号',
  //       component: () => import('@/pages/user/userInfo'),
  //       meta: { title: '我的账号' }
  //     }
  //   ],
  //   hidden: true
  // },
  {
    path: '/park',
    // name: '线路主题',
    component: Layout,
    children: [
      {
        path: 'theme',
        name: '创建线路主题',
        component: () => import('@/pages/park/lineTheme'),
        meta: { title: '创建线路主题', icon: 'theme' }
      }
    ],
    hidden: true
  },
  {
    path: '/park',
    // name: '线路主题',
    component: Layout,
    children: [
      {
        path: 'theme/:themeId',
        name: '编辑线路主题',
        component: () => import('@/pages/park/lineTheme'),
        meta: { title: '编辑线路主题', icon: 'theme' }
      }
    ],
    hidden: true
  },
  {
    path: '/nowrap',
    component: Layout,
    // name: 'nowrap',
    children: [
      { path: '/nowrap', component: () => import('@/pages/nowrap/nowrap'), name: 'nowrap', meta: { title: 'nowrap' } }
    ],
    hidden: true
  },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
})
export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]