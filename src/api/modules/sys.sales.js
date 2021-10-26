import api from '@/api'

export default {
    async enums() {
        return await api.ENUMS();
    },

    async getOrders({
        userID,
        paymentMethod,
        status,
    }) {
        return await api.GET_ORDERS({ userID, paymentMethod, status });
    },

    async getOrderByID(orderID) {
        return await api.GET_ORDER(orderID);
    },

    async getOrderGoods(orderID) {
        return await api.GET_ORDER_GOODS(orderID);
    },

    async getOrderLogistics(orderID) {
        return await api.GET_ORDER_LOGISTICS(orderID);
    },

    async updateOrder(params = { orderID, status, discountAmount, remark, recipients, shippingAddr, mobile, courierCompany, courierNumber, goods: [] }) {
        return await api.UPDATE_ORDER(params);
    },

    async cancelOrder(orderID) {
        return await api.CANCEL_ORDER(orderID);
    },

    async confirmOrder(orderID) {
        return await api.UPDATE_ORDER({
            orderID,
            status: 'CONFIRM',
        });
    },

    async dispatchOrder({ orderID, courierCompany, courierNumber }) {
        if (!orderID || !courierCompany || !courierNumber) {
            return;
        }
        return await api.UPDATE_ORDER({
            orderID,
            status: 'DISPATCH',
            courierCompany,
            courierNumber
        });
    },

    async completeOrder(orderID) {
        return await api.UPDATE_ORDER({
            orderID,
            status: 'COMPLETE',
        });
    },

    async refundOrder(orderID) {
        return await api.UPDATE_ORDER({
            orderID,
            status: 'REFUND',
        });
    }
}