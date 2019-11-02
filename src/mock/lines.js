import Mock from 'mockjs'
import { param2Obj } from '@/utils'

let List = []
List = [
  {
    id:1,
    name: "红色远征军1111",
    explain: "红军过草地、爬雪山、体验红军长征五万里的艰辛。",
    tags: [
      { name: "红色线路", value:"0", color: "red" },
      { name: "亲子线路", value:"1", color: "green" },
      { name: "爱情线路", value:"2", color: "red" }
    ],
    time:'2019-01-30',
    cover: "https://scdn.xidong360.com/201712/3296b3b20c044707a41c8c0c493a011e.png",
  },
  {
    id:2,
    name: "鹊桥",
    explain: "感受园中最浪漫的景色，让园中的一草一木见证你们的爱情。",
    tags: [
      { name: "爱情线路", value:"2", color: "red" }
    ],
    time:'2019-01-30',
    cover:"https://cdn.xidong360.com/201712/5293b769eda947369ff056d96cab2197.jpg",
  },
  {
    id:3,
    name: "家庭大团圆",
    explain: "家庭成员一起在园中做游戏，非常有利于亲子交流，加深亲子感情。",
    tags: [
      { name: "亲子线路", value:"1", color: "green" }
    ],
    time:'2019-01-30',
    cover: "https://cdn.xidong360.com/201712/e9478f3769b046fd9ec6f25269bb2863.png",
  },
  {
    id:4,
    name: "团建大冒险",
    explain: "适用于公司团队建设，路线中有层层关卡，需要团队协作才能通关，能极大的增强团队凝聚力，促进公司发展。",
    tags: [
      { name: "团建线路", value:"3", color: "blue" },
    ],
    time:'2019-01-30',
    cover: "https://cdn.xidong360.com/201712/fcc74b5690d4475f831e74880da62a07.png",
  }
]

export default {
  getLinesList: config => {
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
        lines: pageList
      }
    }
  },

  //mock.js 只能传递对象参数，对于数组参数无法传递，
  addLine: config => {
    const { id, name, explain, tags ,cover} = param2Obj(config.url)
    // const _tags = [];
    // tags.forEach(item => {
    //   _tags.push({name:item,color:'red'});
    // });
    List.push({
      id,
      name,
      cover: cover || "https://cdn.xidong360.com/201712/fcc74b5690d4475f831e74880da62a07.png",
      explain,
      // tags:_tags,
      time:'2019-01-11'
    })
    return {
      code: 0,
      data: {
        message: '添加成功'
      }
    }
  },
  removeLine: config => {
    // console.log(config);
    const { id } = param2Obj(config.url)
    List = List.filter(u => u.id != id)
    // console.log("id--",id,List)
    return {
      code: 0,
      data: {
        message: '删除成功'
      }
    }
  },
  editLine: config => {
    const { id, name, sex, category, sDate, eDate, minAge, maxAge, people, pFee, tFee, teamNum, minTeamPeople, maxTeamPeople, feeCategory } = param2Obj(config.url)
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
        return true;
      }
    })
    return {
      code: 0,
      data: {
        message: '编辑成功'
      }
    }
  }
}
