export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    ENUMS() {
        return request({
            url: '/v0/enums',
            method: 'get',
        });
    },

    GET_ORDERS( params = {
        userID,
        paymentMethod,
        status,
        size,
        offset
    }) {
        return request({
            url: '/v0/orders',
            method: 'get',
            params
        });
    },

    GET_ORDER(orderID) {
        return request({
            url: '/v0/orders/' + orderID,
            method: 'get'
        });
    },

    GET_ORDER_GOODS(orderID) {
        return request({
            url: '/v0/orders/' + orderID + '/goods',
            method: 'get'
        });
    },

    GET_ORDER_LOGISTICS(orderID) {
        return request({
            url: '/v0/orders/' + orderID + '/logistics',
            method: 'get'
        });
    },

    GET_ORDER_PAYMENT(orderID) {
        return request({
            url: '/v0/orders/' + orderID + '/payments/complete',
            method: 'get'
        });
    },

    CANCEL_ORDER(orderID) {
        return request({
            url: '/v0/orders/' + orderID,
            method: 'delete'
        });
    },

    UPDATE_ORDER({ orderID, status, discountAmount, remark, recipients, shippingAddr, mobile, courierCompany, courierNumber, goods }) {
        return request({
            url: '/v0/orders/' + orderID,
            method: 'patch',
            data: { status, discountAmount, remark, recipients, shippingAddr, mobile, courierCompany, courierNumber, goods }
        });
    },

    GET_PAYMENTS(params = {userID, orderID, paymentMethod, status, size, offset}) {
        return request({
            url: '/v0/payment_flows',
            method: 'get',
            params
        });
    },

    GET_REFUNDS(params = {remoteFlowID, paymentFlowID, remotePaymentFlowID, status, size, offset}) {
        return request({
            url: '/v0/refund_flows',
            method: 'get',
            params
        })
    },

    GET_BOOKING_FLOWS(params = {goodsID, type, status, startTimeBegin, startTimeEnd, endTimeBegin, endTimeEnd}) {
        return request({
            url: '/v0/booking_flows',
            method: 'get',
            params
        })
    }
});
