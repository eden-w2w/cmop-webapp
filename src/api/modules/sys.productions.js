import api from '@/api'

export default {
    async getGoods() {
        try {
            return await api.SYS_GET_GOODS();
        } catch (err) {
            console.log('[modules][productions] getGoods err: ' + err);
        }
    },
    async getGoodsByID(id) {
        try {
            return await api.SYS_GET_GOODS_BY_ID({
                id
            });
        } catch (err) {
            console.log('[modules][productions] getGoodsByID err: ' + err);
        }
    },
    async updateGoods(goods) {
        try {
            return await api.UPDATE_GOODS(goods);
        } catch (err) {
            console.log('[modules][productions] updateGoods err: ' + err);
        }
    },
    async createGoods(goods) {
        try {
            return await api.CREATE_GOODS(goods);
        } catch (err) {
            console.log('[modules][productions] createGoods err: ' + err);
        }
    },
    async upload({key, data}) {
        try {
            return await api.UPLOAD({key, data});
        } catch (err) {
            console.log('[modules][productions] upload err: ' + err);
        }
    }
}