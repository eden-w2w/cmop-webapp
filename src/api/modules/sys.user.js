import api from '@/api'

export default {
    async login({userName, password}) {
        return await api.SYS_USER_LOGIN({userName, password});
    },

    async getUserByKeywords(keywords) {
        return await api.GET_USER_BY_KEYWORD(keywords);
    },

    async getUsers(params = { userID, refererID, userName, mobile, nickName, openID, unionID }) {
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
    }
}