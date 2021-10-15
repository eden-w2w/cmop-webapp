import api from '@/api'

export default {
    async taskSettlements(name) {
        try {
            return await api.TASK_SETTLEMENTS(name);
        } catch (err) {
            console.log('[modules][taskSettlements] err: ' + err);
        }
    },

    async getPromotionFlows(params = {userID, refererID, paymentFlowID, settlementID, isNotSettlement, createGte, createLt}) {
        try {
            return await api.GET_PROMOTION_FLOWS(params);
        } catch (err) {
            console.log('[modules][getPromotionFlows] err: ' + err);
        }
    },

    async getSettlementFlows(params = {userID, name, status, createGte, createLt}) {
        try {
            return await api.GET_SETTLEMENT_FLOWS(params);
        } catch (err) {
            console.log('[modules][getSettlementFlows] err: ' + err);
        }
    },

    async actionSettlement(settlementID) {
        try {
            return await api.ACTION_SETTLEMENT(settlementID);
        } catch (err) {
            console.log('[modules][actionSettlement] err: ' + err);
        }
    }
}