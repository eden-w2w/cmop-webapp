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
    },

    GET_DISCOUNTS(params = {type, status, cal, size, offset}) {
        return request({
            url: '/v0/discounts',
            method: 'get',
            params
        })
    },

    GET_DISCOUNT_BY_ID(id) {
        return request({
            url: '/v0/discounts/' + id,
            method: 'get'
        })
    },

    CREATE_DISCOUNT(data = {name, type, cal, validityStart, validityEnd, userLimit, limit, discountLimit, discountRate, multiStepRate, discountAmount, multiStepReduction}) {
        return request({
            url: '/v0/discounts',
            method: 'post',
            data
        })
    },

    UPDATE_DISCOUNT(discountID, data = {name, status, validityStart, validityEnd, userLimit, limit, times, discountLimit, discountRate, multiStepRate, discountAmount, multiStepReduction}) {
        return request({
            url: '/v0/discounts/' + discountID,
            method: 'patch',
            data
        })
    },

    START_DISCOUNT(id) {
        return request({
            url: '/v0/discounts/' + id + '/start',
            method: 'post'
        })
    },

    STOP_DISCOUNT(id) {
        return request({
            url: '/v0/discounts/' + id + '/stop',
            method: 'post'
        })
    },

    DELETE_DISCOUNT(id) {
        return request({
            url: '/v0/discounts/' + id,
            method: 'delete'
        })
    }
});
