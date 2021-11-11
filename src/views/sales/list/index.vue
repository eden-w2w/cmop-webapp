<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">订单列表</el-col>
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
                    <el-select v-model="search.status" placeholder="订单状态" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.orderStatus" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                    <el-select v-model="search.paymentMethod" placeholder="支付方式" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.paymentMethod" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3" style="text-align: right">
                    <el-button type="primary" @click="onCreateOrder">创建订单</el-button>
                </el-col>
            </el-row>
        </template>
        <el-empty v-if="!loading && !listData.length">
            <el-button type="primary" @click="onCreateOrder">创建订单</el-button>
        </el-empty>
        <el-table v-else v-loading="loading" :data="listData" style="width: 100%" stripe ref="table" @expand-change="onTableExpand">
            <el-table-column type="expand">
                <template slot-scope="item">
                    <div class="sub-title">商品列表</div>
                    <el-table :v-loading="item.row.isLoadingGoods" :data="item.row.goods" style="width: 100%" stripe>
                        <el-table-column prop="goodsID" label="商品编号" width="100"></el-table-column>
                        <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
                        <el-table-column prop="amount" label="数量"></el-table-column>
                        <el-table-column prop="specifications" label="规格">
                            <template slot-scope="scope">
                                <el-row v-for="spec in scope.row.specifications" v-bind:key="spec">
                                    <el-tag size="mini">{{ spec }}</el-tag>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column prop="activities" label="参与活动">
                            <template slot-scope="scope">
                                <el-row v-for="spec in scope.row.activities" v-bind:key="spec">
                                    <el-tag size="mini">{{ spec }}</el-tag>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column prop="price" label="价格">
                            <template slot-scope="scope">
                                <span class="money">{{ formatMoney(scope.row.price / 100) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="总价格">
                            <template slot-scope="scope">
                                <span class="money">{{ formatMoney((scope.row.amount * scope.row.price) / 100) }}</span>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="sub-title" v-if="item.row.status != 'CREATED'">支付信息</div>
                    <el-table
                        v-if="item.row.status != 'CREATED'"
                        :v-loading="item.row.isLoadingPayment"
                        :data="item.row.payment"
                        style="width: 100%"
                        :show-header="false"
                        stripe
                    >
                        <el-table-column prop="key" width="150"></el-table-column>
                        <el-table-column prop="value"></el-table-column>
                    </el-table>

                    <div class="sub-title">物流信息</div>
                    <el-table :v-loading="item.row.isLoadingLogistics" :data="item.row.logistics" style="width: 100%" :show-header="false" stripe>
                        <el-table-column prop="key" width="150"></el-table-column>
                        <el-table-column prop="value"></el-table-column>
                    </el-table>

                    <div class="sub-title">订单操作</div>
                    <el-button
                        type="primary"
                        @click="onEditOrder($event, item.row.orderID)"
                        v-if="item.row.status != 'DISPATCH' && item.row.status != 'COMPLETE' && item.row.status != 'CLOSED' && item.row.status != 'REFUND'"
                        >编辑订单</el-button
                    >
                    <order-operator style="margin-left: 10px" :id="item.row.orderID" :status="item.row.status" :show="true"></order-operator>
                </template>
            </el-table-column>
            <el-table-column prop="orderID" label="订单编号" width="200"></el-table-column>
            <el-table-column prop="userID" label="所属用户" width="300">
                <template slot-scope="scope">
                    <el-row>{{ scope.row.nickName }}</el-row>
                    <el-row>
                        <el-tag size="mini">{{ scope.row.userOpenID }}</el-tag>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="订单总额">
                <template slot-scope="scope">
                    <span class="money">{{ formatMoney(scope.row.totalPrice / 100) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="discountAmount" label="优惠金额">
                <template slot-scope="scope">
                    <span class="money">{{ formatMoney(scope.row.discountAmount / 100) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="actualAmount" label="实际金额">
                <template slot-scope="scope">
                    <span class="money">{{ formatMoney(scope.row.actualAmount / 100) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="paymentMethod" label="支付方式">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark">{{ paymentMethod(scope.row.paymentMethod) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态">
                <template slot-scope="scope">
                    <el-tag :type="orderStatusColor(scope.row.status)" effect="dark">{{ orderStatus(scope.row.status) }}</el-tag>
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
            <el-pagination layout="prev, pager, next" :page-size="search.size" :total="total" hide-on-single-page @current-change="onPageChange"></el-pagination>
        </div>
    </d2-container>
</template>

<script>
import api from '@/api/modules/sys.sales'
import userApi from '@/api/modules/sys.user'
import format from '@/libs/util.format'
import OrderOperator from '@/components/order-operator'

export default {
    name: 'sales_list',
    inject: ['reload'],
    components: { OrderOperator },
    data() {
        return {
            enums: {},
            search: {
                userID: '',
                status: '',
                paymentMethod: '',
                size: 10,
                offset: 0
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
        api.getOrders(this.search).then(res => {
            this.listData = res.data
            this.total = res.total
            this.loading = false

            for (let i = 0; i < this.listData.length; i++) {
                this.listData[i].isLoadingGoods = true
                this.listData[i].goods = []
                this.listData[i].isLoadingLogistics = true
                this.listData[i].logistics = []
                this.listData[i].isLoadingPayment = true
                this.listData[i].payment = []
            }
        })
    },
    methods: {
        ...format,
        onCreateOrder() {
            this.$router.push({
                path: '/sales/save'
            })
        },
        onSearchUserID(query) {
            this.loadingUser = true
            userApi.getUserByKeywords(query).then(res => {
                this.loadingUser = false
                this.userList = res
            })
        },
        onSearchSelectChange() {
            this.loading = true
            api.getOrders(this.search).then(res => {
                this.listData = res.data
                this.total = res.total
                this.loading = false

                for (let i = 0; i < this.listData.length; i++) {
                    this.listData[i].isLoadingGoods = true
                    this.listData[i].goods = []
                    this.listData[i].isLoadingLogistics = true
                    this.listData[i].logistics = []
                    this.listData[i].isLoadingPayment = true
                    this.listData[i].payment = []
                }
            })
        },
        onTableExpand(row, expanded) {
            if (expanded.length == 0) {
            }
            this.tableExpanded(row)
        },
        tableExpanded(row) {
            if (row.goods.length == 0) {
                api.getOrderGoods(row.orderID).then(res => {
                    row.isLoadingGoods = false
                    row.goods.push(...res)
                })
            }
            if (row.logistics.length == 0) {
                api.getOrderLogistics(row.orderID).then(res => {
                    row.isLoadingLogistics = false
                    row.logistics.push(
                        {
                            key: '收件地址',
                            value: res.shippingAddr
                        },
                        {
                            key: '收件人',
                            value: res.recipients
                        },
                        {
                            key: '联系电话',
                            value: res.mobile
                        },
                        {
                            key: '物流公司',
                            value: res.courierCompany
                        },
                        {
                            key: '快递单号',
                            value: res.courierNumber
                        }
                    )
                })
            }
            if (row.status != 'CREATED' && row.payment.length == 0) {
                api.getOrderPayment(row.orderID)
                    .then(res => {
                        if (!res) {
                            return
                        }
                        row.isLoadingPayment = false
                        row.payment.push(
                            {
                                key: '支付单号',
                                value: res.flowID
                            },
                            {
                                key: '支付系统流水号',
                                value: res.remoteFlowID
                            },
                            {
                                key: '总金额',
                                value: '￥' + this.formatMoney(res.amount / 100)
                            },
                            {
                                key: '代金券',
                                value: '￥' + this.formatMoney(res.discountAmount / 100)
                            },
                            {
                                key: '实际金额',
                                value: '￥' + this.formatMoney(res.actualAmount / 100)
                            },
                            {
                                key: '支付状态',
                                value: this.paymentStatus(res.status)
                            },
                            {
                                key: '支付时间',
                                value: this.formatDatatime(res.updatedAt)
                            }
                        )
                    })
                    .catch(() => {})
            }
        },
        onEditOrder(evt, orderID) {
            this.$router.push({
                path: '/sales/save',
                query: {
                    orderID
                }
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
