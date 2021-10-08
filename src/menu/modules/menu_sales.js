export default {
    path: '/sales',
    title: '销售中心',
    icon: 'cog',
    children: (pre => [
        // {
        //     path: `${pre}/list`,
        //     title: '商品列表',
        //     icon: 'dashboard',
        //     children: (pre => [
        //         { path: `${pre}/create`, title: '添加商品', icon: 'database' },
        //     ])(`${pre}/list`)
        // },
        { path: `${pre}/list`, title: '订单列表', icon: 'plug' },
        { path: `${pre}/statistics`, title: '销售统计', icon: 'database' },
    ])('/sales')
}
