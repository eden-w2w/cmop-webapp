export default {
    path: '/productions',
    title: '商品管理中心',
    icon: 'cog',
    children: (pre => [
        // {
        //     path: `${pre}/list`,
        //     title: '商品列表',
        //     icon: 'dashboard',
        //     children: (pre => [
        //         { path: `${pre}/save`, title: '添加商品', icon: 'database' },
        //     ])(`${pre}/list`)
        // },
        { path: `${pre}/list`, title: '商品列表', icon: 'plug' },
        { path: `${pre}/save`, title: '创建/更新商品', icon: 'database' },
    ])('/productions')
}
