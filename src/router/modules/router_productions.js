import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

export default {
  path: '/productions',
  name: 'productions',
  component: layoutHeaderAside,
  redirect: { name: 'productions_list' },
  meta: {
    auth: true
  },
  children: [
    // 商品列表
    {
      path: 'list',
      name: 'productions_list',
      meta: {
        title: '商品列表',
        auth: true
      },
      component: _import('productions/list')
    },
    // 创建商品
    {
      path: 'save',
      name: 'productions_save',
      meta: {
        title: '创建/更新商品',
        auth: true
      },
      component: _import('productions/save')
    },
    // 运费模板
    {
      path: 'freight_list',
      name: 'productions_freight_list',
      meta: {
        title: '运费模板',
        auth: true
      },
      component: _import('productions/freight_list')
    }
  ]
}
