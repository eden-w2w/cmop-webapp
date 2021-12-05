import api from '@/api'

export default {
    async login({userName, password}) {
        return await api.SYS_USER_LOGIN({userName, password});
    },

    async getUserByKeywords(keywords) {
        return await api.GET_USER_BY_KEYWORD(keywords);
    },

    async getUsers(params) {
        return await api.GET_USERS(params);
    },

    async getAdmins() {
        return await api.GET_ADMINS();
    },

    async createAdmins(params = { userName, password }) {
        return await api.CREATE_ADMIN(params);
    },

    async resetPassword(params = {adminID, password}) {
        return await api.RESET_PASSWORD(params);
    },

    async getTaskFlows(params = {startTimeGte, startTimeLt, status}) {
        return await api.GET_TASK_FLOWS(params);
    },

    async getDistrict(keyword) {
        return await api.GET_DISTRICT(keyword);
    },

    async getDistrictsAll() {
        return await api.GET_DISTRICTS_ALL();
    },

    resolveDistrictsAll(items) {
        if (!items || items.length == 0) {
            return null
        }
        let nodes = []
        items.forEach(item => {
            const { adcode, name, districts, level } = item
            let node = {
                value: adcode,
                label: name,
                children: this.resolveDistrictsAll(districts),
                leaf: level == 'district' ? true : false
            }
            nodes.push(node)
        });
        return nodes
    },

    async getShippingAddress(userID) {
        return await api.GET_SHIPPING_ADDRESS(userID);
    },

    async createShippingAddress(data = {userID, recipients, district, address, mobile}) {
        return await api.CREATE_SHIPPING_ADDRESS(data);
    },

    async updateShippingAddress(data = {userID, shippingID, recipients, district, address, mobile}) {
        return await api.UPDATE_SHIPPING_ADDRESS(data);
    },

    async deleteShippingAddress(data = {userID, shippingID}) {
        return await api.DELETE_SHIPPING_ADDRESS(data);
    },

    async getSetting() {
        return await api.GET_SETTING()
    },

    async updateSetting(data = { promotionMainPicture }) {
        return await api.UPDATE_SETTING(data)
    }
}