export default {
    path: '/productions',
    title: '商品管理中心',
    icon: 'gift',
    children: (pre => [
        { path: `${pre}/list`, title: '商品列表', icon: 'list' },
        { path: `${pre}/freight_list`, title: '运费模板', icon: 'truck' },
    ])('/productions')
}
