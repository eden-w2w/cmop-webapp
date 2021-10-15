import api from '@/api'

export default {
    async enums() {
        try {
            return await api.ENUMS();
        } catch (err) {
            console.log('[modules][sales] enums err: ' + err);
        }
    },

    async getOrders({
        userID,
        paymentMethod,
        status,
    }) {
        try {
            return await api.GET_ORDERS({ userID, paymentMethod, status });
        } catch (err) {
            console.log('[modules][sales] getOrders err: ' + err);
        }
    },

    async getOrderGoods(orderID) {
        try {
            return await api.GET_ORDER_GOODS(orderID);
        } catch (err) {
            console.log('[modules][sales] getOrderGoods err: ' + err);
        }
    },

    async getOrderLogistics(orderID) {
        try {
            return await api.GET_ORDER_LOGISTICS(orderID);
        } catch (err) {
            console.log('[modules][sales] getOrderLogistics err: ' + err);
        }
    },

    async cancelOrder(orderID) {
        try {
            return await api.CANCEL_ORDER(orderID);
        } catch (err) {
            console.log('[modules][sales] cancelOrder err: ' + err);
        }
    },

    async confirmOrder(orderID) {
        try {
            return await api.UPDATE_ORDER({
                orderID,
                status: 'CONFIRM',
            });
        } catch (err) {
            console.log('[modules][sales] confirmOrder err: ' + err);
        }
    },

    async dispatchOrder({ orderID, courierCompany, courierNumber }) {
        if (!orderID || !courierCompany || !courierNumber) {
            return;
        }
        try {
            return await api.UPDATE_ORDER({
                orderID,
                status: 'DISPATCH',
                courierCompany,
                courierNumber
            });
        } catch (err) {
            console.log('[modules][sales] completeOrder err: ' + err);
        }
    },

    async completeOrder(orderID) {
        try {
            return await api.UPDATE_ORDER({
                orderID,
                status: 'COMPLETE',
            });
        } catch (err) {
            console.log('[modules][sales] completeOrder err: ' + err);
        }
    },

    async refundOrder(orderID) {
        try {
            return await api.UPDATE_ORDER({
                orderID,
                status: 'REFUND',
            });
        } catch (err) {
            console.log('[modules][sales] refundOrder err: ' + err);
        }
    }
}