import axios from 'axios'
// import Vue from 'vue'
import router from "@/router/index";
import { getToken, setToken, removeToken } from '@/utils/auth'

//
axios.default.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/json'

const instance = axios.create()
instance.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use = instance.interceptors.request.use
instance.interceptors.request.use(config => {
  config.headers.Authorization = `token ${getToken()}`;
  return config
}, err => {
  return Promise.reject(err)
})
// axios拦截响应
instance.interceptors.response.use(response => {
  return response
}, err => {
  return router.push({path:'/error'})
})

export const api = instance;