import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

export default {
    path: '/channels',
    name: 'channels',
    component: layoutHeaderAside,
    redirect: { name: 'channels_commission' },
    meta: {
        auth: true
    },
    children: [
        // 佣金管理
        {
            path: 'commission',
            name: 'channels_commission',
            meta: {
                title: '佣金管理',
                auth: true
            },
            component: _import('productions/list')
        }
    ]
}
