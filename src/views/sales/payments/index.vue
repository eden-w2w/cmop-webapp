<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">支付单列表</el-col>
                <el-col :span="20" style="text-align: right">
                    <el-select
                        style="width: 300px"
                        v-model="search.userID"
                        filterable
                        remote
                        clearable
                        placeholder="请输入昵称或OpenID"
                        :remote-method="onSearchUserID"
                        :loading="loadingUser"
                        @change="onSearchSelectChange"
                    >
                        <el-option v-for="u in userList" :key="u.userID" :label="u.nickName" :value="u.userID">
                            <span style="float: left">{{ u.nickName }}</span>
                            <span style="float: right">
                                <el-tag size="mini">{{ u.openID }}</el-tag>
                            </span>
                        </el-option>
                    </el-select>
                    <el-input
                        v-model="search.orderID"
                        placeholder="所属订单号"
                        clearable
                        @change="onSearchSelectChange"
                        style="width: 200px; margin-left: 10px"
                    ></el-input>
                    <el-select v-model="search.status" placeholder="支付状态" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.paymentStatus" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                    <el-select v-model="search.paymentMethod" placeholder="支付方式" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.paymentMethod" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </template>
        <el-empty v-if="!loading && !listData.length"></el-empty>
        <el-table v-else v-loading="loading" :data="listData" style="width: 100%" stripe ref="table">
            <el-table-column prop="flowID" label="支付单编号" width="200"></el-table-column>
            <el-table-column prop="userID" label="所属用户" width="200">
                <template slot-scope="item">
                    <el-link @click="onUserDetail($event, item.row.userID)">{{ item.row.userID }}<i class="el-icon-view el-icon--right"></i></el-link>
                </template>
            </el-table-column>
            <el-table-column prop="orderID" label="关联订单号" width="200">
                <template slot-scope="item">
                    <el-link @click="onOrderDetail($event, item.row.orderID)">{{ item.row.orderID }}<i class="el-icon-view el-icon--right"></i></el-link>
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="支付金额">
                <template slot-scope="scope">
                    <span class="money">{{ formatMoney(scope.row.amount / 100) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="paymentMethod" label="支付方式">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark">{{ paymentMethod(scope.row.paymentMethod) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="remoteFlowID" label="支付系统交易号"></el-table-column>
            <el-table-column prop="status" label="支付状态">
                <template slot-scope="scope">
                    <el-tag :type="paymentStatusColor(scope.row.status)" effect="dark">{{ paymentStatus(scope.row.status) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.createdAt) }}
                </template>
            </el-table-column>
            <el-table-column prop="expiredAt" label="超时时间">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.expiredAt) }}
                </template>
            </el-table-column>
            <el-table-column prop="updatedAt" label="最后更新时间">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.updatedAt) }}
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="prev, pager, next" :page-size="search.size" :total="total" hide-on-single-page @current-change="onPageChange"> </el-pagination>
        </div>
    </d2-container>
</template>

<script>
import api from '@/api/modules/sys.sales'
import userApi from '@/api/modules/sys.user'
import format from '@/libs/util.format'

export default {
    name: 'sales_payments',
    inject: ['reload'],
    data() {
        return {
            enums: {},
            search: {
                orderID: '',
                userID: '',
                status: '',
                paymentMethod: '',
                offset: 0,
                size: 10
            },
            userList: [],
            loadingUser: false,
            loading: true,
            listData: [],
            total: 0
        }
    },
    mounted() {
        api.enums().then(res => {
            this.enums = res
        })
        api.getPaymentFlows({}).then(res => {
            this.listData = res.data
            this.total = res.total
            this.loading = false
        })
    },
    methods: {
        ...format,
        onSearchUserID(query) {
            this.loadingUser = true
            userApi.getUserByKeywords(query).then(res => {
                this.loadingUser = false
                this.userList = res
            })
        },
        onSearchSelectChange() {
            this.loading = true
            api.getPaymentFlows(this.search).then(res => {
                this.listData = res.data
                this.total = res.total
                this.loading = false
            })
        },
        onPageChange(pageNo) {
            console.log(pageNo)
        },

        onUserDetail(evt, userID) {
            this.$router.push({
                path: '/customers/customer_detail',
                query: {
                    userID
                }
            })
        },

        onOrderDetail(evt, orderID) {
            this.$router.push({
                path: '/sales/save',
                query: {
                    orderID
                }
            })
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
