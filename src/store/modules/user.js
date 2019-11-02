import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import axios from "axios";
import { api } from '../../axios';
import {
  setStore,
  getStore,
  removeStore
} from '@/utils/store'
const user = {
  state: {
    qrcode: 'hello world!',
    qstatus: '等待扫描二维码',
    qclass: '',
    connect: false,
    token: getToken(),
    message: '',
    name: '',
    avatar: '',
    loginUserId:'',
    roles: [],
    isLock: getStore({
      name: 'isLock'
    }) || false,
    lockPasswd: getStore({
      name: 'lockPasswd'
    }) || '',
    browserHeaderTitle: getStore({
      name: 'browserHeaderTitle'
    }) || 'NxAdmin'
  },

  mutations: {
    // websocket connect
    SOCKET_CONNECT: (state, status) => {
      // console.log('[mutation] socket connected');
      state.connect = true;
    },
    // server push user message
    SOCKET_USERMESSAGE: (state, message) => {
      // console.log(`[mutation] server message: ${message}`);
      state.message = message;
    },
    // server push user token
    SOCKET_SETTOKEN: (state, token) => {
      // console.log(`[mutation] server token: ${token}`);
      state.token = token.token;
      setToken(token.token);
    },
    SOCKET_SETQRCODE: (state, qrcode) => {
      // console.log(`[mutation] server qrcode: ${qrcode}`);
      state.qrcode = qrcode;
    },
    SOCKET_SETQSTATUS: (state, qstatus) => {
      // console.log(`[mutation] server qstatus: ${qstatus}`);
      state.qstatus = qstatus.status;
      state.qclass = qstatus.class;
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERID: (state, _id) => {
      state.loginUserId = _id;
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    SET_LOCK: (state, action) => {
      state.isLock = true
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state, action) => {
      state.isLock = false
      state.lockPasswd = ''
      removeStore({
        name: 'lockPasswd'
      })
      removeStore({
        name: 'isLock'
      })
    },
    SET_BROWSERHEADERTITLE: (state, action) => {
      state.browserHeaderTitle = action.browserHeaderTitle
    }
  },

  actions: {
    socket_userMessage({ commit }, message) {
      commit('SOCKET_USERMESSAGE', message)
    },
    socket_setToken({ commit }, token) {
      setToken(token.token)
      commit('SOCKET_SETTOKEN', token)
    },
    socket_setQrcode({ commit }, qrcode) {
      commit('SOCKET_SETQRCODE', qrcode)
    },
    socket_setQstatus({ commit }, qstatus) {
      commit('SOCKET_SETQSTATUS', qstatus);
    },
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        var data = { username: userInfo.username, password: userInfo.password }
        api.post('/api/user/login', data).then((res) => {
          if(res.data.code == 200){
            commit('SET_USERID', res.data.user._id);
            commit('SET_TOKEN', res.data.user.token);
            setToken(res.data.user.token);
            resolve(res);
          }else{
            resolve(res);
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.post('/api/user/getInfo', {}).then((res) => {
          if (res.data.code != 200) {
            return resolve(null)
          }
          if (res.data.user.roles && res.data.user.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.data.user.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', res.data.user.name)
          commit('SET_AVATAR', res.data.user.avatar)
          resolve(res.data.user)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_NAME','');
          commit('SET_AVATAR','');
          commit('SET_USERID','');
          removeToken()
          resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getInfo(role).then(response => {
          const data = response
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve()
        })
      })
    }
  }
}

export default user
