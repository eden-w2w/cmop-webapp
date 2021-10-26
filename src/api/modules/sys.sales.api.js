export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    ENUMS() {
        return request({
            url: '/v0/enums',
            method: 'get',
        });
    },

    GET_ORDERS({
        userID,
        paymentMethod,
        status,
    }) {
        return request({
            url: '/v0/orders',
            method: 'get',
            params: {
                userID,
                paymentMethod,
                status,
            }
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

    CANCEL_ORDER(orderID) {
        return request({
            url: '/v0/orders/' + orderID,
            method: 'delete'
        });
    },

    UPDATE_ORDER({ orderID, status, discountAmount, remark, recipients, shippingAddr, mobile, courierCompany, courierNumber, goods: [] }) {
        return request({
            url: '/v0/orders/' + orderID,
            method: 'patch',
            data: { status, discountAmount, remark, recipients, shippingAddr, mobile, courierCompany, courierNumber, goods }
        });
    },
});
