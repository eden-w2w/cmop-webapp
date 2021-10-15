
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

    GET_USERS(params = { userID, refererID, userName, mobile, nickName, openID, unionID }) {
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
    }
})
