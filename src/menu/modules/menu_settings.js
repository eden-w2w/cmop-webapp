export default {
    path: '/settings',
    title: '系统设置',
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
        { path: `${pre}/administrators`, title: '管理员设置', icon: 'plug' },
        { path: `${pre}/tasks`, title: '任务调度列表', icon: 'plug' },
    ])('/settings')
}
