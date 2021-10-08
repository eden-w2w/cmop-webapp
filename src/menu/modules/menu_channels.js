export default {
    path: '/channels',
    title: '渠道管理中心',
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
        { path: `${pre}/commission`, title: '佣金管理', icon: 'plug' },
    ])('/channels')
}
