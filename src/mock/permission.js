import Mock from 'mockjs'
export default {
  getMenu: config => {
    const { username, password } = JSON.parse(config.body)
    console.log(JSON.parse(config.body))
    // 先判断用户是否存在
    if (username === 'admin' || username === 'wp') {
      // 判断账号和密码是否对应
      if (username === 'admin' && password === '123456') {
        return {
          code: 20000,
          data: {
            menu: [
              {
                path: '/dynamic',
                name: 'dynamic',
                label: '项目动态',
                icon: 's-home',
                url: 'Dynamic/Dynamic'
              },
              {
                path: '/',
                name: 'home',
                label: '项目统计',
                icon: 's-home',
                url: 'Home/Home'
              },
              {
                path: '/video',
                name: 'video',
                label: '合同管理',
                icon: 'video-play',
                url: 'VideoManage/VideoManage'
              },
              {
                path: '/user',
                name: 'user',
                label: '项目列表',
                icon: 'user',
                url: 'UserManage/UserManage'
              },
              {
                label: '文档管理',
                icon: 'location',
                children: [
                  {
                    path: "/file",
                    name: "测试文档",
                    label: "测试文档",
                    icon: "setting",
                    url: "Other/PageFive"
                  },
                ]
              },
              {
                label: '前台管理',
                icon: 'user',
                children: [
                  {
                    path: "/banner",
                    name: "轮播图维护",
                    label: '轮播图维护',
                    icon: 'setting',
                    url: 'Front/Banner'
                  },
                  {
                    path: "/bussiness-scope",
                    name: "业务范围维护",
                    label: '业务范围维护',
                    icon: 'setting',
                    url: 'Front/BussinessScope'
                  },
                  {
                    path: "/case",
                    name: "经典案例维护",
                    label: '经典案例维护',
                    icon: 'setting',
                    url: 'Front/Case'
                  },
                  {
                    path: "/case-processing",
                    name: "处理案例维护",
                    label: '处理案例维护',
                    icon: 'setting',
                    url: 'Front/CaseProcessing'
                  },
                  {
                    path: "/people",
                    name: "会计师维护",
                    label: '会计师维护',
                    icon: 'setting',
                    url: 'Front/People'
                  },
                  {
                    path: "/information",
                    name: "联系信息维护",
                    label: '联系信息维护',
                    icon: 'setting',
                    url: 'Front/Information'
                  },
                  {
                    path: "/knowledge",
                    name: "问答系统维护",
                    label: '问答系统维护',
                    icon: 'setting',
                    url: 'Front/Knowledge'
                  }
                ]
              }
            ],
            token: Mock.Random.guid(),
            message: '获取成功'
          }
        }
      } else if (username === 'wp' && password === '123456') {
        return {
          code: 20000,
          data: {
            menu: [
              {
                path: '/dynamic',
                name: 'dynamic',
                label: '项目动态',
                icon: 's-home',
                url: 'Dynamic/Dynamic'
              },
              {
                path: '/',
                name: 'home',
                label: '项目统计',
                icon: 's-home',
                url: 'Home/Home'
              },
              {
                path: '/video',
                name: 'video',
                label: '合同管理',
                icon: 'video-play',
                url: 'VideoManage/VideoManage'
              },
              {
                path: '/user',
                name: 'user',
                label: '项目列表',
                icon: 'user',
                url: 'CheckManage/CheckManage'
              },
              {
                label: '文档管理',
                icon: 'location',
                children: [
                  {
                    path: "/auditfile",
                    name: "测试文档",
                    label: "测试文档",
                    icon: "setting",
                    url: "Other/AuditPageFive"
                  },
                ]
              },
              {
                label: '前台管理',
                icon: 'user',
                children: [
                  {
                    path: "/case",
                    name: "案例维护",
                    label: '案例维护',
                    icon: 'setting',
                    url: 'Front/Case'
                  },
                  {
                    path: "/knowledge",
                    name: "问答维护",
                    label: '问答维护',
                    icon: 'setting',
                    url: 'Front/Knowledge'
                  },
                  {
                    path: "/information",
                    name: "信息维护",
                    label: '信息维护',
                    icon: 'setting',
                    url: 'Front/Information'
                  }
                ]
              }
            ],
            token: Mock.Random.guid(),
            message: '获取成功'
          }
        }
      } else {
        return {
          code: -999,
          data: {
            message: '密码错误'
          }
        }
      }
    } else {
      return {
        code: -999,
        data: {
          message: '用户不存在'
        }
      }
    }
  }
}
