import api from '@/api'

export default {
    async enums() {
        return await api.ENUMS();
    },

    async getOrders(params) {
        return await api.GET_ORDERS(params);
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

    async getOrderPayment(orderID) {
        return await api.GET_ORDER_PAYMENT(orderID);
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
    },

    async getPaymentFlows(params) {
        return await api.GET_PAYMENTS(params);
    },

    async getRefundFlows(params) {
        return await api.GET_REFUNDS(params);
    },

    async getBookingFlows(params) {
        return await api.GET_BOOKING_FLOWS(params);
    },

    async getDiscounts(params) {
        return await api.GET_DISCOUNTS(params);
    },

    async getDiscountByID(params) {
        return await api.GET_DISCOUNT_BY_ID(params);
    },

    async createDiscount(params) {
        return await api.CREATE_DISCOUNT(params);
    },

    async updateDiscount(id, params) {
        return await api.UPDATE_DISCOUNT(id, params);
    },

    async startDiscount(id) {
        return await api.START_DISCOUNT(id);
    },

    async stopDiscount(id) {
        return await api.STOP_DISCOUNT(id);
    },

    async deleteDiscount(id) {
        return await api.DELETE_DISCOUNT(id);
    },

    async getBookingFlowByID(id) {
        return await api.GET_BOOKING_FLOW_BY_ID(id)
    },

    async updateBookingFlow(id, data) {
        return await api.UPDATE_BOOKING_FLOW(id, data)
    },

    async createBookingFlow(data) {
        return await api.CREATE_BOOKING_FLOW(data);
    },

    async startBookingFlow(id) {
        return await api.START_BOOKING_FLOW(id);
    },

    async completeBookingFlow(id) {
        return await api.COMPLETE_BOOKING_FLOW(id);
    }
}