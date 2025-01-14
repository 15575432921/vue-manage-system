import Mock from 'mockjs'

export default {
    getMenu: config => {
        // const { username, password } = JSON.parse(config.body)
        // console.log(JSON.parse(config.body))
        const {type, permission} = JSON.parse(config.body)
        console.log("type   " + type + '\n' + "permission   " + permission)
        console.log("getmenu    " + JSON.parse(config.body))
        // 先判断用户是否存在
        if (permission === '1' || permission === '2' || permission === '3' || permission === '4') {
            if (permission === '3') {
                return {
                    type: '经办人',
                    code: 20000,
                    data: {
                        menu: [
                            {
                                path: '/',
                                name: 'home',
                                label: '首页',
                                icon: 'star-off',
                                url: 'Home/Home'
                            },
                            {
                                path: '/project',
                                name: 'project',
                                label: '项目管理',
                                icon: 'document',
                                redirect: '/project/finance',
                                children: [
                                    {
                                        path: '/project/finance',
                                        name: 'finance',
                                        label: '财务审计',
                                        icon: 'document',
                                        url: 'ProjectManage/ProjectManage'
                                    },
                                    {
                                        path: '/project/engineering',
                                        name: 'engineering',
                                        label: '工程审计',
                                        icon: 'document',
                                        url: 'ProjectManage/EngineeringManage'
                                    },
                                    {
                                        path: '/project/taxation',
                                        name: 'taxation',
                                        label: '税务审计',
                                        icon: 'document',
                                        url: 'ProjectManage/TaxationManage'
                                    },
                                    {
                                        path: "/archive",
                                        name: "归档管理",
                                        label: "归档管理",
                                        icon: "files",
                                        url: 'ArchiveManage/ArchiveManage'
                                    },
                                    {
                                        path: "/sta",
                                        name: "统计查询",
                                        label: "统计查询",
                                        icon: "picture",
                                        url: "StatisticManage/StatisticManage"
                                    },
                                ]
                            },
                            {
                                path: '/addfinance',
                                name: 'addFinance',
                                label: '新增财务审计',
                                hidden: true,
                                url: 'ProjectManage/AddFinance'
                            },
                            {
                                path: '/addengineering',
                                name: 'addEngineering',
                                label: '新增工程审计',
                                hidden: true,
                                url: 'ProjectManage/AddEngineering'
                            },
                            {
                                path: '/addtaxation',
                                name: 'addTaxation',
                                label: '新增税务审计',
                                hidden: true,
                                url: 'ProjectManage/AddTaxation'
                            },
                            {
                                path: "/file",
                                name: "文档管理",
                                label: "文档管理",
                                icon: "location",
                                url: "FileManage/FileManage"
                            },
                            {
                                path: '/contractmanage',
                                name: 'contract',
                                label: '合同管理',
                                icon: 'video-play',
                                url: 'ContractManage/ContractManage'
                            },
                            {
                                path: "/knowledge",
                                name: "问答维护",
                                label: '问答维护',
                                icon: 'setting',
                                url: 'Front/Knowledge'
                            },
                            {
                                path: "/tender",
                                name: "投标管理",
                                label: "投标管理",
                                icon: "position",
                                url: 'TenderManage/TenderManage'
                            },
                        ],
                        token: Mock.Random.guid(),
                        message: '获取成功'
                    }
                }
            } else if (permission === '1') {
                return {
                    type: '审核人',
                    code: 20000,
                    data: {
                        menu: [
                            {
                                path: '/',
                                name: 'home',
                                label: '首页',
                                icon: 'star-off',
                                url: 'Home/Home'
                            },
                            {
                                path: '/check',
                                name: 'check',
                                label: '项目管理',
                                icon: 'document',
                                redirect: '/check/finance',
                                children: [
                                    {
                                        path: '/check/finance',
                                        name: 'finance',
                                        label: '财务审计',
                                        icon: 'document',
                                        url: 'ProjectManage/AuditProjectManage'
                                    },
                                    {
                                        path: '/project/engineering',
                                        name: 'engineering',
                                        label: '工程审计',
                                        icon: 'document',
                                        url: 'ProjectManage/AuditEngineeringManage'
                                    },
                                    {
                                        path: '/project/taxation',
                                        name: 'taxation',
                                        label: '税务审计',
                                        icon: 'document',
                                        url: 'ProjectManage/AuditTaxationManage'
                                    },
                                    {
                                        path: "/archive",
                                        name: "归档管理",
                                        label: "归档管理",
                                        icon: "files",
                                        url: 'ArchiveManage/ArchiveManage'
                                    },
                                    {
                                        path: "/sta",
                                        name: "统计查询",
                                        label: "统计查询",
                                        icon: "picture",
                                        url: "StatisticManage/StatisticManage"
                                    },
                                ]
                            },
                            {
                                path: "/auditfile",
                                name: "文档管理",
                                label: "文档管理",
                                icon: "location",
                                url: "FileManage/AuditFileManage"
                            },
                            {
                                path: '/auditcontractmanage',
                                name: 'contract',
                                label: '合同管理',
                                icon: 'video-play',
                                url: 'ContractManage/AuditContractManage'
                            },
                            {
                                path: "/knowledge",
                                name: "问答维护",
                                label: '问答维护',
                                icon: 'setting',
                                url: 'Front/Knowledge'
                            },
                            {
                                path: "/tender",
                                name: "投标管理",
                                label: "投标管理",
                                icon: "position",
                                url: 'TenderManage/AuditTenderManage'
                            },
                        ],
                        token: Mock.Random.guid(),
                        message: '获取成功'
                    }
                }
            }
            else if (permission === '4') {
                return {
                    type: '审核人',
                    code: 20000,
                    data: {
                        menu: [
                            {
                                path: '/',
                                name: 'home',
                                label: '首页',
                                icon: 'star-off',
                                url: 'Home/Home'
                            },
                            {
                                path: '/check',
                                name: 'check',
                                label: '项目管理',
                                icon: 'document',
                                redirect: '/check/finance',
                                children: [
                                    {
                                        path: '/check/finance',
                                        name: 'finance',
                                        label: '财务审计',
                                        icon: 'document',
                                        url: 'ProjectManage/GlobalAuditProjectManage'
                                    },
                                    {
                                        path: '/check/engineering',
                                        name: 'engineering',
                                        label: '工程审计',
                                        icon: 'document',
                                        url: 'ProjectManage/GlobalAuditEngineeringManage'
                                    },
                                    {
                                        path: '/check/taxation',
                                        name: 'taxation',
                                        label: '税务审计',
                                        icon: 'document',
                                        url: 'ProjectManage/GlobalAuditTaxationManage'
                                    },
                                    {
                                        path: "/archive",
                                        name: "归档管理",
                                        label: "归档管理",
                                        icon: "files",
                                        url: 'ArchiveManage/ArchiveManage'
                                    },
                                    {
                                        path: "/sta",
                                        name: "统计查询",
                                        label: "统计查询",
                                        icon: "picture",
                                        url: "StatisticManage/StatisticManage"
                                    },
                                ]
                            },
                            {
                                path: "/auditfile",
                                name: "文档管理",
                                label: "文档管理",
                                icon: "location",
                                url: "FileManage/AuditFileManage"
                            },
                            {
                                path: '/auditcontractmanage',
                                name: 'contract',
                                label: '合同管理',
                                icon: 'video-play',
                                url: 'ContractManage/AuditContractManage'
                            },
                            {
                                path: "/knowledge",
                                name: "问答维护",
                                label: '问答维护',
                                icon: 'setting',
                                url: 'Front/Knowledge'
                            },
                            {
                                path: "/tender",
                                name: "投标管理",
                                label: "投标管理",
                                icon: "position",
                                url: 'TenderManage/AuditTenderManage'
                            },
                        ],
                        token: Mock.Random.guid(),
                        message: '获取成功'
                    }
                }
            }
            else if (permission === '2') {
                return {
                    type: '管理员',
                    code: 20000,
                    data: {
                        menu: [
                            {
                                path: '/',
                                name: 'home',
                                label: '首页',
                                icon: 'star-off',
                                url: 'Home/Home'
                            },
                            {
                                path: "/allcustomer",
                                name: "所有客户",
                                label: '客户管理',
                                icon: 'user',
                                url: 'CustomerManager/AllCustomer'
                            },
                            {
                                path: "/alluser",
                                name: "所有用户",
                                label: '用户管理',
                                icon: 'user',
                                url: 'UserManage/AllUser'
                            },
                            {
                                path: '/adminproject',
                                name: 'adminproject',
                                label: '项目管理',
                                icon: 'user',
                                url: 'ProjectManage/AdminProjectManage'
                            },
                            {
                                path: "/adminfile",
                                name: "adminfile",
                                label: "文档管理",
                                icon: "location",
                                url: "FileManage/AdminFileManage"
                            },
                            {
                                path: '/admincontract',
                                name: 'admincontract',
                                label: '合同管理',
                                icon: 'video-play',
                                url: 'ContractManage/AdminContractManage'
                            },
                            {
                                path: "/knowledge",
                                name: "问答维护",
                                label: '问答维护',
                                icon: 'setting',
                                url: 'Front/Knowledge'
                            },
                            {
                                path: "/tender",
                                name: "投标管理",
                                label: "投标管理",
                                icon: "position",
                                url: 'TenderManage/AdminTenderManage'
                            },
                            {
                                path: "/sta",
                                name: "统计查询",
                                label: "统计查询",
                                icon: "picture",
                                url: "StatisticManage/StatisticManage"
                            },

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
