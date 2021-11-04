export default {
    path: '/productions',
    title: '商品管理中心',
    icon: 'gift',
    children: (pre => [
        // {
        //     path: `${pre}/list`,
        //     title: '商品列表',
        //     icon: 'dashboard',
        //     children: (pre => [
        //         { path: `${pre}/save`, title: '添加商品', icon: 'database' },
        //     ])(`${pre}/list`)
        // },
        { path: `${pre}/list`, title: '商品列表', icon: 'list' },
    ])('/productions')
}
