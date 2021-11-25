export default {
    path: '/sales',
    title: '销售中心',
    icon: 'balance-scale',
    children: (pre => [
        { path: `${pre}/list`, title: '订单列表', icon: 'list' },
        { path: `${pre}/bookings`, title: '预售单列表', icon: 'balance-scale' },
        { path: `${pre}/payments`, title: '支付单列表', icon: 'weixin' },
        { path: `${pre}/refunds`, title: '退款单列表', icon: 'weixin' },
        { path: `${pre}/statistics`, title: '销售统计', icon: 'pie-chart' },
        {
            path: `${pre}/discounts`,
            title: '营销活动管理',
            icon: 'dashboard',
            children: (pre => [
                { path: `${pre}/list`, title: '活动列表', icon: 'list' },
            ])(`${pre}/discounts`)
        },
    ])('/sales')
}
