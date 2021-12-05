export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    /**
     * @description 获取商品列表
     * @param {Object} data 查询参数
     */
    SYS_GET_GOODS() {
        return request({
            url: '/v0/goods',
            method: 'get',
        });
    },

    SYS_GET_GOODS_BY_ID({ id }) {
        return request({
            url: '/v0/goods/' + id,
            method: 'get'
        });
    },

    UPDATE_GOODS(data = { goodsID, name, comment, freightTemplateID, unitNetWeight, sales, mainPicture, pictures, specifications, activities, logisticPolicy, price, inventory, detail, isAllowBooking, eta, bookingSales }) {
        return request({
            url: '/v0/goods/' + data.goodsID,
            method: 'put',
            data
        });
    },

    CREATE_GOODS(data = { name, comment, freightTemplateID, unitNetWeight, sales, mainPicture, pictures, specifications, activities, logisticPolicy, price, inventory, detail, isAllowBooking, eta, bookingSales }) {
        return request({
            url: '/v0/goods',
            method: 'post',
            data
        })
    },

    UPLOAD({ key, data }) {
        return request({
            url: '/v0/upload',
            method: 'post',
            data: {
                key,
                data
            }
        });
    },

    CREATE_TEMPLATE(data) {
        return request({
            url: '/v0/freight_templates',
            method: 'post',
            data
        })
    },

    CREATE_TEMPLATE_RULE(templateID, data) {
        return request({
            url: '/v0/freight_templates/' + templateID + '/rules',
            method: 'post',
            data
        })
    },

    DELETE_TEMPLATE(templateID) {
        return request({
            url: '/v0/freight_templates/' + templateID,
            method: 'delete'
        })
    },

    DELETE_TEMPLATE_RULE(ruleID) {
        return request({
            url: '/v0/freight_templates/0/rules/' + ruleID,
            method: 'delete'
        })
    },

    GET_TEMPLATE_RULE_BY_ID(ruleID) {
        return request({
            url: '/v0/freight_templates/0/rules/' + ruleID,
            method: 'get'
        })
    },

    GET_TEMPLATE_RULES(templateID, params) {
        return request({
            url: '/v0/freight_templates/' + templateID + '/rules',
            method: 'get',
            params
        })
    },

    GET_TEMPLATE_BY_ID(templateID) {
        return request({
            url: '/v0/freight_templates/' + templateID,
            method: 'get'
        })
    },

    GET_TEMPLATES(params) {
        return request({
            url: '/v0/freight_templates',
            method: 'get',
            params
        })
    },

    UPDATE_TEMPLATE(templateID, data) {
        return request({
            url: '/v0/freight_templates/' + templateID,
            method: 'patch',
            data
        })
    },

    UPDATE_TEMPLATE_RULE(ruleID, data) {
        return request({
            url: '/v0/freight_templates/0/rules/' + ruleID,
            method: 'patch',
            data
        })
    },
})
