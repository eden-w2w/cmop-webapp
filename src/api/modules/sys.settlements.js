import api from '@/api'

export default {
    async taskSettlements(name) {
        return await api.TASK_SETTLEMENTS(name);
    },

    async getPromotionFlows(params = {userID, refererID, paymentFlowID, settlementID, isNotSettlement, createGte, createLt}) {
        return await api.GET_PROMOTION_FLOWS(params);
    },

    async getSettlementFlows(params = {userID, name, status, createGte, createLt}) {
        return await api.GET_SETTLEMENT_FLOWS(params);
    },

    async actionSettlement(settlementID) {
        return await api.ACTION_SETTLEMENT(settlementID);
    }
}