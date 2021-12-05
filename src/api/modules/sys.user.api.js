
export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    /**
     * @description 登录
     * @param {Object} data 登录携带的信息
     */
    SYS_USER_LOGIN({ userName, password }) {
        return request({
            url: '/v0/login',
            method: 'post',
            data: {
                userName,
                password
            }
        });
    },

    GET_USER_BY_KEYWORD(keywords) {
        return request({
            url: '/v0/userKeyword',
            method: 'get',
            params: {
                keywords
            }
        });
    },

    GET_USERS(params = { userID, refererID, userName, mobile, nickName, openID, unionID, size, offset }) {
        return request({
            url: '/v0/users',
            method: 'get',
            params
        });
    },

    GET_ADMINS() {
        return request({
            url: '/v0/admins',
            method: 'get'
        });
    },

    CREATE_ADMIN(params = { userName, password }) {
        return request({
            url: '/v0/admins',
            method: 'post',
            data: params
        })
    },

    RESET_PASSWORD({adminID, password}) {
        return request({
            url: '/v0/admins/' + adminID + '/password',
            method: 'put',
            data: {
                password
            }
        })
    },

    GET_TASK_FLOWS(params = {startTimeGte, startTimeLt, status}) {
        return request({
            url: '/v0/task_flows',
            method: 'get',
            params
        })
    },

    GET_DISTRICT(keyword) {
        return request({
            url: '/v0/districts',
            method: 'get',
            params: {
                keyword
            }
        })
    },

    GET_DISTRICTS_ALL() {
        return request({
            url: '/v0/districts_all',
            method: 'get'
        })
    },

    GET_SHIPPING_ADDRESS(userID) {
        return request({
            url: '/v0/users/' + userID + '/address',
            method: 'get'
        })
    },

    CREATE_SHIPPING_ADDRESS(data) {
        const { userID } = data
        return request({
            url: '/v0/users/' + userID + '/address',
            method: 'post',
            data
        })
    },

    UPDATE_SHIPPING_ADDRESS(data) {
        const { userID, shippingID } = data
        return request({
            url: '/v0/users/' + userID + '/address/' + shippingID,
            method: 'patch',
            data
        })
    },

    DELETE_SHIPPING_ADDRESS(data) {
        const { userID, shippingID } = data
        return request({
            url: '/v0/users/' + userID + '/address/' + shippingID,
            method: 'delete'
        })
    },

    GET_SETTING() {
        return request({
            url: '/v0/settings',
            method: 'get'
        })
    },

    UPDATE_SETTING(data) {
        return request({
            url: '/v0/settings',
            method: 'patch',
            data
        })
    }
})
