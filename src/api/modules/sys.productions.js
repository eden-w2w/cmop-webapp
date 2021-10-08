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
    }
}