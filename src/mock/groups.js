import Mock from 'mockjs'
import { param2Obj } from '@/utils'

let List = []
const count = 5

for (let i = 0; i < count; i++) { 
  List.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.name(),
    category: Mock.Random.integer(0, 1),
    sex: Mock.Random.integer(0, 1, 2),
    minAge: Mock.Random.integer(10,20),
    maxAge: Mock.Random.integer(40,50),
    sDate: Mock.Random.date('yyyy-MM-dd hh:mm:ss'),
    eDate: Mock.Random.date('yyyy-MM-dd hh:mm:ss'),
    //个人
    people: Mock.Random.integer(20, 50),
    pFee: Mock.Random.integer(0,50),
    //团队
    tFee:Mock.Random.integer(0,50),
    teamNum:Mock.Random.integer(0,20),
    minTeamPeople:Mock.Random.integer(0,20),
    maxTeamPeople:Mock.Random.integer(0,20),
    feeCategory:'1'
  }))
}

export default {
    getGroupsList: config => {
    const { name, page = 1, limit = 20 } = param2Obj(config.url)
    const mockList = List.filter(user => {
      if (name && user.name.indexOf(name) === -1) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      data: {
        total: mockList.length,
        groups: pageList
      }
    }
  },
  addGroup: config => {
    const { id, name, sex, category, sDate, eDate, minAge, maxAge, people, pFee, tFee, teamNum, minTeamPeople, maxTeamPeople, feeCategory} = param2Obj(config.url)
    const _sex = parseInt(sex);
    List.push({
      id,
      name,
      sex:_sex,
      category,
      sDate,
      eDate,
      minAge,
      maxAge,
      people,
      pFee,
      tFee,
      teamNum,
      minTeamPeople,
      maxTeamPeople,
      feeCategory,
    })
    return {
      code: 0,
      data: {
        message: '添加成功'
      }
    }
  },
  removeGroup: config => {
    const { id } = param2Obj(config.url)
    List = List.filter(u => u.id !== id)
    return {
      code: 0,
      data: {
        message: '删除成功'
      }
    }
  },
  editGroup: config => {
    const { id, name, sex, category, sDate, eDate, minAge, maxAge, people, pFee, tFee, teamNum, minTeamPeople, maxTeamPeople, feeCategory} = param2Obj(config.url)
    const sex_num = parseInt(sex);
    List.some(group => {
      if (group.id === id) {
        group.name = name;
        group.sex = sex_num;
        group.category = category;
        group.sDate = sDate;
        group.eDate = eDate;
        group.minAge = minAge;
        group.maxAge = maxAge;
        //个人
        group.people = people;
        group.pFee = pFee;
        //团队
        group.tFee = tFee;
        group.teamNum = teamNum;
        group.minTeamPeople = minTeamPeople;
        group.maxTeamPeople = maxTeamPeople;
        group.feeCategory = feeCategory;
        return true
      }
    })
    return {
      code: 0,
      data: {
        message: '编辑成功'
      }
    }
  },
  batchremove: config => {
    let { ids } = param2Obj(config.url)
    ids = ids.split(',')
    List = List.filter(u => !ids.includes(u.id))
    return {
      code: 0,
      data: {
        message: '批量删除成功'
      }
    }
  },
}
