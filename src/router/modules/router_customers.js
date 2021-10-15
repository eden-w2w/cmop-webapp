import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

export default {
    path: '/customers',
    name: 'customers',
    component: layoutHeaderAside,
    redirect: { name: 'customers_commission' },
    meta: {
        auth: true
    },
    children: [
        // 客户管理
        {
            path: 'customers',
            name: 'customers_customers',
            meta: {
                title: '客户管理',
                auth: true
            },
            component: _import('customers/customers')
        },
        // 客户详情
        {
            path: 'customer_detail',
            name: 'customers_customer_detail',
            meta: {
                title: '客户详情',
                auth: true
            },
            component: _import('customers/customer_detail')
        },
        // 佣金管理
        {
            path: 'commission',
            name: 'customers_commission',
            meta: {
                title: '佣金管理',
                auth: true
            },
            component: _import('customers/commission')
        }
    ]
}
