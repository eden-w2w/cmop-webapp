import api from '@/api'

export default {
    async getGoods() {
        return await api.SYS_GET_GOODS();
    },
    async getGoodsByID(id) {
        return await api.SYS_GET_GOODS_BY_ID({
            id
        });
    },
    async updateGoods(goods) {
        return await api.UPDATE_GOODS(goods);
    },
    async createGoods(goods) {
        return await api.CREATE_GOODS(goods);
    },
    async upload({key, data}) {
        return await api.UPLOAD({key, data});
    }
}