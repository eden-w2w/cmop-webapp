import { uniqueId } from 'lodash'
import menuProduction from './modules/menu_production'
import menuSales from './modules/menu_sales'
import menuCustomers from './modules/menu_customers'
import menuSettings from './modules/menu_settings'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath(menu) {
    return menu.map(e => ({
        ...e,
        path: e.path || uniqueId('d2-menu-empty-'),
        ...e.children ? {
            children: supplementPath(e.children)
        } : {}
    }))
}

export const menuHeader = supplementPath([
    { path: '/index', title: '首页', icon: 'home' },
    menuProduction,
    menuSales,
    menuCustomers,
    menuSettings
])

export const menuAside = supplementPath([
    menuProduction,
    menuSales,
    menuCustomers,
    menuSettings
])
