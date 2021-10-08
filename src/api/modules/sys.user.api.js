
export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    /**
     * @description 登录
     * @param {Object} data 登录携带的信息
     */
    SYS_USER_LOGIN({userName, password}) {
        return request({
            url: '/v0/login',
            method: 'post',
            data: {
                userName,
                password
            }
        });
    }
})
