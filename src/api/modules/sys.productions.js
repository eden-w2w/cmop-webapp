import api from '@/api'

export default {
    async getGoods() {
        return await api.SYS_GET_GOODS();
    },
    async getGoodsByID(id) {
        return await api.SYS_GET_GOODS_BY_ID({
            id
        });
    },
    async updateGoods(goods) {
        return await api.UPDATE_GOODS(goods);
    },
    async createGoods(goods) {
        return await api.CREATE_GOODS(goods);
    },
    async upload({key, data}) {
        return await api.UPLOAD({key, data});
    },
    async createTemplate(data) {
        return await api.CREATE_TEMPLATE(data);
    },
    async createTemplateRule(templateID, data) {
        return await api.CREATE_TEMPLATE_RULE(templateID, data);
    },
    async deleteTemplate(templateID) {
        return await api.DELETE_TEMPLATE(templateID);
    },
    async deleteTemplateRule(ruleID) {
        return await api.DELETE_TEMPLATE_RULE(ruleID);
    },
    async getTemplateRuleByID(ruleID) {
        return await api.GET_TEMPLATE_RULE_BY_ID(ruleID);
    },
    async getTemplateRules(templateID, params) {
        return await api.GET_TEMPLATE_RULES(templateID, params);
    },
    async getTemplateByID(templateID) {
        return await api.GET_TEMPLATE_BY_ID(templateID);
    },
    async getTemplates(params) {
        return await api.GET_TEMPLATES(params);
    },
    async updateTemplate(templateID, data) {
        return await api.UPDATE_TEMPLATE(templateID, data);
    },
    async updateTemplateRule(ruleID, data) {
        return await api.UPDATE_TEMPLATE_RULE(ruleID, data);
    },
}