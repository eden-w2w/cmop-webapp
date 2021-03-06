import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

export default {
    path: '/settings',
    name: 'settings',
    component: layoutHeaderAside,
    redirect: { name: 'settings_administrators' },
    meta: {
        auth: true
    },
    children: [
        // 系统配置
        {
            path: 'setting',
            name: 'settings_setting',
            meta: {
                title: '系统配置',
                auth: true
            },
            component: _import('settings/setting')
        },
        // 管理员列表
        {
            path: 'administrators',
            name: 'settings_administrators',
            meta: {
                title: '管理员设置',
                auth: true
            },
            component: _import('settings/admins')
        },
        // 任务调度列表
        {
            path: 'tasks',
            name: 'settings_tasks',
            meta: {
                title: '任务调度列表',
                auth: true
            },
            component: _import('settings/tasks')
        }
    ]
}
