import request from '@/utils/request'

//组别管理 API

//获取全部组别
export function getGroupsList(params) {
  return request({
    url: '/groups/list',
    method: 'get',
    params: params
  })
}

//删除单个组别
export function removeGroup(params) {
  return request({
    url: '/groups/remove',
    method: 'get',
    params: params
  })
}

//编辑组别
export function editGroup(params) {
  return request({
    url: '/groups/edit',
    method: 'get',
    params: params
  })
}

//增加
export function addGroup(params) {
  return request({
    url: '/groups/add',
    method: 'get',
    params: params
  })
}

//批量删除
export function batchRemoveGroup(params) {
  return request({
    url: '/groups/batchremove',
    method: 'get',
    params: params
  })
}