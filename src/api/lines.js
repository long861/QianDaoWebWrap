import request from '@/utils/request'
//线路管理 API
//获取线路
export function getLinesList(params) {
  return request({
    url: '/lines/list',
    method: 'get',
    params: params
  })
}

//删除单个线路
export function removeLine(params) {
  return request({
    url: '/lines/remove',
    method: 'get',
    params: params
  })
}

//编辑线路
export function editLine(params) {
  return request({
    url: '/lines/edit',
    method: 'get',
    params: params
  })
}

//增加线路
export function addLine(params) {
  return request({
    url: '/lines/add',
    method: 'get',
    params: params
  })
}