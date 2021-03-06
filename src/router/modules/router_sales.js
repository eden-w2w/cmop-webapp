import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

export default {
    path: '/sales',
    name: 'sales',
    component: layoutHeaderAside,
    redirect: { name: 'sales_list' },
    meta: {
        auth: true
    },
    children: [
        // 订单列表
        {
            path: 'list',
            name: 'sales_list',
            meta: {
                title: '订单列表',
                auth: true
            },
            component: _import('sales/list')
        },
        // 订单保存
        {
            path: 'save',
            name: 'sales_save',
            meta: {
                title: '创建/编辑订单',
                auth: true
            },
            component: _import('sales/save')
        },
        // 预售单列表
        {
            path: 'bookings',
            name: 'sales_bookings',
            meta: {
                title: '预售单列表',
                auth: true
            },
            component: _import('sales/bookings')
        },
        // 支付单列表
        {
            path: 'payments',
            name: 'sales_payments',
            meta: {
                title: '支付单列表',
                auth: true
            },
            component: _import('sales/payments')
        },
        // 退款单列表
        {
            path: 'refunds',
            name: 'sales_refunds',
            meta: {
                title: '退款单列表',
                auth: true
            },
            component: _import('sales/refunds')
        },
        // 销售统计
        {
            path: 'statistics',
            name: 'sales_statistics',
            meta: {
                title: '销售统计',
                auth: true
            },
            component: _import('sales/statistics')
        },
        // 营销活动列表
        {
            path: 'discounts/list',
            name: 'sales_discount_list',
            meta: {
                title: '营销活动列表',
                auth: true
            },
            component: _import('sales/discount_list')
        },
        // 创建/更新营销活动
        {
            path: 'discounts/save',
            name: 'sales_discount_save',
            meta: {
                title: '创建/更新营销活动',
                auth: true
            },
            component: _import('sales/discount_save')
        }
    ]
}
