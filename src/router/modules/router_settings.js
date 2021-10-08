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
        // 订单列表
        {
            path: 'administrators',
            name: 'settings_administrators',
            meta: {
                title: '管理员设置',
                auth: true
            },
            component: _import('productions/list')
        }
    ]
}
