import api from '@/api'

export default {
    async login({userName, password}) {
        try {
            return await api.SYS_USER_LOGIN({userName, password});
        } catch (err) {
            console.log('[modules][login] err: ' + err);
        }
    }
}