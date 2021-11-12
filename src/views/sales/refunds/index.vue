<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">退款单列表</el-col>
                <el-col :span="20" style="text-align: right">
                    <el-input
                        v-model="search.remoteFlowID"
                        placeholder="支付系统退款单号"
                        clearable
                        @change="onSearchSelectChange"
                        style="width: 300px;"
                    ></el-input>
                    <el-input
                        v-model="search.paymentFlowID"
                        placeholder="交易单号"
                        clearable
                        @change="onSearchSelectChange"
                        style="width: 300px; margin-left: 10px"
                    ></el-input>
                    <el-input
                        v-model="search.remotePaymentFlowID"
                        placeholder="支付系统交易单号"
                        clearable
                        @change="onSearchSelectChange"
                        style="width: 300px; margin-left: 10px"
                    ></el-input>
                    <el-select v-model="search.status" placeholder="退款状态" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.refundStatus" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </template>
        <el-empty v-if="!loading && !listData.length"></el-empty>
        <el-table v-else v-loading="loading" :data="listData" style="width: 100%" stripe ref="table">
            <el-table-column prop="flowID" label="退款单编号" width="200">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="点击复制" placement="top-start">
                        <el-link v-clipboard="scope.row.flowID" v-clipboard:success="onClipboardSuccess" v-clipboard:error="onClipboardError"
                            >{{ scope.row.flowID }}<i class="el-icon-document-copy el-icon--right"></i
                        ></el-link>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="remoteFlowID" label="支付系统退款单号" width="300">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="点击复制" placement="top-start">
                        <el-link v-clipboard="scope.row.remoteFlowID" v-clipboard:success="onClipboardSuccess" v-clipboard:error="onClipboardError"
                            >{{ scope.row.remoteFlowID }}<i class="el-icon-document-copy el-icon--right"></i
                        ></el-link>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="paymentFlowID" label="交易单号" width="200">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="点击复制" placement="top-start">
                        <el-link v-clipboard="scope.row.paymentFlowID" v-clipboard:success="onClipboardSuccess" v-clipboard:error="onClipboardError"
                            >{{ scope.row.paymentFlowID }}<i class="el-icon-document-copy el-icon--right"></i
                        ></el-link>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="remotePaymentFlowID" label="支付系统交易单号" width="200">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="点击复制" placement="top-start">
                        <el-link v-clipboard="scope.row.remotePaymentFlowID" v-clipboard:success="onClipboardSuccess" v-clipboard:error="onClipboardError"
                            >{{ scope.row.remotePaymentFlowID }}<i class="el-icon-document-copy el-icon--right"></i
                        ></el-link>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="交易总额">
                <template slot-scope="scope">
                    <span class="money">{{ formatMoney(scope.row.totalAmount / 100) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="refundAmount" label="退款总额">
                <template slot-scope="scope">
                    <span class="money">{{ formatMoney(scope.row.refundAmount / 100) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="account" label="退款账户"></el-table-column>
            <el-table-column prop="channel" label="退款渠道">
                <template slot-scope="scope">
                    <el-tag effect="dark">{{ refundChannel(scope.row.channel) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="退款状态">
                <template slot-scope="scope">
                    <el-tag :type="refundStatusColor(scope.row.status)" effect="dark">{{ refundStatus(scope.row.status) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.createdAt) }}
                </template>
            </el-table-column>
            <el-table-column prop="updatedAt" label="最后更新时间">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.updatedAt) }}
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="prev, pager, next" :page-size="search.size" :total="total" hide-on-single-page @current-change="onPageChange">
            </el-pagination>
        </div>
    </d2-container>
</template>

<script>
import api from '@/api/modules/sys.sales'
import userApi from '@/api/modules/sys.user'
import format from '@/libs/util.format'

export default {
    name: 'sales_refunds',
    inject: ['reload'],
    data() {
        return {
            enums: {},
            search: {
                remoteFlowID: '',
                paymentFlowID: '',
                remotePaymentFlowID: '',
                status: '',
                offset: 0,
                size: 10
            },
            loading: true,
            listData: [],
            total: 0
        }
    },
    mounted() {
        const paymentFlowID = this.$route.query.paymentFlowID
        if (paymentFlowID) {
            this.search.paymentFlowID = paymentFlowID
        }
        api.enums().then(res => {
            this.enums = res
        })
        api.getRefundFlows(this.search).then(res => {
            this.listData = res.data
            this.total = res.total
            this.loading = false
        })
    },
    methods: {
        ...format,
        onClipboardSuccess({ value, evt }) {
            this.$notify({
                title: '已复制',
                message: value,
                type: 'success'
            })
        },
        onClipboardError({ value, evt }) {
            this.$notify.error({
                title: '复制失败',
                message: value,
            })
        },
        onSearchSelectChange() {
            this.loading = true
            api.getRefundFlows(this.search).then(res => {
                this.listData = res.data
                this.total = res.total
                this.loading = false
            })
        },
        onPageChange(pageNo) {
            this.search.offset = (pageNo - 1) * this.search.size
            this.onSearchSelectChange()
        }
    },
    computed: {}
}
</script>

<style lang="scss" scoped>
.money {
    font-size: 16px;
    font-weight: bold;
    color: #ff0000;
}
.money:before {
    content: '￥';
}
</style>
