<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">佣金管理</el-col>
                <el-col :span="3" style="text-align: right">
                    <el-button type="primary" @click="onTaskSettlements">启动系统结算任务</el-button>
                </el-col>
            </el-row>
        </template>

        <el-tabs v-model="activeTabName" type="card" @tab-click="onTabClick">
            <el-tab-pane label="佣金流水单" name="commission">
                <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="4">
                        <el-select
                            style="width: 100%"
                            v-model="commissionSearch.userID"
                            filterable
                            remote
                            clearable
                            placeholder="请输入奖励用户昵称或OpenID"
                            :remote-method="onSearchUserID"
                            :loading="commissionLoadingUser"
                            @change="onSearchSelectChange"
                        >
                            <el-option v-for="u in commissionUserList" :key="u.userID" :label="u.nickName" :value="u.userID">
                                <span style="float: left">{{ u.nickName }}</span>
                                <span style="float: right">
                                    <el-tag size="mini">{{ u.openID }}</el-tag>
                                </span>
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select
                            style="width: 100%"
                            v-model="commissionSearch.refererID"
                            filterable
                            remote
                            clearable
                            placeholder="请输入来源用户昵称或OpenID"
                            :remote-method="onSearchRefererID"
                            :loading="commissionLoadingReferer"
                            @change="onSearchSelectChange"
                        >
                            <el-option v-for="u in commissionRefererList" :key="u.userID" :label="u.nickName" :value="u.userID">
                                <span style="float: left">{{ u.nickName }}</span>
                                <span style="float: right">
                                    <el-tag size="mini">{{ u.openID }}</el-tag>
                                </span>
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-input
                            v-model="commissionSearch.paymentFlowID"
                            clearable
                            placeholder="请输入支付流水单号"
                            style="width: 100%"
                            @change="onSearchSelectChange"
                        ></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input
                            v-model="commissionSearch.settlementID"
                            clearable
                            placeholder="请输入结算单号"
                            style="width: 100%"
                            @change="onSearchSelectChange"
                        ></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-date-picker
                            v-model="commissionDateRange"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            @change="onSearchSelectChange"
                        >
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="commissionIsNotSettle" @change="onSearchSelectChange">只查询未结算的佣金流水</el-checkbox>
                    </el-col>
                </el-row>
                <el-empty v-if="!commissionLoading && !commissionList.length"></el-empty>
                <el-table v-else v-loading="commissionLoading" :data="commissionList" style="width: 100%" stripe>
                    <el-table-column prop="flowID" label="流水编号" width="200"></el-table-column>
                    <el-table-column label="获得奖励用户" width="250">
                        <template slot-scope="scope">
                            <el-row>{{ scope.row.userNickName }}</el-row>
                            <el-row>
                                <el-tag size="mini">{{ scope.row.userOpenID }}</el-tag>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="来源用户" width="250">
                        <template slot-scope="scope">
                            <el-row>{{ scope.row.refererNickName }}</el-row>
                            <el-row>
                                <el-tag size="mini">{{ scope.row.refererOpenID }}</el-tag>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单金额">
                        <template slot-scope="scope">
                            <span class="money">{{ formatMoney(scope.row.amount / 100) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="关联支付流水">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.paymentFlowID != '0'" @click="onPaymentDetail($event, scope.row.paymentFlowID)"
                                >{{ scope.row.paymentFlowID }}<i class="el-icon-view el-icon--right"></i
                            ></el-link>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="关联结算流水">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.settlementID != '0'" @click="onSettlementDetail($event, scope.row.settlementID)"
                                >{{ scope.row.settlementID }}<i class="el-icon-view el-icon--right"></i
                            ></el-link>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdAt" label="创建时间">
                        <template slot-scope="scope">
                            {{ formatDatatime(scope.row.createdAt) }}
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination layout="prev, pager, next" :page-size="commissionSize" :total="commissionTotal" hide-on-single-page> </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="结算流水单" name="settlement">
                <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="4">
                        <el-select
                            style="width: 100%"
                            v-model="settlementSearch.userID"
                            filterable
                            remote
                            clearable
                            placeholder="请输入结算用户昵称或OpenID"
                            :remote-method="onSearchSettlementUserID"
                            :loading="settlementLoadingUser"
                            @change="onSettlementSearchSelectChange"
                        >
                            <el-option v-for="u in settlementUserList" :key="u.userID" :label="u.nickName" :value="u.userID">
                                <span style="float: left">{{ u.nickName }}</span>
                                <span style="float: right">
                                    <el-tag size="mini">{{ u.openID }}</el-tag>
                                </span>
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-input
                            v-model="settlementSearch.name"
                            clearable
                            placeholder="请输入结算单名称"
                            style="width: 100%"
                            @change="onSettlementSearchSelectChange"
                        ></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-select v-model="settlementSearch.status" placeholder="结算状态" clearable @change="onSettlementSearchSelectChange" style="width:100%">
                            <el-option v-for="s in enums.settlementStatus" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-date-picker
                            v-model="settlementDateRange"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            @change="onSettlementSearchSelectChange"
                        >
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-empty v-if="!settlementLoading && !settlementList.length"></el-empty>
                <el-table v-else v-loading="settlementLoading" :data="settlementList" style="width: 100%" stripe>
                    <el-table-column prop="settlementID" label="结算单编号" width="200"></el-table-column>
                    <el-table-column label="结算用户" width="250">
                        <template slot-scope="scope">
                            <el-row>{{ scope.row.nickName }}</el-row>
                            <el-row>
                                <el-tag size="mini">{{ scope.row.openID }}</el-tag>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column label="销售总额">
                        <template slot-scope="scope">
                            <span class="money">{{ formatMoney(scope.row.totalSales / 100) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="proportion" label="结算比例"></el-table-column>
                    <el-table-column label="结算金额">
                        <template slot-scope="scope">
                            <span class="money">{{ formatMoney(scope.row.amount / 100) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算状态">
                        <template slot-scope="scope">
                            <el-tag :type="settlementStatusColor(scope.row.status)" effect="dark">{{ settlementStatus(scope.row.status) }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdAt" label="创建时间">
                        <template slot-scope="scope">
                            {{ formatDatatime(scope.row.createdAt) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-link type="primary" v-if="scope.row.status == 'CREATED'" @click="onBtnSettlement(scope.row.settlementID)">结算</el-link>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination layout="prev, pager, next" :page-size="settlementSize" :total="settlementTotal" hide-on-single-page> </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </d2-container>
</template>

<script>
import api from '@/api/modules/sys.settlements'
import salesApi from '@/api/modules/sys.sales'
import userApi from '@/api/modules/sys.user'
import format from '@/libs/util.format'

export default {
    name: 'customers_commission',
    inject: ['reload'],
    data() {
        return {
            activeTabName: 'commission',
            enums: {},
            commissionSearch: {
                userID: '',
                refererID: '',
                paymentFlowID: '',
                settlementID: '',
                isNotSettlement: '',
                createGte: '',
                createLt: ''
            },
            commissionDateRange: [],
            commissionIsNotSettle: false,
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            },
            commissionLoadingUser: false,
            commissionUserList: [],
            commissionLoadingReferer: false,
            commissionRefererList: [],
            commissionLoading: false,
            commissionList: [],
            commissionTotal: 0,
            commissionSize: 10,

            settlementSearch: {
                userID: '',
                name: '',
                status: '',
                createGte: '',
                createLt: ''
            },
            settlementDateRange: [],
            settlementLoadingUser: false,
            settlementUserList: [],
            settlementLoading: false,
            settlementList: [],
            settlementTotal: 0,
            settlementSize: 10
        }
    },
    mounted() {
        this.loadCommission({})
        salesApi.enums().then(res => {
            this.enums = res
        })
    },
    methods: {
        ...format,
        loadCommission(searchParams) {
            this.commissionLoading = true
            api.getPromotionFlows(searchParams).then(res => {
                this.commissionLoading = false
                this.commissionList = res.data
                this.commissionTotal = res.total
            })
        },
        loadSettlement(searchParams) {
            this.settlementLoading = true
            api.getSettlementFlows(searchParams).then(res => {
                this.settlementLoading = false
                this.settlementList = res.data
                this.settlementTotal = res.total
            })
        },
        onTaskSettlements() {
            this.$prompt('即将执行系统结算任务，请输入任务名称，例如"第18周"', '系统结算', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showInput: true,
                inputValidator: function (val) {
                    if (!val) {
                        return '请输入结算任务名称'
                    }
                    return true
                }
            }).then(({ value }) => {
                api.taskSettlements(value).then(res => {
                    this.$message({
                        message: '已成功执行结算任务',
                        type: 'success'
                    })
                })
            })
        },

        onSearchUserID(query) {
            this.commissionLoadingUser = true
            userApi.getUserByKeywords(query).then(res => {
                this.commissionLoadingUser = false
                this.commissionUserList = res
            })
        },
        onSearchRefererID(query) {
            this.commissionLoadingReferer = true
            userApi.getUserByKeywords(query).then(res => {
                this.commissionLoadingReferer = false
                this.commissionRefererList = res
            })
        },
        onSearchSettlementUserID(query) {
            this.settlementLoadingUser = true
            userApi.getUserByKeywords(query).then(res => {
                this.settlementLoadingUser = false
                this.settlementUserList = res
            })
        },

        getLocalISOTime(twDate) {
            var d = new Date(twDate)
            var utcd = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds())

            let localOffset = d.getTimezoneOffset() * 60000 + 8 * 60 * 60000
            var newdate = new Date(utcd + localOffset)
            return newdate.toISOString().replace('.000', '')
        },

        onSearchSelectChange() {
            if (this.commissionDateRange.length == 2 && this.commissionDateRange[0] && this.commissionDateRange[1]) {
                this.commissionSearch.createGte = this.getLocalISOTime(this.commissionDateRange[0])
                this.commissionSearch.createLt = this.getLocalISOTime(this.commissionDateRange[1])
            } else {
                this.commissionSearch.createGte = ''
                this.commissionSearch.createLt = ''
            }
            if (this.commissionIsNotSettle) {
                this.commissionSearch.isNotSettlement = 'true'
            } else {
                this.commissionSearch.isNotSettlement = ''
            }
            this.loadCommission(this.commissionSearch)
        },

        onSettlementSearchSelectChange() {
            if (this.settlementDateRange.length == 2 && this.settlementDateRange[0] && this.settlementDateRange[1]) {
                this.settlementSearch.createGte = this.getLocalISOTime(this.settlementDateRange[0])
                this.settlementSearch.createLt = this.getLocalISOTime(this.settlementDateRange[1])
            } else {
                this.settlementSearch.createGte = ''
                this.settlementSearch.createLt = ''
            }
            this.loadSettlement(this.settlementSearch)
        },

        onPaymentDetail(evt, id) {},

        onSettlementDetail(evt, id) {},

        onTabClick(tab) {
            if (tab.name == 'commission') {
                this.loadCommission(this.commissionSearch)
            } else if (tab.name == 'settlement') {
                this.loadSettlement(this.settlementSearch)
            }
        },

        onBtnSettlement(id) {
            let $this = this
            this.$confirm('此操作会将结算单(' + id + ')状态变更为（已结算），是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.actionSettlement(id).then(res => {
                    $this.reload()
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
