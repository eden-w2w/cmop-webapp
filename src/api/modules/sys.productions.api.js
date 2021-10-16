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

    UPDATE_GOODS({ goodsID, name, comment, dispatchAddr, sales, mainPicture, pictures, specifications, activities, logisticPolicy, price, inventory, detail }) {
        return request({
            url: '/v0/goods/' + goodsID,
            method: 'put',
            data: {
                name,
                comment,
                dispatchAddr,
                sales,
                mainPicture,
                pictures,
                specifications,
                activities,
                logisticPolicy,
                price,
                inventory,
                detail,
            }
        });
    },

    CREATE_GOODS(data = { name, comment, dispatchAddr, sales, mainPicture, pictures, specifications, activities, logisticPolicy, price, inventory, detail }) {
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
})
