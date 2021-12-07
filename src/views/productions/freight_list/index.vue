<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="2">运费模板</el-col>
                <el-col :span="22" style="text-align: right">
                    <el-input v-model="search.name" placeholder="模板名称" clearable @change="onSearchSelectChange" style="width: 200px"></el-input>
                    <el-select v-model="search.cal" placeholder="计费方式" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.freightCal" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" style="text-align: right">
                    <el-button type="primary" @click="onCreateTemplate">创建模板</el-button>
                </el-col>
            </el-row>
        </template>
        <el-empty v-if="!loading && !listData.length">
            <el-button type="primary" @click="onCreateTemplate">创建模板</el-button>
        </el-empty>
        <el-table v-else v-loading="loading" :data="listData" style="width: 100%" stripe ref="table" @expand-change="onTableExpand">
            <el-table-column type="expand">
                <template v-if="!item.row.isFreeFreight" slot-scope="item">
                    <div class="sub-title">默认运费</div>
                    <div>
                        {{
                            (item.row.cal == 'COUNT' ? '首件' : '首重') +
                            item.row.firstRange +
                            (item.row.cal == 'COUNT' ? '个，￥' : '克，￥') +
                            formatMoney(item.row.firstPrice / 100) +
                            '元，每增加' +
                            item.row.continueRange +
                            (item.row.cal == 'COUNT' ? '个，增加￥' : '克，增加￥') +
                            formatMoney(item.row.continuePrice / 100) +
                            '元'
                        }}
                    </div>
                    <div class="sub-title">自定义运费规则</div>
                    <el-empty v-if="!loadingRules && !rulesData.length">
                        <el-button type="primary" @click="onCreateTemplateRule">创建运费规则</el-button>
                    </el-empty>
                    <el-table v-else v-loading="loadingRules" :data="rulesData" stripe>
                        <el-table-column prop="ruleID" label="规则编号" width="200"></el-table-column>
                        <el-table-column prop="area" label="包含区域">
                            <template slot-scope="rule">
                                <div v-if="!showAllAreas && rule.row.area.length > 10">
                                    <el-tag style="margin-left: 5px; margin-bottom: 5px" size="small" v-for="i in 10" :key="rule.row.area[i].adCode">{{
                                        formatArea(rule.row.area[i])
                                    }}</el-tag>
                                    <el-tag type="danger" style="margin-left: 5px; margin-bottom: 5px" size="small" @click="onShowAllArea"
                                        >+{{ rule.row.area.length - 10 }}</el-tag
                                    >
                                </div>
                                <div v-else>
                                    <el-tag style="margin-left: 5px; margin-bottom: 5px" size="small" v-for="area in rule.row.area" :key="area.adCode">{{
                                        formatArea(area)
                                    }}</el-tag>
                                    <el-tag
                                        v-if="rule.row.area.length > 10"
                                        type="danger"
                                        style="margin-left: 5px; margin-bottom: 5px"
                                        size="small"
                                        @click="onHideAllArea"
                                        >收起</el-tag
                                    >
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="isFreeFreight" label="是否包邮" width="100">
                            <template slot-scope="rule">
                                {{ rule.row.isFreeFreight ? '包邮' : '自定义邮费' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="运费规则" width="400">
                            <template slot-scope="rule">
                                <span v-if="!rule.row.isFreeFreight">
                                    {{
                                        (item.row.cal == 'COUNT' ? '首件' : '首重') +
                                        rule.row.firstRange +
                                        (item.row.cal == 'COUNT' ? '个，￥' : '克，￥') +
                                        formatMoney(rule.row.firstPrice / 100) +
                                        '元，每增加' +
                                        rule.row.continueRange +
                                        (item.row.cal == 'COUNT' ? '个，增加￥' : '克，增加￥') +
                                        formatMoney(rule.row.continuePrice / 100) +
                                        '元'
                                    }}
                                </span>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200">
                            <template slot="header">
                                <el-button type="primary" @click="onCreateTemplateRule">创建运费规则</el-button>
                            </template>
                            <template slot-scope="rule">
                                <el-link type="primary" @click="onEditTemplateRule(rule.row.ruleID)">编辑</el-link>
                                <el-link style="margin-left: 10px" type="danger" @click="onDeleteTemplateRule(rule.row.ruleID)">删除</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column prop="templateID" label="模板编号" width="200"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="dispatchAddr" label="发货地"></el-table-column>
            <el-table-column prop="dispatchTime" label="发货时间">
                <template slot-scope="item">
                    {{ formatDuration(item.row.dispatchTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="isFreeFreight" label="是否全场包邮">
                <template slot-scope="item">
                    {{ item.row.isFreeFreight ? '全场包邮' : '自定义邮费' }}
                </template>
            </el-table-column>
            <el-table-column prop="cal" label="计费方式">
                <template slot-scope="item">
                    <el-tag v-if="item.row.cal" :type="freightCalColor(item.row.cal)" effect="dark">{{ freightCal(item.row.cal) }}</el-tag>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="item">
                    <el-link type="primary" @click="onEditTemplate(item.row.templateID)">编辑</el-link>
                    <el-link style="margin-left: 10px" type="danger" @click="onDeleteTemplate(item.row.templateID)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination
                layout="prev, pager, next"
                :page-size="search.size"
                :total="total"
                hide-on-single-page
                @current-change="onPageChange"
            ></el-pagination>
        </div>

        <el-drawer title="运费模板" :visible.sync="showAddTemplatePanel" direction="rtl" ref="panel" size="50%">
            <div class="pannel__content">
                <el-form :model="templateDetail" ref="templateForm" label-width="150px">
                    <el-form-item label="名称">
                        <el-input v-model="templateDetail.name"></el-input>
                    </el-form-item>
                    <el-form-item label="发货地">
                        <el-input v-model="templateDetail.dispatchAddr"></el-input>
                    </el-form-item>
                    <el-form-item label="发货时间（小时）">
                        <el-input-number v-model="templateDetail.dispatchTime" :min="0" label="发货时间（小时）"></el-input-number>
                    </el-form-item>
                    <el-form-item label="是否全场包邮">
                        <el-switch v-model="templateDetail.isFreeFreight" active-text="全场包邮" inactive-text="自定义邮费"> </el-switch>
                    </el-form-item>
                    <el-form-item v-if="!templateDetail.isFreeFreight" label="计费方式">
                        <el-select v-model="templateDetail.cal" placeholder="计费方式" clearable>
                            <el-option v-for="s in enums.freightCal" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="!templateDetail.isFreeFreight" :label="templateDetail.cal == 'COUNT' ? '首件（个）范围' : '首重（克）范围'">
                        <el-input-number v-model="templateDetail.firstRange" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item v-if="!templateDetail.isFreeFreight" :label="templateDetail.cal == 'COUNT' ? '首件（个）价格' : '首重（克）价格'">
                        <el-input
                            v-model="templateDetail.firstPriceShadow"
                            @change="onTemplatePriceChange(templateDetail, 'firstPriceShadow', 'firstPrice')"
                            @input="
                                limitInputPrice($event, templateDetail, 'firstPriceShadow')
                                $forceUpdate()
                            "
                        ></el-input>
                    </el-form-item>
                    <el-form-item v-if="!templateDetail.isFreeFreight" label="每增加">
                        <el-input-number v-model="templateDetail.continueRange" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item v-if="!templateDetail.isFreeFreight" :label="templateDetail.cal == 'COUNT' ? '续件（个）价格' : '续重（克）价格'">
                        <el-input
                            v-model="templateDetail.continuePriceShadow"
                            @change="onTemplatePriceChange(templateDetail, 'continuePriceShadow', 'continuePrice')"
                            @input="
                                limitInputPrice($event, templateDetail, 'continuePriceShadow')
                                $forceUpdate()
                            "
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="pannel__footer">
                    <el-button type="primary" @click="onSaveTemplate">保存</el-button>
                </div>
            </div>
        </el-drawer>

        <el-drawer title="模板规则" :visible.sync="showAddTemplateRulePanel" direction="rtl" ref="panel" size="50%">
            <div class="pannel__content">
                <el-form :model="ruleDetail" ref="ruleForm" label-width="150px">
                    <el-form-item label="覆盖区域">
                        <el-cascader
                            ref="addressCascader"
                            style="width: 300px"
                            v-model="areaDisplay"
                            :options="areaOptions"
                            :props="areaProps"
                            placeholder="请选择省/市/区/街道"
                            collapse-tags
                            clearable
                            @visible-change="onAreaCascaderShow"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="是否包邮">
                        <el-switch v-model="ruleDetail.isFreeFreight" active-text="包邮" inactive-text="自定义邮费"></el-switch>
                    </el-form-item>
                    <el-form-item label="用户展示话术">
                        <el-input v-model="ruleDetail.description"></el-input>
                    </el-form-item>
                    <el-form-item v-if="!ruleDetail.isFreeFreight" :label="templateDetail.cal == 'COUNT' ? '首件（个）范围' : '首重（克）范围'">
                        <el-input-number v-model="ruleDetail.firstRange" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item v-if="!ruleDetail.isFreeFreight" :label="templateDetail.cal == 'COUNT' ? '首件（个）价格' : '首重（克）价格'">
                        <el-input
                            v-model="ruleDetail.firstPriceShadow"
                            @change="onTemplatePriceChange(ruleDetail, 'firstPriceShadow', 'firstPrice')"
                            @input="
                                limitInputPrice($event, ruleDetail, 'firstPriceShadow')
                                $forceUpdate()
                            "
                        ></el-input>
                    </el-form-item>
                    <el-form-item v-if="!ruleDetail.isFreeFreight" label="每增加">
                        <el-input-number v-model="ruleDetail.continueRange" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item v-if="!ruleDetail.isFreeFreight" :label="templateDetail.cal == 'COUNT' ? '续件（个）价格' : '续重（克）价格'">
                        <el-input
                            v-model="ruleDetail.continuePriceShadow"
                            @change="onTemplatePriceChange(ruleDetail, 'continuePriceShadow', 'continuePrice')"
                            @input="
                                limitInputPrice($event, ruleDetail, 'continuePriceShadow')
                                $forceUpdate()
                            "
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="pannel__footer">
                    <el-button type="primary" @click="onSaveRule">保存</el-button>
                </div>
            </div>
        </el-drawer>
    </d2-container>
</template>

<script>
import userApi from '@/api/modules/sys.user'
import saleApi from '@/api/modules/sys.sales'
import api from '@/api/modules/sys.productions'
import format from '@/libs/util.format'
import Decimal from 'decimal.js'

export default {
    name: 'productions_freight_list',
    inject: ['reload'],
    data() {
        return {
            showAllAreas: false,
            enums: {},
            search: {
                name: '',
                cal: '',
                size: 10,
                offset: 0
            },
            total: 0,
            loading: false,
            listData: [],
            loadingRules: false,
            rulesData: [],
            showAddTemplatePanel: false,
            templateDetail: {
                templateID: '',
                name: '',
                dispatchAddr: '',
                dispatchTime: '',
                isFreeFreight: false,
                cal: '',
                firstRange: 0,
                firstPrice: 0,
                firstPriceShadow: '',
                continueRange: 0,
                continuePrice: 0,
                continuePriceShadow: ''
            },
            showAddTemplateRulePanel: false,
            searchRules: {},
            ruleDetail: {
                ruleID: '',
                area: [],
                isFreeFreight: false,
                description: '',
                firstRange: 0,
                firstPrice: 0,
                firstPriceShadow: '',
                continueRange: 0,
                continuePrice: 0,
                continuePriceShadow: ''
            },
            areaProps: {
                multiple: true
            },
            areaDisplay: [],
            areaOptions: []
        }
    },
    mounted() {
        saleApi.enums().then(res => {
            this.enums = res
        })
        this.loadData()

        const { action } = this.$route.query
        if (action == 'add_template') {
            this.onCreateTemplateRule()
        }
    },
    methods: {
        ...format,
        onShowAllArea() {
            this.showAllAreas = true
        },
        onHideAllArea() {
            this.showAllAreas = false
        },
        loadData() {
            this.loading = true
            api.getTemplates(this.search)
                .then(resp => {
                    this.loading = false
                    this.listData = resp.data
                    this.total = resp.total
                })
                .catch(() => {})
        },
        loadRules(templateID) {
            this.loadingRules = true
            let $this = this
            api.getTemplateRules(templateID, this.searchRules)
                .then(resp => {
                    this.loadingRules = false
                    this.rulesData = resp
                    this.rulesData.forEach(rule => {
                        $this.showAllAreas[rule.ruleID] = false
                    })
                })
                .catch(() => {})
        },
        onSearchSelectChange() {
            this.loadData()
        },
        onPageChange(pageNo) {
            this.search.offset = (pageNo - 1) * this.search.size
            this.onSearchSelectChange()
        },
        onCreateTemplate() {
            this.showAddTemplatePanel = true
        },
        onTemplatePriceChange: function (detail, shadow, origin) {
            detail[origin] = new Decimal(detail[shadow]).mul(new Decimal(100)).toNumber()
        },
        onSaveTemplate() {
            console.log(this.templateDetail)
            if (this.templateDetail.templateID) {
                // 更新
                api.updateTemplate(this.templateDetail.templateID, this.templateDetail)
                    .then(() => {
                        this.$message({
                            message: '已更新模板',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            } else {
                // 创建
                api.createTemplate(this.templateDetail)
                    .then(() => {
                        this.$message({
                            message: '已创建模板',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            }
        },
        onEditTemplate(id) {
            api.getTemplateByID(id)
                .then(resp => {
                    this.templateDetail = resp
                    this.templateDetail.firstPriceShadow = new Decimal(this.templateDetail.firstPrice).div(new Decimal(100)).toString()
                    this.templateDetail.continuePriceShadow = new Decimal(this.templateDetail.continuePrice).div(new Decimal(100)).toString()
                    this.showAddTemplatePanel = true
                })
                .catch(() => {})
        },
        onDeleteTemplate(id) {
            this.$confirm('此操作将删除模板 (' + id + ')，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteTemplate(id)
                    .then(() => {
                        this.$message({
                            message: '已删除模板',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            })
        },
        onEditTemplateRule(id) {
            api.getTemplateRuleByID(id)
                .then(resp => {
                    this.ruleDetail = resp
                    this.ruleDetail.firstPriceShadow = new Decimal(this.ruleDetail.firstPrice).div(new Decimal(100)).toString()
                    this.ruleDetail.continuePriceShadow = new Decimal(this.ruleDetail.continuePrice).div(new Decimal(100)).toString()
                    this.showAddTemplateRulePanel = true
                })
                .catch(() => {})
        },
        onDeleteTemplateRule(id) {
            this.$confirm('此操作将删除规则 (' + id + ')，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteTemplateRule(id)
                    .then(() => {
                        this.$message({
                            message: '已删除规则',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            })
        },
        onTableExpand(row, expanded) {
            if (expanded.length == 0) {
            }
            this.tableExpanded(row)
        },
        tableExpanded(row) {
            this.resetRules()
            api.getTemplateByID(row.templateID)
                .then(resp => {
                    this.templateDetail = resp
                    this.templateDetail.firstPriceShadow = new Decimal(this.templateDetail.firstPrice).div(new Decimal(100)).toString()
                    this.templateDetail.continuePriceShadow = new Decimal(this.templateDetail.continuePrice).div(new Decimal(100)).toString()
                    this.loadRules(row.templateID)
                })
                .catch(() => {})
        },
        resetRules() {
            this.ruleDetail = {
                ruleID: '',
                area: [],
                isFreeFreight: false,
                description: '',
                firstRange: 0,
                firstPrice: 0,
                firstPriceShadow: '',
                continueRange: 0,
                continuePrice: 0,
                continuePriceShadow: ''
            }
        },
        onAreaCascaderShow(show) {
            if (show && this.areaOptions.length == 0) {
                userApi
                    .getDistrictsAll()
                    .then(resp => {
                        let nodes = userApi.resolveDistrictsAll(resp[0].districts)
                        this.areaOptions = nodes
                    })
                    .catch(() => {})
            }
        },
        onCreateTemplateRule() {
            this.showAddTemplateRulePanel = true
        },
        onSaveRule() {
            let nodes = this.$refs['addressCascader'].getCheckedNodes()
            nodes = nodes.filter(node => node.isLeaf)
            nodes = nodes.map(this.retrieveArea)
            this.ruleDetail.area = nodes
            console.log(this.ruleDetail)
            if (this.ruleDetail.ruleID) {
                // 更新
                api.updateTemplateRule(this.ruleDetail.ruleID, this.ruleDetail)
                    .then(() => {
                        this.$message({
                            message: '已更新规则',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            } else {
                // 创建
                api.createTemplateRule(this.templateDetail.templateID, this.ruleDetail)
                    .then(() => {
                        this.$message({
                            message: '已创建规则',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            }
        },
        retrieveArea(item) {
            return {
                adCode: item.value,
                name: item.label,
                level: item.level == 1 ? 'province' : item.level == 2 ? 'city' : item.level == 3 ? 'district' : 'UNKNOWN',
                parent: item.parent ? this.retrieveArea(item.parent) : null
            }
        }
    },
    computed: {}
}
</script>

<style lang="scss" scoped>
</style>
