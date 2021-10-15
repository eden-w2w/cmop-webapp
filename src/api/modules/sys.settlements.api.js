import { method } from "lodash"

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    TASK_SETTLEMENTS(name) {
        return request({
            url: '/v0/settlements',
            method: 'post',
            data: {
                name
            }
        })
    },

    GET_PROMOTION_FLOWS(params = { userID, refererID, paymentFlowID, settlementID, isNotSettlement, createGte, createLt }) {
        return request({
            url: '/v0/promotion_flows',
            method: 'get',
            params
        })
    },

    GET_SETTLEMENT_FLOWS(params = { userID, name, status, createGte, createLt }) {
        return request({
            url: '/v0/settlements',
            method: 'get',
            params
        })
    },

    ACTION_SETTLEMENT(settlementID) {
        return request({
            url: '/v0/settlements/' + settlementID + '/action',
            method: 'post'
        })
    }
})