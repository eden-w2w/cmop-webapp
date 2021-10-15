import api from '@/api'

export default {
    async login({userName, password}) {
        try {
            return await api.SYS_USER_LOGIN({userName, password});
        } catch (err) {
            console.log('[modules][login] err: ' + err);
        }
    },

    async getUserByKeywords(keywords) {
        try {
            return await api.GET_USER_BY_KEYWORD(keywords);
        } catch (err) {
            console.log('[modules][getUserByKeywords] err: ' + err);
        }
    },

    async getUsers(params = { userID, refererID, userName, mobile, nickName, openID, unionID }) {
        try {
            return await api.GET_USERS(params);
        } catch (err) {
            console.log('[modules][getUsers] err: ' + err);
        }
    },

    async getAdmins() {
        try {
            return await api.GET_ADMINS();
        } catch (err) {
            console.log('[modules][getAdmins] err: ' + err);
        }
    },

    async createAdmins(params = { userName, password }) {
        try {
            return await api.CREATE_ADMIN(params);
        } catch (err) {
            console.log('[modules][createAdmins] err: ' + err);
        }
    },

    async resetPassword(params = {adminID, password}) {
        try {
            return await api.RESET_PASSWORD(params);
        } catch (err) {
            console.log('[modules][resetPassword] err: ' + err);
        }
    }
}