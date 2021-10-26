<template>
    <d2-container>
        <template slot="header">创建/编辑订单 </template>
        <el-form ref="form" :model="order" :rules="{}" label-width="100px">
            <el-divider content-position="left">基本信息</el-divider>
            <el-form-item label="所属用户" prop="userID">
                <el-select
                    style="width: 300px"
                    v-model="order.userID"
                    filterable
                    remote
                    clearable
                    placeholder="请输入昵称或OpenID"
                    :remote-method="onSearchUserID"
                    :loading="loadingUser"
                    :disabled="isUpdate"
                >
                    <el-option v-for="u in userList" :key="u.userID" :label="u.nickName" :value="u.userID">
                        <span style="float: left">{{ u.nickName }}</span>
                        <span style="float: right">
                            <el-tag size="mini">{{ u.openID }}</el-tag>
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单总额" prop="totalPrice">
                <el-input disabled :value="formatMoney(order.totalPrice / 100)"><template slot="prepend">￥</template></el-input>
            </el-form-item>
            <el-form-item label="优惠金额" prop="discountAmount">
                <el-input v-model="discountAmount" @input="onDiscountAmountInput"><template slot="prepend">￥</template></el-input>
            </el-form-item>
            <el-form-item label="实际金额" prop="actualAmount">
                <el-input disabled :value="formatMoney(order.actualAmount / 100)"><template slot="prepend">￥</template></el-input>
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
                <el-select :disabled="isUpdate" v-model="order.paymentMethod" placeholder="支付方式">
                    <el-option v-for="s in enums.paymentMethod" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="order.remark" :autosize="{ minRows: 1, maxRows: 5 }"></el-input>
            </el-form-item>
            <el-form-item label="订单状态" prop="status">
                <el-tag :type="orderStatusColor(order.status)" effect="dark">{{ orderStatus(order.status) }}</el-tag>
            </el-form-item>

            <el-divider content-position="left">物流信息</el-divider>
            <el-form-item label="收件人" prop="recipients">
                <el-input v-model="order.recipients"></el-input>
            </el-form-item>
            <el-form-item label="收货地址" prop="shippingAddr">
                <el-input v-model="order.shippingAddr"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
                <el-input v-model="order.mobile"></el-input>
            </el-form-item>
            <el-form-item label="快递公司" prop="courierCompany">
                <el-input v-model="order.courierCompany"></el-input>
            </el-form-item>
            <el-form-item label="快递单号" prop="courierNumber">
                <el-input v-model="order.courierNumber"></el-input>
            </el-form-item>

            <el-divider content-position="left">商品列表</el-divider>
            <el-table :v-loading="loading" :data="order.goods" style="width: 100%" stripe>
                <el-table-column prop="goodsID" label="商品编号" width="100"></el-table-column>
                <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
                <el-table-column prop="amount" label="数量">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.amount" :min="1"></el-input-number>
                    </template>
                </el-table-column>
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

            <el-divider content-position="left">订单操作</el-divider>
            <el-button
                type="primary"
                @click="onSubmitOrder($event, order.orderID)"
                >提交订单</el-button
            >
            <el-button type="danger" @click="onCancelOrder($event, order.orderID)" v-if="isUpdate && order.status == 'CREATED'">取消订单</el-button>
            <el-button type="warning" @click="onConfirmOrder($event, order.orderID)" v-if="isUpdate && order.status == 'PAID'">确认收款</el-button>
            <el-button type="success" @click="onDispatchOrder($event, order.orderID)" v-if="isUpdate && order.status == 'CONFIRM'">发货</el-button>
            <el-button type="warning" @click="onCompleteOrder($event, order.orderID)" v-if="isUpdate && order.status == 'DISPATCH'">确认收货</el-button>
            <el-button type="danger" @click="onRefundOrder($event, order.orderID)" v-if="isUpdate && (order.status == 'DISPATCH' || order.status == 'COMPLETE')"
                >退货</el-button
            >
            <el-button type="danger" v-if="isUpdate && (order.status == 'PAID' || order.status == 'CONFIRM' || order.status == 'REFUND')">确认退款</el-button>
        </el-form>
    </d2-container>
</template>

<script>
import api from '@/api/modules/sys.sales'
import userApi from '@/api/modules/sys.user'
import format from '@/libs/util.format'
import Decimal from 'decimal.js'

export default {
    name: 'sales_save',
    data() {
        return {
            loading: false,
            isUpdate: false,
            userList: [],
            loadingUser: false,
            enums: {},
            order: {},
            discountAmount: '0.00'
        }
    },
    mounted() {
        const id = this.$route.query.orderID
        if (id) {
            // 更新
            this.isUpdate = true
            this.loading = true
            api.getOrderByID(id).then(res => {
                this.order = res
                this.loading = false
                this.discountAmount = this.formatMoney(this.order.discountAmount / 100)
                this.userList.push({
                    userID: res.userID,
                    nickName: res.nickName,
                    openID: res.openID
                })
            })
        } else {
            this.isUpdate = false
        }
        api.enums().then(res => {
            this.enums = res
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

        onDiscountAmountInput(val) {
            let reg = /^\d+(\.\d{1,2})?$/i
            if (!reg.test(val)) {
                return
            }
            let d = new Decimal(val)
            d = d.mul(new Decimal(100))
            if (d.toNumber() > this.order.totalPrice) {
                return
            }
            this.order.discountAmount = d.toNumber()
            this.order.actualAmount = new Decimal(this.order.totalPrice).sub(new Decimal(this.order.discountAmount)).toNumber()
        },
        onCancelOrder(evt, orderID) {
            let $this = this
            this.$confirm('此操作将永久取消该订单 (' + orderID + ') 并且无法恢复, 请再次确定已与客户提前沟通，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.cancelOrder(orderID).then(() => {
                    $this.reload()
                })
            })
        },
        onConfirmOrder(evt, orderID) {
            let $this = this
            this.$confirm('此操作将对订单 (' + orderID + ') 状态标记为 (待发货), 请再次确定已收到客户付款，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.confirmOrder(orderID).then(() => {
                    $this.reload()
                })
            })
        },
        onDispatchOrder(evt, orderID) {
            this.currentOrder = orderID
            this.showDispatchPanel = true
        },
        onDispatchSubmit(evt) {
            if (!this.currentOrder) {
                return
            }
            let $this = this
            api.dispatchOrder({
                orderID: this.currentOrder,
                courierCompany: this.dispatchForm.courierCompany,
                courierNumber: this.dispatchForm.courierNumber
            }).then(() => {
                $this.$refs.dispatchPanel.closeDrawer()
                $this.reload()
            })
        },
        onCompleteOrder(evt, orderID) {
            let $this = this
            this.$confirm('此操作将对订单 (' + orderID + ') 状态标记为 (已完成), 建议该操作由客户自主完成，请再次确认客户已收到商品，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.completeOrder(orderID).then(() => {
                    $this.reload()
                })
            })
        },
        onRefundOrder(evt, orderID) {
            let $this = this
            this.$confirm('此操作将对订单 (' + orderID + ') 状态标记为 (退款中), 建议该操作由客户自主发起，请再次确认客户已退货，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.refundOrder(orderID).then(() => {
                    $this.reload()
                })
            })
        }
    },
    computed: {}
}
</script>

<style lang="scss" scoped>
</style>
