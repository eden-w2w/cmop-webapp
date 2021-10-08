import util from '@/libs/util'

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

    SYS_GET_GOODS_BY_ID({id}) {
        return request({
            url: '/v0/goods/' + id,
            method: 'get'
        });
    },
})
